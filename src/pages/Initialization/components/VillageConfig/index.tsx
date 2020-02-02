import React, { PureComponent } from 'react';
import styles from './index.less';
import { connect } from '@/utils/decorators';
import classNames from 'classnames';
import { WrappedFormUtils, UploadFile } from '@/components/Library/type';
import { GlobalState, UmiComponentProps, DictionaryEnum } from '@/common/type';
import { FormSimple, Button } from '@/components/Library';
import { isPhone } from '@/utils/validater';
import StepTitle from '../StepTitle';

const mapStateToProps = ({ app, loading: { effects } }: GlobalState) => {
  return {
    operateList: app.dictionry[DictionaryEnum.OPERATE_TYPE] || [],
    constructionList: app.dictionry[DictionaryEnum.BUILD_UNIT] || [],
    loading: { updateVillageConfig: effects['init/submitSave'] },
  };
};

type VillageConfigStateProps = ReturnType<typeof mapStateToProps>;
type VillageConfigProps = VillageConfigStateProps &
  UmiComponentProps & {
    onFormNext: Function;
    onStepNext: Function;
  };

interface VillageConfigState {
  treeData: any[];
  fileList: UploadFile[];
}

@connect(
  mapStateToProps,
  null,
)
class VillageConfig extends PureComponent<any, VillageConfigState> {
  selectedArea: any[] = [];
  form: WrappedFormUtils;
  constructor(props: Readonly<VillageConfigProps>) {
    super(props);
    this.state = {
      fileList: [],
      treeData: [],
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'app/getDic',
      payload: { type: [DictionaryEnum.OPERATE_TYPE, DictionaryEnum.BUILD_UNIT].toString() },
    });
    this.getAreaTree();
  }

  renderButton() {
    const { loading } = this.props;
    const ButtonProps = {
      customtype: 'main',
      onClick: this.submit,
      loading: loading.updateVillageConfig,
    };
    return (
      <div className={classNames(styles.bottomButton, 'flexCenter', 'itemCenter')}>
        <Button {...ButtonProps}>下一步</Button>
      </div>
    );
  }

  // eslint-disable-next-line max-lines-per-function
  renderForm() {
    const { operateList } = this.props;
    const formProps = {
      items: [
        {
          formItemLayout: {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
          },
          type: 'upload',
          field: 'villageImage',
          placeholder: '小区照片',
          onChange: this.onFileChange,
          textContent: '单击或拖放文件到此区域上传,最多上传一张图片',
          fileList: this.state.fileList,
          rules: [{ required: true, message: '请上传小区图片' }],
          span: 18,
          maxFiles: 1,
        },
        {
          formItemLayout: {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
          },
          type: 'input',
          maxLength: 50,
          field: 'name',
          height: '60',
          span: 18,
          placeholder: '小区名称',
          rules: [{ required: true, message: '小区名称不能为空' }],
        },
        {
          formItemLayout: {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
          },
          type: 'cascader',
          field: 'province',
          onChange: this.cascaderChange,
          options: this.state.treeData,
          loadData: this.loadData,
          height: '60',
          changeOnSelect: true,
          span: 18,
          placeholder: '小区地址',
          rules: [{ required: true, message: '小区地址不能为空' }],
        },
        {
          formItemLayout: {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
          },
          type: 'textArea',
          field: 'address',
          maxLength: 50,
          placeholder: '详细地址',
          span: 18,
          rules: [{ required: true, message: '详细地址不能为空' }],
        },
        {
          formItemLayout: {
            labelCol: { span: 12 },
            wrapperCol: { span: 10 },
          },
          maxLength: 10,
          type: 'input',
          height: '60',
          field: 'construction',
          placeholder: '设备承建商',
          // children: constructionList,
          span: 12,
          rules: [{ required: true, message: '设备承建商不能为空' }],
        },
        {
          formItemLayout: {
            labelCol: { span: 4 },
            wrapperCol: { span: 10 },
          },
          type: 'input',
          field: 'constructionPhone',
          height: '60',
          placeholder: '联系电话',
          span: 10,
          rules: [
            { required: true, message: '联系电话不能为空' },
            {
              validator: isPhone,
            },
          ],
        },
        {
          formItemLayout: {
            labelCol: { span: 12 },
            wrapperCol: { span: 10 },
          },
          type: 'select',
          field: 'operate',
          height: '60',
          children: operateList,
          placeholder: '设备运营商',
          span: 12,
          rules: [{ required: true, message: '设备运营商不能为空' }],
        },
        {
          formItemLayout: {
            labelCol: { span: 4 },
            wrapperCol: { span: 10 },
          },
          type: 'input',
          height: '60',
          field: 'operatePhone',
          placeholder: '联系电话',
          span: 10,
          rules: [
            { required: true, message: '联系电话不能为空' },
            {
              validator: isPhone,
            },
          ],
        },
        {
          formItemLayout: {
            labelCol: { span: 12 },
            wrapperCol: { span: 10 },
          },
          type: 'datePicker',
          span: 12,
          height: '60',
          showTime: true,
          field: 'buildDay',
          placeholder: '建设时间',
          rules: [{ required: true, message: '请选择建设时间!' }],
        },
      ],
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
      },
      className: styles.form,
      onGetFormRef: form => {
        this.form = form;
      },
    };
    return <FormSimple {...formProps} />;
  }
  render() {
    return (
      <div className={classNames('flexColStart', styles.content)}>
        <StepTitle title={'小区设置'} />
        {this.renderForm()}
        {this.renderButton()}
      </div>
    );
  }

  loadData = async selectedOptions => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    targetOption.level = targetOption.level || 1;
    const data = await this.props.dispatch({
      type: 'init/getAreaByParent',
      payload: { parentId: targetOption.value, level: targetOption.level === 3 ? 4 : undefined },
    });
    data.forEach(item => {
      item.level = targetOption.level ? targetOption.level + 1 : 1;
      item.isLeaf = targetOption.level === 3;
      // item.isLeaf = item.leaf;
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

  async getAreaTree() {
    const { dispatch } = this.props;
    const treeData = await dispatch({ type: 'init/getAreaByParent' });
    if (treeData)
      treeData.forEach(item => {
        item.isLeaf = item.leaf;
        item.level = 1;
      });
    this.setState({
      treeData,
    });
  }

  onFileChange = info => {
    this.setState({
      fileList: info.fileList,
    });
  };

  submit = () => {
    const { onFormNext, onStepNext } = this.props;
    const { setFields } = this.form;
    this.form.validateFields(async (err, fieldsValue) => {
      if (this.selectedArea[0]) {
        fieldsValue.provinceId = this.selectedArea[0];
      } else {
        setFields({ province: { value: this.selectedArea, errors: [new Error('请选择省区')] } });
        return;
      }
      if (this.selectedArea[1]) {
        fieldsValue.cityId = this.selectedArea[1];
      } else {
        setFields({ province: { value: this.selectedArea, errors: [new Error('请选择市区')] } });
        return;
      }
      if (this.selectedArea[2]) {
        fieldsValue.countyId = this.selectedArea[2];
      } else {
        setFields({ province: { value: this.selectedArea, errors: [new Error('请选择区县')] } });
        return;
      }
      if (this.selectedArea[3]) {
        fieldsValue.streetId = this.selectedArea[3];
      } else {
        setFields({ province: { value: this.selectedArea, errors: [new Error('请选择街道')] } });
        return;
      }
      if (err) return;
      fieldsValue.buildDay = fieldsValue.buildDay.format('YYYY-MM-DD HH:mm:ss');
      const formData = new FormData();
      for (const key in fieldsValue) {
        if (!fieldsValue[key]) {
          continue;
        }
        if (key !== 'villageImage' && fieldsValue.hasOwnProperty(key)) {
          formData.set(key, fieldsValue[key]);
        } else if (key === 'villageImage' && fieldsValue[key].file) {
          formData.set(key, fieldsValue[key].file);
        }
      }
      const res = await this.props.dispatch({
        type: 'init/submitSave',
        payload: formData,
      });
      if (res && res.success) {
        onFormNext();
        onStepNext();
      }
    });
  };
}
export default VillageConfig;
