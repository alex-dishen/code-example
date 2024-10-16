import { EnvCookies } from 'env-cookies';
import { router } from 'index';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { AppState } from 'redux/store';
import { Paths } from 'routes/paths';
import { getDesiredTenantByUrl, getNonAuthorizedEnvHostname } from 'tenant-helpers';

export const useKeepRelevantTenantId = () => {
  const userTenants = useSelector((state: AppState) => state.auth.userTenants);

  useEffect(() => {
    function updateTenant() {
      if (!userTenants.length) return;

      const tenantId = EnvCookies.get('tenant');
      const auth = EnvCookies.get('auth');
      const selectedTenant = userTenants?.find((item) => item.id === tenantId);

      const currentHostname = window.location.hostname;
      const nonAuthorizedHostName = getNonAuthorizedEnvHostname();
      const isAuthorizedHostname = currentHostname !== nonAuthorizedHostName;
      const isTenantSelected = !!selectedTenant;
      const subdomainFromCurrentUrl = currentHostname.replace(`.${nonAuthorizedHostName}`, '');
      const isSelectedTenantDifferFromUrlTenant = subdomainFromCurrentUrl !== selectedTenant?.subdomain;

      // If used was authorized and used url that not match selected tenant > switch tenant in Cookies
      if (auth && isTenantSelected && isAuthorizedHostname && isSelectedTenantDifferFromUrlTenant) {
        const desiredTenant = getDesiredTenantByUrl(window.location.href, userTenants);

        if (!desiredTenant) {
          router.navigate(Paths.CompanyAccessDenied, { state: { showBackButton: true } });
          return;
        }

        EnvCookies.set('tenant', desiredTenant.id);
      }
    }
    window.addEventListener('focus', updateTenant);
    return () => {
      window.removeEventListener('focus', updateTenant);
    };
  }, [userTenants]);
};
