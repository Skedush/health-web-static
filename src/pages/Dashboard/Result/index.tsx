import React, { PureComponent } from 'react';
import { connect } from '@/utils/decorators';
import classNames from 'classnames';
import { FormComponentProps } from '@/components/Library/type';
import { GlobalState, UmiComponentProps, WrappedFormUtils } from '@/common/type';
import { Card, Button, Img, Modal } from '@/components/Library';
import styles from './index.less';
import domtoimage from 'dom-to-image';
import { isEmpty } from 'lodash';

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
      maskClosable: false,
      bodyStyle: {},
      width: '80%',
      height: '50%',
      wrapClassName: 'modal',
    };
    return (
      <div className={classNames('height100', 'flexColStart', 'itemCenter', styles.container)}>
        <div className={styles.title}>健康症状自检结果</div>
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
        {!isEmpty(entryGroups) && len > 1 && (
          <div id={'card'} style={{ width: '100%' }}>
            <Card className={styles.card} title={entryGroups[0].category}>
              {entryGroups[0].entrys.map(entry => (
                <Card.Grid style={{ width: '50%', textAlign: 'center' }} key={entry.id}>
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
                  <Card.Grid style={{ width: '50%', textAlign: 'center' }} key={entry.id}>
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
        {len > 0 && (
          <Card className={styles.card} title={entryGroups[len - 1].category}>
            {entryGroups[len - 1].entrys.map(entry => (
              <Card.Grid style={{ width: '50%', textAlign: 'center' }} key={entry.id}>
                <div className={classNames('flexCenter', 'itemCenter')}>
                  <div className={styles.entry}>{entry.title}&nbsp;</div>
                  <div className={styles.number}>{entry.number}</div>
                </div>
              </Card.Grid>
            ))}
          </Card>
        )}
        <div className={classNames(styles.row, 'flexCenter')}>
          <Button customtype="select" onClick={this.domToImage}>
            分享
          </Button>
        </div>
        <Modal {...modalProps}>
          <Img image={picture} className={styles.image} previewImg={true} />
        </Modal>
      </div>
    );
  }
  cancelModal = () => {
    this.setState({
      modalVisible: false,
    });
  };
  domToImage = async () => {
    const that = this;
    let realCard = document.getElementById('card');
    // let lastCard = realCard.removeChild(realCard.lastChild);
    await domtoimage.toJpeg(realCard, { quality: 0.95 }).then(function(dataUrl) {
      that.setState({
        picture: dataUrl,
        modalVisible: true,
      });
    });
    // realCard = realCard.appendChild(lastCard);
  };
}

export default Result;
