import { GlobalState, UmiComponentProps } from '@/common/type';
import { Button, Card, Img, Modal } from '@/components/Library';
import { FormComponentProps, WrappedFormUtils } from '@/components/Library/type';
import { connect } from '@/utils/decorators';
import classNames from 'classnames';
import domtoimage from 'dom-to-image';
import { isEmpty } from 'lodash';
import moment from 'moment';
import React, { PureComponent } from 'react';
import store from 'store';
import styles from './index.less';

const mapStateToProps = ({ result }: GlobalState) => {
  return {
    resultData: result.resultData,
    entryGroups: result.entryGroups,
  };
};

type ResultStateProps = ReturnType<typeof mapStateToProps>;
type ResultProps = ResultStateProps & UmiComponentProps & FormComponentProps;

interface ResultState {
  picture: string;
  modalVisible: boolean;
}

@connect(
  mapStateToProps,
  null,
)
class Result extends PureComponent<ResultProps, ResultState> {
  form: WrappedFormUtils;
  constructor(props: Readonly<ResultProps>) {
    super(props);
    this.state = {
      picture: '',
      modalVisible: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    if (this.props.match.params) {
      dispatch({
        type: 'result/getResult',
        payload: { id: this.props.match.params.id },
      });
    }
  }

  renderTitle(title) {
    return (
      <div className={classNames('flexStart', 'itemBaseline')}>
        {title}
        {title === '病因' && <span className={styles.titleTip}>(仅供参考，不具医学效力)</span>}
      </div>
    );
  }

  // eslint-disable-next-line max-lines-per-function
  render() {
    const { resultData, entryGroups } = this.props;
    const len = entryGroups.length || 0;
    const { picture, modalVisible } = this.state;
    const modalProps = {
      onCancel: this.cancelModal,
      visible: modalVisible,
      title: '分享图片查看',
      destroyOnClose: true,
      centered: true,
      footer: null,
      maskClosable: true,
      bodyStyle: {},
      width: '80%',
      height: '80%',
      wrapClassName: 'modal',
    };
    return (
      <div id={'result'} className={classNames('flexColStart', 'itemCenter', styles.container)}>
        <div className={styles.title}>健康症状自检结果</div>
        <div className={styles.createdTime}>
          提交时间：{moment(resultData.created).format('YYYY-MM-DD HH:mm:ss')}
        </div>

        <div className={classNames('flexBetween', 'itemCenter', styles.row)}>
          <div className={styles.info}>
            姓名：<b>{resultData.name}</b>
          </div>
          <div className={styles.info}>手机：{resultData.phone}</div>
        </div>
        <div className={classNames(styles.row)}>地址：{resultData.address}</div>
        <div className={classNames('flexBetween', 'itemCenter', styles.row)}>
          <div className={styles.info}>年龄：{resultData.age}</div>
          <div className={styles.info}>性别：{resultData.gender === '1' ? '男' : '女'}</div>
        </div>
        <div className={classNames('flexBetween', 'itemCenter', styles.row)}>
          <div className={styles.info}>身高：{resultData.height}</div>
          <div className={styles.info}>体重：{resultData.weight}</div>
        </div>
        <div className={classNames('flexBetween', 'itemCenter', styles.row)}>
          <div className={styles.info}>腰围：{resultData.waistline}</div>
          <div className={styles.info}>血糖：{resultData.blood_sugar}</div>
        </div>
        <div className={classNames('flexBetween', 'itemCenter', styles.row)}>
          <div className={styles.info}>收缩压：{resultData.systolic_pressure}</div>
          <div className={styles.info}>舒张压：{resultData.diastolic_pressure}</div>
        </div>
        <div className={classNames(styles.row)}>
          <div>备注或其他症状：{resultData.remark}</div>
        </div>
        {len > 0 && (
          <Card className={styles.card} title={this.renderEntrysTitle(entryGroups[len - 1])}>
            {entryGroups[len - 1].entrys.map(entry => (
              <Card.Grid
                onClick={() => this.nav(entry)}
                style={{ width: '50%', textAlign: 'center' }}
                key={entry.id}
              >
                <div className={classNames('flexCenter', 'itemCenter')}>
                  <div className={styles.entry}>{entry.title}&nbsp;</div>
                  <div className={styles.number}>{entry.number}</div>
                </div>
              </Card.Grid>
            ))}
          </Card>
        )}

        {!isEmpty(entryGroups) && len > 1 && (
          <div id={'card'} style={{ width: '100%' }}>
            <Card className={styles.card} title={this.renderTitle(entryGroups[0].category)}>
              {entryGroups[0].entrys.map(entry => (
                <Card.Grid
                  onClick={() => this.nav(entry)}
                  style={{ width: '50%', textAlign: 'center' }}
                  key={entry.id}
                >
                  <div className={classNames('flexCenter', 'itemCenter')}>
                    <div className={styles.entry}>{entry.title}&nbsp;</div>
                    <div className={styles.number}>{entry.number}</div>
                  </div>
                </Card.Grid>
              ))}
            </Card>
            {len > 2 && (
              <Card className={styles.card} title={entryGroups[1].category}>
                {entryGroups[1].entrys.map(entry => (
                  <Card.Grid
                    onClick={() => this.nav(entry)}
                    style={{ width: '50%', textAlign: 'center' }}
                    key={entry.id}
                  >
                    <div className={classNames('flexCenter', 'itemCenter')}>
                      <div className={styles.entry}>{entry.title}&nbsp;</div>
                      <div className={styles.number}>{entry.number}</div>
                    </div>
                  </Card.Grid>
                ))}
              </Card>
            )}
          </div>
        )}
        <div className={classNames(styles.row, 'flexCenter')}>
          <Button customtype={'select'} onClick={this.domToImage}>
            分享
          </Button>
        </div>
        <Modal {...modalProps}>
          <Img image={picture} className={styles.image} previewImg={true} />
        </Modal>
      </div>
    );
  }

  renderEntrysTitle(entryGroup) {
    return (
      <div>
        <span>{entryGroup.category}</span>
        <span className={styles.entryCount}>共{entryGroup.entrys.length}个症状</span>
      </div>
    );
  }
  nav = entry => {
    const userInfo = store.get('userInfo');
    const { fxId } = userInfo;
    window.open(`http://${fxId}.cjsq.net/xx/ShowArticle.asp?ArticleID=${entry.remark}`);
  };

  cancelModal = () => {
    this.setState({
      modalVisible: false,
    });
  };
  domToImage = async () => {
    const that = this;
    let realCard: any = document.getElementById('result');
    const lastCard = realCard!.removeChild(realCard.lastChild);
    await domtoimage.toJpeg(realCard, { quality: 1 }).then(function(dataUrl) {
      that.setState({
        picture: dataUrl,
        modalVisible: true,
      });
    });
    realCard = realCard!.appendChild(lastCard);
  };
}

export default Result;
