import React, { PureComponent, Fragment } from 'react';
import styles from './index.less';
import Modal, { ModalProps } from '../Modal';
import Col from '../Col';
import Row from '../Row';
import classNames from 'classnames';
import Confirm from '../Confirm';

interface ResultsProps extends ModalProps {
  data?: { [propName: string]: any };
}

interface State {
  errorData?: { [propName: string]: any };
  visible: boolean;
}

class OperatingResults extends PureComponent<ResultsProps, State> {
  constructor(props: Readonly<ResultsProps>) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  renderResultsTitle() {
    return (
      <Fragment>
        <div>操作结果</div>
        {/* <Icon type="info-circle" /> */}
      </Fragment>
    );
  }

  renderCol = () => {
    const data = this.props.data || this.state.errorData;
    const greaterThanOne = data && data.error > 1;
    const items: any = [];
    if (data && data.message) {
      const { message: content } = data;
      for (let i = 0, len = content.length; i < len; i++) {
        const o = {
          key: i + 1,
          reason: content[i],
        };
        items.push(o);
      }
    } else {
      return;
    }

    items.unshift({ key: '序号', reason: '失败原因' });
    return items.map((item, index) => {
      return (
        <Col span={24} key={`element${index + 1}`}>
          <div className={styles.infoField}>
            {greaterThanOne && <div className={styles.fieldName}>{item.key}</div>}
            <div className={styles.fieldValue} title={item.reason}>
              {item.reason}
            </div>
          </div>
        </Col>
      );
    });
  };

  render() {
    const { visible, onCancel } = this.props;
    const data = this.props.data || this.state.errorData;
    const greaterThanOne = data && data.error > 1;
    if (!greaterThanOne) {
      return (
        <Confirm
          visible={visible || this.state.visible}
          title={'错误信息'}
          type={'warning'}
          content={data && data.message && data.message[0]}
          onCancel={onCancel || this.close}
        />
      );
    }

    return (
      <Modal
        wrapClassName={classNames(styles.container, !greaterThanOne ? styles.container2 : '')}
        centered
        title={this.renderResultsTitle()}
        footer={null}
        onCancel={onCancel || this.close}
        visible={visible || this.state.visible}
        {...this.props}
      >
        {greaterThanOne && (
          <div className={styles.number}>
            <div className={styles.fail}>{data ? data.error : ''}</div>
            <div className={styles.total}>/{data ? data.error + data.success : ''}</div>
          </div>
        )}
        {greaterThanOne && <div className={styles.text}>操作结果失败数据</div>}
        <div className={styles.infoList}>
          <Row>{this.renderCol()}</Row>
        </div>
      </Modal>
    );
  }

  open(errorData) {
    this.setState({
      visible: true,
      errorData,
    });
  }

  close = () => {
    this.setState({
      visible: false,
    });
  };
}
export default OperatingResults;
