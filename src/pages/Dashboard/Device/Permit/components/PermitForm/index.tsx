import React, { PureComponent, FormEvent, RefObject, createRef } from 'react';
import { connect } from '@/utils/decorators';
import { GlobalState, DictionaryEnum } from '@/common/type';
import styles from './index.less';
import { PaginationConfig } from '@/components/Library/Table';
import AntdIcon from '@/components/Library/Icon';
import {
  Button,
  Row,
  ModalForm,
  Img,
  Confirm,
  OperatingResults,
  // Tooltip,
} from '@/components/Library';
import { WrappedFormUtils } from '@/components/Library/Form';
import passportImage from '@/assets/images/permit/passport.png';
import TreeSelect from '@/components/Library/TreeSelect';
import classNames from 'classnames';

const mapStateToProps = (state: GlobalState) => {
  return {
    state,
    loading: state.loading.effects['permit/addPermit'],
    timeMenu: state.app.dictionry[DictionaryEnum.PERMIT_TIME_MENU],
  };
};

interface State {
  pageOption: PaginationConfig;
  dataSource: any[];
  modify: boolean;
  positionList: any[];
  personPositionList: any[];
  carPositionList: any[];
  add: boolean;
  customDisabled: boolean;
  modifyData: any;
}

@connect(
  mapStateToProps,
  null,
)
export default class PermitForm extends PureComponent<any, State> {
  modelForm: WrappedFormUtils;

  queryCondition: any;

  selectedList: any[];

  confirmRef: RefObject<Confirm>;

  operateResultRef: RefObject<OperatingResults>;

  constructor(props) {
    super(props);
    this.operateResultRef = createRef();
    this.confirmRef = createRef();
    this.state = {
      modifyData: {},
      dataSource: [],
      positionList: [],
      personPositionList: [],
      carPositionList: [],
      pageOption: {
        current: 1,
        total: 0,
        pageSize: 10,
      },
      add: false,
      modify: false,
      customDisabled: true,
    };
  }

  async componentDidMount() {
    this.props.dispatch({ type: 'app/getDic', payload: { type: DictionaryEnum.PERMIT_TIME_MENU } });
    this.getPositionList();
  }

  async getPositionList() {
    const { type } = this.props;
    const data = await this.props.dispatch({
      type: 'permit/getPositionList',
      data: { type },
    });
    this.setState({
      positionList: [data],
    });
  }

  renderForm() {
    const { modify, add, customDisabled, modifyData } = this.state;
    const { SHOW_ALL } = TreeSelect;
    const { timeMenu, loading, treeData } = this.props;
    const props = {
      items: [
        {
          type: 'input',
          field: 'name',
          initialValue: modifyData ? modifyData.name : '',
          fill: true,
          maxLength: 50,
          placeholder: '通行证名称',
          rules: [{ required: true, message: '请输入通行证名称!' }],
        },
        {
          type: 'select',
          field: 'expirationDate',
          maxLength: 9,
          span: 10,
          initialValue:
            modifyData && modifyData.customize !== '1' ? modifyData.expirationDate : undefined,
          disabled: !customDisabled,
          children: timeMenu || [],
          placeholder: '默认有效期',
          rules: !customDisabled ? [] : [{ required: true, message: '请输入默认有效期!' }],
        },
        {
          type: 'checkBox',
          field: 'customize',
          label: '自定义',
          span: 6,
          initialValue: modifyData && modifyData.customize === '1',
          onChange: this.isCustomChange,
          placeholder: '自定义',
        },
        {
          type: 'number',
          field: 'customizeDay',
          span: 8,
          disabled: customDisabled,
          maxLength: 9,
          min: 1,
          initialValue:
            modifyData && modifyData.customize === '1' ? modifyData.customizeDay : undefined,
          placeholder: '自定义天数',
          rules: customDisabled ? [] : [{ required: true, message: '请输入自定义天数!' }],
        },
        {
          type: 'treeSelect',
          initialValue: modifyData ? modifyData.passPositionList : [],
          field: 'passPositionIds',
          fill: true,
          treeCheckable: true,
          showCheckedStrategy: SHOW_ALL,
          searchPlaceholder: '搜索权限',
          treeData: treeData instanceof Array ? treeData : [treeData],
          placeholder: '通行位置',
          colHeight: 'auto',
          rules: [{ required: true, message: '请选择通行位置!' }],
        },
      ],
      actions: [
        {
          customtype: 'select',
          loading: loading,
          title: '确定',
          htmlType: 'submit' as 'submit',
        },
        { customtype: 'second', title: '取消', onClick: this.onCancelModel },
      ],
      formItemLayout: {
        className: styles.formItem,
      },
      onSubmit: this.onSubmit,
      title: modify ? '修改通行证' : '新增通行证',
      onCancel: this.onCancelModel,
      destroyOnClose: true,
      width: '30%',
      bodyStyle: {},
      add: add,

      modify: modify,
      onGetFormRef: (modelForm: WrappedFormUtils) => {
        this.modelForm = modelForm;
      },
    };
    return <ModalForm {...props} />;
  }

