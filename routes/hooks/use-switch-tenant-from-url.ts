import { EnvCookies } from 'env-cookies';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppState } from 'redux/store';
import { Paths } from 'routes/paths';
import { getDesiredTenantByUrl, getNonAuthorizedEnvHostname } from 'tenant-helpers';

export const useSwitchTenantFromUrl = () => {
  const userTenants = useSelector((state: AppState) => state.auth.userTenants);
  const navigate = useNavigate();

  useEffect(() => {
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

    // If user was authorized and used url that not match selected tenant > switch tenant in Cookies
    if (auth && isTenantSelected && isAuthorizedHostname && isSelectedTenantDifferFromUrlTenant) {
      const desiredTenant = getDesiredTenantByUrl(window.location.href, userTenants);

      if (!desiredTenant) {
        setTimeout(() => {
          navigate(Paths.CompanyAccessDenied, { state: { showBackButton: true } });
        }, 3000);

        return;
      }

      EnvCookies.set('tenant', desiredTenant.id);
    }
  }, [navigate, userTenants]);
};
