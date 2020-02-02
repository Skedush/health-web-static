import React, { PureComponent, Fragment, ChangeEvent } from 'react';
import Button from '../Button';
import Input from '../Input';
import Form, { FormComponentProps } from '../Form';
import DatePicker, { RangePickerValue } from '../DatePicker';
import Select from '../Select';
import Col from '../Col';
import Row from '../Row';
import InputNumber from '../InputNumber';
import Cascader, { CascaderOptionType } from './../Cascader';
import Radio from '../Radio';
import RadioGroup from '../RadioGroup';
import TreeSelect from '../TreeSelect';
import styles from './index.less';
import { ColumnProps, PaginationConfig } from '@/components/Library/type';
// import Icon from '../Icon';
import moment, { Moment } from 'moment';
import Upload, { UploadFile, UploadChangeParam } from '../Upload';
import { Img, Checkbox } from '..';
import { RadioChangeEvent } from 'antd/lib/radio';
import classNames from 'classnames';

// import { chunk } from 'lodash';

const FormItem = Form.Item;
const TextArea = Input.TextArea;
const TreeNode = TreeSelect.TreeNode;

type onUploadChange = (info: UploadChangeParam) => void;
type onDatePickerChange = (date: moment.Moment | null, dateString: string) => void;
type onRangePickerChange = (dates: RangePickerValue, dateStrings: [string, string]) => void;
type onSelectChange = (
  value: any,
  option: React.ReactElement<any> | React.ReactElement<any>[],
) => void;
type onInputChange = (event: ChangeEvent<HTMLInputElement>) => void;
type onCascaderChange = (value: string[], selectedOptions?: CascaderOptionType[]) => void;
type onLoadCascaderData = (selectedOptions?: CascaderOptionType[]) => void;
interface FormSimpleState {}

interface Children {
  key: string | number;
  value: string | number;
}

interface ButtonProps {
  customtype?: string;
  icon?: string;
  title?: string;
  htmlType?: 'button' | 'submit' | 'reset' | undefined;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

export interface FormSimpleItem extends ButtonProps {
  type: string;
  field?: string;
  placeholder?: string | [string, string] | undefined;
  label?: string;
  onChange?:
    | onSelectChange
    | onDatePickerChange
    | onRangePickerChange
    | onUploadChange
    | onCascaderChange;
  loadData?: onLoadCascaderData;
  fileList?: UploadFile[];
  children?: Children[];
  // CascaderOptions?: CascaderOptions[];
  initialValue?: any;
  validateTrigger?: string;
  getValueFromEvent?: (...arg) => any;
  trigger?: string;
  disabled?: boolean;
  rules?: object[];
  hidden?: boolean;
  fill?: boolean;
  columns?: ColumnProps<any>[];
  pagination?: PaginationConfig;
  data?: any;
  ButtonItem?: any;
  className?: string;
  timeBegin?: Moment;
  span?: number;
  monthsRange?: any[];
  height?: string;
  render?: Function;
  item?: FormSimpleItem;
  [propName: string]: any;
}
export interface FormSimpleProps extends FormComponentProps {
  items: FormSimpleItem[];
  actions?: ButtonProps[];
  formItemLayout?: any;
  className?: any;
  modify?: boolean;
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  onGetFormRef?: Function;
}

class FormSimple extends PureComponent<FormSimpleProps, FormSimpleState> {
  containerRef: React.RefObject<any>;

  autoHeightList: string[] = ['img', 'upload', 'textArea', 'treeSelect'];

  constructor(props: Readonly<FormSimpleProps>) {
    super(props);
    this.state = {};
    if (props) {
      const { onGetFormRef, form } = props;
      if (onGetFormRef) {
        onGetFormRef(form);
      }
    }
  }
  render() {
    const { onSubmit, items, actions, formItemLayout = {}, className } = this.props;
    const cols = this.getCol(items, actions);
    // const formItemLayout = {
    //   labelCol: { span: 6 },
    //   wrapperCol: { span: 17 },
    // };
    return (
      <Form
        className={classNames(className)}
        labelAlign={'right'}
        onSubmit={onSubmit}
        {...formItemLayout}
        autoComplete={'off'}
      >
        <Row gutter={16} justify={'center'} style={{ marginLeft: '0', marginRight: '0' }}>
          {cols}
        </Row>
      </Form>
    );
  }

