import Mock from 'mockjs';
import qs from 'qs';

export function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min);
}

export function randomAvatar(): string {
  const avatarList = [
    'photo-1549492864-2ec7d66ffb04.jpeg',
    'photo-1480535339474-e083439a320d.jpeg',
    'photo-1523419409543-a5e549c1faa8.jpeg',
    'photo-1519648023493-d82b5f8d7b8a.jpeg',
    'photo-1523307730650-594bc63f9d67.jpeg',
    'photo-1522962506050-a2f0267e4895.jpeg',
    'photo-1489779162738-f81aed9b0a25.jpeg',
    'photo-1534308143481-c55f00be8bd7.jpeg',
    'photo-1519336555923-59661f41bb45.jpeg',
    'photo-1551438632-e8c7d9a5d1b7.jpeg',
    'photo-1525879000488-bff3b1c387cf.jpeg',
    'photo-1487412720507-e7ab37603c6f.jpeg',
    'photo-1510227272981-87123e259b17.jpeg',
  ];
  return `//image.zuiidea.com/${
    avatarList[randomNumber(0, avatarList.length - 1)]
  }?imageView2/1/w/200/h/200/format/webp/q/75|imageslim`;
}

export const Constant = {
  apiPrefix: '',
};

export const ResponseWarpper = {
  success: function(data?: any, message = '操作成功') {
    return {
      success: true,
      msg: message,
      code: 200,
      value: data,
    };
  },
  failed: function(message = '操作失败') {
    return {
      success: false,
      msg: message,
      code: 404,
    };
  },
};

export { Mock, qs };
