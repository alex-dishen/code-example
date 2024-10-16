import axios, { AxiosError } from 'axios';
import { Actions as AuthActions } from 'redux/auth.controller';
import store from 'redux/store';
import { redirectToNotFoundPage, router } from 'index';
import { t } from 'setup-localization';
import { showBackEndErrorMessage } from 'utils/show-back-end-error-message';
import { EnvCookies } from 'env-cookies';
import { Paths } from 'routes/paths';
import { TenantUserStatus } from 'services/tenant.model';

function addAccessTokenToRequest(req) {
  const request = { ...req };
  const authTokens = JSON.parse(EnvCookies.get('auth') || '{}');
  const userTenantId = EnvCookies.get('tenant') || '';
  if (authTokens?.accessToken) {
    request.headers = {
      ...request.headers,
      Authorization: `Bearer ${authTokens.accessToken}`,
    };
  }
  if (userTenantId) {
    request.headers = {
      ...request.headers,
      'x-tenant-id': userTenantId,
    };
  }
  return request;
}

export const authAxiosInstance = axios.create({ baseURL: process.env.REACT_APP_API_URL });
authAxiosInstance.interceptors.request.use(
  (request) => {
    return addAccessTokenToRequest(request);
  },
  (error) => Promise.reject(error),
);

let isAlreadyFetchingNewAccessToken = false;
let subscribers = [];
function addSubscriber(callback) {
  subscribers.push(callback);
}
function rerunFailedRequests(newToken: string) {
  subscribers.reverse().forEach((callback) => callback(newToken));
}

export const baseAxiosInstance = axios.create({ baseURL: process.env.REACT_APP_API_URL });
baseAxiosInstance.interceptors.request.use(
  (request) => {
    return addAccessTokenToRequest(request);
  },
  (error) => Promise.reject(error),
);

baseAxiosInstance.interceptors.response.use(
  (response) => response,
  async (e) => {
    const { config, response } = e as AxiosError;

    if (response) {
      if (response.status === 404) {
        redirectToNotFoundPage(window.location.href);
        throw e;
      }

      if (response.status === 403) {
        const currentTenantId = EnvCookies.get('tenant');
        const userTenants = await store.dispatch(AuthActions.loadUserTenants());
        const currentTenant = userTenants.find((tenant) => tenant.id === currentTenantId);

        if (currentTenant?.user_status === TenantUserStatus.Inactive) {
          router.navigate(Paths.CompanyAccessDenied);
        }
      }

      showBackEndErrorMessage(response.data, e);

      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.error(response);
      }
    } else {
      showBackEndErrorMessage(t('global.init_loading'));
    }

    async function refreshToken() {
      if (!isAlreadyFetchingNewAccessToken) {
        try {
          isAlreadyFetchingNewAccessToken = true;
          const newAccessToken = await store.dispatch(AuthActions.refreshAccessToken());

          if (newAccessToken) {
            rerunFailedRequests(newAccessToken);
            subscribers = [];
          } else {
            store.dispatch(AuthActions.logout());
            subscribers = [];
          }
        } catch (err) {
          store.dispatch(AuthActions.logout());
          subscribers = [];
          throw err;
        } finally {
          isAlreadyFetchingNewAccessToken = false;
        }
      }
    }

    if (response?.status === 401) {
      refreshToken();

      return new Promise((resolve) => {
        addSubscriber((newAccessToken) => {
          const originalRequest = { ...config };
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          resolve(axios(originalRequest));
        });
      });
    }

    throw e;
  },
);
