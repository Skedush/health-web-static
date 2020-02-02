import React, { Component } from 'react';
import styles from './index.less';
import connect from '@/utils/decorators/connect';
import { GlobalState, UmiComponentProps, DictionaryEnum } from '@/common/type';
import { Button, Form, Icon, Modal, FormSimple } from '@/components/Library';
import router from 'umi/router';
import { FormComponentProps, WrappedFormUtils } from '@/components/Library/Form';
import { VillageBaseInfo } from '../model';
import { isPhone } from '@/utils/validater';
import moment from 'moment';
import { UploadFile } from 'antd/lib/upload/interface';
import AntdIcon from '@/components/Library/Icon';
import EntryAndExitConfig from '@/pages/Initialization/components/EntryAndExitConfig';
// import Cascader from '@/components/Library/Cascader';

const mapStateToProps = ({ loading, app, village: { baseInfo } }: GlobalState) => ({
  loading,
  baseInfo,
  constructionList: app.dictionry[DictionaryEnum.BUILD_UNIT] || [],
  operateList: app.dictionry[DictionaryEnum.OPERATE_TYPE] || [],
});

type StateProps = ReturnType<typeof mapStateToProps>;

interface VillageEditProps extends StateProps, UmiComponentProps, FormComponentProps {}

interface VillageEditState {
  communityFiles: UploadFile[];
  poilceFiles: any[];
  baseInfo: VillageBaseInfo;
  treeData: any[];
  loading: boolean;
  modalVisible: boolean;
}
@connect(
  mapStateToProps,
  null,
)
class VillageEdit extends Component<VillageEditProps, VillageEditState> {
  selectedArea: any[] = [];
  form: WrappedFormUtils;
  constructor(props: VillageEditProps) {
    super(props);
    this.state = {
      communityFiles: [],
      poilceFiles: [],
      treeData: [],
      loading: false,
      modalVisible: false,
      baseInfo: {
        village: {},
        villagePoliceResp: {},
      } as VillageBaseInfo,
    };
  }

  async componentDidMount() {
    await Promise.all([
      this.props.dispatch({ type: 'app/getDic', payload: { type: DictionaryEnum.OPERATE_TYPE } }),
      this.props.dispatch({
        type: 'app/getDic',
        payload: { type: DictionaryEnum.BUILD_UNIT },
      }),
    ]);
    const baseInfo = await this.resetForm();
    await this.getAreaTree(baseInfo);
  }

  async getAreaTree(baseInfo) {
    const { dispatch } = this.props;
    const treeData = await dispatch({ type: 'villageEdit/getAreaByParent' });
    if (!baseInfo) {
      return;
    }
    const areaData = baseInfo.village;
    baseInfo.village.provinceId = `${baseInfo.village.provinceId}`;
    baseInfo.village.cityId = `${baseInfo.village.cityId}`;
    baseInfo.village.countyId = `${baseInfo.village.countyId}`;
    baseInfo.village.streetId = `${baseInfo.village.streetId}`;
    this.selectedArea = [
      baseInfo.village.provinceId,
      baseInfo.village.cityId,
      baseInfo.village.countyId,
      baseInfo.village.streetId,
    ];
    const requestList = [
      dispatch({ type: 'villageEdit/getAreaByParent', parentId: areaData.provinceId }),
    ];
    if (areaData.countyId) {
      requestList.push(
        dispatch({ type: 'villageEdit/getAreaByParent', parentId: areaData.cityId }),
      );
    }
    if (areaData.streetId) {
      requestList.push(
        dispatch({ type: 'villageEdit/getAreaByParent', parentId: areaData.countyId, level: 4 }),
      );
    }
    const [cityList, countyList, streetList] = await Promise.all(requestList);
    if (streetList) {
      streetList.forEach(item => {
        item.isLeaf = true;
      });
    }
    countyList.forEach(item => {
      item.isLeaf = item.leaf;
      item.level = 3;
      if (item.value === areaData.countyId && streetList) {
        item.children = streetList;
      }
    });
    cityList.forEach(item => {
      item.isLeaf = item.leaf;
      item.level = 2;
      if (item.value === areaData.cityId) {
        item.children = countyList;
      }
    });
    treeData.forEach(item => {
      item.isLeaf = item.leaf;
      item.level = 1;
      if (item.value === areaData.provinceId) {
        item.children = cityList;
      }
    });
    this.setState({
      treeData,
      baseInfo,
    });
  }

  async resetForm() {
    const data: VillageBaseInfo = await this.props.dispatch({ type: 'village/getCommuntyInfo' });
    if (!data) {
      return;
    }
    data.village.buildDay = data.village.buildDay
      ? moment(data.village.buildDay, 'YYYY-MM-DD HH:mm:ss')
      : moment();
    this.setState({
      communityFiles: [
        {
          uid: '1',
          type: 'unchanged',
          size: 3,
          name: '23',
          url: data.village.image,
        },
      ],
    });
    return Promise.resolve(data);
  }

  constructionVaildator = (rule, value, callback) => {
    return value > -1 ? callback(null) : callback(new Error('请选择承建商!'));
  };

