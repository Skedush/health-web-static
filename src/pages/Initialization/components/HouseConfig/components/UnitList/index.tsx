import React, { PureComponent, RefObject, createRef, Fragment } from 'react';
import store from 'store';
import styles from './index.less';
import { connect } from '@/utils/decorators';
import classNames from 'classnames';
import { WrappedFormUtils } from '@/components/Library/type';
import { SUCCESS_SETTING } from '@/utils/message';
import { GlobalState, UmiComponentProps } from '@/common/type';
import {
  Button,
  Img,
  Icon,
  FormSimple,
  Modal,
  OperatingResults,
  Confirm,
  Steps,
  Tabs,
  Message,
  ButtonGroup,
} from '@/components/Library';
import { isEmpty } from 'lodash';

import phone from '@/assets/images/phone.png';
import unit from '@/assets/images/unit.png';
import aboveNum from '@/assets/images/aboveNum.png';
import underFloor from '@/assets/images/underFloor.png';
import defaultuser from '@/assets/images/defaultuser.png';
import exitCount from '@/assets/images/exitCount.png';
import elevatorCount from '@/assets/images/elevatorCount.png';
const { TabPane } = Tabs;
const mapStateToProps = ({ unitGlobal, loading: { effects } }: GlobalState) => {
  return {
    unitData: unitGlobal.unitData,
    unitDetail: unitGlobal.unitDetail,
    loading: {
      updateUnit: effects['unitGlobal/updateUnit'],
      addUnit: effects['unitGlobal/addUnit'],
      setUnitMgmt: effects['unitGlobal/setUnitMgmt'],
    },
  };
};

type UnitListStateProps = ReturnType<typeof mapStateToProps>;
type UnitListProps = UnitListStateProps &
  UmiComponentProps & {
    getBuildUnitTree?: Function;
    delete?: Function;
    onFormNext?: Function;
    buildId?: number;
  };

interface UnitListState {
  modify: boolean;
  propertyList: any[];
  add: boolean;
  mgmtInfo: any;
  address: string;
  unitId: number;
  unitTypeIsNumber: number;
  aboveBeginList?: KeyValue<number, number>[];
  batchHandleResultsData: any;
  operatingResultsVisible: boolean;
  tabsActiveKey: string;
}
interface KeyValue<K, V> {
  key: K;
  value: V;
}
@connect(
  mapStateToProps,
  null,
)
class UnitList extends PureComponent<any, UnitListState> {
  addBuildForm: WrappedFormUtils;
  form: WrappedFormUtils;
  addHouseForm: WrappedFormUtils;
  setMgmtForm: WrappedFormUtils;
  unitForm: WrappedFormUtils;
  confirmRef: RefObject<Confirm> = createRef();

  TYPE = { BUILD: 1, UNIT: 2, HOUSE: 3 };

  letterList: KeyValue<string, string>[] = Array(26)
    .fill(65)
    .map((v, index) => ({
      key: String.fromCharCode(v + index),
      value: String.fromCharCode(v + index),
    }));

  numberList: KeyValue<number, number>[] = Array(50)
    .fill(0)
    .map((v, index) => ({ key: index + 1, value: index + 1 }));

  aboveList: KeyValue<number, number>[] = Array(100)
    .fill(0)
    .map((v, index) => ({ key: index + 1, value: index + 1 }));

  tenList: KeyValue<number, number>[] = Array(11)
    .fill(0)
    .map((v, index) => ({ key: index, value: index }));

  houseBeginCode: KeyValue<string, string>[] = Array(20)
    .fill(0)
    .map((v, index) => {
      let temp: string | number = index + 1;
      if (temp < 10) {
        temp = '0' + temp;
      } else {
        temp = temp.toString();
      }
      return { key: temp, value: temp };
    });

  constructor(props: Readonly<UnitListProps>) {
    super(props);
    this.state = {
      modify: false,
      address: '',
      propertyList: [],
      add: false,
      unitId: 0,
      tabsActiveKey: '1',
      mgmtInfo: {
        id: null,
        name: '',
        image: '',
        position: '',
        phone: '',
      },
      unitTypeIsNumber: store.get('unitNameType') || 1,
      batchHandleResultsData: {},
      operatingResultsVisible: false,
    };
  }

  componentDidMount() {
    if (!this.props.onFormNext) {
      this.getPropertyList();
    }
  }

