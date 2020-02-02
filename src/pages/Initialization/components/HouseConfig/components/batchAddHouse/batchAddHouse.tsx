import React, { PureComponent, RefObject, createRef, ReactNode } from 'react';
import {
  Modal,
  FormSimple,
  Tabs,
  SimplyTable,
  Steps,
  Button,
  Message,
  OperatingResults,
  Alert,
} from '@/components/Library';
import { SUCCESS_ADD } from '@/utils/message';
import { WrappedFormUtils, ISimplyColumn } from '@/components/Library/type';
import styles from './batchAddHouse.less';

interface Props {
  visible: boolean;
  dispatch: Function;
  onCancel: Function;
  success: Function;
  unitId: string;
  buildId: string;
}

interface State {
  buildingList: any[];
  unitList: any[];
  floorNum?: number;
  houseCountList: any[];
  layerNumList: any[];
  startIDList: any[];
  houseTableData: any[];
  currentStep: number;
  warningMsg: string | ReactNode;
}
export default class BatchAddHouse extends PureComponent<Props, State> {
  static getDerivedStateFromProps(preProps) {
    if (!preProps.visible) {
      return {
        currentStep: 0,
      };
    }
    return null;
  }

  addHouseForm: WrappedFormUtils;

  stepList = ['0', '1'];

  houseColumns: ISimplyColumn[] = [
    { name: '层数', span: 4, key: 'floor' },
    {
      name: '门牌号',
      span: 20,
      className: styles.simpleTableRow,
      render(item) {
        return item.houses.map((v, i) => (
          <div className={styles.fieldCol} key={i}>
            {item.floor}
            {v}
          </div>
        ));
      },
    },
  ];

  addBatchHousesList: any[] = [];

  operateResultRef: RefObject<OperatingResults>;

  constructor(props) {
    super(props);
    this.operateResultRef = createRef();
    this.state = {
      buildingList: [],
      unitList: [],
      houseTableData: [],
      houseCountList: Array(10)
        .fill(1)
        .map((v, i) => ({ key: v + i, value: v + i })),
      layerNumList: [],
      startIDList: Array(20)
        .fill(0)
        .map((v, index) => {
          let temp: string | number = index + 1;
          if (temp < 10) {
            temp = '0' + temp;
          } else {
            temp = temp.toString();
          }
          return { key: temp, value: temp };
        }),
      currentStep: 0,
      warningMsg: '',
    };
  }

  componentDidMount() {
    this.getBuildingList();
    this.getUnitList(this.props.buildId);
    this.unitChange(this.props.unitId);
  }

  renderForm = () => {
    const {
      buildingList = [],
      unitList = [],
      houseCountList,
      floorNum,
      layerNumList = [],
      startIDList = [],
    } = this.state;

    const props = {
      items: [
        {
          type: 'select',
          field: 'buildingId',
          valuePropName: 'selected',
          disabled: true,
          children: buildingList,
          initialValue: parseInt(this.props.buildId),
          onSelect: this.buildingChange,
          placeholder: '楼栋编号',
          height: '83px',
          span: 12,
          rules: [{ required: true, message: '楼栋编号不能为空' }],
        },
        {
          type: 'select',
          field: 'unitId',
          placeholder: '单元编号',
          children: unitList,
          initialValue: parseInt(this.props.unitId),
          disabled: true,
          onSelect: this.unitChange,
          span: 12,
          height: '83px',
          rules: [{ required: true, message: '单元编号不能为空' }],
        },
        {
          type: 'input',
          field: 'floor',
          placeholder: '单元楼层',
          initialValue: floorNum,
          disabled: true,
          span: 12,
          height: '83px',
          // rules: [{ required: true, message: '单元楼层不能为空' }],
        },
        {
          type: 'select',
          field: 'houseCount',
          placeholder: '每层户数',
          children: houseCountList,
          span: 12,
          height: '83px',
          rules: [{ required: true, message: '请选择每层户数' }],
        },
        {
          type: 'select',
          field: 'aboveStartIndex',
          placeholder: '地上开始层数',
          children: layerNumList,
          span: 12,
          height: '83px',
          rules: [{ required: true, message: '请选择地上开始层数' }],
        },
        {
          type: 'select',
          field: 'houseStartCode',
          placeholder: '房屋开始编号',
          children: startIDList,
          span: 12,
          height: '83px',
          rules: [{ required: true, message: '请选择地上房屋开始编号' }],
        },
      ],
      actions: [{ customtype: 'select', title: '下一步', onClick: this.generateHouses }],
      onGetFormRef: (modelForm: WrappedFormUtils) => {
        this.addHouseForm = modelForm;
      },
    };
    return <FormSimple {...props} />;
  };