  operateVaildator = (rule, value, callback) => {
    return value > -1 ? callback(null) : callback(new Error('请选择运营商!'));
  };

  imageVaildator = (rule, value, callback) => {
    const { communityFiles } = this.state;
    return communityFiles.length ? callback(null) : callback(new Error('请选择小区图片'));
  };

  renderInOutModal = () => {
    const modalProps = {
      onCancel: () => {
        this.cancelModal();
        this.resetForm();
      },
      visible: this.state.modalVisible,
      title: '出入口设置',
      destroyOnClose: true,
      centered: true,
      footer: null,
      maskClosable: false,
      bodyStyle: {},
      width: '80%',
      height: '80%',
      wrapClassName: 'modal',
    };
    return (
      <Modal {...modalProps}>
        <EntryAndExitConfig />
      </Modal>
    );
  };

  // eslint-disable-next-line max-lines-per-function
  renderForm() {
    const { operateList } = this.props;
    const { baseInfo } = this.state;
    const areaDefaultValue = [
      baseInfo.village.provinceId,
      baseInfo.village.cityId,
      baseInfo.village.countyId,
      baseInfo.village.streetId,
    ];
    const formProps = {
      items: [
        {
          formItemLayout: {
            labelCol: { span: 24 },
            wrapperCol: { span: 12 },
          },
          type: 'upload',
          field: 'villageImage',
          initialValue: baseInfo.village.image,
          placeholder: '小区照片',
          onChange: img => this.imgChange(img),
          textContent: '单击或拖放文件到此区域上传,最多上传一张图片',
          fileList: this.state.communityFiles,
          rules: [{ required: true, message: '请上传小区图片' }],
          span: 24,
          maxFiles: 1,
        },
        {
          formItemLayout: {
            labelCol: { span: 24 },
            wrapperCol: { span: 12 },
          },
          type: 'input',
          maxLength: 50,
          field: 'name',
          initialValue: baseInfo.village.name || '',
          height: '60',
          span: 24,
          placeholder: '小区名称',
          rules: [{ required: true, message: '小区名称不能为空' }],
        },
        {
          formItemLayout: {
            labelCol: { span: 24 },
            wrapperCol: { span: 12 },
          },
          type: 'cascader',
          field: 'province',
          onChange: this.cascaderChange,
          options: this.state.treeData,
          loadData: this.loadData,
          initialValue: areaDefaultValue.filter(v => v) || [],
          height: '60',
          changeOnSelect: true,
          span: 24,
          placeholder: '小区地址',
          rules: [{ required: true, message: '小区地址不能为空' }],
        },
        {
          formItemLayout: {
            labelCol: { span: 24 },
            wrapperCol: { span: 12 },
          },
          type: 'textArea',
          field: 'address',
          initialValue: baseInfo.village.address || '',
          maxLength: 50,
          placeholder: '详细地址',
          span: 24,
          rules: [{ required: true, message: '详细地址不能为空' }],
        },
        {
          formItemLayout: {
            labelCol: { span: 24 },
            wrapperCol: { span: 24 },
          },
          maxLength: 10,
          type: 'input',
          initialValue: baseInfo.village.construction || '',
          height: '60',
          field: 'construction',
          placeholder: '设备承建商',
          // children: constructionList,
          span: 6,
          rules: [{ required: true, message: '设备承建商不能为空' }],
        },
        {
          formItemLayout: {
            labelCol: { span: 24 },
            wrapperCol: { span: 8 },
          },
          type: 'input',
          field: 'constructionPhone',
          initialValue: baseInfo.village.constructionPhone || '',
          height: '60',
          placeholder: '联系电话',
          span: 18,
          rules: [
            { required: true, message: '联系电话不能为空' },
            {
              validator: isPhone,
            },
          ],
        },
        {
          formItemLayout: {
            labelCol: { span: 24 },
            wrapperCol: { span: 24 },
          },
          type: 'select',
          field: 'operate',
          height: '60',
          initialValue: baseInfo.village.operate || '',
          children: operateList,
          placeholder: '设备运营商',
          span: 6,
          rules: [{ required: true, message: '设备运营商不能为空' }],
        },
        {
          formItemLayout: {
            labelCol: { span: 24 },
            wrapperCol: { span: 8 },
          },
          type: 'input',
          initialValue: baseInfo.village.operatePhone || '',
          height: '60',
          field: 'operatePhone',
          placeholder: '联系电话',
          span: 18,
          rules: [
            { required: true, message: '联系电话不能为空' },
            {
              validator: isPhone,
            },
          ],
        },
        {
          formItemLayout: {
            labelCol: { span: 24 },
            wrapperCol: { span: 24 },
          },
          type: 'datePicker',
          span: 6,
          height: '60',
          initialValue: baseInfo.village.buildDay || '',
          showTime: true,
          field: 'buildDay',
          placeholder: '建设时间',
          rules: [{ required: true, message: '请选择建设时间!' }],
        },
        {
          type: 'button',
          span: 6,
          customtype: 'master',
          height: '70px',
          onClick: this.openInOutModal,
          title: `出入口设置`,
        },
      ],
      formItemLayout: {
        labelCol: { span: 24 },
        wrapperCol: { span: 14 },
      },

      className: styles.form,
      onGetFormRef: form => {
        this.form = form;
      },
    };
    return <FormSimple {...formProps} />;
  }

