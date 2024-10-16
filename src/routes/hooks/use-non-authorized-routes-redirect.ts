export const useNonAuthorizedRoutesRedirect = () => {
  // Redirect to Landing page
  if (window.location.pathname === '/') window.location.replace('https://www.hesh.app');
};
