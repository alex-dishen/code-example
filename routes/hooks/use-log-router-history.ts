import { EnvCookies } from 'env-cookies';

// Main purpose - to understand routing changes between subdomains
export const useLogRouterHistory = () => {
  if (process.env.REACT_APP_ENV_NAME === 'local') {
    pushRouterHistoryLog(window.location.href);
  }
};

export const pushRouterHistoryLog = (value: string) => {
  const routerHistory = JSON.parse(EnvCookies.get('router-history') || '[]') as string[];
  const updatedRouterHistory = [...routerHistory, value];
  EnvCookies.set('router-history', JSON.stringify(updatedRouterHistory));
};
