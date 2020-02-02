import React, { PureComponent, RefObject, createRef } from 'react';
import { Modal, Row, Col, Form, Button, Select, Message, Confirm } from '@/components/Library';
import SimplyTable, { ISimplyColumn } from '@/components/Library/SimplyTable';
import { IParking } from '../ParkingList';
import { SUCCESS_BINDING, SUCCESS_UNBINDING } from '@/utils/message';
import styles from './index.less';
import { FormComponentProps } from 'antd/es/form/Form';

interface Props {
  dispatch: Function;
  visible: boolean;
  onCancel: Function;
  parkingData: IParking;
  addedDevice: any[];
  bindingSuccess: Function;
  type?: 'form';
  optionalDevices: any[];
}

export default class AssociateDevice extends PureComponent<Props> {
  confirmRef: RefObject<Confirm>;

  columns: ISimplyColumn[] = [
    {
      span: 8,
      name: '序号',
      key: 'index',
    },
    {
      span: 8,
      name: '名称',
      key: 'name',
    },
    {
      span: 8,
      name: '操作',
      render: data => {
        return (
          <Button
            customtype={'icon'}
            icon={'pm-trash-can'}
            title={'解绑设备'}
            onClick={() => this.unbindingDevice(data)}
          />
        );
      },
    },
  ];

  constructor(props) {
    super(props);
    this.confirmRef = createRef();
  }

  renderDevicesSelector(): any {
    const { optionalDevices } = this.props;
    return Form.create()((props: FormComponentProps) => {
      const { form } = props;
      const { getFieldDecorator, validateFields } = form;
      return (
        <Form.Item label={'停车场设备'}>
          <div className={styles.selectorContainer}>
            {getFieldDecorator('value', {
              rules: [{ required: true, message: '请选择设备后添加' }],
            })(
              <Select className={styles.selector}>
                {optionalDevices.map((item, i) => {
                  return (
                    <Select.Option key={i} value={item.key}>
                      {item.value}
                    </Select.Option>
                  );
                })}
              </Select>,
            )}
            <Button customtype={'master'} onClick={() => this.addDevice(validateFields)}>
              添加
            </Button>
          </div>
        </Form.Item>
      );
    });
  }

  renderFooter() {
    return (
      <>
        <Button customtype={'second'} onClick={this.close}>
          关闭
        </Button>
      </>
    );
  }

  renderFormBody() {
    const DevicesSelector = this.renderDevicesSelector();
    const { parkingData, addedDevice } = this.props;
    return (
      <div className={styles.formBody}>
        <Confirm ref={this.confirmRef} />
        <Row>
          <Col span={12}>
            <Form.Item label={'停车场名称'}>{parkingData.name}</Form.Item>
          </Col>
          <Col span={12}>
            <DevicesSelector />
          </Col>
        </Row>
        <SimplyTable columns={this.columns} dataSource={addedDevice} />
      </div>
    );
  }

  render() {
    const { visible, type } = this.props;
    if (type === 'form') {
      return this.renderFormBody();
    }
    return (
      <Modal
        title={'关联设备'}
        visible={visible}
        width={'45%'}
        footer={this.renderFooter()}
        onCancel={this.close}
      >
        {this.renderFormBody()}
      </Modal>
    );
  }

  addDevice = validateFields => {
    const { parkingData, bindingSuccess } = this.props;
    validateFields(async (error, { value }) => {
      if (error) {
        return;
      }
      const data = await this.props.dispatch({
        type: 'parking/bindingParkingDevice',
        data: { id: parkingData.id, deviceId: value },
      });
      if (data) {
        Message.success(SUCCESS_BINDING);
        bindingSuccess(parkingData);
      }
    });
  };

  unbindingDevice(device) {
    console.log(device);
    const { dispatch, bindingSuccess, parkingData } = this.props;
    if (this.confirmRef.current) {
      this.confirmRef.current.open(
        async () => {
          const data = await dispatch({
            type: 'parking/unbindingParkingDevice',
            data: { id: device.id },
          });
          if (data) {
            Message.success(SUCCESS_UNBINDING);
            bindingSuccess(parkingData);
          }
        },
        '解绑设备',
        '确定要解绑设备吗？',
        'warning',
      );
    }
  }

  close = () => {
    const { onCancel } = this.props;
    if (onCancel) {
      onCancel();
    }
  };
}
