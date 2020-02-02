import React, { PureComponent } from 'react';
import {
  Row,
  Col,
  Upload,
  Button,
  Input,
  Select,
  KVTable,
  Message,
  DatePicker,
  Radio,
  RadioGroup,
} from '@/components/Library';
import Form, { FormComponentProps } from '@/components/Library/Form';
import connect from '@/utils/decorators/connect';
import { DictionaryEnum, UmiComponentProps, GlobalState } from '@/common/type';
import { PersonBaseInfo } from '@/models/person';
import styles from './index.less';
import { uploadImage, isPhone, isIdCard, isPassport } from '@/utils/validater';
import moment from 'moment';
import { UploadFile } from 'antd/lib/upload/interface';
import { base64ToFile, encryptValue } from '@/utils';
import { ERROR_READ_CARD } from '@/utils/message';
import Config from '@/utils/config';
import { EPersonType } from '../PerosonForm';
// import RadioGroup from 'antd/lib/radio/group';
// -----------------------------住户信息表单--------------------

const mapStateToProps = (state: GlobalState) => {
  return {
    state,
    ButtonLoading: state.loading.effects['person/addPerson'],
    idCardReaderLoading: state.loading.effects['person/readIdCard'],
    householdPersonTypes: state.app.dictionry[DictionaryEnum.HOUSEHOLD_PERSON_TYPE] || [],
    personTypes: state.app.dictionry[DictionaryEnum.TEMP_PERSON_TYPE] || [],
    propertyTypes: state.app.dictionry[DictionaryEnum.PROPERTY_TYPE] || [],
    cardType: state.app.dictionry[DictionaryEnum.CARD_TYPE] || [],
  };
};

interface FormBodyProps
  extends FormComponentProps,
    ReturnType<typeof mapStateToProps>,
    UmiComponentProps {
  isWard: boolean;
  openType: 'add' | 'edit';
  buidingUnitHouse: any[];
  personType: EPersonType;
  personData: PersonBaseInfo | null;
  houseData?: { buildingId: string; unitId: string; [key: string]: any };
}

interface FormBodyState {
  buildingList: any[];
  unitList: any[];
  houseList: any[];
  idCardImage: UploadFile[];
  personImage: UploadFile[];
  countryList: { id: number; nameCn: string }[];
  countryListSourceData: { id: number; nameCn: string }[];
  unitListDisabled: boolean;
  houseListDisabled: boolean;
  modifyData: PersonBaseInfo | null;
  isOwner: boolean;
  isForeigner: boolean;
  parentDataOfChild: PersonBaseInfo | null;
}

@connect(
  mapStateToProps,
  null,
  null,
  { forwardRef: true },
)
export class FormBody extends PureComponent<FormBodyProps, FormBodyState> {
  editId: number;

  editData: PersonBaseInfo;

  personData: PersonBaseInfo | null;

  constructor(props) {
    super(props);
    this.state = {
      buildingList: [],
      unitList: [],
      houseList: [],
      personImage: [],
      idCardImage: [],
      countryListSourceData: [],
      countryList: [],
      unitListDisabled: true,
      houseListDisabled: true,
      isOwner: false,
      parentDataOfChild: null,
      modifyData: null,
      isForeigner: false,
    };
  }

  async componentDidMount() {
    const { dispatch, personType, personData } = this.props;

    await Promise.all([
      dispatch({ type: 'app/getDic', payload: { type: DictionaryEnum.HOUSEHOLD_PERSON_TYPE } }),
      dispatch({ type: 'app/getDic', payload: { type: DictionaryEnum.TEMP_PERSON_TYPE } }),
      dispatch({ type: 'app/getDic', payload: { type: DictionaryEnum.PROPERTY_TYPE } }),
      dispatch({ type: 'app/getDic', payload: { type: DictionaryEnum.CARD_TYPE } }),
    ]);
    this.getCountryList();
    if (personType === EPersonType.child && personData) {
      this.addChildren(personData);
    }
  }

  async getCountryList() {
    const data = await this.props.dispatch({ type: 'person/getCountryList' });
    this.setState({
      countryList: data,
      countryListSourceData: data,
    });
  }

