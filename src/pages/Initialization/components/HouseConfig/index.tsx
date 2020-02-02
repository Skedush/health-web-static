import React, { PureComponent, RefObject, createRef } from 'react';
import styles from './index.less';
import { connect } from '@/utils/decorators';
import store from 'store';
import classNames from 'classnames';
import { WrappedFormUtils } from '@/components/Library/type';
import { GlobalState, UmiComponentProps } from '@/common/type';
import {
  Button,
  Collapse,
  Icon,
  FormSimple,
  Modal,
  OperatingResults,
  Confirm,
  Spin,
  Message,
} from '@/components/Library';
import UnitList from './components/UnitList';
import HouseList from './components/HouseList';
const { Panel } = Collapse;
const mapStateToProps = ({
  unitGlobal,
  buildGlobal,
  houseGlobal,
  loading: { effects },
}: GlobalState) => {
  return {
    unitData: unitGlobal.unitData,
    buildingUnitTree: buildGlobal.buildingUnitTree,
    unitDetail: unitGlobal.unitDetail,
    houseData: houseGlobal.houseData,
    loading: {
      getBuildingAndUnitTree: effects['buildGlobal/getBuildingAndUnitTree'],
      getUnitList: effects['unitGlobal/getUnitList'],
      getHouseList: effects['houseGlobal/getHouseList'],
      buildingAdd: effects['buildGlobal/buildingAdd'],
    },
  };
};

type HouseConfigStateProps = ReturnType<typeof mapStateToProps>;
type HouseConfigProps = HouseConfigStateProps &
  UmiComponentProps & {
    onFormNext?: Function;
    onStepNext?: Function;
  };

interface HouseConfigState {
  unitSelected?: number;
  modify: boolean;
  add: boolean;
  addBuild: boolean;
  addHouseVisible: boolean;
  buildId: number;
  unitId: number;
  buildTypeIsNumber: number;
  aboveBeginList?: KeyValue<number, number>[];
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
class HouseConfig extends PureComponent<any, HouseConfigState> {
  addBuildForm: WrappedFormUtils;
  form: WrappedFormUtils;
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

  constructor(props: Readonly<HouseConfigProps>) {
    super(props);
    this.state = {
      unitSelected: undefined,
      modify: false,
      add: false,
      addHouseVisible: false,
      buildId: 0,
      unitId: 0,
      addBuild: false,
      buildTypeIsNumber: store.get('buildNameType') || 1,
      batchHandleResultsData: {},
      operatingResultsVisible: false,
    };
  }

  componentDidMount() {
    this.featch();
  }

  renderButton() {
    const ButtonProps = { customtype: 'main', onClick: this.submit };
    return (
      <div className={classNames(styles.bottomButton, 'flexCenter', 'itemCenter')}>
        <Button {...ButtonProps}>下一步</Button>
      </div>
    );
  }

  renderAddBuildModal() {
    const modalProps = {
      onCancel: this.cancelModel,
      visible: this.state.addBuild,
      title: '新增楼栋',
      destroyOnClose: true,
      centered: true,
      footer: null,
      maskClosable: false,
      bodyStyle: {},
      width: '30%',
      wrapClassName: 'modal',
    };
    const formProps = {
      items: [
        {
          type: 'radio',
          field: 'type',
          span: 24,
          initialValue: this.state.buildTypeIsNumber || '1',
          children: [
            { key: 1, value: '数字正序（如：1栋）' },
            { key: 2, value: '英文正序（如：A栋）' },
          ],
          placeholder: '编号类型',
          onChange: this.buildTypeChange,
          rules: [{ required: true, message: '编号类型不能为空！' }],
        },
        {
          type: 'select',
          field: 'code',
          span: 24,
          children: this.state.buildTypeIsNumber === 1 ? this.numberList : this.letterList,
          placeholder: '楼栋编号',
          rules: [{ required: true, message: '楼栋编号不能为空！' }],
        },
      ],
      actions: [
        { customtype: 'second', title: '取消', onClick: this.cancelModel },
        {
          customtype: 'select',
          title: '完成',
          htmlType: 'submit' as 'submit',
        },
      ],
      onSubmit: this.onBuildFormSubmit,
      onGetFormRef: (modelForm: WrappedFormUtils) => {
        this.addBuildForm = modelForm;
      },
    };
    return (
      <Modal {...modalProps}>
        <FormSimple {...formProps} />
      </Modal>
    );
  }

  renderHeader(id, text) {
    return (
      <div className={classNames('flexBetween', 'itemCenter')}>
        <div>{text}</div>
        <Button
          customtype={'icon'}
          icon={'pm-trash-can'}
          title={'删除'}
          onClick={e => this.delete(id, this.TYPE.BUILD, e)}
        />
      </div>
    );
  }

