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
class Success extends PureComponent<any, SuccessState> {
  constructor(props: Readonly<any>) {
    super(props);
    this.state = {};
  }

  render() {
    const { location } = this.props;
    let num: any;
    if (location && location.query && location.query.num) {
      num = '本次提交的症状共' + location.query.num + '个';
    }
    return (
      <div className={classNames('height100', 'flexColCenter', 'itemCenter')}>
        <Result status={'success'} title={'提交成功!'} subTitle={num} />
      </div>
    );
  }
}

export default Success;