  // eslint-disable-next-line max-lines-per-function
  renderUnitModal() {
    let { unitDetail = {}, onFormNext, loading } = this.props;
    const { add, modify, mgmtInfo, propertyList } = this.state;
    if (add) {
      unitDetail = {};
    }

    let items: any = [
      {
        type: 'select',
        initialValue: unitDetail.underNum,
        field: 'underNum',
        span: 12,
        children: this.tenList,
        placeholder: '地下层数',
      },
      {
        type: 'select',
        field: 'doorCount',
        initialValue: unitDetail.doorCount,
        span: 12,
        children: this.tenList,
        placeholder: '出入口数',
      },
      {
        type: 'select',
        field: 'elevatorCount',
        initialValue: unitDetail.elevatorCount,
        span: 12,
        children: this.tenList,
        placeholder: '电梯数',
      },
    ];
    if (add) {
      items = [
        {
          type: 'radio',
          field: 'type',
          disabled: modify,
          span: 24,
          initialValue: unitDetail.code
            ? isNaN(unitDetail.code)
              ? 2
              : 1
            : this.state.unitTypeIsNumber,
          children: [
            { key: 1, value: '数字正序（如：1单元）' },
            { key: 2, value: '英文正序（如：A单元）' },
          ],
          placeholder: '编号类型',
          onChange: this.unitTypeChange,
          rules: [{ required: true, message: '请选择编号类型' }],
        },
        {
          type: 'select',
          field: 'code',
          span: 12,
          initialValue: unitDetail.code,
          disabled: modify,
          children: this.state.unitTypeIsNumber === 1 ? this.numberList : this.letterList,
          placeholder: '单元编号',
          rules: [{ required: true, message: '请选择楼栋编号！' }],
        },
        {
          type: 'select',
          field: 'aboveNum',
          disabled: modify,
          span: 12,
          children: this.aboveList,
          initialValue: unitDetail.aboveNum,
          placeholder: '地上层数',
          onChange: this.aboveChange,
          rules: [{ required: true, message: '请选择地上层数！' }],
        },
        {
          type: 'select',
          field: 'aboveStartIndex',
          initialValue: unitDetail.startNum,
          span: 12,
          disabled: !this.state.aboveBeginList || modify,
          children: this.state.aboveBeginList,
          placeholder: '开始层数',
          rules: [{ required: true, message: '请选择开始层数！' }],
        },
        {
          type: 'select',
          field: 'houseCount',
          initialValue: unitDetail.houseCount,
          disabled: modify,
          span: 12,
          children: this.numberList,
          placeholder: '每层户数',
          rules: [{ required: true, message: '请选择每户层数！' }],
        },
        {
          type: 'select',
          field: 'houseStartCode',
          initialValue: unitDetail.houseStartCode,
          disabled: modify,
          span: 12,
          children: this.houseBeginCode,
          placeholder: '房屋起始编号',
          rules: [{ required: true, message: '请选择房屋起始编号！' }],
        },
      ].concat(items);
    } else {
      items = [
        {
          type: 'input',
          field: 'address',
          placeholder: '当前地址',
          initialValue: this.state.address,
          disabled: true,
          span: 12,
        },
        {
          type: 'select',
          field: 'aboveNum',
          span: 12,
          children: this.aboveList,
          initialValue: unitDetail.aboveNum,
          placeholder: '地上层数',
          onChange: this.aboveChange,
          rules: [{ required: true, message: '请选择地上层数！' }],
        },
      ].concat(items);
    }
    const setMgmtFormItems = [
      {
        type: 'input',
        field: 'address',
        placeholder: '当前地址',
        initialValue: this.state.address,
        disabled: true,
        span: 12,
      },
      {
        type: 'select',
        field: 'chargePersonId',
        // initialValue: mgmtInfo.id,
        onChange: this.onChargePersonChange,
        span: 12,
        children: propertyList,
        placeholder: '单元管理员',
        rules: [{ required: true, message: '请选择单元管理员！' }],
      },
    ];

    const setMgmtFormProps = {
      items: setMgmtFormItems,
      modify,
      onGetFormRef: (modelForm: WrappedFormUtils) => {
        this.setMgmtForm = modelForm;
      },
    };

    const formProps = {
      items: items,
      actions: [
        { customtype: 'second', title: '取消', onClick: this.cancelModel },
        {
          customtype: 'select',
          title: onFormNext ? '完成' : '下一步',
          htmlType: 'submit' as 'submit',
          loading: loading.updateUnit || loading.addUnit,
        },
      ],
      modify,
      onSubmit: this.onUnitFormSubmit,
      onGetFormRef: (modelForm: WrappedFormUtils) => {
        this.unitForm = modelForm;
      },
    };
    const steps = ['添加单元信息', '设置单元管理员'];
    const modalProps = {
      onCancel: this.cancelModel,
      visible: add || modify,
      title: add
        ? steps[parseInt(this.state.tabsActiveKey) - 1]
        : this.state.tabsActiveKey === '1'
        ? '修改单元信息'
        : '设置单元管理员',
      destroyOnClose: true,
      centered: true,
      footer: null,
      maskClosable: false,
      bodyStyle: {},
      width: '50%',
      wrapClassName: 'modal',
    };
    return (
      <Modal {...modalProps}>
        {!onFormNext && add && (
          <Steps current={parseInt(this.state.tabsActiveKey) - 1} size={'small'}>
            {steps.map(item => (
              <Steps.Step key={item} title={item} />
            ))}
          </Steps>
        )}
        <Tabs hiddenTabButton={true} activeKey={this.state.tabsActiveKey}>
          <TabPane tab={steps[0]} key={'1'}>
            <FormSimple {...formProps} />
          </TabPane>
          <TabPane tab={steps[1]} key={'2'}>
            <FormSimple {...setMgmtFormProps} />
            <div className={classNames('flexStart', styles.mgmt, 'itemCenter')}>
              <Img className={styles.mgmtImage} image={mgmtInfo.image} previewImg={true} />
              <div className={classNames('flexColAround', styles.mgmtInfo)}>
                {mgmtInfo.name === '' && <div className={styles.mgmtName}>暂无管理员</div>}
                {mgmtInfo.name !== '' && (
                  <Fragment>
                    <div className={styles.mgmtName}>{mgmtInfo.name}</div>
                    <div className={styles.position}>{mgmtInfo.personTypeStr}</div>
                    <div className={styles.phone}>{mgmtInfo.phone}</div>
                  </Fragment>
                )}
              </div>
            </div>
            {this.renderSetMgmtButtonGroup()}
          </TabPane>
        </Tabs>
      </Modal>
    );
  }