  cardTypeChange = event => {
    this.setState({
      isForeigner: event.target.value === '2',
      idCardImage: [],
    });
    this.props.form.setFieldsValue({
      name: '',
      idCard: '',
      nation: '',
      domicile: '',
      idCardAddress: '',
      birthday: null,
      sex: '1',
    });
  };

  disabledStartDate = startValue => {
    if (!startValue) {
      return false;
    }
    return (
      startValue.valueOf() >
      moment()
        .subtract('day', 1)
        .valueOf()
    );
  };

  idCardImageChange = ({ fileList }) => {
    this.setState({
      idCardImage: fileList,
    });
  };

  reset() {
    this.props.form.resetFields();
    this.personData = null;
    this.setState({
      modifyData: null,
      isForeigner: false,
      isOwner: false,
      idCardImage: [],
    });
  }

  async modifyPerson(record: PersonBaseInfo) {
    this.editData = record;
    const personType = record.personType;
    this.editId =
      personType === EPersonType.property || personType === EPersonType.temp
        ? +record.id
        : +record.subId;
    this.props.form.resetFields();
    this.personData = { ...record };
    if (personType === EPersonType.owner || personType === EPersonType.child) {
      if (record.type === '1') {
        record.rentTime = null;
      } else {
        record.rentTime = moment(record.rentTime);
        record.authorizeExpireTime = moment(record.authorizeExpireTime);
        // record.rentTime = [
        //   record.rentTime ? moment(record.rentTime) : null,
        //   record.rentTime ? moment(record.authorizeExpireTime) : null,
        // ];
      }
      this.setState({
        isOwner: record.type === '1',
      });
    }
    this.setState({
      parentDataOfChild: record,
      idCardImage: [
        {
          uid: '2',
          type: 'unchanged',
          size: 3,
          name: '无登记照',
          url:
            personType === EPersonType.property || personType === EPersonType.temp
              ? record.image
              : record.bpImageUrl,
        },
      ],
    });

    this.setValueModify(record, personType);
  }

  setValueModify(personData: PersonBaseInfo, personType?: EPersonType) {
    let modifyData: any;
    personData.idCardSource = personData.idCard;
    const encryptCardId = encryptValue(personData.idCard);
    if (personType === EPersonType.owner) {
      modifyData = {
        name: personData.name,
        idCard: encryptCardId,
        nation: personData.nation,
        domicile: personData.domicile,
        type: personData.type,
        sex: personData.sex,
        birthday: moment(personData.birthday),
        rentTime: personData.rentTime,
        authorizeExpireTime: personData.authorizeExpireTime,
        phone: personData.phone,
        remark: personData.remark,
      };
    } else if (personType === EPersonType.child) {
      modifyData = {
        name: personData.name,
        nation: personData.nation,
        idCard: encryptCardId,
        domicile: personData.domicile,
        sex: personData.sex,
        birthday: moment(personData.birthday),
        phone: personData.phone,
        remark: personData.remark,
      };
    } else if (personType === EPersonType.property) {
      modifyData = {
        name: personData.name,
        idCard: encryptCardId,
        nation: personData.nation,
        idCardAddress: personData.idCardAddress,
        phone: personData.phone,
        sex: personData.sex,
        // type: personData.type,
        birthday: moment(personData.birthday),
        remark: personData.remark,
        personTypeMetaData: personData.personTypeMetaData,
      };
    } else if (personType === EPersonType.temp) {
      modifyData = {
        name: personData.name,
        idCard: encryptCardId,
        nation: personData.nation,
        domicile: personData.domicile,
        type: personData.type,
        sex: personData.sex,
        birthday: moment(personData.birthday),
        phone: personData.phone,
        remark: personData.remark,
        position: personData.position,
      };
    }

    if (personData.foreign) {
      modifyData.nationality = personData.nationality;
    }
    this.setState({ modifyData, isForeigner: personData.foreign }, () => {
      if (modifyData.type) {
        this.props.form.resetFields(['type']);
      }
    });
  }