  // eslint-disable-next-line max-lines-per-function
  render() {
    const { loading } = this.state;

    return (
      <div className={styles.communityPage}>
        <Form className={styles.baseInfo} onReset={this.reset}>
          <div className={styles.title}>
            {/* <Icon type={'rollback'} className={styles.backBtn} onClick={this.back} /> */}
            <AntdIcon className={styles.backBtn} type={'pm-back'} onClick={this.back} />
            <span className={styles.line} />
            <div>小区基本信息</div>
          </div>
          <div className={styles.body}>
            <div className={styles.block}>
              <div className={styles.blockTitle}>
                <div className={styles.line} />
                <label>小区建设信息</label>
              </div>
              {this.renderForm()}
            </div>
          </div>
          <div className={styles.operate}>
            <Button
              customtype={'select'}
              htmlType={'submit'}
              onClick={this.submitSave}
              className={styles.button}
              loading={loading}
            >
              <Icon type={'save'} /> 保存
            </Button>
            <Button htmlType={'reset'} className={`${styles.button} ${styles.reset}`}>
              <Icon type={'reload'} />
              重置
            </Button>
          </div>
        </Form>
        {/* <div className={styles.modfiyRecord}>
          <div className={styles.title}>
            <div>修改记录</div>
          </div>
          <div className={styles.recordList}>
            <div className={styles.record}>
              <div className={styles.point} />
              <div className={styles.recordName}>Admin</div>
              <span className={styles.recordTime}>2019-08-29 23:2</span>
            </div>
          </div>
        </div> */}
        {this.renderInOutModal()}
      </div>
    );
  }

  loadData = async selectedOptions => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    targetOption.level = targetOption.level || 1;
    const data = await this.props.dispatch({
      type: 'villageEdit/getAreaByParent',
      parentId: targetOption.value,
      level: targetOption.level === 3 ? 4 : undefined,
    });
    data.forEach(item => {
      item.level = targetOption.level ? targetOption.level + 1 : 1;
      item.isLeaf = targetOption.level === 3;
    });
    targetOption.loading = false;
    targetOption.children = data;
    this.setState({
      treeData: [...this.state.treeData],
    });
  };

  cascaderChange = value => {
    this.selectedArea = value;
  };

  imgChange(img) {
    this.setState({ communityFiles: img.fileList }, this.props.form.validateFields);
  }

  submitSave = async () => {
    const { dispatch } = this.props;
    const { getFieldsValue, setFields, validateFields } = this.form;
    const values = getFieldsValue();
    validateFields((_err, _fieldsValue) => {});
    if (!this.state.communityFiles[0]) {
      setFields({ villageImage: { value: undefined, errors: [new Error('请选择照片')] } });
      return;
    }
    if (this.selectedArea[0]) {
      values.provinceId = this.selectedArea[0];
    } else {
      setFields({ province: { value: this.selectedArea, errors: [new Error('请选择省区')] } });
      return;
    }
    if (this.selectedArea[1]) {
      values.cityId = this.selectedArea[1];
    } else {
      setFields({ province: { value: this.selectedArea, errors: [new Error('请选择市区')] } });
      return;
    }
    if (this.selectedArea[2]) {
      values.countyId = this.selectedArea[2];
    } else {
      setFields({ province: { value: this.selectedArea, errors: [new Error('请选择区县')] } });
      return;
    }
    if (this.selectedArea[3]) {
      values.streetId = this.selectedArea[3];
    } else {
      setFields({ province: { value: this.selectedArea, errors: [new Error('请选择街道')] } });
      return;
    }

    if (!values.construction) {
      setFields({
        construction: {
          value: undefined,
          errors: [new Error('请选择承建商')],
        },
      });
      values.construction = '';
      return;
    }
    if (!values.operate) {
      setFields({
        operate: {
          value: undefined,
          errors: [new Error('请选择运营商')],
        },
      });
      values.operate = '';
      return;
    }
    if (!values.name) {
      return;
    }
    const data = {
      ...values,
      buildDay: values.buildDay ? (values.buildDay as any).format('YYYY-MM-DD HH:mm:ss') : '',
      villageImage:
        this.state.communityFiles[0] && this.state.communityFiles[0].type === 'unchanged'
          ? undefined
          : this.state.communityFiles[0]
          ? this.state.communityFiles[0].originFileObj
          : undefined,
    };
    this.setState({ loading: true });
    const result = await dispatch({ type: 'villageEdit/submitSave', submitData: data });
    this.setState({ loading: false });
    if (result) {
      router.push('/dashboard/basicdata/village');
    }
  };

  back = () => {
    router.push(`/dashboard/basicdata/village`);
  };

  openInOutModal = () => {
    this.setState({
      modalVisible: true,
    });
  };
  cancelModal = () => {
    this.setState({
      modalVisible: false,
    });
  };

  reset = async () => {
    this.form.resetFields();
  };
}
export default Form.create<VillageEditProps>()(VillageEdit);