  renderSetMgmtButtonGroup() {
    const { add } = this.state;
    const { loading } = this.props;
    const ButtonGroupProps = {
      actions: [
        {
          customtype: 'second',
          title: add ? '跳过' : '取消',
          onClick: this.cancelModel,
        },
        {
          customtype: 'master',
          title: '完成',
          onClick: this.onsetMgmtFormSubmit,
          loading: loading.setUnitMgmt,
        },
      ],
      flexState: 'right' as 'right',
    };
    return <ButtonGroup {...ButtonGroupProps} />;
  }

  renderOperatingResults() {
    const { operatingResultsVisible, batchHandleResultsData } = this.state;
    const props = {
      visible: operatingResultsVisible,
      onCancel: this.onCancelOperatingResults,
      data: batchHandleResultsData,
    };
    return <OperatingResults {...props} />;
  }

  // eslint-disable-next-line max-lines-per-function
  render() {
    const { unitData, onFormNext } = this.props;
    if (isEmpty(unitData)) {
      return null;
    }

    return (
      <div className={classNames('flexColStart', 'flexAuto')}>
        <div className={classNames('flexStart', 'flexWrap')}>
          <div className={classNames(styles.itemHeader, 'flexColCenter')}>
            <div className={styles.txt}>当前楼栋</div>
            <div className={styles.count}>{unitData.buildingName}</div>
          </div>
          <div className={classNames(styles.itemHeader, 'flexColCenter')}>
            <div className={styles.txt}>单元数量</div>
            <div className={styles.count}>{unitData.unitCount}</div>
          </div>
          <div className={classNames(styles.itemHeader, 'flexColCenter')}>
            <div className={styles.txt}>房屋总数</div>
            <div className={styles.count}>{unitData.houseCount}</div>
          </div>
          <div className={classNames(styles.itemHeader, 'flexColCenter')}>
            <div className={styles.txt}>登记人数</div>
            <div className={styles.count}>{unitData.houseHoldCount}</div>
          </div>
        </div>
        <div className={classNames(styles.unit, 'flexStart', 'flexWrap')}>
          {unitData.unitList &&
            unitData.unitList.map(item => {
              return (
                <div
                  key={item.id}
                  className={classNames(styles.itemNormal, styles.item, 'flexColBetween')}
                >
                  <div className={classNames('flexBetween', 'itemCenter')}>
                    <div className={classNames('flexStart', 'itemCenter')}>
                      <Img className={styles.icon} image={unit} />
                      <div className={styles.title}>{item.name}</div>
                    </div>
                    {!onFormNext && (
                      <Button type={'link'} onClick={() => this.updateUnitMgmt(item)}>
                        设置单元管理员
                      </Button>
                    )}
                  </div>
                  {!onFormNext && (
                    <div className={classNames('flexColBetween', 'itemCenter')}>
                      {item.liaisonName !== null && (
                        <Fragment>
                          <Img
                            className={styles.photo}
                            image={item.liaisonImage}
                            previewImg={true}
                          />
                          <div className={styles.mgmtName}>{item.liaisonName}</div>
                          <div className={classNames('flexCenter', 'itemCenter')}>
                            <Img className={styles.iconS} image={phone} />
                            <div className={styles.phone}>{item.liaisonPhone}</div>
                          </div>
                        </Fragment>
                      )}
                      {item.liaisonName === null && (
                        <Fragment>
                          <Img className={styles.photo} image={defaultuser} />
                          <div className={styles.mgmtName}>暂无</div>
                        </Fragment>
                      )}
                    </div>
                  )}
                  <div className={classNames('flexBetween', 'itemCenter', styles.itemRow)}>
                    <div className={classNames('flexStart', 'itemCenter')}>
                      <Img className={styles.iconS} image={aboveNum} />
                      <div className={styles.text}>地上层数</div>
                    </div>
                    <div className={styles.count}>{item.aboveNum}</div>
                  </div>
                  <div className={classNames('flexBetween', 'itemCenter', styles.itemRow)}>
                    <div className={classNames('flexStart', 'itemCenter')}>
                      <Img className={styles.iconS} image={underFloor} />
                      <div className={styles.text}>地下层数</div>
                    </div>
                    <div className={styles.count}>{item.underNum}</div>
                  </div>
                  <div className={classNames('flexBetween', 'itemCenter', styles.itemRow)}>
                    <div className={classNames('flexStart', 'itemCenter')}>
                      <Img className={styles.iconS} image={exitCount} />
                      <div className={styles.text}>出入口数</div>
                    </div>
                    <div className={styles.count}>{item.doorCount}</div>
                  </div>
                  <div className={classNames('flexBetween', 'itemCenter', styles.itemRow)}>
                    <div className={classNames('flexStart', 'itemCenter')}>
                      <Img className={styles.iconS} image={elevatorCount} />
                      <div className={styles.text}>电梯数</div>
                    </div>
                    <div className={styles.count}>{item.elevatorCount}</div>
                  </div>
                  <div className={classNames('flexEnd')}>
                    <Button
                      customtype={'icon'}
                      icon={'pm-edit'}
                      title={'修改'}
                      onClick={() => this.edit(item.id)}
                    />
                    <Button
                      customtype={'icon'}
                      icon={'pm-trash-can'}
                      title={'删除'}
                      onClick={e => this.props.delete(item.id, this.TYPE.UNIT, e)}
                    />
                  </div>
                </div>
              );
            })}
          <div
            className={classNames(styles.addItem, styles.item, 'flexColCenter', 'itemCenter')}
            onClick={this.openAddUnitModal}
          >
            <Icon type={'pm-add'} />
            <div className={styles.addText}>新增单元</div>
          </div>
        </div>
        {this.renderUnitModal()}
        {this.renderOperatingResults()}
      </div>
    );
  }

