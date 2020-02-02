import React, { PureComponent } from 'react';
import { Steps as AntdSteps } from 'antd';
import { StepsProps as AntdStepsProps } from 'antd/lib/steps';
import styles from './index.less';
import classNames from 'classnames';

export interface StepsProps extends AntdStepsProps {}

export default class Steps extends PureComponent<StepsProps> {
  static Step = AntdSteps.Step;

  render() {
    const { className } = this.props;
    return (
      <AntdSteps {...this.props} className={classNames(styles.steps, className)}>
        {this.props.children}
      </AntdSteps>
    );
  }
}

// export default AntdSteps;
