import { CssBaseline } from '@mui/material';
import RootModals from 'modules/root-modals/root-modals';
import { ToastContainer } from 'react-toastify';
import { Actions as AuthActions } from 'redux/auth.controller';
import store from 'redux/store';
import { RootRoutes } from 'routes/root.routes';
import { ReactFlowProvider } from 'reactflow';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useLogRouterHistory } from 'routes/hooks/use-log-router-history';
import { useEffect } from 'react';
import PermissionGuardModal from './modules/permission-guard/permission-guard';

export default function App() {
  useLogRouterHistory(); // For local debugging purposes

  useEffect(() => {
    store.dispatch(AuthActions.checkIfUserAlreadyLoggedIn());
  }, []);

  return (
    <div data-testid="layout" className="layout">
      <ReactFlowProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <RootRoutes />

          <ToastContainer limit={3} />
          <PermissionGuardModal />
          <RootModals />
          <CssBaseline enableColorScheme />
        </LocalizationProvider>
      </ReactFlowProvider>
    </div>
  );
}
