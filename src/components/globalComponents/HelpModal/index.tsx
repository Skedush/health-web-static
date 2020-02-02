import React, { PureComponent } from 'react';
import styles from './index.less';
import classNames from 'classnames';
// import { connect } from '@/utils/decorators';
import { HelpGlobalState } from '@/models/helpGlobal';
import { Modal, Button, Icon, Img } from '@/components/Library';
import Config from '@/utils/config';
import parse from 'url-parse';
import { saveAs } from 'file-saver';
import request from '@/utils/request';
// import { GlobalState } from '@/common/type';
// const mapStateToProps = ({ helpGlobal }: GlobalState) => ({
//   helpData: helpGlobal.helpData,
// });

// type HelpFormStateProps = ReturnType<typeof mapStateToProps>;
type HelpFormProps = {
  helpVisible: boolean;
  cancelHelp: Function;
  helpData: HelpGlobalState['helpData'];
};
// @connect(
//   mapStateToProps,
//   null,
// )
export default class HelpModal extends PureComponent<HelpFormProps, any> {
  constructor(props: Readonly<HelpFormProps>) {
    super(props);
    this.state = {};
  }

  renderFooter() {
    return (
      <div className={styles.helpFooter}>
        <Button customtype={'master'} onClick={this.uploadAll}>
          <Icon type={'vertical-align-bottom'} />
          全部下载
        </Button>
        <Button customtype={'second'} onClick={this.cancelHelp}>
          关闭
        </Button>
      </div>
    );
  }
  render() {
    const { helpVisible } = this.props;
    const { helpData } = this.props;

    let cpt: React.ReactNode = null;
    if (helpData && helpData.length > 0) {
      cpt = helpData.map(item => {
        return (
          <div className={classNames(styles.item, 'flexColCenter', 'itemCenter')} key={item.id}>
            <Img className={styles.img} image={require(`@/assets/images/${item.icon}.png`)} />
            <div className={styles.name} title={item.name}>
              {item.name}
            </div>
            <Button
              customtype={'master'}
              className={styles.buttonUpload}
              onClick={() => {
                this.upload(item.url, item.name);
              }}
            >
              下载
            </Button>
          </div>
        );
      });
    }

    return (
      <Modal
        title="操作指南下载"
        visible={helpVisible}
        onCancel={this.cancelHelp}
        footer={this.renderFooter()}
        width={'50%'}
        wrapClassName={styles.helpBox}
      >
        <div className={classNames(styles.helpModal, 'flexStart')}>{cpt}</div>
      </Modal>
    );
  }
  cancelHelp = () => {
    this.props.cancelHelp();
  };
  upload = (url, name) => {
    this.funDownload(url, name);
  };
  funDownload = (url, filename) => {
    // 资源文件url地址可能存在只有相对路径
    const parseUrl = parse(url, {});
    if (!parseUrl.protocol) {
      url = `${Config.apiPrefix}/${url}`;
    }

    const extension = url.substring(url.lastIndexOf('.'), url.length);
    filename = `${filename}${extension}`;
    request({
      url: url,
      responseType: 'blob',
    }).then(res => {
      if (res && res.data) {
        saveAs(res.data, filename);
      }
    });
  };
  uploadAll = () => {
    const { helpData } = this.props;

    if (helpData) {
      helpData.map(item => {
        console.log('item', item);
        this.funDownload(item.url, item.name);
      });
    }
  };
}