  addChildren = async (record: PersonBaseInfo) => {
    this.props.form.resetFields();
    this.personData = record;
    if (record.type === '1') {
      record.rentTime = '永久';
      record.rentTimeCN = '永久';
    } else if (record.authorizeExpireTime) {
      record.rentTime = moment(record.rentTime);
      record.authorizeExpireTime = moment(record.authorizeExpireTime);
      record.rentTimeCN =
        record.rentTime.format('YYYY-MM-DD') +
        '~' +
        record.authorizeExpireTime.format('YYYY-MM-DD');
    }
    const findItem = this.props.householdPersonTypes.find(item => item.key === record.type);
    if (findItem) {
      record.typeCN = findItem.value;
    }
    this.setState({
      isOwner: record.type === '1',
      parentDataOfChild: record,
    });
    this.props.form.setFieldsValue({
      phone: record.phone,
    });
  };

  onPersonTypeChange = value => {
    const { personType } = this.props;
    if (personType === EPersonType.owner) {
      // const findPerson = this.props.householdPersonTypes.find(item => item.key === value);
      this.props.form.setFieldsValue({
        rentTime: undefined,
        authorizeExpireTime: undefined,
      });
      this.setState({
        isOwner: value === '1',
      });
    }
  };

  readIdCard = async () => {
    const { personType, form } = this.props;
    let data;
    try {
      data = await this.props.dispatch({ type: 'person/readIdCard' });
    } catch (error) {
      return Promise.resolve();
    }
    if (this.state.isForeigner) {
      return;
    }
    if (!data) {
      Message.warning(ERROR_READ_CARD);
      return;
    }
    const fileImage: any = await base64ToFile('data:image/png;base64,' + data.Base64Photo, 'png');
    form.resetFields(['idCardImage']);
    fileImage.uid = '1';
    fileImage.url = 'data:image/png;base64,' + data.Base64Photo;
    this.setState({
      idCardImage: [fileImage],
    });
    const formData: any = {
      idCard: data.IDNumber,
      nation: data.Nation,
      name: data.Name,
      birthday: moment(data.Birthday),
      sex: data.Sex === '男' ? '1' : '2',
    };
    if (personType === EPersonType.property) {
      formData.idCardAddress = data.Address;
    } else {
      formData.domicile = data.Address;
    }
    form.setFieldsValue(formData, () => {});
  };

  idCardChange = event => {
    if (this.state.isForeigner || this.props.personType !== EPersonType.child) {
      return;
    }
    const cardId = event.target.value;
    isIdCard(null, cardId, error => {
      if (error) {
        return;
      }

      const birthday = moment(cardId.substr(6, 8));
      const gender = cardId.substr(16, 1) % 2 ? '1' : '2';
      this.props.form.setFieldsValue({ birthday: cardId ? birthday : null, sex: gender });
    });
  };

  disabledEndDate = endValue => {
    if (!endValue) {
      return false;
    }
    return endValue.valueOf() <= moment().valueOf();
  };

  imageValidator = (rule, value, callback) => {
    const { idCardImage } = this.state;
    if (rule.field === 'idCardImage' && idCardImage.length) {
      callback();
    } else {
      callback(new Error('图片不能为空！'));
    }
  };

  removeParameter(obj: Object, name: string) {
    if (!obj[name]) {
      delete obj[name];
    }
  }

