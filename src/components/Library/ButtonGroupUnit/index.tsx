import React, { PureComponent, Fragment } from 'react';
import styles from './index.less';
import Button from '../Button';

interface ButtonProps {
  customtype?: string;
  icon?: string;
  title: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

interface ButtonGroupProps {
  actions: ButtonProps[];
}

class ButtonGroup extends PureComponent<ButtonGroupProps> {
  constructor(props: Readonly<ButtonGroupProps>) {
    super(props);

    this.state = {};
  }

  render() {
    const { actions } = this.props;
    if (!actions) {
      return null;
    }

    const actionsElements = this.getAction(actions);

    return (
      <Fragment>
        <div className={styles.ButtonGroupHeader}>信息筛选</div>

        <div className={styles.actionWrapper}>
          <div className={styles.btnWrapper}>{actionsElements}</div>
        </div>
      </Fragment>
    );
  }

  getAction = (actions: ButtonProps[]) => {
    if (!Array.isArray(actions)) {
      console.error('data of from action is not array');
      return null;
    }

    return actions.map((item, index) => {
      const { title } = item;

      return (
        <Button key={`actionBtn${index}`} {...item}>
          {title}
        </Button>
      );
    });
  };
}

export default ButtonGroup;