  renderHouseList() {
    const { houseTableData, warningMsg } = this.state;
    return (
      <div>
        <Alert message={warningMsg} type={'warning'} showIcon className={styles.warning} />
        <SimplyTable columns={this.houseColumns} dataSource={houseTableData} scrollH={500} />
        <div className={styles.tableBtns}>
          <Button customtype={'second'} onClick={this.preStep}>
            上一步
          </Button>
          <Button customtype={'master'} onClick={this.addHouseFormSubmit}>
            提交
          </Button>
        </div>
      </div>
    );
  }

  render() {
    const { visible } = this.props;
    const { currentStep } = this.state;
    return (
      <div>
        <OperatingResults ref={this.operateResultRef} />
        <Modal
          width={'45%'}
          destroyOnClose
          title={'批量新增房屋'}
          visible={visible}
          onCancel={this.onCancel}
          footer={null}
        >
          <Steps current={currentStep} size={'small'}>
            <Steps.Step title={'生成房屋'} />
            <Steps.Step title={'确认房屋列表'} />
          </Steps>
          <Tabs hiddenTabButton activeKey={this.stepList[currentStep]}>
            <Tabs.TabPane key={'0'} tab={'0'}>
              {this.renderForm()}
            </Tabs.TabPane>
            <Tabs.TabPane key={'1'} tab={'1'}>
              {this.renderHouseList()}
            </Tabs.TabPane>
          </Tabs>
        </Modal>
      </div>
    );
  }

  getBuildingList = async () => {
    const { dispatch } = this.props;
    const data = await dispatch({ type: 'buildGlobal/getBuildingList' });
    this.setState({
      buildingList: data,
    });
  };

  getUnitList = async (buildingId: string) => {
    const data = await this.props.dispatch({
      type: 'unitGlobal/getUnitList',
      payload: { buildingId },
    });

    this.setState({
      unitList: data.unitList,
    });
  };

  buildingChange = value => {
    this.getUnitList(value);
    this.addHouseForm.resetFields(['houseCount', 'aboveStartIndex', 'houseStartCode', 'unitId']);
  };

  unitChange = async id => {
    const data = await this.props.dispatch({
      type: 'unitGlobal/getUnitById',
      payload: { id },
    });
    this.setState({
      floorNum: data.aboveNum,
      layerNumList: Array(data.aboveNum)
        .fill(1)
        .map((v, i) => ({ key: v + i, value: v + i })),
    });
    // this.addHouseForm.resetFields(['houseCount', 'aboveStartIndex', 'houseStartCode']);
  };

  onCancel = () => {
    this.props.onCancel();
  };

  preStep = () => {
    this.setState({
      currentStep: 0,
    });
  };

  generateHouses = () => {
    this.addHouseForm.validateFields(async (error, values) => {
      if (error) {
        return;
      }

      const data = await this.props.dispatch({
        type: 'houseGlobal/generateAddHouse',
        payload: values,
      });
      const list: any[] = [];
      data.forEach(item => {
        const foundItem = list.find(v => v && v.floor === item.floor);
        if (foundItem) {
          foundItem.houses.push(item.name);
        } else {
          list.push({
            floor: item.floor,
            houses: [item.name],
          });
        }
        delete item.name;
        delete item.id;
      });
      this.addBatchHousesList = data;
      const foundUnit = this.state.unitList.find(item => item.id === values.unitId);
      this.setState({
        houseTableData: list,
        currentStep: 1,
        warningMsg: (
          <div>
            <b>{foundUnit.name}</b>，新增<b>{data.length}</b>户房屋，是否继续？
          </div>
        ),
      });
    });
  };

  addHouseFormSubmit = async () => {
    const res = await this.props.dispatch({
      type: 'houseGlobal/batchAddHouse',
      payload: this.addBatchHousesList,
    });
    if (res && res.data && !res.data.error) {
      Message.success(SUCCESS_ADD);
    } else if (this.operateResultRef.current) {
      this.operateResultRef.current.open(res.data);
    }
    this.props.success();
    this.onCancel();
  };
}
