import React, { PureComponent, Fragment, ReactElement, ReactNode } from 'react';
import { Upload as AntdUpload } from 'antd';
// import Button, { ButtonProps } from '../Button';
import Gallery from '../Gallery';
import classNames from 'classnames';
import Icon from '../Icon';
import styles from './index.less';
import {
  UploadProps as AntdUploadProps,
  UploadChangeParam,
  UploadFile,
} from 'antd/lib/upload/interface';
import { getBase64 } from '@/utils';
import Button from '../Button';

const { Dragger } = AntdUpload;

export { UploadChangeParam, UploadFile };
export interface UploadProps extends AntdUploadProps {
  uploadType: 'file' | 'picture';
  title?: string;
  fileList?: UploadFile[];
  maxFiles?: Number;
  textContent?: string | ReactElement;
  hiddenList?: boolean;
  icon?: ReactNode;
  onClick?: (event) => void;
}
type image = { src: string };

interface UploadState {
  images: image[];
  previewVisible: boolean;
}

class Upload extends PureComponent<UploadProps, UploadState> {
  constructor(props: Readonly<UploadProps>) {
    super(props);

    this.state = {
      previewVisible: false,
      images: [{ src: '132' }],
    };
  }
  render() {
    const {
      title,
      onChange,
      fileList,
      maxFiles = 1,
      uploadType,
      beforeUpload,
      hiddenList,
      accept,
      onClick,
      icon,
      textContent,
      ...option
    } = this.props;
    const filesCount = (fileList && fileList.length) || 0;
    if (uploadType === 'file') {
      return (
        <AntdUpload
          className={hiddenList ? styles.hiddenList : ''}
          beforeUpload={beforeUpload}
          {...option}
        >
          <Button customtype={'master'}>{title}</Button>
        </AntdUpload>
      );
    }
    return (
      <Fragment>
        <Dragger
          className={classNames(
            { [styles.upload]: true },
            { [styles.hidden]: filesCount >= maxFiles },
          )}
          // className={styles.upload}
          accept={accept || '.jpg,.jpeg,.png,.bmp'}
          onChange={onChange}
          fileList={fileList}
          beforeUpload={beforeUpload || this.beforeUpload}
          onPreview={this.handlePreview}
          listType={'picture-card'}
          {...option}
        >
          <div onClick={onClick}>
            {icon || <Icon type={'plus'} />}
            <p className={styles.title}>{title}</p>
            <p className={styles.subTitle}>
              {textContent ||
                `(单击或拖放文件到此区域上传，最多上传${maxFiles}张，大小不能超过200KB)`}
            </p>
          </div>
        </Dragger>
        <Gallery
          images={this.state.images}
          isOpen={this.state.previewVisible}
          sendToggle={this.handleClose}
        />
      </Fragment>
    );
  }

  beforeUpload = file => {
    return false;
  };

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file);
    }
    const images = [{ src: file.url || file.preview }];
    this.setState({
      images: images,
      previewVisible: true,
    });
  };

  handleClose = (previewVisible: boolean) => {
    this.setState({
      previewVisible: previewVisible,
    });
  };
}
export default Upload;
