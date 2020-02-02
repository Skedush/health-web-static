import React, { PureComponent } from 'react';
import { Button, Result } from '@/components/Library';
import { RouteComponentProps } from 'react-router';
import styles from './index.less';
import { router } from '@/utils';

interface RouterParams {
  code?: '403' | '404' | '500';
}

interface ExceptionProps extends RouteComponentProps<RouterParams> {}

class MyException extends PureComponent<ExceptionProps> {
  renderAction = () => {
    return (
      <div>
        <Button customtype={'primary'} onClick={this.onBack}>
          返回首页
        </Button>
      </div>
    );
  };

  render() {
    const {
      match: { params },
    } = this.props;
    const subTitle = params.code === '500' ? '系统出错，请联系管理员' : '页面未找到';
    return (
      <Result
        status={params.code || '404'}
        className={styles.body}
        title={params.code || '404'}
        subTitle={subTitle}
        extra={this.renderAction()}
        // title={code}
        // desc={'抱歉，你无权访问该页面'}
      />
    );
  }

  onBack = () => {
    router.push('/dashboard');
  };
}

export default MyException;
