import { SomethingWentWrong } from 'components/errors/something-went-wrong';
import { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import SignIn from 'pages/auth/components/sign-in/sign-in';
import ForgotPassword from 'pages/auth/components/forgot-password/forgot-password';
import CreateNewPassword from 'pages/auth/components/create-new-password/create-new-password';
import SignUp from 'pages/auth/components/sign-up/sign-up';
import { Paths } from 'routes/paths';
import { getNonAuthorizedEnvHostname } from 'tenant-helpers';
import PagePlug from 'pages/page-plug/page-plug';
import InvalidLink from 'pages/auth/components/invalid-link/invalid-link';
import AuthPage from 'pages/auth/auth';
import { useNonAuthorizedRoutesRedirect } from 'routes/hooks/use-non-authorized-routes-redirect';
import Spinner from '../components/spinner/spinner';

export const NonAuthorizedRoutes = () => {
  useNonAuthorizedRoutesRedirect();

  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route
          path={Paths.SignIn}
          errorElement={<SomethingWentWrong />}
          element={
            <AuthPage>
              <SignIn />
            </AuthPage>
          }
        />
        <Route
          path={Paths.SignUp}
          errorElement={<SomethingWentWrong />}
          element={
            <AuthPage>
              <SignUp />
            </AuthPage>
          }
        />
        <Route
          path={Paths.ForgotPassword}
          errorElement={<SomethingWentWrong />}
          element={
            <AuthPage>
              <ForgotPassword />
            </AuthPage>
          }
        />
        <Route
          path={Paths.CreatePassword}
          errorElement={<SomethingWentWrong />}
          element={
            <AuthPage>
              <CreateNewPassword />
            </AuthPage>
          }
        />

        <Route path={Paths.InvalidLink} errorElement={<SomethingWentWrong />} element={<InvalidLink />} />
        <Route
          path={Paths.NotFound}
          errorElement={<SomethingWentWrong />}
          element={<PagePlug withUrl title="Not Found" subtitle="Entity is not exists. It could be deleted or moved" />}
        />
        <Route
          path={Paths.CompanyAccessDenied}
          errorElement={<SomethingWentWrong />}
          element={
            <PagePlug
              withUrl
              title="Access is denied"
              subtitle="You don`t have permission to access this page. Please contact your HESH administrator."
              onLogoClick={() => {
                const destination = `${window.location.protocol}//${getNonAuthorizedEnvHostname()}/sign-in`;
                window.location.replace(destination);
              }}
            />
          }
        />

        <Route path="*" element={<Navigate to={Paths.SignIn} />} />
      </Routes>
    </Suspense>
  );
};
