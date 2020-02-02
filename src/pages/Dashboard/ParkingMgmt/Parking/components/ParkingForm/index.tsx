import React, { PureComponent } from 'react';
import { Modal, Button, Row, Form, Input, Radio, Select, RadioGroup } from '@/components/Library';
import { FormComponentProps } from '@/components/Library/Form';
import { GlobalState, DictionaryEnum, UmiComponentProps } from '@/common/type';
import connect from '@/utils/decorators/connect';

interface Props extends FormComponentProps, UmiComponentProps {
  visible: boolean;
  title: string;
  openType: 'add' | 'edit';
  onSubmit?: Function;
  onCancel: Function;
  modifyData: any;
  [name: string]: any;
}

const mapStateToProps = (state: GlobalState) => {
  return {
    state,
    parkingType: state.app.dictionry[DictionaryEnum.PARKING_TYPE] || [],
  };
};

@connect(
  mapStateToProps,
  null,
)
export class ParkingForm extends PureComponent<Props> {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'app/getDic', payload: { type: DictionaryEnum.PARKING_TYPE } });
  }

  renderFooter() {
    const { openType } = this.props;
    return (
      <div>
        <Button onClick={this.onSubmit} customtype={'master'}>
          {openType === 'edit' ? '保存' : '完成'}
        </Button>
        <Button onClick={this.close} customtype={'second'}>
          关闭
        </Button>
      </div>
    );
  }

  renderFormBody() {
    const { form, parkingType, modifyData, openType } = this.props;
    const { getFieldDecorator } = form;
    return (
      <>
        <Row>
          <Form.Item label={'停车场名称'}>
            {getFieldDecorator('name', {
              initialValue: modifyData ? modifyData.name : '',
              rules: [{ required: true, message: '请填写停车场名称' }],
            })(<Input placeholder={'停车场名称'} maxLength={20} />)}
          </Form.Item>
        </Row>
        <Row>
          <Form.Item label={'是否收费'}>
            {getFieldDecorator('fee', {
              initialValue: modifyData ? modifyData.fee : '0',
              rules: [{ required: true, message: '请选择' }],
            })(
              <RadioGroup disabled>
                <Radio value={'1'}>是</Radio>
                <Radio value={'0'}>否</Radio>
              </RadioGroup>,
            )}
          </Form.Item>
        </Row>
        {openType === 'add' && (
          <Row>
            <Form.Item label={'停车场类型'}>
              {getFieldDecorator('type', {
                initialValue: modifyData ? modifyData.type : '',
                rules: [{ required: true, message: '请选择停车场类型' }],
              })(
                <Select style={{ width: '100%' }}>
                  {parkingType.map(item => {
                    return (
                      <Select.Option key={item.key} value={item.key}>
                        {item.value}
                      </Select.Option>
                    );
                  })}
                </Select>,
              )}
            </Form.Item>
          </Row>
        )}
      </>
    );
  }

  render() {
    const { visible, title } = this.props;
    return (
      <Modal
        title={title}
        visible={visible}
        onCancel={this.close}
        maskClosable={false}
        footer={this.renderFooter()}
      >
        {this.renderFormBody()}
      </Modal>
    );
  }

  onSubmit = () => {
    const { onSubmit, form, dispatch, modifyData, openType } = this.props;
    const { validateFields } = form;
    validateFields(async (error, values) => {
      if (error) {
        return;
      }
      console.log(values);
      let result;
      if (openType === 'edit') {
        values.id = modifyData.id;
        result = await dispatch({ type: 'parking/editParking', data: values });
      } else {
        result = await dispatch({ type: 'parking/addParking', data: values });
      }

      if (onSubmit && result) {
        this.close();
        onSubmit(result);
      }
    });
  };

  close = () => {
    const { onCancel, form } = this.props;
    onCancel();
    form.resetFields();
  };
}

export default Form.create<Props>()(ParkingForm);
