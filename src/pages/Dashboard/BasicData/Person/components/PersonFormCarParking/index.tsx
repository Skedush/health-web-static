import React, { PureComponent } from 'react';
import styles from './index.less';
import { CarBaseInfo } from '../../../Car/model';
import ParkingRegisterForm from '../../../Car/components/ParkingRegisterForm';

interface Props {
  dispatch: Function;
  carData: CarBaseInfo | null;
}

interface State {}

export default class CarParking extends PureComponent<Props, State> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={styles.carParking}>
        <ParkingRegisterForm />
      </div>
    );
  }

  reset() {}

  onSearch = value => {
    console.log(value);
  };

  submit() {
    // const { dispatch, carData } = this.props;
    // if (carData) {
    //   console.log(carData);
    // }
    // dispatch({ type:  })
  }
}
