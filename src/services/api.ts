export default {
  logout: 'GET /logout',
  login: 'POST /login',

  createUser: 'POST /user/',

  getEntryInfoList: 'GET /entryInfo/',
  getUserEntryList: 'GET /userEntry/',
  deleteUserEntry: 'DELETE /userEntry/:id/',
  getUserEntry: 'GET /userEntry/:id/',

  getEntryInfoDetail: 'GET /entryInfo/:id/',
  addUserEntry: 'POST /userEntry/',
  updateUserEntry: 'PATCH /userEntry/:id/',

  getResult: 'GET /result/:id/',

  getTitleDetail: 'GET /title/:id/',

  updateTitle: 'PATCH /title/:id/',

  updatePasswordAndUsername: 'PATCH /user/:id/',
};
