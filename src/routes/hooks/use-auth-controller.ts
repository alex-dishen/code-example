import { EnvCookies } from 'env-cookies';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { AppState } from 'redux/store';
import { getNonAuthorizedEnvHostname } from 'tenant-helpers';

export const useAuthController = () => {
  // Switch hostname when not authorized
  useEffect(() => {
    const auth = EnvCookies.get('auth');
    const currentHostname = window.location.hostname;
    const newHostname = getNonAuthorizedEnvHostname();

    // If user not logged in  > remove subdomain
    if (!auth && newHostname !== currentHostname) {
      const newUrl = `${window.location.protocol}//${newHostname}${window.location.pathname}${window.location.search}`;
      window.location.replace(newUrl);
    }
  });

  // Switch hostname when authorized
  const userTenants = useSelector((state: AppState) => state.auth.userTenants);
  useEffect(() => {
    if (!userTenants.length) return;

    const auth = EnvCookies.get('auth');
    const tenantId = EnvCookies.get('tenant');
    const currentHostname = window.location.hostname;
    const nonAuthorizedHostname = getNonAuthorizedEnvHostname();

    // If user logged in  > navigate to subdomain
    if (auth && tenantId && nonAuthorizedHostname === currentHostname) {
      const selectedTenant = userTenants?.find((item) => item.id === tenantId);
      const destinationUrl = `${window.location.protocol}//${selectedTenant.subdomain}.${getNonAuthorizedEnvHostname()}`;
      window.location.replace(destinationUrl);
    }
  });
};