  renderCollapse() {
    const { unitSelected } = this.state;
    const { buildingUnitTree, loading } = this.props;
    return (
      <Spin spinning={loading.getBuildingAndUnitTree}>
        <Collapse defaultActiveKey={[1]} onChange={this.callback} accordion>
          {buildingUnitTree &&
            buildingUnitTree.map(item => (
              <Panel header={this.renderHeader(item.id, item.name)} key={item.id}>
                {item.children &&
                  item.children.map(unitItem => (
                    <div
                      key={unitItem.id}
                      className={classNames(
                        unitSelected === unitItem.id ? styles.unitActive : styles.unitItem,
                      )}
                      onClick={() => this.onClickUnit(unitItem.id)}
                    >
                      {unitItem.code + '单元'}
                    </div>
                  ))}
              </Panel>
            ))}
          <div
            className={classNames(styles.addBuildBtn, 'flexCenter', 'itemCenter')}
            onClick={() => {
              this.setState({ addBuild: true });
            }}
          >
            <Icon type={'pm-add'} />
            <div>新增楼栋</div>
          </div>
        </Collapse>
      </Spin>
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

  render() {
    const { loading } = this.props;
    return (
      <div className={classNames('flexColStart', styles.content)}>
        <Confirm type={'warning'} ref={this.confirmRef} />
        <div className={classNames('flexStart', styles.main)}>
          <div className={classNames('flexColStart', styles.left)}>{this.renderCollapse()}</div>
          <div className={classNames('flexColStart', styles.right)}>
            {this.state.unitSelected ? (
              <Spin spinning={loading.getHouseList}>
                <HouseList
                  getHouseList={this.getHouseList}
                  delete={this.delete}
                  buildId={this.state.buildId}
                  unitSelected={this.state.unitSelected}
                  onFormNext={this.props.onFormNext}
                />
              </Spin>
            ) : (
              <Spin spinning={loading.getUnitList}>
                <UnitList
                  getBuildUnitTree={this.getBuildUnitTree}
                  delete={this.delete}
                  onFormNext={this.props.onFormNext}
                  buildId={this.state.buildId}
                />
              </Spin>
            )}
            {/* {!this.state.unitSelected && <div className={classNames('flexColStart', 'flexAuto')} />} */}
            {this.props.onFormNext && this.renderButton()}
          </div>
        </div>
        {this.renderAddBuildModal()}
        {this.renderOperatingResults()}
      </div>
    );
  }

  onCancelOperatingResults = () => {
    this.setState({ operatingResultsVisible: false });
  };

  cancelModel = () => {
    this.setState({
      addBuild: false,
    });
  };

  buildTypeChange = e => {
    store.set('buildNameType', e.target.value);
    this.addBuildForm.setFieldsValue({ code: undefined });
    this.setState({
      buildTypeIsNumber: e.target.value,
    });
  };

  featch = async () => {
    const data = await this.props.dispatch({ type: 'buildGlobal/getBuildingAndUnitTree' });
    if (Array.isArray(data) && data.length > 0) {
      this.setState({
        buildId: data[0].id,
      });
      this.getUnit(data[0].id);
    }
  };

  getBuildUnitTree = () => {
    this.props.dispatch({ type: 'buildGlobal/getBuildingAndUnitTree' });
  };

  delete = (id, type, e) => {
    e.stopPropagation();
    const payload = [id];
    let url = '';
    let txt = '';
    if (type === this.TYPE.BUILD) {
      url = 'buildGlobal/buildingDelete';
      txt = '楼栋';
    } else if (type === this.TYPE.UNIT) {
      url = 'unitGlobal/deleteUnit';
      txt = '单元';
    } else {
      url = 'houseGlobal/deleteHouse';
      txt = '房屋';
    }
    if (this.confirmRef.current) {
      this.confirmRef.current.open(
        async () => {
          const data = await this.props.dispatch({
            type: url,
            payload,
          });
          if (data && data.error) {
            this.setState({
              operatingResultsVisible: true,
              batchHandleResultsData: data,
            });
          } else {
            if (type === this.TYPE.HOUSE) {
              this.getHouseList({ unitId: this.state.unitSelected });
            } else if (type === this.TYPE.UNIT) {
              this.getBuildUnitTree();
              this.getUnit(this.state.buildId);
            } else {
              if (id.toString() === this.state.buildId.toString()) {
                this.featch();
              } else {
                this.getBuildUnitTree();
              }
            }
          }
        },
        '删除',
        `确定要删除该${txt}吗？`,
      );
    }
  };

  getUnit(id) {
    this.props.dispatch({ type: 'unitGlobal/getUnitList', payload: { buildingId: id } });
  }

  callback = key => {
    if (key) {
      this.getUnit(key);
      this.setState({
        buildId: key,
      });
    }
    this.setState({
      unitSelected: undefined,
    });
  };

  onClickUnit = unitId => {
    this.getHouseList({ unitId });
    this.setState({
      unitSelected: unitId,
    });
  };

  getHouseList = payload => {
    this.props.dispatch({ type: 'houseGlobal/getHouseList', payload });
  };

  onBuildFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault();
    }
    this.addBuildForm.validateFields(async (err, fieldsValue) => {
      if (err) return;
      const { dispatch } = this.props;
      const data = await dispatch({
        type: 'buildGlobal/buildingAdd',
        payload: [{ code: fieldsValue.code }],
      });
      if (data && data.error > 1) {
        this.setState({
          operatingResultsVisible: true,
          batchHandleResultsData: data,
        });
      } else if (data && data.error === 1) {
        Message.error(data.message[0]);
      } else {
        this.getBuildUnitTree();
        this.cancelModel();
      }
    });
  };

  submit = () => {
    const { onFormNext, onStepNext } = this.props;
    onStepNext();
    onFormNext();
  };
}
export default HouseConfig;
