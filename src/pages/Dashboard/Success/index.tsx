/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
/* eslint-disable no-dupe-class-members */
import React, { PureComponent } from 'react';
import { connect } from '@/utils/decorators';
import classNames from 'classnames';
import { FormComponentProps } from '@/components/Library/type';
import { Result } from '@/components/Library';
import { GlobalState, UmiComponentProps } from '@/common/type';

const mapStateToProps = (state: GlobalState) => {
  return {};
};

type SuccessStateProps = ReturnType<typeof mapStateToProps>;
type SuccessProps = SuccessStateProps & UmiComponentProps & FormComponentProps;

interface SuccessState {}

@connect(
  mapStateToProps,
  null,
)
class Success extends PureComponent<SuccessProps, SuccessState> {
  constructor(props: Readonly<SuccessProps>) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={classNames('height100', 'flexColCenter', 'itemCenter')}>
        <Result status="success" title="提交成功!" subTitle="" />
      </div>
    );
  }
}

export default Success;
