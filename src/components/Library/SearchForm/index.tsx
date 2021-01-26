import React, { Fragment, PureComponent, ReactElement } from 'react';
import styles from './index.less';
import classNames from 'classnames';
import Button from '../Button';
import Input from '../Input';
import Form, { FormComponentProps } from '../Form';
import DatePicker, { RangePickerValue } from '../DatePicker';
import Select from '../Select';
import Col from '../Col';
import Row from '../Row';
import ExpandBtn from '../ExpandBtn';
import moment from 'moment';
import { chunk } from 'lodash';

const FormItem = Form.Item;
const DEFAULT_COLUMN_NUM_OF_ROW = 4;

interface Children {
  key: string | number;
  value: string | number;
}

type onSelectChange = (
  value: any,
  option: React.ReactElement<any> | React.ReactElement<any>[],
) => void;
type onDatePickerChange = (date: moment.Moment | null, dateString: string) => void;
type onRangePickerChange = (dates: RangePickerValue, dateStrings: [string, string]) => void;
interface SearchFormItem {
  type: string;
  field: string;
  disabled?: boolean;
  placeholder?: string | [string, string] | undefined;
  onClick?: Function;
  children?: Children[];
  initialValue?: any;
  suffix?: ReactElement | string;
  maxLength?: number;
  onChange?: onSelectChange | onDatePickerChange | onRangePickerChange;
}

interface ButtonProps {
  customtype?: string;
  icon?: string;
  title: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

interface SearchState {
  isExpandForm: boolean;
}

interface SearchFormProps extends FormComponentProps {
  actions: ButtonProps[];
  items: SearchFormItem[];
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  columnNumOfRow?: number;
  onGetFormRef?: Function;
  titleVisible?: boolean;
  title?: string;
  className?: string;
}

class SearchForm extends PureComponent<SearchFormProps, SearchState> {
  columnNumOfRow: number;
  containerRef: React.RefObject<any>;

  constructor(props: Readonly<SearchFormProps>) {
    super(props);

    this.state = {
      isExpandForm: false,
    };
    this.columnNumOfRow = DEFAULT_COLUMN_NUM_OF_ROW;
    this.containerRef = React.createRef();

    if (props.items) {
      const { columnNumOfRow, onGetFormRef } = props;
      this.columnNumOfRow = columnNumOfRow || DEFAULT_COLUMN_NUM_OF_ROW;
      if (onGetFormRef) {
        onGetFormRef(props.form);
      }
    }
  }

  render() {
    const { actions, items, titleVisible, title, className } = this.props;
    if (!items) {
      return null;
    }
    if (!Array.isArray(items)) {
      console.error('this data of page header is not array');
      return null;
    }

    const rows = this.getRow(items, actions);

    return (
      <Fragment>
        {titleVisible && <div className={styles.searchFromHeader}>{title || '信息筛选'}</div>}
        <div
          className={classNames(styles.searchForm, styles.formWrapper, className)}
          ref={this.containerRef}
        >
          <Form layout={'inline'} onSubmit={this.onSubmit} autoComplete={'off'}>
            {rows}
          </Form>
        </div>
      </Fragment>
    );
  }

  getRow = (items: SearchFormItem[], actions: ButtonProps[]) => {
    const { isExpandForm } = this.state;
    if (!Array.isArray(items)) {
      console.error('this data of page header is not array');
      return null;
    }

    const cpts = items.map((item, index) => {
      return this.getFormElement(item, index);
    });

    const actionsElements = this.getAction(actions);
    const chunks = chunk(cpts, this.columnNumOfRow);
    const rows = chunks.map((item, index) => {
      let actionCpts: React.ReactNode = null;

      if (!isExpandForm && index > 0) {
        return null;
      }

      // if ((!isExpandForm && index === 0) || (isExpandForm && index === chunks.length - 1)) {
      if (index === 0) {
        actionCpts = (
          <Fragment>
            <Col md={5} sm={24}>
              <FormItem>
                <div className={styles.btnWrapper}>
                  <div className={styles.btn}>{actionsElements}</div>
                  {chunks.length > 1 && (
                    <ExpandBtn
                      isExpand={this.state.isExpandForm}
                      onClick={this.onClickExpandForm}
                    />
                  )}
                </div>
              </FormItem>
            </Col>
          </Fragment>
        );
      }

      return (
        <Row
          key={`row${index}`}
          gutter={{ md: 24, lg: 24, xl: 24 }}
          type={'flex'}
          justify={'start'}
          align={'middle'}
        >
          {item}
          {actionCpts}
        </Row>
      );
    });

    return <Fragment>{rows}</Fragment>;
  };

  getAction = (actions: ButtonProps[]) => {
    if (!Array.isArray(actions)) {
      console.error('data of from action is not array');
      return null;
    }

    return actions.map((item, index) => {
      const { title } = item;
      return (
        <Button key={`actionBtn${index}`} {...item}>
          {title}
        </Button>
      );
    });
  };

  getFormElement = (element: SearchFormItem, index) => {
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
      onChange,
      maxLength,
      disabled,
      ...option
    } = element;
    switch (type) {
      case 'input':
        cpt = (
          <Input placeholder={placeholder as string} maxLength={maxLength} disabled={disabled} />
        );
        break;

      case 'datePicker':
        cpt = (
          <DatePicker
            placeholder={placeholder as string}
            // showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
            getCalendarContainer={this.getContainer}
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
            getCalendarContainer={this.getContainer}
          />
        );
        break;

      case 'select':
        const arr = children || [];
        const { Option } = Select;
        const options = arr.map(item => {
          const { key, value } = item;
          return (
            <Option key={key} value={key}>
              {value}
            </Option>
          );
        });
        cpt = (
          <Select placeholder={placeholder} onChange={onChange as onSelectChange} {...option}>
            {options}
          </Select>
        );
        break;

      default:
        break;
    }

    return (
      <Col key={`element${index}`} md={14} sm={24}>
        <FormItem>
          {getFieldDecorator(field, {
            initialValue,
          })(cpt)}
        </FormItem>
      </Col>
    );
  };

  getContainer = () => {
    return this.containerRef.current;
  };

  onReset = () => {};

  onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const { onSubmit } = this.props;
    if (onSubmit) {
      onSubmit(e);
    }
  };

  onClickExpandForm = () => {
    const isExpand = !this.state.isExpandForm;
    this.setState({ isExpandForm: isExpand });
  };
}

export default Form.create<SearchFormProps>()(SearchForm);
