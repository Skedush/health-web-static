import React, { PureComponent } from 'react';
import Carousel, { Modal, ModalGateway } from 'react-images';

interface GalleryProps {
  images: { [key: string]: any }[];
  isOpen: boolean;
  sendToggle: Function;
}

class Gallery extends PureComponent<GalleryProps> {
  constructor(props) {
    super(props);
    this.state = { modalIsOpen: false };
  }

  render() {
    const { isOpen, images } = this.props;
    const styleFn = styleObj => ({ ...styleObj, zIndex: 1000 });
    return (
      <ModalGateway>
        {isOpen ? (
          <Modal
            onClose={this.toggleModal}
            closeOnBackdropClick
            styles={{ blanket: styleFn, positioner: styleFn }}
          >
            <Carousel views={images} />
          </Modal>
        ) : null}
      </ModalGateway>
    );
  }

  toggleModal = e => {
    e.stopPropagation();
    this.props.sendToggle(false);
  };
}

export default Gallery;
