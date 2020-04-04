import React, { Component, RefObject, createRef } from 'react';
import Modal from '../Modal';
import Camera, { PhotoData } from '../Camera';
import { Col, Row, Button, Radio, Icon, Img, RadioGroup } from '..';
import styles from './index.less';
import frameImage from '../assets/images/photo/circle.png';
import soSmallImg from '../assets/images/photo/soSmall.png';
import offsetImg from '../assets/images/photo/offset.png';
import rightImg from '../assets/images/photo/right.png';
interface State {
  visible: boolean;
  devices: MediaDeviceInfo[];
  currentDevice: string;
  picture: string;
}

export default class Photo extends Component<any, State> {
  cameraRef: RefObject<Camera>;

  callback: (data: PhotoData) => void;

  pictureData: PhotoData;

  constructor(props) {
    super(props);
    this.cameraRef = createRef();
    this.state = {
      visible: false,
      devices: [],
      currentDevice: '',
      picture: '',
    };
  }

  renderFooter() {
    return (
      <Button customtype={'master'} disabled={!this.state.picture} onClick={this.confirm}>
        采集
      </Button>
    );
  }

  render() {
    const { visible, currentDevice, devices, picture } = this.state;
    return (
      <Modal
        visible={visible}
        onCancel={this.onCancel}
        footer={this.renderFooter()}
        title={'面部拍照'}
        width={'50%'}
      >
        <Row className={styles.fontColor}>
          <Col span={12} className={styles.cameraContainer}>
            <Row gutter={18} style={{ position: 'relative', margin: 0 }}>
              {/* <div className={styles.frame}></div> */}
              <Img className={styles.frame} image={frameImage} previewImg={true} />
              <Camera
                ref={this.cameraRef}
                className={styles.camera}
                getVideoDevices={this.getVideoDevices}
              />
            </Row>
            <Row gutter={6}>
              <Row gutter={2} className={styles.radio}>
                选择摄像头
                <RadioGroup onChange={this.switchDevice} value={currentDevice}>
                  {devices.map((item, i) => {
                    return (
                      <Radio key={i} value={item.deviceId}>
                        {item.label}
                      </Radio>
                    );
                  })}
                </RadioGroup>
              </Row>
              <Row gutter={4}>
                <Button customtype={'master'} className={styles.button} onClick={this.capture}>
                  <Icon type={'pm-camera'} />
                  拍照
                </Button>
              </Row>
            </Row>
          </Col>
          <Col span={12}>
            <Row>
              <Row>
                照片预览
                <Row>
                  <Col className={styles.images}>
                    <Col className={styles.image}>
                      <Img image={picture} className={styles.image1} previewImg={true} /> 120*120
                    </Col>
                    <Col className={styles.image}>
                      <Img image={picture} className={styles.image2} previewImg={true} />
                      80*80
                    </Col>
                    <Col className={styles.image}>
                      <Img image={picture} className={styles.image3} previewImg={true} />
                      40*40
                    </Col>
                  </Col>
                </Row>
              </Row>
              <Row>
                照片示范
                <Row style={{ display: 'flex' }}>
                  <Img image={rightImg} className={styles.example} />
                  <Img image={offsetImg} className={styles.example} />
                  <Img image={soSmallImg} className={styles.example} />
                </Row>
              </Row>
            </Row>
          </Col>
        </Row>
      </Modal>
    );
  }

  open(callback: (data: PhotoData) => void) {
    this.callback = callback;
    this.setState({
      visible: true,
      picture: '',
    });
    if (this.cameraRef.current) {
      this.cameraRef.current.restart();
    }
  }

  switchDevice = e => {
    if (this.cameraRef.current) {
      this.cameraRef.current.setVideo(e.target.value);
    }
    this.setState({ currentDevice: e.target.value });
  };

  onCancel = () => {
    if (this.cameraRef.current) {
      this.cameraRef.current.stop();
    }
    this.setState({ visible: false });
  };

  capture = async () => {
    if (this.cameraRef.current) {
      const data = await this.cameraRef.current.capture();
      if (data) {
        this.pictureData = data;
        this.setState({
          picture: data.base64,
        });
      }
    }
  };

  getVideoDevices = (devices: MediaDeviceInfo[]) => {
    this.setState({
      devices,
      currentDevice: devices[0].deviceId,
    });
  };

  confirm = () => {
    this.callback(this.pictureData);
    this.onCancel();
  };
}
