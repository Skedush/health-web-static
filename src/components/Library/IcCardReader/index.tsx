import React, { PureComponent } from 'react';
import styles from './index.less';
import { Button, Row, Col, Form, Input, Modal, Img, Message } from '..';
import { connect } from '@/utils/decorators';
import { ERROR_READ_CARD } from '@/utils/message';
import { GlobalState } from '@/common/type';
import icReader from '../assets/images/icReader/icCardMaster.png';
import errorImage1 from '../assets/images/icReader/errorImage1.png';
import errorImage2 from '../assets/images/icReader/errorImage2.png';
import errorImage3 from '../assets/images/icReader/errorImage3.png';
const mapStateToProps = (state: GlobalState) => {
  return {
    state,
    loading: state.loading.effects['app/readIcCard'],
  };
};

interface State {
  visible: boolean;
  currentIcID: string;
}

@connect(
  mapStateToProps,
  null,
  null,
  { forwardRef: true },
)
export default class IcCardReader extends PureComponent<any, State> {
  callback: Function;

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      currentIcID: '',
    };
  }

  open(callback: Function) {
    this.setState({
      visible: true,
      currentIcID: '',
    });
    this.callback = callback;
  }

  icCardChange = e => {
    this.setState({
      currentIcID: e.target.value,
    });
  };

  readIcCard = async () => {
    const data = await this.props.dispatch({ type: 'app/readIcCard' });
    if (!data || typeof data === 'string') {
      Message.warning(ERROR_READ_CARD);
    }
    this.setState({
      currentIcID: data.ICSnr,
    });
  };

  closeIcCard = () => {
    this.setState({
      visible: false,
    });
  };

  submit = () => {
    this.closeIcCard();
    this.callback(this.state.currentIcID);
  };

  renderIcCardModal() {
    const { currentIcID } = this.state;
    return (
      <Button customtype={'master'} disabled={!currentIcID} onClick={this.submit}>
        采集
      </Button>
    );
  }

  render() {
    const { visible, currentIcID } = this.state;
    const { loading } = this.props;
    return (
      <Modal
        visible={visible}
        footer={this.renderIcCardModal()}
        onCancel={this.closeIcCard}
        title={'IC卡录入'}
        width={'50%'}
      >
        <Row>
          <Col span={12} className={styles.right}>
            <Row className={styles.imgContainer}>
              <Img className={styles.image} image={icReader} />
            </Row>
            <Row>
              <Button
                className={styles.readCard}
                onClick={this.readIcCard}
                customtype={'master'}
                loading={loading}
              >
                {loading ? '正在读取中...' : '读取IC卡'}
              </Button>
            </Row>
          </Col>
          <Col span={12} className={styles.left}>
            <Form.Item label={'IC卡编号'}>
              <Input
                value={currentIcID}
                // disabled
                onChange={this.icCardChange}
                placeholder={'卡编号'}
              />
            </Form.Item>
            <Form.Item label={'读卡示范'}>
              <Row className={styles.errorExample}>
                <Img className={styles.errorImage} image={errorImage1} />
                <Img className={styles.errorImage} image={errorImage2} />
                <Img className={styles.errorImage} image={errorImage3} />
              </Row>
            </Form.Item>
          </Col>
        </Row>
      </Modal>
    );
  }
}
