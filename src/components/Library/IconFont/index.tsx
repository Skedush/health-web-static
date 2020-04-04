import React, { PureComponent } from 'react';
import classNames from 'classnames';

interface IconFontProps {
  style: object;
  type: string;
}

class IconFont extends PureComponent<IconFontProps> {
  defaultStyle: object;
  constructor(props) {
    super(props);

    this.defaultStyle = {
      color: 'white',
    };
  }

  render() {
    const { type, style, ...option } = this.props;

    return (
      <i
        className={classNames('iconfont', type)}
        style={{ ...this.defaultStyle, ...style }}
        {...option}
      />
    );
  }
}

export default IconFont;
