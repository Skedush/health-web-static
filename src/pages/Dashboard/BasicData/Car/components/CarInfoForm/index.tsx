import React, { PureComponent, Fragment } from 'react';
import { WrappedFormUtils } from '@/components/Library/type';
import { FormSimple, Select, Col, Form, Input } from '@/components/Library';
import { connect } from '@/utils/decorators';
import { GlobalState, UmiComponentProps, DictionaryEnum } from '@/common/type';
import { carNumber } from '@/utils/validater';
const FormItem = Form.Item;

const mapStateToProps = ({ app, parkingGlobal, carGlobal, loading: { effects } }: GlobalState) => {
  return {
    parkingConfig: parkingGlobal.parkingConfig,
    carTypes: app.dictionry[DictionaryEnum.CAR_TYPE] || [],
    carArea: carGlobal.carArea,
    carBanAuthSettingData: carGlobal.carBanAuthSettingData,
    carProvince: carGlobal.carProvince,
    loading: {
      addCarLoading: effects['carGlobal/addCar'],
    },
  };
};

type CarInfoFormStateProps = ReturnType<typeof mapStateToProps>;

type CarInfoFormProps = UmiComponentProps &
  CarInfoFormStateProps & {
    carType: string;
    getList: Function;
    onFormPre: Function;
    onFormNext: Function;
    onCancelModel: Function;
    owner: any;
    setCarId: Function;
    haveReGetList: boolean;
    inPersonForm?: boolean;
    // visible: boolean;
  };
interface CarInfoFormState {}
@connect(
  mapStateToProps,
  null,
  null,
  { forwardRef: true },
)
class CarInfoForm extends PureComponent<any, CarInfoFormState> {
  carInfoForm: WrappedFormUtils;

  constructor(props: Readonly<CarInfoFormProps>) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.dispatch({ type: 'carGlobal/getCarArea', payload: { province: '浙' } });
  }

  render() {
    return <FormSimple {...this.getCarInfoFormProps()} />;
  }

  getCarPlateItem = () => {
    const { carProvince = [], carArea = [] } = this.props;
    const carProvinceOption = carProvince.map((item, index) => {
      return (
        <Select.Option key={item} value={item}>
          {item}
        </Select.Option>
      );
    });

    const carAreaOption = carArea.map((item, index) => {
      return (
        <Select.Option key={item} value={item}>
          {item}
        </Select.Option>
      );
    });
    return {
      type: 'custom',
      field: 'ownerName',
      render: getFieldDecorator => {
        return (
          <Fragment>
            <Col span={6}>
              <FormItem label={'车牌号'}>
                {getFieldDecorator('province', {
                  initialValue: '浙',
                  rules: [{ required: true, message: '省代码不能为空！' }],
                })(
                  <Select placeholder={'省'} onChange={this.onProvinceChange}>
                    {carProvinceOption}
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span={6} style={{ marginTop: '40px' }}>
              <FormItem label={''}>
                {getFieldDecorator('area', {
                  initialValue: 'C',
                  rules: [{ required: true, message: '区域代码不能为空！' }],
                })(<Select placeholder={'区域'}>{carAreaOption}</Select>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label={''} style={{ marginTop: '40px' }}>
                {getFieldDecorator('carNumber', {
                  rules: [{ required: true, message: '车牌不能为空！' }, { validator: carNumber }],
                })(<Input placeholder={'车牌'} maxLength={10} />)}
              </FormItem>
            </Col>
          </Fragment>
        );
      },
    };
  };

  getCarInfoFormProps = () => {
    const { carBanAuthSettingData, parkingConfig, inPersonForm } = this.props;
    console.log('parkingConfig: ', parkingConfig);
    const props = {
      items: [
        {
          type: 'select',
          field: 'type',
          initialValue: this.props.carType,
          disabled: true,
          children: this.props.carTypes,
          placeholder: '车辆类型',
          rules: [{ required: true, message: '车辆类型不能为空！' }],
        },
        {
          type: 'input',
          initialValue: this.props.owner.name,
          field: 'ownerName',
          disabled: true,
          placeholder: '关联人员',
          rules: [{ required: true, message: '关联人员不能为空！' }],
        },
        {
          disabled: true,
          initialValue: this.props.owner.phone || '',
          type: 'input',
          field: 'ownerPhone',
          placeholder: '联系电话',
          rules: [{ required: true, message: '请选择关联人员！' }],
        },
        this.getCarPlateItem(),
        {
          type: 'input',
          field: 'brand',
          placeholder: '品牌',
          maxLength: 10,
        },
        {
          type: 'input',
          field: 'spec',
          placeholder: '车型',
          maxLength: 10,
        },
        {
          type: 'input',
          field: 'color',
          placeholder: '颜色',
          maxLength: 10,
        },
        {
          type: 'textArea',
          field: 'remark',
          fill: true,
          maxLength: 200,
          placeholder: '备注内容',
        },
      ],
      actions: [
        { customtype: 'select', title: '上一步', onClick: this.props.onFormPre },
        {
          customtype: 'select',
          title: carBanAuthSettingData.authState || parkingConfig.enabled ? '下一步' : '完成',
          // loading: formButtonLoading,
          htmlType: 'submit' as 'submit',
        },
      ],
      onSubmit: this.onAddModalSubmit,
      onGetFormRef: (modelForm: WrappedFormUtils) => {
        this.carInfoForm = modelForm;
      },
    };
    if (inPersonForm) {
      props.items.splice(0, 3);
      props.actions = [];
    }
    return props;
  };

  onProvinceChange = (value, _item) => {
    const { dispatch } = this.props;
    this.carInfoForm.setFieldsValue({
      area: undefined,
    });
    dispatch({ type: 'carGlobal/getCarArea', payload: { province: value } });
  };

  onAddModalSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { dispatch, carBanAuthSettingData, parkingConfig } = this.props;
    this.carInfoForm.validateFields(async (err, fieldValues) => {
      if (!err) {
        fieldValues.type = this.props.carType;
        fieldValues.personId = this.props.owner.id;
        fieldValues.licensePlate = fieldValues.province + fieldValues.area + fieldValues.carNumber;
        fieldValues.spec = fieldValues.spec || '未知';
        fieldValues.brand = fieldValues.brand || '未知';
        fieldValues.color = fieldValues.color || '未知';
        const res = await dispatch({ type: 'carGlobal/addCar', data: fieldValues });
        if (res && res.success) {
          this.props.setCarId(res.data);
          carBanAuthSettingData.authState || parkingConfig.enabled
            ? this.props.onFormNext()
            : this.props.onCancelModel();
        }
        if (this.props.haveReGetList) this.props.getList();
      }
    });
  };

  personFormSubmit = async () => {
    const { dispatch, owner } = this.props;
    return new Promise(resolve => {
      this.carInfoForm.validateFields(async (err, fieldValues) => {
        if (!err) {
          fieldValues.type = this.props.carType;
          fieldValues.personId = this.props.owner.id;
          fieldValues.licensePlate =
            fieldValues.province + fieldValues.area + fieldValues.carNumber;
          fieldValues.spec = fieldValues.spec || '未知';
          fieldValues.brand = fieldValues.brand || '未知';
          fieldValues.color = fieldValues.color || '未知';
          fieldValues.ownerName = owner.name;
          fieldValues.ownerPhone = owner.phone;
          const res = await dispatch({ type: 'carGlobal/addCar', data: fieldValues });
          if (res && res.success) {
            resolve(res.data);
          } else if (!res.success && this.props.reject) {
            resolve();
          } else {
            resolve();
          }
        } else {
          resolve();
        }
      });
    });
  };
}
export default CarInfoForm;
