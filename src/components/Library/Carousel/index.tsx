import { Carousel as AntdCarousel } from 'antd';
import { PureComponent } from 'react';
import { CarouselProps as AntCarouselProps } from 'antd/lib/carousel';

export interface CarouselProps extends AntCarouselProps {}

class Carousel extends PureComponent<CarouselProps> {
  carouselRef: AntdCarousel | null;

  render() {
    return (
      <AntdCarousel ref={ins => (this.carouselRef = ins)} {...this.props}>
        {this.props.children}
      </AntdCarousel>
    );
  }

  next() {
    if (this.carouselRef) {
      this.carouselRef.next();
    }
  }

  prev() {
    if (this.carouselRef) {
      this.carouselRef.prev();
    }
  }
}
export default Carousel;
