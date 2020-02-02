import React, { PureComponent, RefObject, createRef } from 'react';
import { base64ToFile } from '@/utils';
import styles from './index.less';
import { UploadFile } from '../type';
import classNames from 'classnames';

interface Props {
  fileType?: 'file';
  className?: any;
  getVideoDevices?: (devices: MediaDeviceInfo[]) => void;
  cameraDidMount?: Function;
}

interface State {
  devices: MediaDeviceInfo[];
}

export interface PhotoData {
  file: File;
  base64: string;
  uploadFile?: UploadFile;
}
export default class Camera extends PureComponent<Props, State> {
  videoElement: RefObject<HTMLVideoElement>;

  cameraDevices: MediaDeviceInfo[] = [];

  currentDeviceId: string;

  currentMediaStream: MediaStream;

  get getUserMedia() {
    const navigatorIns: any = navigator;
    return (
      (navigator && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) ||
      navigatorIns.webkitGetUserMedia ||
      navigatorIns.mozGetUserMedia ||
      navigatorIns.msGetUserMedia
    );
  }

  constructor(props) {
    super(props);
    this.videoElement = createRef();
    this.state = {
      devices: [],
    };
  }

  async componentDidMount() {
    await this.getCameras();

    this.videoLoadStream();

    if (this.props.cameraDidMount) {
      this.props.cameraDidMount();
    }
  }

  async getCameras() {
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      const devices = await navigator.mediaDevices.enumerateDevices();

      this.cameraDevices = devices.filter(item => item.kind === 'videoinput');
      this.setState({ devices: this.cameraDevices });

      if (this.props.getVideoDevices) {
        this.props.getVideoDevices(this.cameraDevices);
      }

      if (this.cameraDevices.length) {
        this.currentDeviceId = this.cameraDevices[0].deviceId;
      }
    }
  }

  public async capture(): Promise<PhotoData | null> {
    if (!this.videoElement) {
      return Promise.resolve(null);
    }

    if (this.videoElement.current) {
      const video = this.videoElement.current;
      const canvas = document.createElement('canvas');
      const aspectRatio = video.videoWidth / video.videoHeight;

      const canvasWidth = video.clientWidth;
      const canvasHeight = canvasWidth / aspectRatio;

      canvas.width = canvasHeight;
      canvas.height = canvasHeight;

      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.translate(0, 0);
        ctx.scale(-1, 1);
        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(video, canvasWidth * 0.25 - canvasWidth, 0, canvasWidth, canvasHeight);
      }

      const photo = canvas.toDataURL('image/jpeg');

      const file = await base64ToFile(photo, 'png');

      const uploadFile: any = file;
      uploadFile.uid = '1';
      uploadFile.url = photo;

      return Promise.resolve({ file, base64: photo, uploadFile });
    } else {
      return Promise.resolve(null);
    }
  }

  public setVideo(deviceId) {
    this.deviceChange(deviceId);
  }

  deviceChange = deviceId => {
    this.currentDeviceId = deviceId;
    this.videoLoadStream();
  };

  videoLoadStream() {
    this.stop(); // 每次加载新摄像头数据流时关闭上个流的数据
    const constraints = {
      video: { deviceId: { ideal: this.currentDeviceId }, width: 1280, height: 720 },
    };
    const navigatorIns: any = navigator;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia(constraints).then(this.loadStream);
    } else if (navigatorIns.webkitGetUserMedia) {
      navigatorIns.webkitGetUserMedia(constraints, this.loadStream);
    }
  }

  loadStream = stream => {
    this.currentMediaStream = stream;
    if (this.videoElement.current) {
      this.videoElement.current.srcObject = stream;
    }
  };

  public stop() {
    if (this.currentMediaStream) {
      this.currentMediaStream.getTracks().forEach(track => {
        track.stop();
      });
    }
    if (
      this.videoElement.current &&
      this.videoElement.current.srcObject &&
      this.videoElement.current.srcObject instanceof MediaStream
    ) {
      this.videoElement.current.srcObject.getTracks().forEach(track => {
        track.stop();
      });
    }
  }

  async restart() {
    this.stop();
    await this.getCameras();
    this.videoLoadStream();
    if (this.props.cameraDidMount) {
      this.props.cameraDidMount();
    }
  }

  render() {
    const { className } = this.props;
    return (
      <div className={classNames(styles.body, className)}>
        <video
          autoPlay
          playsInline
          className={styles.video}
          ref={this.videoElement}
          height={'100%'}
        />
      </div>
    );
  }
}
