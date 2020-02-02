import React, { PureComponent } from 'react';
import styles from './index.less';

type StepTitleProps = {
  title: string;
};

interface StepTitleState {}

class StepTitle extends PureComponent<any, StepTitleState> {
  constructor(props: Readonly<StepTitleProps>) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    return <div className={styles.title}>{this.props.title}</div>;
  }
}
export default StepTitle;
