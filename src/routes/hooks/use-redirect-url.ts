import { useLocation } from 'react-router-dom';
import { isCompanyPath } from 'routes/paths';
import { EnvCookies } from 'env-cookies';

export async function useRedirectUrl() {
  const { pathname } = useLocation();
  const url = EnvCookies.get('return-url');
  const isNotAuthorized = !EnvCookies.get('auth');

  const needToSaveUrl = isCompanyPath() && isNotAuthorized && !!pathname && pathname !== '/' && url === undefined;

  if (needToSaveUrl) {
    EnvCookies.set('return-url', window.location.href);

    // we redirect user from another hook to sign in when return url exists;
    // here we need only to save return url because if user is not authorized we redirect him to subdomain/sign-in route wich not exists in tenant subdomain
    // router.navigate(Paths.SignIn);
  }
}
