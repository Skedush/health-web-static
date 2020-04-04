import React, { PureComponent } from 'react';
import Img from 'react-image';
import styles from './index.less';
import Gallery from '../Gallery';
import classNames from 'classnames';
import defaultImg from '../assets/images/defaultuser.png';
import defaultImg2 from '../assets/images/defaultImg2.png';
export interface ImgProps {
  image: string;
  previewImg?: boolean;
  onClick?: Function;
  defaultImg?: string;
  className?: any;
  type?: 'others';
  noDefaultImg?: boolean;
}
type image = { src: string };

interface ImgState {
  image: image[];
  openImage: boolean;
}
class Image extends PureComponent<ImgProps, ImgState> {
  static defaultProps: Partial<ImgProps> = {
    defaultImg: defaultImg,
    className: styles.defaultImgClass,
  };
  constructor(props: Readonly<ImgProps>) {
    super(props);
    this.state = {
      image: [],
      openImage: false,
    };
  }

  render() {
    const {
      image,
      defaultImg,
      type,
      className,
      previewImg = false,
      noDefaultImg,
      ...option
    } = this.props;
    const defaultImage = noDefaultImg ? '' : type === 'others' ? defaultImg2 : defaultImg;
    return (
      <div className={classNames(className, styles.box)} onClick={this.onClick}>
        <Img
          src={[image]}
          loader={<Img src={[defaultImage]} className={styles.image} />}
          unloader={<Img src={[defaultImage]} className={styles.image} />}
          onClick={
            previewImg ? e => this.sendImage(image || (defaultImage as string), e) : () => {}
          }
          className={classNames(styles.image, className)}
          {...option}
        />
        <Gallery
          images={this.state.image}
          isOpen={this.state.openImage}
          sendToggle={this.handleClose}
        />
      </div>
    );
  }

  onClick = (...arg) => {
    if (this.props.onClick) {
      this.props.onClick(...arg);
    }
  };

  sendImage = (image: string, e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    this.setState({
      image: [{ src: image }],
      openImage: true,
    });
  };

  handleClose = () => {
    this.setState({
      openImage: false,
    });
  };
}

export default Image;
