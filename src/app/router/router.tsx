import {createBrowserRouter, Navigate} from 'react-router';
import {AppLayout} from '@/components/layout/AppLayout';
import {PublicLayout} from '@/components/layout/PublicLayout';
import {GuestOnly, RequireAuth} from './guards';
import {paths} from './paths';
import {RootLayout} from './RootLayout';
import {NotFoundPage, RouteErrorPage} from './RouteErrorPage';

/** Route-level code splitting: each page ships in its own chunk. */
const page = (load: () => Promise<{default: React.ComponentType}>) => async () => ({
  Component: (await load()).default,
});

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      {
        element: <PublicLayout />,
        children: [{index: true, lazy: page(() => import('@/features/landing/LandingPage'))}],
      },
      {
        element: <GuestOnly />,
        children: [
          {path: paths.login, lazy: page(() => import('@/features/auth/pages/LoginPage'))},
          {
            path: paths.register,
            lazy: page(() => import('@/features/auth/pages/RegisterPage')),
          },
        ],
      },
      {
        element: <RequireAuth />,
        children: [
          {
            path: paths.app.root,
            element: <AppLayout />,
            children: [
              {index: true, element: <Navigate to={paths.app.pick} replace />},
              {
                path: paths.app.pick,
                lazy: page(() => import('@/features/dishes/pages/PickDishPage')),
              },
              {
                path: paths.app.polls,
                lazy: page(() => import('@/features/polls/pages/GroupPollPage')),
              },
              {
                path: paths.app.bot,
                lazy: page(() => import('@/features/bot/BotPage')),
              },
            ],
          },
        ],
      },
      {path: '*', element: <NotFoundPage />},
    ],
  },
]);
