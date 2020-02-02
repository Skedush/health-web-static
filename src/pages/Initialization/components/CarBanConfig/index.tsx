import React, { PureComponent } from 'react';
// import styles from './index.less';
import { connect } from '@/utils/decorators';
// import classNames from 'classnames';
import { FormComponentProps } from '@/components/Library/type';
import { GlobalState, UmiComponentProps } from '@/common/type';

const mapStateToProps = (state: GlobalState) => {
  return {};
};

type CarBanConfigStateProps = ReturnType<typeof mapStateToProps>;
type CarBanConfigProps = CarBanConfigStateProps & UmiComponentProps & FormComponentProps;

interface CarBanConfigState {}

@connect(
  mapStateToProps,
  null,
)
class CarBanConfig extends PureComponent<CarBanConfigProps, CarBanConfigState> {
  constructor(props: Readonly<CarBanConfigProps>) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    return <div />;
  }
}
export default CarBanConfig;