  async getPropertyList() {
    const data = await this.props.dispatch({ type: 'unitGlobal/getPropertyList', payload: {} });
    data.forEach(item => {
      item.value = `${item.value} | ${item.phone}`;
    });
    this.setState({
      propertyList: data,
    });
  }

  onChargePersonChange = value => {
    const findItem = this.state.propertyList.find(item => item.key === value);
    if (findItem) {
      this.setState({
        mgmtInfo: {
          id: findItem.id,
          phone: findItem.phone,
          personTypeStr: findItem.personTypeStr,
          image: findItem.image ? findItem.image : findItem.idCardImage,
          name: findItem.name,
        },
      });
    }
  };

  updateUnitMgmt = async item => {
    await this.getUnitById(item.id);
    const { unitDetail } = this.props;
    this.onChargePersonChange(unitDetail.liaisonId);
    this.setState({
      unitId: unitDetail.id,
      address: unitDetail.buildingCode + '栋' + unitDetail.code + '单元',
      modify: true,
      tabsActiveKey: '2',
    });
  };

  openAddUnitModal = () => {
    this.setState({
      add: true,
      mgmtInfo: {
        mame: '',
      },
    });
  };

  onFormNext = () => {
    this.setState({
      tabsActiveKey: (parseInt(this.state.tabsActiveKey) + 1).toString(),
    });
  };

