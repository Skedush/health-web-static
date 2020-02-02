import React, { PureComponent } from 'react';
// import styles from './index.less';
import { connect } from '@/utils/decorators';
// import classNames from 'classnames';
import { FormComponentProps } from '@/components/Library/type';
import { GlobalState, UmiComponentProps } from '@/common/type';

const mapStateToProps = (state: GlobalState) => {
  return {};
};

type DoorBanConfigStateProps = ReturnType<typeof mapStateToProps>;
type DoorBanConfigProps = DoorBanConfigStateProps & UmiComponentProps & FormComponentProps;

interface DoorBanConfigState {}

@connect(
  mapStateToProps,
  null,
)
class DoorBanConfig extends PureComponent<DoorBanConfigProps, DoorBanConfigState> {
  constructor(props: Readonly<DoorBanConfigProps>) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    return <div />;
  }
}
export default DoorBanConfig;
