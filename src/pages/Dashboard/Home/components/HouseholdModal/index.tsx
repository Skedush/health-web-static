import React, { Component } from 'react';
import { Modal, Radio, Button, RadioGroup } from '@/components/Library';
import styles from './index.less';

interface State {
  radioValue: string;
  type: 'personAdd' | 'personRemove';
  visible: boolean;
}

export default class HouseholdModal extends Component<any, State> {
  callback: Function;

  constructor(props) {
    super(props);
    this.state = {
      type: 'personAdd',
      visible: false,
      radioValue: 'owner',
    };
  }

  open(callback: Function, type: 'personAdd' | 'personRemove' = 'personAdd') {
    console.log('callback: ', callback);
    this.callback = callback;
    this.setState({
      type,
      visible: true,
    });
  }

  onChange = e => {
    this.setState({
      radioValue: e.target.value,
    });
  };

  reset() {
    this.setState({ radioValue: 'owner' });
  }

  close() {
    this.setState({
      visible: false,
    });
  }

  onConfirm = () => {
    this.callback(this.state.radioValue);
    this.close();
  };

  renderFooter() {
    const { type } = this.state;
    return (
      <div>
        <Button customtype={'master'} onClick={this.onConfirm}>
          {type === 'personAdd' ? '下一步' : '确定'}
        </Button>
      </div>
    );
  }

  render() {
    const { visible, radioValue, type } = this.state;
    return (
      <Modal
        title={type === 'personAdd' ? '登记类型' : '人员注销'}
        visible={visible}
        onCancel={() => this.close()}
        footer={this.renderFooter()}
      >
        <div className={styles.container}>
          <RadioGroup onChange={this.onChange} value={radioValue}>
            <Radio value={'owner'}>{type === 'personAdd' ? '住户登记' : '普通住户'}</Radio>
            {type === 'personAdd' && <Radio value={'child'}>孩童登记</Radio>}
            <Radio value={'temp'}>{type === 'personAdd' ? '临时人员登记' : '临时人员'}</Radio>
            <Radio value={'property'}>{type === 'personAdd' ? '物业人员登记' : '物业人员'}</Radio>
          </RadioGroup>
        </div>
      </Modal>
    );
  }
}
