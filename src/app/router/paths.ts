export const paths = {
  home: '/',
  login: '/login',
  register: '/register',
  app: {
    root: '/app',
    pick: '/app/pick',
    polls: '/app/polls',
    bot: '/app/bot',
  },
} as const;

export const loginWithRedirect = (redirect: string) =>
  `${paths.login}?redirect=${encodeURIComponent(redirect)}`;
