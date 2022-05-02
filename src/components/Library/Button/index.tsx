import { Button as AntdButton } from 'antd';
import { ButtonProps as AntButtonProps, ButtonType } from 'antd/lib/button/button';
import React, { PureComponent } from 'react';
import styles from './index.less';

const ButtonTypes = ['default', 'primary', 'ghost', 'dashed', 'danger', 'link'];
const isButtonType = (x: any): x is ButtonType => ButtonTypes.includes(x);

export type ButtonProps = {
  customtype?: string;
  className?: string;
} & AntButtonProps;

interface State {
  loading: boolean;
}

class Button extends PureComponent<ButtonProps, State> {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  onClick = async event => {
    const { onClick } = this.props;
    if (onClick) {
      const response: Promise<any> | any = onClick(event);
      if (response instanceof Promise) {
        this.setState({ loading: true });
        try {
          await response;
        } finally {
          this.setState({ loading: false });
        }
      }
    }
  };

  render() {
    const { customtype, className, loading } = this.props;
    const loadingStatus = this.state.loading || loading;

    let cn = className;

    if (customtype && !isButtonType(customtype)) {
      cn = className ? `${className} ${styles[customtype]}` : `${styles[customtype]}`;
    }

    return (
      <AntdButton {...this.props} loading={loadingStatus} onClick={this.onClick} className={cn} />
    );
  }
}

export default Button;
