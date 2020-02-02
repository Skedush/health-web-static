import React, { Component } from 'react';
import { Modal } from '@/components/Library';

interface State {
  visible: boolean;
}

export default class PersonDelete extends Component<any, State> {
  render() {
    const { visible } = this.state;

    return (
      <Modal title={'注销住户'} visible={visible}>
        {/* <div */}
      </Modal>
    );
  }
}
