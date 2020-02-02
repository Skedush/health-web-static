import React, { PureComponent, Fragment } from 'react';
import Button from '../Button';
import Input from '../Input';
import Form, { FormComponentProps } from '../Form';
import DatePicker, { RangePickerValue } from '../DatePicker';
import Select from '../Select';
import Col from '../Col';
import Row from '../Row';
import Modal from '../Modal';
import InputNumber from '../InputNumber';
import Radio from '../Radio';
import Cascader from './../Cascader';
import styles from './index.less';
// import Icon from '../Icon';
import moment from 'moment';
import Upload, { UploadFile, UploadChangeParam } from '../Upload';
// import { chunk } from 'lodash';

const FormItem = Form.Item;
const TextArea = Input.TextArea;
const RadioGroup = Radio.Group;

type onUploadChange = (info: UploadChangeParam) => void;
type onDatePickerChange = (date: moment.Moment | null, dateString: string) => void;
type onRangePickerChange = (dates: RangePickerValue, dateStrings: [string, string]) => void;
type onSelectChange = (
  value: any,
  option: React.ReactElement<any> | React.ReactElement<any>[],
) => void;
interface ModalFormState {
  visible: boolean;
}

interface Children {
  key: string | number;
  value: string | number;
}

interface ButtonProps {
  customtype?: string;
  icon?: string;
  title?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

interface ModalFormItem {
  type: string;
  field: string;
  placeholder?: string | [string, string] | undefined;
  onChange?: onSelectChange | onDatePickerChange | onRangePickerChange | onUploadChange;
  fileList?: UploadFile[];
  children?: Children[];
  children1?: Children[];
  children2?: Children[];
  children3?: Children[];
  initialValue?: any;
  rules?: object[];
  hidden?: boolean;
  fill?: boolean;
  itemPlaceholder?: string[];

  [propName: string]: any;
}
interface BodyStyle {
  [propName: string]: string;
}

export interface ModalFormProps extends FormComponentProps {
  items: ModalFormItem[];
  actions: ButtonProps[];
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  title?: string;
  onCancel: (e: React.MouseEvent<HTMLElement>) => void;
  destroyOnClose: boolean;
  width: string;
  bodyStyle: BodyStyle;
  add?: boolean;
  personAdd?: boolean;
  personModel?: boolean;

  modify?: boolean;
  onGetFormRef?: Function;
  options4: [];
}

class ModalForm extends PureComponent<ModalFormProps, ModalFormState> {
  containerRef: React.RefObject<any>;

