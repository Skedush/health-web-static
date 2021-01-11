import { IRoute } from 'umi-types';

const routes: IRoute[] = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    component: '../layouts',
    routes: [{ path: '/login', component: './Login' }],
  },

  {
    path: '/dashboard',
    component: '../layouts',
    routes: [
      { path: '/dashboard', redirect: '/dashboard/home' },
      { path: '/dashboard/home', component: './Dashboard/Home' },
      { path: '/dashboard/f/:id', component: './Dashboard/FillForm' },
      { path: '/dashboard/result/:id', component: './Dashboard/Result' },
      { path: '/dashboard/user', component: './Dashboard/User' },
      { path: '/dashboard/success', component: './Dashboard/Success' },
    ],
  },
  {
    path: '/404',
    redirect: '/exception/404',
  },
  {
    path: '/exception',
    routes: [
      { path: '/exception', redirect: '/exception/404' },
      { path: '/exception/:code', component: './Exception' },
    ],
  },
];

export default routes;
