import React, { PureComponent, Fragment } from 'react';
import styles from './index.less';
import Button from '../Button';
import classNames from 'classnames';

interface ButtonProps {
  customtype?: string;
  render?: Function;
  icon?: string;
  title?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

interface ButtonGroupProps {
  actions: ButtonProps[];
  titleVisible?: boolean;
  flexState?: 'left' | 'right';
  title?: string;
}

class ButtonGroup extends PureComponent<ButtonGroupProps> {
  constructor(props: Readonly<ButtonGroupProps>) {
    super(props);

    this.state = {};
  }

  render() {
    const { actions, titleVisible, title, flexState = 'left' } = this.props;
    if (!actions) {
      return null;
    }

    const actionsElements = this.getAction(actions);

    return (
      <Fragment>
        {titleVisible && <div className={styles.ButtonGroupHeader}>{title || '信息筛选'}</div>}
        {/* <div className={styles.ButtonGroupHeader}>信息展示</div> */}
        <div
          className={classNames(
            styles.actionWrapper,
            flexState === 'left' ? 'flexStart' : 'flexEnd',
          )}
        >
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
      if (item.customtype === 'custom' && item.render) {
        return item.render();
      }

      return (
        <Button key={`actionBtn${index}`} {...item}>
          {title}
        </Button>
      );
    });
  };
}

export default ButtonGroup;