  onCancelOperatingResults = () => {
    this.setState({ operatingResultsVisible: false });
  };

  cancelModel = () => {
    this.setState({
      add: false,
      modify: false,
      tabsActiveKey: '1',
    });
  };

  aboveChange = (value, option) => {
    this.unitForm.setFieldsValue({ aboveStartIndex: undefined });
    this.setState({
      aboveBeginList: Array(value)
        .fill(0)
        .map((v, index) => ({ key: index + 1, value: index + 1 })),
    });
  };

  unitTypeChange = e => {
    store.set('unitNameType', e.target.value);
    this.unitForm.resetFields(['code']);
    this.setState({
      unitTypeIsNumber: e.target.value,
    });
  };

  edit = async unitId => {
    await this.getUnitById(unitId);
    const { unitDetail } = this.props;
    console.log('unitDetail: ', unitDetail);
    this.setState({
      modify: true,
      unitId,
      address: unitDetail.buildingCode + '栋' + unitDetail.code + '单元',
    });
  };

  getUnitById = async id => {
    const data = await this.props.dispatch({
      type: 'unitGlobal/getUnitById',
      payload: { id },
    });
    return data;
  };

  getUnit(id) {
    this.props.dispatch({ type: 'unitGlobal/getUnitList', payload: { buildingId: id } });
  }

  onAddUnit = async fieldsValue => {
    const { dispatch, buildId, onFormNext, unitData } = this.props;

    const res = await dispatch({
      type: 'unitGlobal/addUnit',
      payload: { ...fieldsValue, buildId },
    });
    this.getUnit(buildId);
    if (res && res.addUnit) {
      this.setState({
        address: unitData.buildingName + fieldsValue.code + '单元',
        unitId: res.unitId,
      });
      this.props.getBuildUnitTree();
      this.getUnit(buildId);
      if (!onFormNext) {
        this.onFormNext();
      } else {
        this.cancelModel();
      }
    }
  };

  addMgmt = () => {
    this.setState({});
  };

  onUpdateUnit = async fieldsValue => {
    const { dispatch, buildId } = this.props;
    const { unitId } = this.state;
    const unitData = {
      id: unitId,
      aboveNum: fieldsValue.aboveNum,
      underNum: fieldsValue.underNum,
      doorCount: fieldsValue.doorCount,
      elevatorCount: fieldsValue.elevatorCount,
    };
    const res = await dispatch({
      type: 'unitGlobal/updateUnit',
      payload: unitData,
    });
    if (res && res.success) {
      this.getUnit(buildId);
      this.cancelModel();
    }
  };

  onsetMgmtFormSubmit = () => {
    const { dispatch, buildId } = this.props;
    this.setMgmtForm.validateFields(async (err, fieldValues) => {
      if (!err) {
        fieldValues.unitId = this.state.unitId;
        delete fieldValues.address;
        const res = await dispatch({ type: 'unitGlobal/setUnitMgmt', payload: fieldValues });
        if (res && res.success) {
          Message.success(SUCCESS_SETTING);
          this.cancelModel();
          this.getUnit(buildId);
        }
      }
    });
  };

  onUnitFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault();
    }
    this.unitForm.validateFields((err, fieldsValue) => {
      if (err) return;
      const { add } = this.state;
      if (add) {
        this.onAddUnit(fieldsValue);
      } else {
        this.onUpdateUnit(fieldsValue);
      }
    });
  };
}
export default UnitList;
