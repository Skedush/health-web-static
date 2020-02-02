import { Request, Response } from 'express';
import { ResponseWarpper } from './_utils';
import api from '../src/services/api';

const { getCompany, addCompany, companyDelete, getCompanyById, updateCompany } = api;
const content: object[] = [];
for (let i = 0, len = 12; i < len; i++) {
  const item = {
    id: i,
    name: '温州易云智能科技有限公司' + i,
    address: '杭州滨江' + i,
    addressName: '5栋3单元1-101g',
    masterImage:
      'http://192.168.70.23/images/companyInfo/20190801/ebc5483b-def8-4f9f-a77d-e017ec5be960.jpg',
    registerTime: '2019-08-01',
  };
  content.push(item);
}

// const personContent: object[] = [];
// for (let i = 0, len = 12; i < len; i++) {
//   const item = {
//     id: 1 + i,
//     companyId: 2,
//     villageId: 1,
//     name: '张三' + i,
//     image:
//       'http://192.168.70.23/images/companyInfo/20190801/ebc5483b-def8-4f9f-a77d-e017ec5be960.jpg',
//     idCardImage:
//       'http://192.168.70.23/images/companyInfo/20190801/ebc5483b-def8-4f9f-a77d-e017e21c5be960.jpg',
//     position: '打工人',
//     phone: '15224005566',
//     nation: '民族',
//     idCard: '114324234235234234',
//     domicile: '户籍地址',
//     temporaryAddress: '暂住地址',
//     registerTime: '2019-08-01',
//     currentAddress: '现居住地址',
//     idCardAddress: '身份证地址',
//     remark: '备注',
//   };
//   personContent.push(item);
// }