  // eslint-disable-next-line max-lines-per-function
  submit(type: 'add' | 'edit') {
    const { isForeigner, countryListSourceData } = this.state;
    const { isWard, personType, houseData, dispatch } = this.props;
    if (personType === EPersonType.child) {
      return this.childSubmit(type);
    }
    if (type === 'add') {
      return new Promise(resolve => {
        const { validateFieldsAndScroll } = this.props.form;
        validateFieldsAndScroll(async (error, values) => {
          const { idCardImage } = this.state;
          if (error) {
            resolve();
            return;
          }
          if (!values.nation) values.nation = '其他';
          if (values.rentTime) {
            values.authorizeExpireTime = values.authorizeExpireTime.format('YYYY-MM-DD HH:mm:ss');
            values.rentTime = values.rentTime.format('YYYY-MM-DD HH:mm:ss');
          }
          if (values.idCardImage instanceof Array) {
            values.idCardImage = values.idCardImage[0];
          } else if (idCardImage.length) {
            if (idCardImage[0].originFileObj instanceof File) {
              values.idCardImage = idCardImage[0].originFileObj;
            } else {
              values.idCardImage = idCardImage[0];
            }
          } else if (values.idCardImage) {
            values.idCardImage = values.idCardImage.file.originFileObj;
          }
          if (personType === 'owner') {
            values.buildingId = houseData ? houseData.buildingId : '';
            values.unitId = houseData ? houseData.unitId : '';
            values.houseId = houseData ? houseData.id : '';
          }
          values.birthday = values.birthday.format('YYYY-MM-DD');
          if (isForeigner) {
            const country = countryListSourceData.find(item => item.id === values.nationality);
            values.nationality = country ? country.nameCn : '中国';
          } else {
            values.nationality = '中国';
          }
          let responseData;
          if (personType === EPersonType.property) {
            responseData = await dispatch({
              type: 'person/addProperty',
              data: values,
            });
          } else if (personType === EPersonType.temp) {
            responseData = await dispatch({
              type: 'person/addProvisional',
              data: values,
            });
          } else {
            values.personId = '';
            responseData = await this.props.dispatch({ type: 'person/addPerson', data: values });
          }
          if (responseData) {
            this.personData = this.personData || Object.assign({}, values, responseData);
            resolve(this.personData);
          } else {
            resolve();
          }
        });
      });
    } else if (type === 'edit') {
      return new Promise((resolve, reject) => {
        const { validateFieldsAndScroll } = this.props.form;
        validateFieldsAndScroll(async (error, values) => {
          if (error) {
            resolve();
            return;
          }
          values.idCard = this.editData.idCardSource;
          if (
            (values.idCardImage &&
              values.idCardImage[0] &&
              values.idCardImage[0].type === 'unchanged') ||
            isWard
          ) {
            delete values.idCardImage;
          } else if (values.idCardImage || isWard) {
            values.idCardImage = values.idCardImage.file.originFileObj;
          }
          if (values.rentTime) {
            values.authorizeExpireTime = values.authorizeExpireTime.format('YYYY-MM-DD HH:mm:ss');
            values.rentTime = values.rentTime.format('YYYY-MM-DD HH:mm:ss');
          }
          // if (typeof values.rentTime === 'string') {
          //   delete values.rentTime;
          //   delete values.authorizeExpireTime;
          // }
          if (this.personData && values.type === '1') {
            values.rentTime = this.personData.rentTime;
          }
          if (this.personData && personType === EPersonType.owner) {
            values.houseId = this.personData.houseId;
            values.unitId = this.personData.unitId;
            values.buildingId = this.personData.buildingId;
          }
          this.removeParameter(values, 'idCardImage');
          this.removeParameter(values, 'occupation');
          this.removeParameter(values, 'remark');
          values.idType = '1';
          if (isForeigner) {
            // values.nation = values.nationality;
            values.idType = '2';
          } else {
            values.nationality = '中国';
          }
          values.birthday = values.birthday.format('YYYY-MM-DD');
          try {
            if (personType === EPersonType.property) {
              values.id = this.editId;
              await this.props.dispatch({ type: 'person/updateProperty', data: values });
            } else if (personType === EPersonType.temp) {
              await dispatch({
                type: 'person/updateProvisional',
                data: {
                  id: this.editId,
                  type: values.type,
                  phone: values.phone,
                  remark: values.remark,
                },
              });
            } else {
              values.subId = this.editId ? this.editId : null;
              await this.props.dispatch({ type: 'person/editPerson', data: values });
            }
            resolve({});
          } catch (error) {
            reject(error);
          }
        });
      });
    }
  }