  constructor(props: Readonly<ModalFormProps>) {
    super(props);
    this.state = {
      visible: false,
    };
    if (props) {
      const { onGetFormRef, form } = props;
      if (onGetFormRef) {
        onGetFormRef(form);
      }
    }
  }
  render() {
    const {
      onSubmit,
      items,
      actions,
      title,
      onCancel,
      destroyOnClose,
      width,
      bodyStyle,
      add,
      personAdd,
      modify,
    } = this.props;
    const cols = this.getCol(items, actions);
    // const formItemLayout = {
    //   labelCol: { span: 6 },
    //   wrapperCol: { span: 17 },
    // };
    return (
      <Modal
        centered
        width={width}
        bodyStyle={bodyStyle}
        destroyOnClose={destroyOnClose}
        onCancel={onCancel}
        visible={add || modify || personAdd || this.state.visible}
        footer={null}
        maskClosable={false}
        title={title}
        wrapClassName={styles.model}
      >
        <Form
          className={styles.AddOrEditForm}
          labelAlign={'right'}
          onSubmit={onSubmit}
          // {...formItemLayout}
          autoComplete={'off'}
        >
          <Row gutter={24}>{cols}</Row>
        </Form>
      </Modal>
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
    // const chunks = chunk(cpts, this.columnNumOfRow);
    // const cols = cpts.map((item, index) => {
    //   return item;
    // });
    return (
      <Fragment>
        {cpts}
        {actionsCol}
      </Fragment>
    );
  };

  // eslint-disable-next-line max-lines-per-function
  getFormElement = (element: ModalFormItem, index: number) => {
    if (!element) {
      return null;
    }
    let cpt: React.ReactNode = null;

    const { form } = this.props;
    const { getFieldDecorator } = form;
    const {
      type,
      field,
      initialValue,
      placeholder,
      children,
      // children1,
      // children2,
      // children3,
      // itemPlaceholder,
      rules,
      hidden,
      fill,
      onChange,
      ...option
    } = element;
    const { modify } = this.props;
    if (hidden && modify) {
      return getFieldDecorator(field, {
        initialValue,
      })(<Input hidden={hidden} key={`element${index}`} />);
    }
    if (hidden && !modify) {
      return null;
    }
    switch (type) {
      case 'input':
        cpt = <Input placeholder={placeholder as string} {...option} />;
        break;
      case 'password':
        cpt = <Input placeholder={placeholder as string} type={'password'} {...option} />;
        break;
      case 'number':
        cpt = <InputNumber placeholder={placeholder as string} {...option} />;
        break;
      case 'textArea':
        cpt = <TextArea placeholder={placeholder as string} {...option} />;
        break;
      case 'datePicker':
        cpt = (
          <DatePicker
            placeholder={placeholder as string}
            // showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
            // getCalendarContainer={this.getContainer}
            onChange={onChange as onDatePickerChange}
          />
        );
        break;

      case 'rangePicker':
        cpt = (
          <DatePicker.RangePicker
            placeholder={placeholder as [string, string]}
            showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
            onChange={onChange as onRangePickerChange}
            // getCalendarContainer={this.getContainer}
          />
        );
        break;
      case 'upload':
        cpt = (
          <Upload
            uploadType={'picture'}
            title={'上传测试'}
            onChange={onChange as onUploadChange}
            {...option}
          />
        );
        break;
      case 'select':
        const arr = children || [];
        const options = arr.map((item, index) => {
          const { key, value } = item;
          return (
            <Select.Option key={key} value={value}>
              {value}
            </Select.Option>
          );
        });
        cpt = (
          <Select placeholder={placeholder} {...option}>
            {options}
          </Select>
        );
        break;
      // case 'moreselect':
      //   const arr1 = children1 || [];
      //   const options1 = arr1.map((item, index) => {
      //     const { key, value } = item;
      //     return (
      //       <Select.Option key={key} value={value}>
      //         {value}
      //       </Select.Option>
      //     );
      //   });
      //   const arr2 = children2 || [];
      //   const options2 = arr2.map((item, index) => {
      //     const { key, value } = item;
      //     return (
      //       <Select.Option key={key} value={value}>
      //         {value}
      //       </Select.Option>
      //     );
      //   });
      //   const arr3 = children3 || [];
      //   const options3 = arr3.map((item, index) => {
      //     const { key, value } = item;
      //     return (
      //       <Select.Option key={key} value={value}>
      //         {value}
      //       </Select.Option>
      //     );
      //   });

      //   cpt = (
      //     <div style={{ display: 'flex' }}>
      //       <Select placeholder={itemPlaceholder[0]} {...option}>
      //         {options1}
      //       </Select>
      //       <Select placeholder={itemPlaceholder[1]} {...option}>
      //         {options2}
      //       </Select>
      //       <Select placeholder={itemPlaceholder[2]} {...option}>
      //         {options3}
      //       </Select>
      //     </div>
      //   );
      //   break;
      case 'cascader':
        const options4 = [
          {
            value: 'zhejiang',
            label: 'Zhejiang',
            isLeaf: false,
          },
          {
            value: 'jiangsu',
            label: 'Jiangsu',
            isLeaf: false,
          },
        ];
        cpt = (
          <Cascader
            options={options4}
            loadData={this.loadData}
            onChange={this.onChange2}
            changeOnSelect
          />
        );
        break;
      case 'radio':
        const ary = children || [];
        const radios = ary.map((item, index) => {
          const { key, value } = item;
          return (
            <Radio key={value} value={value}>
              {key}
            </Radio>
          );
        });
        cpt = <RadioGroup {...option}>{radios}</RadioGroup>;
        break;
      default:
        break;
    }
    return (
      <Col key={`element${index}`} span={fill ? 24 : 12}>
        <FormItem label={placeholder}>
          {getFieldDecorator(field, {
            initialValue,
            rules,
          })(cpt)}
        </FormItem>
      </Col>
    );
  };

  getContainer = () => {
    return this.containerRef.current;
  };

  onChange2 = (value, selectedOptions) => {
    console.log(value, selectedOptions);
  };

  loadData = selectedOptions => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;

    // load options lazily
    setTimeout(() => {
      targetOption.loading = false;
      targetOption.children = [
        {
          label: `${targetOption.label} Dynamic 1`,
          value: 'dynamic1',
        },
        {
          label: `${targetOption.label} Dynamic 2`,
          value: 'dynamic2',
        },
      ];
      // this.setState({
      //   options4: [...this.state.options4],
      // });
    }, 1000);
  };
}

export default Form.create<ModalFormProps>()(ModalForm);