export default {
  [getCompany](req: Request, res: Response) {
    console.log('req: ', req.query);
    const data = {
      content: content,
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
      totalElements: 12,
      size: 10,
      number: 0,
      sort: {
        sorted: true,
        unsorted: false,
        empty: false,
      },
      numberOfElements: 5,
      first: true,
      empty: false,
    };
    if (data) {
      res.json(ResponseWarpper.success(data));
    } else {
      res.json(ResponseWarpper.failed('Not Found'));
    }
  },

  [getCompanyById](req: Request, res: Response) {
    console.log('req: ', req.params);
    const data = {
      id: 73,
      name: '温州易云智能科技有限公司',
      address: '12,1,3',
      addressName: '5栋3单元1-101g',
      masterImage:
        'http://192.168.70.23/images/companyInfo/20190801/ebc5483b-def8-4f9f-a77d-e017ec5be960.jpg',
      juridicalPersonName: '法人姓名',
      liaisonName: '方先生',
      liaisonPhone: '15224005566',
      companyCode: '15345235423423',
      typeType: '1',
      tradeTypeStr: '行业名字',
      remark: '备注',
    };
    if (data) {
      res.json(ResponseWarpper.success(data));
    } else {
      res.json(ResponseWarpper.failed('Not Found'));
    }
  },

  [addCompany](req: Request, res: Response) {
    const data = 1;
    if (data) {
      res.json(ResponseWarpper.success(data));
    } else {
      res.json(ResponseWarpper.failed('Not Found'));
    }
  },
  // [getBuildingData](req: Request, res: Response) {
  //   const data = [
  //     {
  //       id: 1,
  //       villageId: 1,
  //       code: '编号',
  //       name: '楼栋名称1',
  //     },
  //     {
  //       id: 2,
  //       villageId: 1,
  //       code: '编号',
  //       name: '楼栋名称2',
  //     },
  //     {
  //       id: 3,
  //       villageId: 1,
  //       code: '编号',
  //       name: '楼栋名称3',
  //     },
  //   ];
  //   if (data) {
  //     res.json(ResponseWarpper.success(data));
  //   } else {
  //     res.json(ResponseWarpper.failed('Not Found'));
  //   }
  // },
  // [getUnitDropdown](req: Request, res: Response) {
  //   const data = [
  //     {
  //       id: 1,
  //       villageId: 1,
  //       buildingId: 1,
  //       code: '编号',
  //       name: '单元名称1',
  //     },
  //     {
  //       id: 2,
  //       villageId: 1,
  //       buildingId: 1,
  //       code: '编号',
  //       name: '单元名称2',
  //     },
  //     {
  //       id: 3,
  //       villageId: 1,
  //       buildingId: 1,
  //       code: '编号',
  //       name: '单元名称3',
  //     },
  //   ];
  //   if (data) {
  //     res.json(ResponseWarpper.success(data));
  //   } else {
  //     res.json(ResponseWarpper.failed('Not Found'));
  //   }
  // },
  // [getHouse](req: Request, res: Response) {
  //   const data = [
  //     {
  //       id: 1,
  //       villageId: 1,
  //       unitId: 1,
  //       buildingId: 1,
  //       code: '编号',
  //       name: '房屋名称1',
  //     },
  //     {
  //       id: 2,
  //       villageId: 1,
  //       unitId: 1,
  //       buildingId: 1,
  //       code: '编号',
  //       name: '房屋名称2',
  //     },
  //     {
  //       id: 3,
  //       villageId: 1,
  //       unitId: 1,
  //       buildingId: 1,
  //       code: '编号',
  //       name: '房屋名称3',
  //     },
  //     {
  //       id: 4,
  //       villageId: 1,
  //       unitId: 1,
  //       buildingId: 1,
  //       code: '编号',
  //       name: '房屋名称4',
  //     },
  //   ];
  //   if (data) {
  //     res.json(ResponseWarpper.success(data));
  //   } else {
  //     res.json(ResponseWarpper.failed('Not Found'));
  //   }
  // },
  [companyDelete](req: Request, res: Response) {
    console.log('req: ', req.body);
    const data = true;
    if (data) {
      res.json(ResponseWarpper.success(data));
    } else {
      res.json(ResponseWarpper.failed('Not Found'));
    }
  },
  [updateCompany](req: Request, res: Response) {
    console.log('req: ', req.body);
    const data = true;
    if (data) {
      res.json(ResponseWarpper.success(data));
    } else {
      res.json(ResponseWarpper.failed('Not Found'));
    }
  },
  // [getPerson](req: Request, res: Response) {
  //   const data = {
  //     content: personContent,
  //     pageable: {
  //       sort: {
  //         sorted: true,
  //         unsorted: false,
  //         empty: false,
  //       },
  //       offset: 0,
  //       pageNumber: 0,
  //       pageSize: 10,
  //       paged: true,
  //       unpaged: false,
  //     },
  //     last: true,
  //     totalPages: 1,
  //     totalElements: 12,
  //     size: 10,
  //     number: 0,
  //     sort: {
  //       sorted: true,
  //       unsorted: false,
  //       empty: false,
  //     },
  //     numberOfElements: 5,
  //     first: true,
  //     empty: false,
  //   };
  //   if (data) {
  //     res.json(ResponseWarpper.success(data));
  //   } else {
  //     res.json(ResponseWarpper.failed('Not Found'));
  //   }
  // },
  // [personDetele](req: Request, res: Response) {
  //   const data = true;
  //   if (data) {
  //     res.json(ResponseWarpper.success(data));
  //   } else {
  //     res.json(ResponseWarpper.failed('Not Found'));
  //   }
  // },
  // [companyPersonAdd](req: Request, res: Response) {
  //   const data = true;
  //   if (data) {
  //     res.json(ResponseWarpper.success(data));
  //   } else {
  //     res.json(ResponseWarpper.failed('Not Found'));
  //   }
  // },
  // [companyPersonUpdate](req: Request, res: Response) {
  //   const data = true;
  //   if (data) {
  //     res.json(ResponseWarpper.success(data));
  //   } else {
  //     res.json(ResponseWarpper.failed('Not Found'));
  //   }
  // },
};
