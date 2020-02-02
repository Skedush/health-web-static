import React, { PureComponent } from 'react';
import styles from './index.less';
import { connect } from '@/utils/decorators';
import classNames from 'classnames';
// import { isEmpty } from 'lodash';
import { FormComponentProps } from '@/components/Library/type';
import { GlobalState, UmiComponentProps } from '@/common/type';
import HouseConfig from '@/pages/Initialization/components/HouseConfig';

const mapStateToProps = (state: GlobalState) => {
  return {};
};

type BuildingAndUnitAndHouseStateProps = ReturnType<typeof mapStateToProps>;
type BuildingAndUnitAndHouseProps = BuildingAndUnitAndHouseStateProps &
  UmiComponentProps &
  FormComponentProps;

interface BuildingAndUnitAndHouseState {}

@connect(
  mapStateToProps,
  null,
)
class BuildingAndUnitAndHouse extends PureComponent<
  BuildingAndUnitAndHouseProps,
  BuildingAndUnitAndHouseState
> {
  constructor(props: Readonly<BuildingAndUnitAndHouseProps>) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    return (
      <div className={classNames('height100', 'flexColStart')}>
        <div className={classNames(styles.back, 'flexColStart')}>
          <div className={classNames(styles.block, 'flexColStart')}>
            <div className={styles.header}>楼房管理</div>
            <div className={classNames(styles.main, 'flexAuto', 'flexColStart')}>
              <HouseConfig />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default BuildingAndUnitAndHouse;
