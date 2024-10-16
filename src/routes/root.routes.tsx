import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { AppState } from 'redux/store';
import { EnvCookies } from 'env-cookies';
import { CompanySelectionMiddlewareRoutes } from 'pages/auth-select-company/auth-select-company';
import Spinner from 'components/spinner/spinner';
import { useSwitchTenantFromUrl } from 'routes/hooks/use-switch-tenant-from-url';
import { useAuthController } from 'routes/hooks/use-auth-controller';
import { getNonAuthorizedEnvHostname } from 'tenant-helpers';
import { useRedirectToProvidedReturnUrl } from 'routes/use-redirect-to-provided-url';
import { useKeepRelevantTenantId } from 'routes/hooks/use-keep-relevant-tenant-id';
import { useGoogleAnalytics } from 'hooks/use-google-analytics';
import { CompanyRoutes } from './company.routes';
import { NonAuthorizedRoutes } from './non-authorized.routes';
import { useRedirectUrl } from './hooks/use-redirect-url';

export const RootRoutes = () => {
  useRedirectUrl();
  useSwitchTenantFromUrl();
  useKeepRelevantTenantId();
  useAuthController();
  useRedirectToProvidedReturnUrl();

  const location = useLocation();
  const { registerPageViewEvent } = useGoogleAnalytics();
  registerPageViewEvent(location.pathname);

  const isLoading = useSelector((state: AppState) => state.auth.isLoading);

  const auth = EnvCookies.get('auth');
  const tenantId = EnvCookies.get('tenant');

  const currentHostname = window.location.hostname;
  const nonAuthorizedHostname = getNonAuthorizedEnvHostname();
  const isSubdomain = currentHostname !== nonAuthorizedHostname;

  if (isLoading) return <Spinner />;

  if (auth && !tenantId) return <CompanySelectionMiddlewareRoutes />;

  if (auth && tenantId && isSubdomain) return <CompanyRoutes />;

  if (!auth && !isSubdomain) return <NonAuthorizedRoutes />;

  return <Spinner />;
};
