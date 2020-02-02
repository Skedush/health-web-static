import React, { PureComponent } from 'react';
import styles from './index.less';
import Skip from '../assets/images/usegeGuide/skip.png';
import perButton from '../assets/images/usegeGuide/preButton.png';
import nextButton from '../assets/images/usegeGuide/nextButton.png';
import Part1 from '../assets/images/usegeGuide/part1.png';
import Part2 from '../assets/images/usegeGuide/part2.png';
import Part3 from '../assets/images/usegeGuide/part3.png';
import Part4 from '../assets/images/usegeGuide/part4.png';
import Part5 from '../assets/images/usegeGuide/part5.png';
import { Img } from '..';
import classNames from 'classnames';
import { GlobalState } from '@/common/type';
import { connect } from '@/utils/decorators';

const mapStateToProps = ({ app, helpGlobal }: GlobalState) => ({
  visible: app.usageGuideVisible,
});
interface Props {
  visible?: boolean;
  onCancel: Function;
}

interface State {
  currentIndex: number;
}

@connect(
  mapStateToProps,
  null,
)
export default class UsageGuide extends PureComponent<Props, State> {
  static getDerivedStateFromProps(preProps: Props) {
    if (!preProps.visible) {
      return {
        currentIndex: 0,
      };
    }
    return null;
  }

  images = [Part1, Part2, Part3, Part4, Part5];

  buttonPosition = [
    { top: 245, left: 800 },
    { top: 650, left: 1000 },
    { bottom: 132, left: 400 },
    { top: 220, left: 800 },
    { bottom: 400, left: 300 },
  ];

  constructor(props) {
    super(props);
    this.state = {
      currentIndex: 0,
    };
  }

  renderButton() {
    const { onCancel } = this.props;
    const { currentIndex } = this.state;
    const position = this.buttonPosition[currentIndex];
    return (
      <div className={styles.buttonGroup} style={position}>
        <Img
          noDefaultImg
          onClick={onCancel}
          image={Skip}
          className={classNames(styles.img, styles.skip)}
        />
        {currentIndex !== 0 && (
          <Img noDefaultImg onClick={this.previous} image={perButton} className={styles.img} />
        )}
        {currentIndex < this.images.length && (
          <Img noDefaultImg onClick={this.next} image={nextButton} className={styles.img} />
        )}
      </div>
    );
  }

  render() {
    const { currentIndex } = this.state;
    const { visible } = this.props;
    if (visible) {
      return (
        <div className={styles.usageGuide}>
          {this.renderButton()}
          {this.images.map((item, i) => {
            return (
              <Img
                noDefaultImg
                key={i}
                className={classNames(styles.image, i !== currentIndex ? styles.hidden : '')}
                image={item}
              />
            );
          })}
        </div>
      );
    } else {
      return '';
    }
  }

  next = () => {
    const value = this.state.currentIndex + 1;
    if (value === this.images.length) {
      this.props.onCancel();
    } else {
      this.setState({
        currentIndex: value,
      });
    }
  };

  previous = () => {
    this.setState({
      currentIndex: this.state.currentIndex - 1,
    });
  };
}
