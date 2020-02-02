import React, { PureComponent, RefObject, createRef } from 'react';
import styles from './index.less';
import { connect } from '@/utils/decorators';
import classNames from 'classnames';
import { WrappedFormUtils } from '@/components/Library/type';
import { isIdCard, isPhone } from '@/utils/validater';
import { GlobalState, UmiComponentProps, DictionaryEnum } from '@/common/type';
import {
  Button,
  Img,
  Icon,
  FormSimple,
  Radio,
  Modal,
  OperatingResults,
  Confirm,
  Steps,
  Tabs,
  Tooltip,
  Message,
} from '@/components/Library';
import { isEmpty } from 'lodash';
import houseNum from '@/assets/images/houseNum.png';
import emptyHouse from '@/assets/images/emptyHouse.png';
import sendHouse from '@/assets/images/sendHouse.png';
import BatchAddHouse from '../batchAddHouse/batchAddHouse';
import { SUCCESS_INPUT } from '@/utils/message';

const { TabPane } = Tabs;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

const mapStateToProps = ({ houseGlobal, app, loading: { effects } }: GlobalState) => {
  return {
    houseData: houseGlobal.houseData,
    houseDetail: houseGlobal.houseDetail,
    houseState: app.dictionry[DictionaryEnum.HOUSE_STATE],
    loading: {
      setHouseHold: effects['houseGlobal/setHouseHold'],
      addHouse: effects['houseGlobal/addHouse'],
    },
  };
};

type HouseListStateProps = ReturnType<typeof mapStateToProps>;
type HouseListProps = HouseListStateProps &
  UmiComponentProps & {
    getHouseList?: Function;
    onFormNext?: Function;
    buildId: number;
    delete?: Function;
    unitSelected: number;
  };

interface HouseListState {
  addBuild: boolean;
  addHouseVisible: boolean;
  houseId: number;
  batchHouseVisible: boolean;
  tabsActiveKey: string;
  modify: boolean;
  floor: number;
  hasHouseHoldInfo: boolean;
  batchHandleResultsData: any;
  operatingResultsVisible: boolean;
}
interface KeyValue<K, V> {
  key: K;
  value: V;
}
@connect(
  mapStateToProps,
  null,
)
class HouseList extends PureComponent<any, HouseListState> {
  addBuildForm: WrappedFormUtils;
  addHouseHoldForm: WrappedFormUtils;
  addHouseForm: WrappedFormUtils;
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

  constructor(props: Readonly<HouseListProps>) {
    super(props);
    this.state = {
      modify: false,
      addHouseVisible: false,
      houseId: 0,
      hasHouseHoldInfo: false,
      addBuild: false,
      floor: 0,
      batchHouseVisible: false,
      tabsActiveKey: '1',
      batchHandleResultsData: {},
      operatingResultsVisible: false,
    };
  }

  componentDidMount() {
    const { onFormNext } = this.props;
    if (!onFormNext) {
      this.props.dispatch({
        type: 'app/getDic',
        payload: { type: [DictionaryEnum.HOUSE_STATE].toString() },
      });
    }
  }

