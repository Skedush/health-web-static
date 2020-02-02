import React, { PureComponent, ReactElement } from 'react';
import Modal, { ModalProps } from '../Modal';
import Button from '../Button';
import Icon from '../Icon';
import classNames from 'classnames';
import styles from './index.less';
export interface ConfirmPropos extends ModalProps {}

export interface ConfirmProps extends ModalProps {
  type?: string;
  visible?: boolean;
  title?: string;
  content?: string | ReactElement;
}

interface ConfirmState {
  sourceData?: any;
  visible: boolean;
  callback?: Function;
  title?: string;
  content?: string | ReactElement;
  type?: string;
}

class Confirm extends PureComponent<ConfirmProps, ConfirmState> {
  constructor(props: Readonly<ConfirmProps>) {
    super(props);

    this.state = {
      title: '',
      content: '',
      sourceData: {},
      visible: false,
      callback: () => {},
    };
  }

  render() {
    const type = this.state.type || this.props.type;
    const { title, content } = this.state;
    let icon = '';
    let color = styles.error;
    switch (type) {
      case 'warning':
        icon = 'exclamation-circle';
        color = styles.warning;
        break;
      case 'question':
        icon = 'question-circle';
        color = styles.question;
        break;
      case 'success':
        icon = 'check-circle';
        color = styles.success;
        break;
      case 'info':
        icon = 'info-circle';
        color = styles.info;
        break;
      default:
        icon = 'info-circle';
        color = styles.info;
        break;
    }
    const titleNode = (
      <div className={classNames(styles.title, color)}>
        <Icon type={icon} theme={'filled'} />
        <span>{title || this.props.title}</span>
      </div>
    );
    return (
      <Modal
        title={titleNode}
        footer={null}
        visible={this.state.visible || this.props.visible}
        wrapClassName={styles.modal}
        onCancel={this.onCancel}
        destroyOnClose
      >
        <div className={styles.content}>{content || this.props.content}</div>
        <div className={classNames(styles.buttonGroup)}>
          <Button customtype={'select'} onClick={this.onOk}>
            确认
          </Button>
          <Button customtype={'second'} onClick={this.onCancel}>
            取消
          </Button>
        </div>
      </Modal>
    );
  }
  open(fun: Function, title?: string, content?: string | ReactElement, type?: string) {
    this.setState({
      visible: true,
      callback: fun,
      title,
      type,
      content,
    });
  }
  onOk = e => {
    if (this.state.callback) {
      this.state.callback();
    }
    this.closeModal();
  };
  onCancel = e => {
    this.closeModal();
  };
  closeModal = () => {
    if (this.props.onCancel) {
      this.props.onCancel({} as any);
    }
    this.setState({
      visible: false,
    });
  };
}
export default Confirm;
