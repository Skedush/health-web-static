export default {
  logout: 'GET /logout',
  login: 'POST /login',

  createUser: 'POST /user/',

  getEntryInfoList: 'GET /entryInfo/',
  getUserEntryList: 'GET /userEntry/',

  getEntryInfoDetail: 'GET /entryInfo/:id/',
  addUserEntry: 'POST /userEntry/',

  getResult: 'GET /result/:id/',

  getTitleDetail: 'GET /title/:id/',

  updateTitle: 'PATCH /title/:id/',

  updatePasswordAndUsername: 'PATCH /user/:id/',
};
