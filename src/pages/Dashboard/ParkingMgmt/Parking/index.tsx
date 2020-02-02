import React, { PureComponent } from 'react';
import { GlobalState, UmiComponentProps } from '@/common/type';
import connect from '@/utils/decorators/connect';
import styles from './index.less';
import classNames from 'classnames';
import ParkingList from './components/ParkingList';
import ParkingCardItemList from './components/ParkingCardItemList';
import ParkingCarCardItemList from './components/ParkingCarCardItemList';

const mapStateToProps = (state: GlobalState) => {
  return {
    state,
  };
};

type ParkingStateProps = ReturnType<typeof mapStateToProps>;
type ParkingProps = ParkingStateProps & UmiComponentProps;

interface ParkingState {
  parkingId?: number;
  parkingType?: string;
  parkingName?: string;
}

@connect(
  mapStateToProps,
  null,
)
class Parking extends PureComponent<ParkingProps, ParkingState> {
  constructor(props: Readonly<ParkingProps>) {
    super(props);
    this.state = {
      parkingId: undefined,
      parkingType: '',
      parkingName: '',
    };
  }

  render() {
    return (
      <div className={classNames('height100', 'flexBetween')}>
        <ParkingList getParking={this.parkingChange} />
        <div className={classNames(styles.tableContainer, 'flexColStart')}>
          {this.state.parkingId && this.state.parkingType === '1' && (
            <ParkingCardItemList parkingLotId={this.state.parkingId} />
          )}
          {this.state.parkingId && this.state.parkingType === '2' && (
            <ParkingCarCardItemList
              parkingLotId={this.state.parkingId}
              parkingName={this.state.parkingName}
            />
          )}
          {!this.state.parkingId && <div className={styles.parkingSpace} />}
        </div>
      </div>
    );
  }

  parkingChange = record => {
    if (record) {
      this.setState({
        parkingId: record.id,
        parkingType: record.type,
        parkingName: record.name,
      });
    }
  };
}

export default Parking;
