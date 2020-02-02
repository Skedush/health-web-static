import { connect as connectDva } from 'dva';

export default (mapStateToProps: any, actions: any, mergeProps?: any, options?: any) => {
  return (target: any) => connectDva(mapStateToProps, actions, mergeProps, options)(target) as any;
};
