import { EnvCookies } from 'env-cookies';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { AppState } from 'redux/store';
import { Tenant } from 'services/tenant.model';
import { getDesiredTenantByUrl, getNonAuthorizedEnvHostname } from 'tenant-helpers';

export const useRedirectToProvidedReturnUrl = () => {
  const userTenants = useSelector((state: AppState) => state.auth.userTenants);

  useEffect(() => {
    const auth = EnvCookies.get('auth');
    const returnUrl = EnvCookies.get('return-url');
    const currentHostname = window.location.hostname;
    const nonAuthorizedHostname = getNonAuthorizedEnvHostname();
    const isSubdomain = currentHostname !== nonAuthorizedHostname;

    if (!auth || !returnUrl) return;

    const tenantId = EnvCookies.get('tenant');
    if (auth && tenantId && !returnUrl) return;

    let desiredTenant: Tenant;
    try {
      desiredTenant = getDesiredTenantByUrl(returnUrl, userTenants);
    } catch (ex) {
      EnvCookies.remove('return-url');
      return;
    }

    // if we are on select company route check return url for tenant info and if it provided in url get it id and select it with redirect.
    if (auth && returnUrl && !tenantId && desiredTenant && !isSubdomain) {
      EnvCookies.set('tenant', desiredTenant.id);
    }

    // if we are on company page and have return url in cookies remove it and redirect user to provided url
    if (auth && returnUrl && tenantId && isSubdomain) {
      // window.location.assign(returnUrl);
      setTimeout(() => {
        EnvCookies.remove('return-url');
        window.location.assign(returnUrl);
      }, 50);
    }
  }, [userTenants]);
};
