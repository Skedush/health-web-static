import React, { PureComponent } from 'react';
import { Modal } from '@/components/Library';

interface Props {
  visible: boolean;
}

export default class ParkingSpaceDetail extends PureComponent<Props> {
  render() {
    const { visible } = this.props;
    return <Modal visible={visible} title={'车位详情'} />;
  }
}