  getAction = actions => {
    if (!Array.isArray(actions)) {
      console.error('data of from action is not array');
      return null;
    }
    const actionsElements = actions.map((item, index) => {
      const { title } = item;
      return (
        <Button key={`actionBtn${index}`} style={{ marginLeft: 10 }} {...item}>
          {title}
        </Button>
      );
    });
    return (
      <Col span={24} className={styles.buttonCol}>
        {actionsElements}
      </Col>
    );
  };

  getCol = (items, actions) => {
    if (!Array.isArray(items)) {
      console.error('this data of page header is not array');
      return null;
    }

    const cpts = items.map((item, index) => {
      return this.getFormElement(item, index);
    });

    const actionsCol = this.getAction(actions);
    return (
      <Fragment>
        <Row style={{ padding: '12px 24px' }}>{cpts}</Row>
        <Row>{actionsCol}</Row>
      </Fragment>
    );
  };

  // eslint-disable-next-line max-lines-per-function
  getFormElement = (element: FormSimpleItem, index: number) => {
    if (!element) {
      return null;
    }

    let cpt: React.ReactNode = null;
    const { form, modify } = this.props;
    const { getFieldDecorator } = form;
    const {
      type,
      field,
      initialValue,
      validateTrigger,
      getValueFromEvent,
      trigger,
      placeholder,
      children = [],
      rules,
      hidden,
      fill,
      span = 12,
      formItemLayout,
      onChange,
      loadData,
      monthsRange,
      showTime,
      cascaderOption,
      render,
      beforeUpload,
      timeBegin,
      height,
      label,
      ...option
    } = element;

    if (hidden && type !== 'hiddenInput') {
      return null;
    }
    const colHeight = height || (this.autoHeightList.indexOf(type) > -1 ? 'auto' : '83px');
    switch (type) {
      case 'hiddenInput':
        if (modify) {
          return getFieldDecorator(field as string, {
            initialValue,
          })(<Input hidden={hidden} key={`element${index}`} />);
        } else {
          return null;
        }
      case 'input':
        cpt = (
          <Input
            placeholder={placeholder as string}
            onChange={onChange as onInputChange}
            {...option}
          />
        );
        break;
      case 'password':
        cpt = <Input placeholder={placeholder as string} type={'password'} {...option} />;
        break;
      case 'number':
        cpt = <InputNumber placeholder={placeholder as string} {...option} />;
        break;
      case 'label':
        return (
          <Col
            key={`element${index}`}
            span={fill ? 24 : span}
            style={{
              height: colHeight,
              padding: '0 8px',
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
            }}
          >
            {label || placeholder}：{option.value}
          </Col>
        );
      case 'button':
        const { title } = element;
        return (
          <Col
            key={`element${index}`}
            span={fill ? 24 : span}
            style={{
              height: colHeight,
              padding: '28px 8px 0 8px',
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
            }}
          >
            <Button {...option}>{title}</Button>
          </Col>
        );
      case 'textArea':
        cpt = <TextArea placeholder={placeholder as string} {...option} />;
        break;
      case 'datePicker':
        cpt = (
          <DatePicker
            placeholder={placeholder as string}
            // showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
            // getCalendarContainer={this.getContainer}
            showTime={
              typeof showTime === 'boolean'
                ? showTime
                : { defaultValue: moment('00:00:00', 'HH:mm:ss') }
            }
            onChange={onChange as onDatePickerChange}
            {...option}
          />
        );
        break;
      case 'rangePicker':
        cpt = (
          <DatePicker.RangePicker
            timeBegin={timeBegin}
            monthsRange={monthsRange}
            placeholder={placeholder as [string, string]}
            showTime={showTime}
            onChange={onChange as onRangePickerChange}
            {...option}
            // getCalendarContainer={this.getContainer}
          />
        );
        break;
      case 'upload':
        cpt = (
          <Upload
            uploadType={'picture'}
            title={'上传图片'}
            beforeUpload={beforeUpload}
            onChange={onChange as onUploadChange}
            {...option}
          />
        );
        break;
      case 'img':
        cpt = <Img image={initialValue} previewImg={true} className={styles.image} {...option} />;
        break;
      case 'select':
        const arr = children || [];
        const options = arr.map((item, index) => {
          const { key, value } = item;
          return (
            <Select.Option key={key} value={key}>
              {value}
            </Select.Option>
          );
        });
        cpt = (
          <Select placeholder={placeholder} onChange={onChange as onSelectChange} {...option}>
            {options}
          </Select>
        );
        break;
      case 'radio':
        const ary = children || [];
        const radios = ary.map((item, index) => {
          const { key, value } = item;
          return (
            <Radio key={key} value={key}>
              {value}
            </Radio>
          );
        });
        cpt = (
          <RadioGroup onChange={onChange as (e: RadioChangeEvent) => void} {...option}>
            {radios}
          </RadioGroup>
        );
        break;
      case 'cascader':
        cpt = (
          <Cascader
            options={cascaderOption as CascaderOptionType[]}
            placeholder={placeholder as string}
            loadData={loadData}
            onChange={onChange as onCascaderChange}
            changeOnSelect
            {...option}
          />
        );
        break;
      case 'checkBoxGroup':
        cpt = <Checkbox.Group options={children as any[]} {...option} />;
        break;
      case 'checkBox':
        cpt = (
          <Checkbox defaultChecked={initialValue} onChange={onChange as any} {...option}>
            {label}
          </Checkbox>
        );
        break;
      case 'treeSelect':
        cpt = this.getTreeSelect(element);
        break;
      case 'custom':
        return (
          <Col
            key={`element${index}`}
            span={fill ? 24 : span}
            style={{ height: colHeight, padding: '0 8px' }}
          >
            {render ? render(getFieldDecorator) : ''}
          </Col>
        );
      default:
        break;
    }
    return (
      <Col
        key={`element${index}`}
        span={fill ? 24 : span}
        style={{
          height: colHeight,
          padding: '0 8px',
        }}
      >
        <FormItem label={label || placeholder} {...formItemLayout}>
          {getFieldDecorator(field as string, {
            initialValue,
            validateTrigger: validateTrigger || 'onChange',
            trigger: trigger || 'onChange',
            getValueFromEvent,
            rules,
          })(cpt)}
        </FormItem>
      </Col>
    );
  };

  getTreeSelect = element => {
    const {
      treeDefaultExpandAll,
      allowClear,
      placeholder,
      showSearch,
      onChange,
      treeData,
      searchPlaceholder,
      style,
      dropdownStyle,
      ...options
    } = element;
    return (
      <TreeSelect
        showSearch={showSearch}
        style={style}
        searchPlaceholder={searchPlaceholder}
        dropdownStyle={dropdownStyle}
        placeholder={placeholder}
        allowClear={allowClear}
        treeDefaultExpandAll={treeDefaultExpandAll}
        onChange={onChange}
        treeNodeFilterProp={'title'}
        {...options}
      >
        {this.getTreeNode(treeData)}
      </TreeSelect>
    );
  };

  getTreeNode = treeData => {
    console.log(treeData);
    return (treeData || []).map(item => (
      <TreeNode value={item.id} title={item.name} key={item.id}>
        {item.children && this.getTreeNode(item.children)}
      </TreeNode>
    ));
  };

  getContainer = () => {
    return this.containerRef.current;
  };
}

export default Form.create<FormSimpleProps>()(FormSimple);
