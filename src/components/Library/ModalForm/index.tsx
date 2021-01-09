import React, { PureComponent } from 'react';
import Form, { FormComponentProps } from '../Form';
import styles from './index.less';
import { FormSimpleProps } from '../FormSimple';
// import Icon from '../Icon';
// import ButtonGroup from '../ButtonGroup';
import { FormSimple, Modal } from '..';

// import { chunk } from 'lodash';

interface ModalFormState {
  visible: boolean;
}

// interface SearchFormItem {
//   type: string;
//   field: string;
//   placeholder?: string | [string, string] | undefined;
//   onClick?: Function;
//   children?: Children[];
//   initialValue?: any;
//   onChange?: onSelectChange | onDatePickerChange | onRangePickerChange;
// }
// interface SearchFormProps extends FormComponentProps {
//   items: SearchFormItem[];
//   actions: ButtonProps[];
//   onSubmit?: React.FormEventHandler<HTMLFormElement>;
//   columnNumOfRow?: number;
//   onGetFormRef?: Function;
// }
// interface ButtonProps {
//   customtype?: string;
//   title: string;
//   icon?: string;
//   onClick?: React.MouseEventHandler<HTMLElement>;
//   htmlType?: string;
// }

// interface ButtonGroupProps {
//   actions: ButtonProps[];
// }
interface BodyStyle {
  [propName: string]: string;
}

export interface ModalFormProps extends FormComponentProps, FormSimpleProps {
  title?: string;
  onCancel: (e: React.MouseEvent<HTMLElement>) => void;
  destroyOnClose?: boolean;
  width: string;
  bodyStyle?: BodyStyle;
  add?: boolean;
  modify?: boolean;
  personModel?: boolean;
  personAdd?: boolean;
  companyDetails?: boolean;
}

class ModalForm extends PureComponent<ModalFormProps, ModalFormState> {
  containerRef: React.RefObject<any>;

  autoHeightList: string[] = ['img', 'upload', 'textArea'];

  constructor(props: Readonly<ModalFormProps>) {
    super(props);
    this.state = {
      visible: false,
    };
    if (props) {
      // const { onGetFormRef, form } = props;
      // if (onGetFormRef) {
      //   onGetFormRef(form);
      // }
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
      modify,
      onGetFormRef,
      ...options
    } = this.props;
    const formProps = { items, actions, onSubmit, modify, onGetFormRef };
    // const cols = this.getCol(items, actions);
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
        visible={add || modify || this.state.visible}
        footer={null}
        title={title}
        wrapClassName={styles.model}
        {...options}
      >
        <FormSimple {...formProps} />
        {/* <Form
          className={styles.AddOrEditForm}
          labelAlign={'right'}
          onSubmit={onSubmit}
          // {...formItemLayout}
          autoComplete={'off'}
        >
          <Row gutter={16} justify={'center'} style={{ marginLeft: '0', marginRight: '0' }}>
            {cols}
          </Row>
        </Form> */}
      </Modal>
    );
  }

  getContainer = () => {
    return this.containerRef.current;
  };
}

export default Form.create<ModalFormProps>()(ModalForm);
