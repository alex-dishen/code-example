import { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import 'setup-localization';
import store from 'redux/store';
import { theme } from 'styles/mui-theme-styles/mui-theme';
import { ThemeProvider } from '@emotion/react';
import { Paths } from 'routes/paths';
import { StyledEngineProvider } from '@mui/material';
import App from './app';
import 'react-toastify/dist/ReactToastify.css';
import './styles/mui-theme-styles/mui-index.scss';
import './styles/index.css';
import Spinner from './components/spinner/spinner';

export const router = createBrowserRouter([
  {
    path: '*',
    element: (
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <Suspense fallback={<Spinner />}>
            <App />
          </Suspense>
        </ThemeProvider>
      </StyledEngineProvider>
    ),
  },
]);
export const redirectToNotFoundPage = (fromUrl?: string) => {
  router.navigate(`${Paths.NotFound}?url=${fromUrl}`, { replace: true });
};

ReactDOM.render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>,
  document.getElementById('root'),
);
