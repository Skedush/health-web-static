import { Request, Response } from 'express';
import { ResponseWarpper } from './_utils';
import api from '../src/services/api';

const { getEntranceList, addEntrance, updateEntrance, deleteEntrance } = api;
// const { apiPrefix } = Constant;

export default {
  // eslint-disable-next-line max-lines-per-function
  [getEntranceList](req: Request, res: Response) {
    console.log('req: ', req.query);
    const data = [
      {
        id: 4,
        name: '东门出入口',
        type: '4',
        parentId: 1,
        sort: 3,
        villageId: 1,
        children: [],
      },
      {
        id: 5,
        name: '北门出入口',
        type: '4',
        parentId: 1,
        sort: 3,
        villageId: 1,
        children: [],
      },
    ];
    if (data) {
      res.json(ResponseWarpper.success(data));
    } else {
      res.json(ResponseWarpper.failed('Not Found'));
    }
  },

  [addEntrance](req: Request, res: Response) {
    console.log('req: ', req.body);
    const data = 1;
    if (data) {
      res.json(ResponseWarpper.success(data));
    } else {
      res.json(ResponseWarpper.failed('Not Found'));
    }
  },
  [updateEntrance](req: Request, res: Response) {
    console.log('req: ', req.body);
    const data = 1;
    if (data) {
      res.json(ResponseWarpper.success(data));
    } else {
      res.json(ResponseWarpper.failed('Not Found'));
    }
  },
  [deleteEntrance](req: Request, res: Response) {
    console.log('req: ', req.body);
    const data = 1;
    if (data) {
      res.json(ResponseWarpper.success(data));
    } else {
      res.json(ResponseWarpper.failed('Not Found'));
    }
  },
};
