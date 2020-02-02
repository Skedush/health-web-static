import { Request, Response } from 'express';
import { ResponseWarpper } from './_utils';
import api from '../src/services/api';

const { getUser, addUser, updateUser, deleteUser } = api;
// const { apiPrefix } = Constant;

export default {
  // eslint-disable-next-line max-lines-per-function
  [getUser](req: Request, res: Response) {
    console.log('req: ', req.query);
    const data = {
      content: [
        {
          id: 1,
          userName: 'string1',
          name: 'string1',
          email: 'string',
          phone: 'string',
          roleId: 0,
          roleName: 'string',
          menuList: [
            {
              id: 0,
              name: 'string',
              route: 'string',
              parentId: 0,
              icon: 'string',
              level: 0,
              children: [
                {
                  id: 0,
                  name: 'string',
                  route: 'string',
                  parentId: 0,
                  icon: 'string',
                  level: 0,
                  children: [
                    {
                      id: 0,
                      name: 'string',
                      route: 'string',
                      parentId: 0,
                      icon: 'string',
                      level: 0,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: 2,
          userName: 'string2',
          name: 'string2',
          email: 'string',
          phone: 'string',
          roleId: 0,
          roleName: 'string',
          menuList: [
            {
              id: 0,
              name: 'string',
              route: 'string',
              parentId: 0,
              icon: 'string',
              level: 0,
              children: [
                {
                  id: 0,
                  name: 'string',
                  route: 'string',
                  parentId: 0,
                  icon: 'string',
                  level: 0,
                  children: [
                    {
                      id: 0,
                      name: 'string',
                      route: 'string',
                      parentId: 0,
                      icon: 'string',
                      level: 0,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: 3,
          userName: 'string2',
          name: 'string2',
          email: 'string',
          phone: 'string',
          roleId: 0,
          roleName: 'string',
          menuList: [
            {
              id: 0,
              name: 'string',
              route: 'string',
              parentId: 0,
              icon: 'string',
              level: 0,
              children: [
                {
                  id: 0,
                  name: 'string',
                  route: 'string',
                  parentId: 0,
                  icon: 'string',
                  level: 0,
                  children: [
                    {
                      id: 0,
                      name: 'string',
                      route: 'string',
                      parentId: 0,
                      icon: 'string',
                      level: 0,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: 4,
          userName: 'string2',
          name: 'string2',
          email: 'string',
          phone: 'string',
          roleId: 0,
          roleName: 'string',
          menuList: [
            {
              id: 0,
              name: 'string',
              route: 'string',
              parentId: 0,
              icon: 'string',
              level: 0,
              children: [
                {
                  id: 0,
                  name: 'string',
                  route: 'string',
                  parentId: 0,
                  icon: 'string',
                  level: 0,
                  children: [
                    {
                      id: 0,
                      name: 'string',
                      route: 'string',
                      parentId: 0,
                      icon: 'string',
                      level: 0,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: 5,
          userName: 'string2',
          name: 'string2',
          email: 'string',
          phone: 'string',
          roleId: 0,
          roleName: 'string',
          menuList: [
            {
              id: 0,
              name: 'string',
              route: 'string',
              parentId: 0,
              icon: 'string',
              level: 0,
              children: [
                {
                  id: 0,
                  name: 'string',
                  route: 'string',
                  parentId: 0,
                  icon: 'string',
                  level: 0,
                  children: [
                    {
                      id: 0,
                      name: 'string',
                      route: 'string',
                      parentId: 0,
                      icon: 'string',
                      level: 0,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: 6,
          userName: 'string2',
          name: 'string2',
          email: 'string',
          phone: 'string',
          roleId: 0,
          roleName: 'string',
          menuList: [
            {
              id: 0,
              name: 'string',
              route: 'string',
              parentId: 0,
              icon: 'string',
              level: 0,
              children: [
                {
                  id: 0,
                  name: 'string',
                  route: 'string',
                  parentId: 0,
                  icon: 'string',
                  level: 0,
                  children: [
                    {
                      id: 0,
                      name: 'string',
                      route: 'string',
                      parentId: 0,
                      icon: 'string',
                      level: 0,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: 7,
          userName: 'string2',
          name: 'string2',
          email: 'string',
          phone: 'string',
          roleId: 0,
          roleName: 'string',
          menuList: [
            {
              id: 0,
              name: 'string',
              route: 'string',
              parentId: 0,
              icon: 'string',
              level: 0,
              children: [
                {
                  id: 0,
                  name: 'string',
                  route: 'string',
                  parentId: 0,
                  icon: 'string',
                  level: 0,
                  children: [
                    {
                      id: 0,
                      name: 'string',
                      route: 'string',
                      parentId: 0,
                      icon: 'string',
                      level: 0,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: 8,
          userName: 'string2',
          name: 'string2',
          email: 'string',
          phone: 'string',
          roleId: 0,
          roleName: 'string',
          menuList: [
            {
              id: 0,
              name: 'string',
              route: 'string',
              parentId: 0,
              icon: 'string',
              level: 0,
              children: [
                {
                  id: 0,
                  name: 'string',
                  route: 'string',
                  parentId: 0,
                  icon: 'string',
                  level: 0,
                  children: [
                    {
                      id: 0,
                      name: 'string',
                      route: 'string',
                      parentId: 0,
                      icon: 'string',
                      level: 0,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: 9,
          userName: 'string2',
          name: 'string2',
          email: 'string',
          phone: 'string',
          roleId: 0,
          roleName: 'string',
          menuList: [
            {
              id: 0,
              name: 'string',
              route: 'string',
              parentId: 0,
              icon: 'string',
              level: 0,
              children: [
                {
                  id: 0,
                  name: 'string',
                  route: 'string',
                  parentId: 0,
                  icon: 'string',
                  level: 0,
                  children: [
                    {
                      id: 0,
                      name: 'string',
                      route: 'string',
                      parentId: 0,
                      icon: 'string',
                      level: 0,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: 10,
          userName: 'string2',
          name: 'string2',
          email: 'string',
          phone: 'string',
          roleId: 0,
          roleName: 'string',
          menuList: [
            {
              id: 0,
              name: 'string',
              route: 'string',
              parentId: 0,
              icon: 'string',
              level: 0,
              children: [
                {
                  id: 0,
                  name: 'string',
                  route: 'string',
                  parentId: 0,
                  icon: 'string',
                  level: 0,
                  children: [
                    {
                      id: 0,
                      name: 'string',
                      route: 'string',
                      parentId: 0,
                      icon: 'string',
                      level: 0,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: 11,
          userName: 'string2',
          name: 'string2',
          email: 'string',
          phone: 'string',
          roleId: 0,
          roleName: 'string',
          menuList: [
            {
              id: 0,
              name: 'string',
              route: 'string',
              parentId: 0,
              icon: 'string',
              level: 0,
              children: [
                {
                  id: 0,
                  name: 'string',
                  route: 'string',
                  parentId: 0,
                  icon: 'string',
                  level: 0,
                  children: [
                    {
                      id: 0,
                      name: 'string',
                      route: 'string',
                      parentId: 0,
                      icon: 'string',
                      level: 0,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      pageable: {
        sort: {
          sorted: true,
          unsorted: false,
          empty: false,
        },
        offset: 0,
        pageNumber: 0,
        pageSize: 10,
        paged: true,
        unpaged: false,
      },
      last: true,
      totalPages: 1,
      totalElements: 11,
      size: 10,
      number: 0,
      sort: {
        sorted: true,
        unsorted: false,
        empty: false,
      },
      numberOfElements: 11,
      first: true,
      empty: false,
    };
    if (data) {
      res.json(ResponseWarpper.success(data));
    } else {
      res.json(ResponseWarpper.failed('Not Found'));
    }
  },

  [addUser](req: Request, res: Response) {
    console.log('req: ', req.body);
    const data = 1;
    if (data) {
      res.json(ResponseWarpper.success(data));
    } else {
      res.json(ResponseWarpper.failed('Not Found'));
    }
  },
  [updateUser](req: Request, res: Response) {
    console.log('req: ', req.body);
    const data = 1;
    if (data) {
      res.json(ResponseWarpper.success(data));
    } else {
      res.json(ResponseWarpper.failed('Not Found'));
    }
  },
  [deleteUser](req: Request, res: Response) {
    console.log('body: ', req.body);
    const data = 1;
    if (data) {
      res.json(ResponseWarpper.success(data));
    } else {
      res.json(ResponseWarpper.failed('Not Found'));
    }
  },
};