  childSubmit(type: 'add' | 'edit') {
    const { dispatch, houseData } = this.props;
    const { parentDataOfChild, isForeigner, countryListSourceData } = this.state;
    const { validateFieldsAndScroll } = this.props.form;
    console.log(parentDataOfChild);
    return new Promise(resolve => {
      validateFieldsAndScroll(async (errors, values) => {
        if (errors) {
          resolve();
          return;
        }
        if (!values.nation) values.nation = '其他';
        if (parentDataOfChild) {
          if (parentDataOfChild.authorizeExpireTime) {
            values.authorizeExpireTime = parentDataOfChild.authorizeExpireTime.format(
              'YYYY-MM-DD HH:mm:ss',
            );
            values.rentTime = parentDataOfChild.rentTime.format('YYYY-MM-DD HH:mm:ss');
          }
          values.type = parentDataOfChild.type;
        }
        if (this.personData) {
          values.personId = this.personData.personId;
        }
        values.buildingId = houseData ? houseData.buildingId : '';
        values.unitId = houseData ? houseData.unitId : '';
        values.houseId = houseData ? houseData.id : '';
        if (isForeigner) {
          const country = countryListSourceData.find(item => item.id === values.nationality);
          values.nationality = country ? country.nameCn : '中国';
        } else {
          values.nationality = '中国';
        }
        let data;
        values.birthday = values.birthday.format('YYYY-MM-DD');
        if (type === 'add') {
          data = await dispatch({ type: 'person/addChild', data: values });
        } else {
          if (this.personData) {
            values.subId = this.personData.subId ? this.personData.subId : null;
          }
          values.idCard = this.editData.idCardSource;
          values.personId = parentDataOfChild ? parentDataOfChild.personId : '';
          data = await dispatch({ type: 'person/editChild', data: values });
        }
        resolve(data);
      });
    });
  }