  renderAddHouseModal() {
    const { onFormNext } = this.props;
    const { modify } = this.state;
    const steps = ['新增房屋', '户主登记'];
    const modalProps = {
      onCancel: this.cancelModel,
      visible: this.state.addHouseVisible,
      title: steps[parseInt(this.state.tabsActiveKey) - 1],
      destroyOnClose: true,
      centered: true,
      footer: null,
      maskClosable: false,
      bodyStyle: {},
      width: '40%',
      wrapClassName: 'modal',
    };
    return (
      <Modal {...modalProps}>
        {!onFormNext && !modify && (
          <Steps current={parseInt(this.state.tabsActiveKey) - 1} size={'small'}>
            {steps.map(item => (
              <Steps.Step key={item} title={item} />
            ))}
          </Steps>
        )}
        <Tabs hiddenTabButton={true} activeKey={this.state.tabsActiveKey}>
          <TabPane tab={steps[0]} key={'1'}>
            <FormSimple {...this.getAddHouseFormProps()} />
          </TabPane>
          <TabPane tab={steps[1]} key={'2'}>
            <FormSimple {...this.getSetHouseHoldFormProps()} />
          </TabPane>
        </Tabs>
      </Modal>
    );
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

  renderButtonGroup() {
    const {
      houseState = [
        { key: 1, value: '自住' },
        { key: 2, value: '出租' },
        { key: 3, value: '空置' },
      ],
    } = this.props;
    return (
      <div className={classNames('flexBetween', 'itemCenter')}>
        <div className={classNames('flexStart')}>
          <Button customtype={'second'} onClick={this.batchaddHouse}>
            批量新增
          </Button>
        </div>
        <div className={classNames('flexEnd', 'flexAuto')}>
          <div className={classNames(styles.tips, 'flexBetween', 'itemCenter')}>
            <div className={classNames('itemCenter', 'flexStart')}>
              <Img className={styles.iconTip} image={houseNum} />
              自住
            </div>
            <div className={classNames('itemCenter', 'flexStart')}>
              <Img className={styles.iconTip} image={sendHouse} />
              出租
            </div>
            <div className={classNames('itemCenter', 'flexStart')}>
              <Img className={styles.iconTip} image={emptyHouse} />
              空置
            </div>
          </div>
          <RadioGroup defaultValue={'0'} buttonStyle={'solid'} onChange={this.houseTypeSearch}>
            <RadioButton value={'0'}>全部</RadioButton>
            {houseState &&
              houseState.map(item => (
                <RadioButton key={item.key} value={item.key}>
                  {item.value}
                </RadioButton>
              ))}
          </RadioGroup>
        </div>
      </div>
    );
  }

  renderItemHeader() {
    const { houseData } = this.props;
    if (isEmpty(houseData)) {
      return null;
    }
    return (
      <div className={classNames(styles.floorRow, 'flexBetween')}>
        <div className={classNames(styles.floorHeader, 'flexCenter', 'itemCenter')}>层数</div>
        <div className={classNames('flexStart', 'flexWrap', 'flexAuto')}>
          <div className={classNames(styles.itemHeader, 'flexColCenter')}>
            <div className={styles.txt}>当前单元</div>
            <div className={styles.count}>{houseData.unitName}</div>
          </div>
          {/* <div className={classNames(styles.itemHeader, 'flexColCenter')}>
            <div className={styles.txt}>楼层数量</div>
            <div className={styles.count}>{houseData.floorCount}</div>
          </div> */}
          <div className={classNames(styles.itemHeader, 'flexColCenter')}>
            <div className={styles.txt}>房屋数量</div>
            <div className={styles.count}>{houseData.houseCount}</div>
          </div>
          <div className={classNames(styles.itemHeader, 'flexColCenter')}>
            <div className={styles.txt}>登记人数</div>
            <div className={styles.count}>{houseData.houseHoldCount}</div>
          </div>
          <div className={classNames(styles.itemHeader, 'flexColCenter')}>
            <div className={styles.txt}>管理员</div>
            <div className={styles.count}>{houseData.chargePersonName}</div>
          </div>
          <div className={classNames(styles.itemHeader, 'flexColCenter')}>
            <div className={styles.txt}>联系电话</div>
            <div className={styles.count}>{houseData.chargePersonPhone}</div>
          </div>
        </div>
      </div>
    );
  }

  renderList() {
    const { houseData, onFormNext } = this.props;
    if (isEmpty(houseData)) {
      return null;
    }
    return (
      <>
        {houseData.houseList &&
          houseData.houseList.map(item => (
            <div key={item.floor} className={classNames(styles.floorRow, 'flexBetween')}>
              <div className={classNames(styles.floor, 'flexCenter', 'itemCenter')}>
                {item.floor}
              </div>
              <div className={classNames('flexStart', 'flexWrap', 'flexAuto')}>
                {item.houses &&
                  item.houses.map(house => (
                    <div
                      key={house.id}
                      className={classNames(styles.itemNormal, styles.item, 'flexColBetween')}
                    >
                      <div className={classNames('flexBetween', 'itemCenter')}>
                        <div className={classNames('flexStart', 'itemCenter')}>
                          <Tooltip
                            placement={'top'}
                            title={
                              house.useType === '1'
                                ? '自住'
                                : house.useType === '2'
                                ? '出租'
                                : '空置'
                            }
                          >
                            <Img
                              className={styles.icon}
                              image={
                                house.useType === '1'
                                  ? houseNum
                                  : house.useType === '2'
                                  ? sendHouse
                                  : emptyHouse
                              }
                            />
                          </Tooltip>
                          <div className={styles.title}>{house.name}</div>
                        </div>
                        <div>{house.useTypeStr}</div>
                      </div>
                      {!onFormNext && (
                        <div className={styles.houseOwner}>
                          {/* {CommonComponent.renderTableOverFlowHidden(house.personName)} */}
                          {house.personName}
                        </div>
                      )}
                      <div className={classNames('flexBetween', 'itemCenter')}>
                        {!onFormNext && (
                          <div className={styles.houseHoldCount}>
                            {/* {CommonComponent.renderTableOverFlowHidden(house.personName)} */}
                            居住人数：{house.householdCount}
                          </div>
                        )}
                        <div>
                          {!onFormNext && (
                            <Button
                              customtype={'icon'}
                              icon={'pm-edit'}
                              title={house.personName === '户主未登记' ? '户主登记' : '户主变更'}
                              onClick={() => this.edit(house.id)}
                            />
                          )}
                          <Button
                            customtype={'icon'}
                            icon={'pm-trash-can'}
                            title={'删除'}
                            onClick={e => this.props.delete(house.id, this.TYPE.HOUSE, e)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                <div
                  className={classNames(styles.addItem, styles.item, 'flexColCenter', 'itemCenter')}
                  onClick={() => {
                    this.setState({ addHouseVisible: true, floor: item.floor });
                  }}
                >
                  <Icon type={'pm-add'} />
                  <div className={styles.addText}>新增房屋</div>
                </div>
              </div>
            </div>
          ))}
      </>
    );
  }

  render() {
    const { unitSelected, buildId, dispatch, getHouseList } = this.props;
    return (
      <div className={classNames('flexColStart', 'flexAuto')}>
        <div className={classNames(styles.house, 'flexColStart')}>
          {!this.props.onFormNext && this.renderButtonGroup()}
          {this.renderItemHeader()}
          {this.renderList()}
        </div>
        {!this.props.onFormNext && (
          <BatchAddHouse
            unitId={unitSelected}
            buildId={buildId}
            dispatch={dispatch}
            visible={this.state.batchHouseVisible}
            onCancel={this.closeBatchHouse}
            success={() => {
              getHouseList({ unitId: unitSelected });
            }}
          />
        )}
        {this.renderAddHouseModal()}
        {this.renderOperatingResults()}
      </div>
    );
  }

  batchaddHouse = () => {
    this.setState({
      batchHouseVisible: true,
    });
  };

  closeBatchHouse = () => {
    this.setState({
      batchHouseVisible: false,
    });
  };

  getSetHouseHoldFormProps = () => {
    let { houseDetail = {}, loading } = this.props;
    const { modify, hasHouseHoldInfo } = this.state;
    if (!modify) {
      houseDetail = {};
    }
    return {
      items: [
        {
          type: 'input',
          field: 'personName',
          maxLength: 10,
          span: 12,
          initialValue: houseDetail.personName,
          placeholder: '人员姓名',
          onChange: this.onHouseHoldChange,
          rules: [hasHouseHoldInfo ? { required: true, message: '人员姓名不能为空！' } : {}],
        },
        {
          type: 'input',
          field: 'personPhone',
          initialValue: houseDetail.personPhone,
          maxLength: 11,
          span: 12,
          placeholder: '联系电话',
          rules: [
            { validator: isPhone },
            hasHouseHoldInfo ? { required: true, message: '联系电话不能为空！' } : {},
          ],
          onChange: this.onHouseHoldChange,
        },
        {
          type: 'input',
          field: 'personIdCard',
          initialValue: houseDetail.personIdCard,
          maxLength: 18,
          rules: [
            { validator: isIdCard },
            hasHouseHoldInfo ? { required: true, message: '身份证号不能为空！' } : {},
          ],
          span: 12,
          placeholder: '身份证号',
          onChange: this.onHouseHoldChange,
        },
      ],
      actions: [
        { customtype: 'second', title: '取消', onClick: this.cancelModel },
        {
          customtype: 'select',
          title: '完成',
          loading: loading.setHouseHold,
          htmlType: 'submit' as 'submit',
        },
      ],
      onSubmit: this.onHouseHoldFormSubmit,
      onGetFormRef: (modelForm: WrappedFormUtils) => {
        this.addHouseHoldForm = modelForm;
      },
    };
  };

  getAddHouseFormProps = () => {
    const { houseData, onFormNext, loading } = this.props;
    let floor: number | undefined = this.state.floor;
    if (this.state.modify) {
      floor = undefined;
    }
    return {
      items: [
        {
          type: 'input',
          field: 'buildUnit',
          span: 12,
          disabled: true,
          initialValue: houseData.unitName,
          placeholder: '楼栋单元',
        },
        {
          type: 'input',
          field: 'floor',
          initialValue: floor,
          disabled: true,
          span: 12,
          placeholder: '所在楼层',
        },
        {
          type: 'select',
          field: 'code',
          span: 24,
          children: this.houseBeginCode,
          placeholder: '房屋编号',
          rules: [{ required: true, message: '楼栋编号不能为空！' }],
        },
      ],
      actions: [
        { customtype: 'second', title: '取消', onClick: this.cancelModel },
        {
          customtype: 'select',
          title: onFormNext ? '完成' : '下一步',
          htmlType: 'submit' as 'submit',
          loading: loading.addHouse,
        },
      ],
      onSubmit: this.onHouseFormSubmit,
      onGetFormRef: (modelForm: WrappedFormUtils) => {
        this.addHouseForm = modelForm;
      },
    };
  };

  onHouseHoldChange = e => {
    const id = e.target.id;
    let hasHouseHoldInfo = false;
    const value = e.target.value;
    const values = this.addHouseHoldForm.getFieldsValue();
    for (const item in values) {
      if (item !== id) {
        if (values[item] !== null && values[item] !== undefined && values[item] !== '') {
          hasHouseHoldInfo = true;
        }
      }
    }
    if (value) {
      hasHouseHoldInfo = true;
    }
    this.setState({ hasHouseHoldInfo: hasHouseHoldInfo }, () => {
      if (!hasHouseHoldInfo) {
        // this.addHouseHoldForm.resetFields();
        this.addHouseHoldForm.setFieldsValue({
          personName: undefined,
          personPhone: undefined,
          personIdCard: undefined,
        });
      }
    });
  };

  getHouseById = async id => {
    this.setState({
      houseId: id,
    });
    const data = await this.props.dispatch({
      type: 'houseGlobal/getHouseById',
      payload: { id },
    });
    return data;
  };

  edit = async id => {
    this.getHouseById(id);
    this.setState({
      modify: true,
      addHouseVisible: true,
      tabsActiveKey: '2',
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
      addHouseVisible: false,
      modify: false,
      tabsActiveKey: '1',
    });
  };

  houseTypeSearch = e => {
    if (e.target.value === '0') delete e.target.value;
    this.props.getHouseList({ unitId: this.props.unitSelected, useType: e.target.value });
  };

  onHouseHoldFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault();
    }
    this.addHouseHoldForm.validateFields(async (err, fieldsValue) => {
      if (err) return;
      const { dispatch } = this.props;
      fieldsValue.houseId = this.state.houseId;
      const res = await dispatch({
        type: 'houseGlobal/setHouseHold',
        payload: fieldsValue,
      });
      if (res && res.success) {
        Message.success(SUCCESS_INPUT);
        this.props.getHouseList({ unitId: this.props.unitSelected });
        this.cancelModel();
      }
    });
  };

  onHouseFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault();
    }
    this.addHouseForm.validateFields(async (err, fieldsValue) => {
      if (err) return;
      const { dispatch, onFormNext } = this.props;
      const houseData = {
        unitId: this.props.unitSelected,
        buildingId: this.props.buildId,
        floor: fieldsValue.floor,
        code: fieldsValue.code,
      };
      const data = await dispatch({
        type: 'houseGlobal/addHouse',
        payload: houseData,
      });
      if (data && data.error) {
        this.setState({
          operatingResultsVisible: true,
          batchHandleResultsData: data,
        });
      } else if (data && !data.error) {
        this.setState({
          houseId: data.id,
        });
        this.props.getHouseList({ unitId: this.props.unitSelected });
        if (onFormNext) {
          this.cancelModel();
        } else {
          this.onFormNext();
        }
      }
    });
  };
}
export default HouseList;
