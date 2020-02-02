import React, { PureComponent, Fragment } from 'react';
import { WrappedFormUtils } from '@/components/Library/type';
import { FormSimple, Modal, Col, Select } from '@/components/Library';
import { connect } from '@/utils/decorators';
import { GlobalState, UmiComponentProps } from '@/common/type';
import { LETTER } from '@/utils/constant';
import FormItem from 'antd/lib/form/FormItem';

const mapStateToProps = ({ parkingGlobal, loading: { effects } }: GlobalState) => {
  return {
    // getParkingList: parkingGlobal.parkingList,
    loading: { addParkingItemLoading: effects['parking/addParkingItem'] },
  };
};

type AddParkingItemModalStateProps = ReturnType<typeof mapStateToProps>;

type AddParkingItemModalProps = UmiComponentProps &
  AddParkingItemModalStateProps & {
    cancelModel: Function;
    reGetList: Function;
    modalVisible: boolean;
    isGroupAdd: boolean;
    parkingLotId: number;
    // visible: boolean;
  };
interface AddParkingItemModalState {}
@connect(
  mapStateToProps,
  null,
)
class AddParkingItemModal extends PureComponent<any, AddParkingItemModalState> {
  modalForm: WrappedFormUtils;

  constructor(props: Readonly<AddParkingItemModalProps>) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    return (
      <Modal {...this.getAddParkingItemModalProps()}>
        <FormSimple {...this.getAddParkingItemFormProps()} />
      </Modal>
    );
  }

  getAddParkingItemModalProps = () => {
    return {
      onCancel: this.props.cancelModel,
      visible: this.props.modalVisible,
      title: this.props.isGroupAdd ? '批量新增车位' : '新增车位',
      destroyOnClose: true,
      centered: true,
      footer: null,
      maskClosable: true,
      bodyStyle: {},
      width: '30%',
      wrapClassName: 'modal',
    };
  };

  getRegionItem = () => {
    const firstRegion: any = [];
    const secondRegion: any = [];

    LETTER.forEach(item => {
      firstRegion.push({ value: item, key: item });
    });

    for (let i = 1; i < 10; i++) {
      secondRegion.push({ value: i.toString(), key: i.toString() });
    }
    const firstRegionOption = firstRegion.map((item, index) => {
      return (
        <Select.Option key={item.key} value={item.key}>
          {item.value}
        </Select.Option>
      );
    });

    const secondRegionOption = secondRegion.map((item, index) => {
      return (
        <Select.Option key={item.key} value={item.key}>
          {item.value}
        </Select.Option>
      );
    });
    return {
      type: 'custom',
      field: 'ownerName',
      span: 24,
      render: getFieldDecorator => {
        return (
          <Fragment>
            <Col span={14}>
              <FormItem label={'所在区域'}>
                {getFieldDecorator('parkingFirst', {})(
                  <Select placeholder={'空'}>{firstRegionOption}</Select>,
                )}
              </FormItem>
            </Col>
            <Col span={8} style={{ marginTop: '40px' }}>
              <FormItem label={''}>
                {getFieldDecorator('parkingSecond', {})(
                  <Select placeholder={'空'}>{secondRegionOption}</Select>,
                )}
              </FormItem>
            </Col>
          </Fragment>
        );
      },
    };
  };

  getAddParkingItemFormProps = () => {
    const items: any = [
      this.getRegionItem(),
      // {
      //   type: 'label',
      //   field: 'packingNumber',
      //   span: 24,
      //   value: 'A-1',
      //   placeholder: '车位号',
      // },
    ];
    if (this.props.isGroupAdd)
      items.splice(items.length, 0, {
        type: 'number',
        field: 'count',
        span: 24,
        initialValue: 1,
        placeholder: '新增数量',
        min: 0,
        rules: [{ required: true, message: '新增数量不能为空！' }],
      });
    return {
      items: items,
      actions: [
        { customtype: 'second', title: '取消', onClick: this.props.cancelModel },
        {
          customtype: 'select',
          loading: this.props.loading.addParkingItemLoading,
          title: '确认新增',
          htmlType: 'submit' as 'submit',
        },
      ],
      onSubmit: this.onAddParkingItemSubmit,
      onGetFormRef: (modelForm: WrappedFormUtils) => {
        this.modalForm = modelForm;
      },
    };
  };

  onAddParkingItemSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault();
    }
    this.modalForm.validateFields(async (err, fieldsValue) => {
      const area =
        (fieldsValue.parkingFirst ? fieldsValue.parkingFirst : '') +
        (fieldsValue.parkingSecond ? fieldsValue.parkingSecond : '');
      if (err) return;
      const fields = {
        parkingLotId: this.props.parkingLotId,
        area: area,
        count: fieldsValue.count ? fieldsValue.count : 1,
      };
      const res = await this.props.dispatch({ type: 'parking/addParkingItem', payload: fields });
      if (res && res.success) {
        this.props.reGetList();
        this.props.cancelModel();
      }
    });
  };
}
export default AddParkingItemModal;