  renderPersonType() {
    const { getFieldDecorator } = this.props.form;
    const { householdPersonTypes, personTypes, isWard, personType } = this.props;
    const { modifyData } = this.state;
    const menuList = personType === EPersonType.temp ? personTypes : householdPersonTypes;
    const title = personType === EPersonType.owner ? '住户类型' : '人员类型';
    return (
      (personType === EPersonType.temp || personType === EPersonType.owner) && (
        <Col span={12} className={styles.floatCol}>
          <Form.Item label={title} className={styles.formItem}>
            {getFieldDecorator('type', {
              initialValue: modifyData ? modifyData.type : '',
              rules: [{ required: true, message: '请选择人员类型' }],
            })(
              <Select placeholder={title} disabled={isWard} onSelect={this.onPersonTypeChange}>
                {menuList.map((item, i) => (
                  <Select.Option key={i} value={item.key}>
                    {item.value}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>
        </Col>
      )
    );
  }

  // eslint-disable-next-line max-lines-per-function
  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      isWard,
      openType,
      idCardReaderLoading,
      houseData,
      personType,
      propertyTypes,
      cardType,
    } = this.props;
    const {
      isOwner,
      idCardImage,
      parentDataOfChild,
      countryList,
      modifyData,
      isForeigner,
    } = this.state;
    const houseAddress = houseData
      ? `${houseData.buildingCode}栋${houseData.unitCode}单元${houseData.code}室`
      : '';
    const idCardRules: any[] = [{ required: true, message: '证件号码不能为空！' }];
    if (openType === 'add') {
      idCardRules.push(isForeigner ? { validator: isPassport } : { validator: isIdCard });
    }
    const countryItems = countryList || [];
    // const provisionalEdit = personType === EPersonType.temp && openType === 'edit';
    const isProduct = Config.cardReaderOpened;
    const inputDisabled =
      (isForeigner || personType === EPersonType.child ? false : isProduct) || openType === 'edit';
    return (
      <Form className={styles.form}>
        <div className={styles.topInfo}>
          {(personType === EPersonType.child || personType === EPersonType.owner) && (
            <KVTable style={{ marginBottom: 0 }}>
              <KVTable.Item name={'房屋地址'}>{houseAddress}</KVTable.Item>
              <KVTable.Item name={'户主姓名'}>{houseData ? houseData.personName : ''}</KVTable.Item>
              <KVTable.Item name={'户主电话'}>
                {houseData ? houseData.personPhone : ''}
              </KVTable.Item>
              {personType === EPersonType.child && (
                <KVTable.Item name={'监护人姓名'}>
                  {parentDataOfChild
                    ? openType === 'edit'
                      ? parentDataOfChild.guardianName
                      : parentDataOfChild.name
                    : ''}
                </KVTable.Item>
              )}
              {personType === EPersonType.child && (
                <KVTable.Item name={'住户类型'}>
                  {parentDataOfChild ? parentDataOfChild.typeStr : ''}
                </KVTable.Item>
              )}
              {personType === EPersonType.child && (
                <KVTable.Item name={'租住时间'}>
                  {parentDataOfChild ? parentDataOfChild.rentTimeCN : ''}
                </KVTable.Item>
              )}
            </KVTable>
          )}
        </div>
        {openType === 'add' && (
          <Row>
            <Col>
              <Form.Item label={'证件类型'} className={styles.formItem}>
                {getFieldDecorator('idType', {
                  initialValue: modifyData ? modifyData.cardType : '1',
                  rules: [{ required: true, message: '请选择证件类型' }],
                })(
                  <RadioGroup onChange={this.cardTypeChange}>
                    {cardType.map(item => {
                      return (
                        <Radio value={item.key} key={item.key}>
                          {item.value}
                        </Radio>
                      );
                    })}
                    {/* <Radio value={'1'}>中国大陆</Radio>
                  <Radio value={'2'}>护照</Radio> */}
                  </RadioGroup>,
                )}
              </Form.Item>
            </Col>
          </Row>
        )}
        <Row>
          {((personType !== EPersonType.child && !isForeigner) || openType === 'edit') && (
            <Col span={24} className={styles.floatCol}>
              <Form.Item
                label={'登记照'}
                htmlFor={'idCardImageDisabled'}
                className={styles.formItem}
              >
                {getFieldDecorator('idCardImage', {
                  rules: [{ validator: this.imageValidator }, { validator: uploadImage }],
                })(
                  <Upload
                    onChange={this.idCardImageChange}
                    fileList={idCardImage}
                    uploadType={'picture'}
                    maxFiles={1}
                    icon={
                      <Button
                        customtype={'master'}
                        onClick={this.readIdCard}
                        loading={idCardReaderLoading}
                      >
                        读取身份证信息
                      </Button>
                    }
                    textContent={'单击此处配合读卡器读取身份证信息'}
                    openFileDialogOnClick={!isProduct}
                    disabled={inputDisabled && openType === 'edit'}
                  />,
                )}
              </Form.Item>
            </Col>
          )}
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item label={'人员姓名'} className={styles.formItem}>
              {getFieldDecorator('name', {
                initialValue: modifyData ? modifyData.name : '',
                rules: [{ required: true, message: '姓名不能为空！' }],
              })(<Input placeholder={'人员姓名'} disabled={inputDisabled} maxLength={10} />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={'证件号码'} className={styles.formItem}>
              {getFieldDecorator('idCard', {
                initialValue: modifyData ? modifyData.idCard : '',
                rules: idCardRules,
              })(
                <Input
                  placeholder={'证件号码'}
                  disabled={inputDisabled}
                  onChange={this.idCardChange}
                  maxLength={20}
                />,
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          {!isForeigner && (
            <Col span={12}>
              <Form.Item label={'民族'} className={styles.formItem}>
                {getFieldDecorator('nation', {
                  initialValue: modifyData ? modifyData.nation : '',
                  rules: [{ required: true, message: '民族不能为空！' }],
                })(<Input placeholder={'民族'} disabled={inputDisabled} maxLength={6} />)}
              </Form.Item>
            </Col>
          )}
          {isForeigner && (
            <Col span={12} className={styles.floatCol}>
              <Form.Item label={'国籍'} className={styles.formItem}>
                {getFieldDecorator('nationality', {
                  initialValue: modifyData ? modifyData.nationality : '',
                  rules: [{ required: true, message: '请选择国籍' }],
                })(
                  <Select
                    showSearch
                    filterOption={(value, option: any) => option.props.children.indexOf(value) >= 0}
                    placeholder={'国籍'}
                    disabled={openType === 'edit'}
                  >
                    {countryItems.map((item, i) => (
                      <Select.Option key={i} value={item.id}>
                        {item.nameCn}
                      </Select.Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
            </Col>
          )}
          <Col span={12}>
            <Form.Item label={'证件地址'} className={styles.formItem}>
              {personType === EPersonType.property
                ? getFieldDecorator('idCardAddress', {
                    initialValue: modifyData ? modifyData.idCardAddress : '',
                    rules: [{ required: true, message: '证件地址不能为空！' }],
                  })(<Input placeholder={'证件地址'} disabled={inputDisabled} />)
                : getFieldDecorator('domicile', {
                    initialValue: modifyData ? modifyData.domicile : '',
                    rules: [{ required: true, message: '证件地址不能为空！' }],
                  })(<Input placeholder={'证件地址'} disabled={inputDisabled} />)}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12} className={styles.floatCol}>
            <Form.Item label={'出生年月'} className={styles.formItem}>
              {getFieldDecorator('birthday', {
                initialValue: modifyData ? modifyData.birthday : null,
                rules: [{ required: true, message: '请选择出生年月' }],
              })(
                <DatePicker
                  disabledDate={this.disabledStartDate}
                  showTime={false}
                  placeholder={'出生年月'}
                  disabled={inputDisabled || (personType === EPersonType.child && !isForeigner)}
                />,
              )}
            </Form.Item>
          </Col>
          <Col span={12} className={styles.floatCol}>
            <Form.Item label={'性别'} className={styles.formItem}>
              {getFieldDecorator('sex', {
                initialValue: modifyData ? modifyData.sex : '1',
                rules: [{ required: true, message: '请选择性别' }],
              })(
                <RadioGroup
                  disabled={inputDisabled || (personType === EPersonType.child && !isForeigner)}
                >
                  <Radio value={'1'}>男</Radio>
                  <Radio value={'2'}>女</Radio>
                </RadioGroup>,
              )}
            </Form.Item>
          </Col>
        </Row>
        {personType !== EPersonType.child && !isForeigner && (
          <div className={styles.tip}>(以上内容可通过读取身份证录入)</div>
        )}
        <Row>
          {this.renderPersonType()}
          {personType === EPersonType.owner &&
            (isOwner ? (
              <Col span={12}>
                <Form.Item label={'租住时间'} className={styles.formItem}>
                  <Input value={'永久'} disabled />
                </Form.Item>
              </Col>
            ) : (
              <Col span={12}>
                <Col span={12} className={styles.floatCol}>
                  <Form.Item label={'租住时间'} className={styles.formItem}>
                    {getFieldDecorator('rentTime', {
                      initialValue: modifyData ? modifyData.rentTime : undefined,
                      rules: [{ required: true, message: '请选择租住时间' }],
                    })(<DatePicker showTime={false} disabled={isWard} placeholder={'开始时间'} />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={'租住到期时间'} className={styles.formItem}>
                    {getFieldDecorator('authorizeExpireTime', {
                      initialValue: modifyData ? modifyData.authorizeExpireTime : undefined,
                      rules: [{ required: true, message: '请选择租住到期时间' }],
                    })(
                      <DatePicker
                        showTime={false}
                        disabled={isWard}
                        disabledDate={this.disabledEndDate}
                        placeholder={'到期时间'}
                      />,
                    )}
                  </Form.Item>
                </Col>
              </Col>
            ))}
          {personType === EPersonType.property && (
            <Col span={12} className={styles.floatCol}>
              <Form.Item label={'职位'} className={styles.formItem}>
                {getFieldDecorator('personType', {
                  initialValue: modifyData ? modifyData.personTypeMetaData : '',
                  rules: [{ required: true, message: '请选择职位！' }],
                })(
                  <Select placeholder={'职位'}>
                    {propertyTypes.map((item, i) => (
                      <Select.Option key={i} value={item.key}>
                        {item.value}
                      </Select.Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
            </Col>
          )}
          <Col span={12} className={styles.floatCol}>
            <Form.Item label={'联系电话'} className={styles.formItem}>
              {getFieldDecorator('phone', {
                initialValue: modifyData ? modifyData.phone : '',
                rules: [{ required: true, message: '联系电话不能为空！' }, { validator: isPhone }],
              })(<Input placeholder={'联系电话'} maxLength={20} />)}
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col>
            <Form.Item label={'备注'} className={styles.formItem}>
              {getFieldDecorator('remark', {
                initialValue: modifyData ? modifyData.remark : '',
              })(<Input placeholder={'备注'} maxLength={200} />)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}

const FormBodyInstance = Form.create<any>()(FormBody);

export default FormBodyInstance;
