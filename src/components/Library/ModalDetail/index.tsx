import React, { PureComponent, ReactNode } from 'react';
import styles from './index.less';
import Modal, { ModalProps } from '../Modal';
import Col from '../Col';
import Row from '../Row';
import Button from '../Button';
import Img from '../Img';
import Icon from '../Icon';

interface DetailProps extends ModalProps {
  items?: any[];
  info: { [propName: string]: any };
  images?: any[];
  actions?: any[];
  remark?: string;
  customRender?: () => ReactNode;
}

class ModalDetail extends PureComponent<DetailProps> {
  constructor(props: Readonly<DetailProps>) {
    super(props);
    this.state = {};
  }

  renderCol = () => {
    const { items } = this.props;
    return (
      items &&
      items.map((item, index) => {
        const col = item.fill ? 24 : 12;
        return (
          <Col span={col} key={`element${index}`}>
            <div className={styles.infoField}>
              <div className={styles.fieldName}>{item.name}</div>
              <div className={styles.fieldValue} title={item.value}>
                {item.value}
              </div>
            </div>
          </Col>
        );
      })
    );
  };

  renderImages = () => {
    const { images = [] } = this.props;
    return images.map(item => {
      return (
        <div className={styles.imageItem} key={item.name}>
          <div className={styles.imageName}>{item.name}</div>
          <Img image={item.url} previewImg={true} />
        </div>
      );
    });
  };

  renderTip = () => {
    const { remark } = this.props;
    if (!remark) return;
    const i = remark.indexOf('[');
    const lastI = remark.lastIndexOf(']') + 1;
    const firstTip = remark.slice(0, i);
    const secondTip = remark.slice(i, lastI);
    const lastTip = remark.slice(lastI);
    return (
      <div className={styles.tip}>
        <Icon
          type={'pm-question-mark'}
          style={{ color: '#FFC96B', padding: '0 8px', fontSize: '22px' }}
        />
        <div>
          {firstTip}
          <span style={{ fontWeight: 'bold' }}>{secondTip}</span>
          {lastTip}
        </div>
      </div>
    );
  };

  renderCustomContent() {
    const { customRender } = this.props;
    return <div className={styles.customContent}>{customRender && customRender()}</div>;
  }

  render() {
    const { actions, items } = this.props;
    let actionsCol: any = null;
    if (actions) actionsCol = this.getAction(actions);
    return (
      <Modal footer={null} wrapClassName={styles.container} centered {...this.props}>
        <div className={styles.content}>
          <div className={styles.imageList}>{this.renderImages()}</div>
          {items && (
            <div className={styles.infoList}>
              <Row>{this.renderCol()}</Row>
            </div>
          )}
          {this.renderTip()}
          {this.renderCustomContent()}
        </div>
        <div className={styles.footer}>{actions && <Row>{actionsCol}</Row>}</div>
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
}
export default ModalDetail;
