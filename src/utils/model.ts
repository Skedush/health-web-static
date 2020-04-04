import modelExtend from 'dva-model-extend';
import CommonModel from '@/common/model';

export type Model = typeof CommonModel;

export default <T extends Model>(model: T): T => {
  return modelExtend(CommonModel, model);
};