  renderTableItem(item) {
    const { tableStyle } = this.props;
    return (
      <div
        className={classNames(styles.permitItem, tableStyle === 'vertical' ? styles.vertical : '')}
        key={item.id}
      >
        <div className={styles.top}>
          <Img type={'others'} image={passportImage} className={styles.icon} />
          <div className={styles.name} title={item.name}>
            {item.name}
          </div>
        </div>
        <div className={styles.bottom}>
          <div className={styles.row}>
            <AntdIcon type={'pm-position'} className={styles.icon} />
            {/* <Tooltip
              placement={'topRight'}
              title={item.passPositionList.map(v => v.passPositionName + '，')}
            >
            </Tooltip> */}
            <div className={styles.rowContent}>
              {(item.passPositionList || []).map(v => v.passPositionName + '，')}
            </div>
          </div>
          <div className={styles.row}>
            <AntdIcon type={'clock-circle'} theme={'filled'} className={styles.icon} />
            <div className={styles.rowContent}>
              {item.customize === '0' ? item.expirationDateStr : item.customizeDay + '天'}
            </div>
          </div>
          <Row className={styles.operate}>
            <Button
              customtype={'icon'}
              className={styles.operateBtn}
              icon={'pm-edit'}
              onClick={() => this.editPermit(item)}
              title={'修改'}
            />
            <Button
              customtype={'icon'}
              className={styles.operateBtn}
              icon={'pm-trash-can'}
              onClick={() => this.deletePermit(item)}
              title={'删除'}
            />
          </Row>
        </div>
      </div>
    );
  }

  renderTable() {
    const { initialzation, type, dataSource, tableStyle } = this.props;
    return (
      <div className={styles.listContainer}>
        {!initialzation && (
          <div
            className={classNames(
              styles.permitItemPlus,
              tableStyle === 'vertical' ? styles.vertical : '',
            )}
          >
            <div className={styles.plus} onClick={this.addPermit}>
              <AntdIcon type={'pm-add'} className={styles.icon} />
              <label>新增{type === 'person' ? '人员' : '车辆'}通行证</label>
            </div>
          </div>
        )}
        {dataSource &&
          dataSource.map(item => {
            return this.renderTableItem(item);
          })}
        {initialzation && (
          <div className={styles.permitItemPlus} style={{ float: 'left' }}>
            <div className={styles.plus} onClick={this.addPermit}>
              <AntdIcon type={'pm-add'} className={styles.icon} />
              <label>新增{type === 'person' ? '人员' : '车辆'}通行证</label>
            </div>
          </div>
        )}
      </div>
    );
  }

  render() {
    const { tableStyle } = this.props;
    return (
      <div
        className={classNames(
          styles.personPermit,
          tableStyle === 'vertical' ? styles.verticalList : '',
        )}
      >
        <Confirm ref={this.confirmRef} />
        <OperatingResults ref={this.operateResultRef} />
        {this.renderForm()}
        {this.renderTable()}
      </div>
    );
  }

  isCustomChange = event => {
    this.modelForm.resetFields(['expirationDate', 'customizeDay']);
    this.modelForm.setFieldsValue({
      expirationDate: undefined,
      customizeDay: undefined,
    });
    this.setState({
      customDisabled: event.target.value,
    });
  };

  addPermit = () => {
    this.setState({
      add: true,
      modifyData: {},
      customDisabled: true,
    });
  };

  editPermit(item) {
    const tempData = JSON.parse(JSON.stringify(item));
    tempData.passPositionList = (tempData.passPositionList || []).map(v => v.passPositionId);
    this.setState({
      add: false,
      customDisabled: tempData.customize !== '1',
      modify: true,
      modifyData: tempData,
    });
  }

  deletePermit(item) {
    if (this.confirmRef.current) {
      const { getList } = this.props;
      this.confirmRef.current.open(
        async () => {
          const data = await this.props.dispatch({ type: 'permit/deletePermit', data: [item.id] });
          if (data && !data.error && getList) {
            getList();
          } else if (this.operateResultRef.current) {
            this.operateResultRef.current.open(data);
          }
        },
        '删除通行证',
        <div className={styles.deleteMsg}>
          {this.renderTableItem(item)}
          <label className={styles.red}>删除通行证将回收已下发该通行证的人员该通行证权限</label>
        </div>,
      );
    }
  }

  onSubmit = (e: FormEvent<any>) => {
    e.preventDefault();
    const { modifyData, modify } = this.state;
    const { type, getList } = this.props;
    this.modelForm.validateFields(async (error, values) => {
      if (error) {
        return;
      }
      if (modify) {
        values.id = modifyData.id;
      }
      values.type = type === 'person' ? 1 : 2;
      values.customize = values.customize ? 1 : 0;
      if (modify) {
        await this.props.dispatch({ type: 'permit/updatePermit', data: values });
      } else {
        await this.props.dispatch({ type: 'permit/addPermit', data: values });
      }
      this.onCancelModel();
      if (getList) {
        getList();
      }
    });
  };

  onCancelModel = () => {
    this.setState({
      add: false,
      modify: false,
    });
  };

  onSelectChange = (value, option) => {
    this.selectedList = value;
  };
}
