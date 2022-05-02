/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
/* eslint-disable no-dupe-class-members */
import { GlobalState, UmiComponentProps } from '@/common/type';
import { Button, Card, Img, Modal, Spin, Tooltip } from '@/components/Library';
import { FormComponentProps, WrappedFormUtils } from '@/components/Library/type';
import { connect } from '@/utils/decorators';
import { Tag } from 'antd';
import classNames from 'classnames';
import domtoimage from 'dom-to-image';
import moment from 'moment';
import React, { PureComponent } from 'react';
import store from 'store';
import styles from './index.less';

const mapStateToProps = ({ common, compare, loading: { effects } }: GlobalState) => {
  return {
    entryInfoDetail: common.entryInfoDetail,
    userEntrys: compare.userEntrys,
    getEntryInfoDetailLoading: effects['common/getEntryInfoDetail'],
    getUserEntryDetailLoading: effects['common/getUserEntry'],
  };
};

type CompareStateProps = ReturnType<typeof mapStateToProps>;
type CompareProps = CompareStateProps & UmiComponentProps & FormComponentProps;

interface CompareState {
  id: string;
  oneId: string;
  twoId: string;
  picture: string;
  modalVisible: boolean;
}

@connect(
  mapStateToProps,
  null,
)
class Compare extends PureComponent<CompareProps, CompareState> {
  form: WrappedFormUtils;

  constructor(props: Readonly<CompareProps>) {
    super(props);
    this.state = {
      id: '',
      oneId: '',
      twoId: '',
      picture: '',
      modalVisible: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    // const userInfo = store.get('userInfo');
    if (this.props.match.params) {
      this.setState(
        {
          id: this.props.match.params.id,
          oneId: this.props.match.params.oneId,
          twoId: this.props.match.params.twoId,
        },
        () => {
          dispatch({
            type: 'common/getEntryInfoDetail',
            payload: { id: this.props.match.params.id },
          });
          dispatch({
            type: 'compare/getTwiceUserEntryDetail',
            payload: [this.props.match.params.oneId, this.props.match.params.twoId].sort(),
          });
        },
      );
    }
  }

  renderTitle(category) {
    return (
      <div className={classNames('flexStart', 'itemBaseline')}>
        <div className={styles.title} onClick={() => this.navCategory(category)}>
          {category.name}
        </div>
        {category.name === '病因' && (
          <span className={styles.titleTip}>(仅供参考，不具医学效力)</span>
        )}
      </div>
    );
  }

  // eslint-disable-next-line max-lines-per-function
  render() {
    const {
      entryInfoDetail,
      getEntryInfoDetailLoading,
      userEntrys,
      getUserEntryDetailLoading,
    } = this.props;
    const perCommit = userEntrys[0] || {};
    const thisCommit = userEntrys[1] || {};
    const { picture, modalVisible } = this.state;
    const userInfo = store.get('userInfo');
    const { isStaff } = userInfo;
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
      <div className={classNames('height100', 'flexColStart', 'itemCenter', styles.container)}>
        <Spin
          tip="请求数据中，稍等3-10秒..."
          spinning={!!getEntryInfoDetailLoading || !!getUserEntryDetailLoading}
        >
          <div id={'result'} className={classNames('flexColStart', 'itemCenter', styles.container)}>
            <div className={styles.title}>
              {entryInfoDetail && entryInfoDetail.title
                ? entryInfoDetail.title.title_name
                : '健康症状自检表'}
            </div>
            <div className={classNames(styles.legend, 'flexAround', 'itemCenter')}>
              <Tag color="#108ee9">上次</Tag>
              <Tag color="#f09000">近次</Tag>
              <Tag color="#FF0000">两次都有</Tag>
            </div>
            <div className={classNames('flexBetween', 'itemCenter', styles.createdTime)}>
              提交时间：
              <div className={classNames('flexColBetween', 'itermCenter')}>
                <span className={styles.perColor}>
                  {moment(perCommit.created).format('YYYY-MM-DD HH:mm:ss')}
                </span>
                <span className={styles.thisColor}>
                  {moment(thisCommit.created).format('YYYY-MM-DD HH:mm:ss')}
                </span>
              </div>
            </div>

            {isStaff && (
              <>
                <div className={classNames('flexBetween', 'itemCenter', styles.row)}>
                  <div className={classNames('flexStart', styles.info, 'itemCenter')}>
                    姓名：
                    <div className={classNames('flexColBetween', 'itermCenter')}>
                      <span className={styles.perColor}>{perCommit.name}</span>
                      <span className={styles.thisColor}>{thisCommit.name}</span>
                    </div>
                  </div>
                  <div className={classNames('flexStart', styles.info, 'itemCenter')}>
                    手机：
                    <div className={classNames('flexColBetween', 'itermCenter')}>
                      <span className={styles.perColor}>{perCommit.phone}</span>
                      <span className={styles.thisColor}>{thisCommit.phone}</span>
                    </div>
                  </div>
                </div>
                <div className={classNames(styles.row, 'flexStart', 'itemCenter')}>
                  地址：
                  <div className={classNames('flexColBetween', 'itermCenter')}>
                    <span className={styles.perColor}>{perCommit.address}</span>
                    <span className={styles.thisColor}>{thisCommit.address}</span>
                  </div>
                </div>
                <div className={classNames('flexBetween', 'itemCenter', styles.row)}>
                  <div className={classNames('flexStart', styles.info, 'itemCenter')}>
                    年龄：
                    <div className={classNames('flexColBetween', 'itermCenter')}>
                      <span className={styles.perColor}>{perCommit.age}</span>
                      <span className={styles.thisColor}>{thisCommit.age}</span>
                    </div>
                  </div>
                  <div className={classNames('flexStart', styles.info, 'itemCenter')}>
                    性别：
                    <div className={classNames('flexColBetween', 'itermCenter')}>
                      <span className={styles.perColor}>
                        {perCommit.gender === '1' ? '男' : '女'}
                      </span>
                      <span className={styles.thisColor}>
                        {thisCommit.gender === '1' ? '男' : '女'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className={classNames('flexBetween', 'itemCenter', styles.row)}>
                  <div className={classNames('flexStart', styles.info, 'itemCenter')}>
                    身高：
                    <div className={classNames('flexColBetween', 'itermCenter')}>
                      <span className={styles.perColor}>{perCommit.height}</span>
                      <span className={styles.thisColor}>{thisCommit.height}</span>
                    </div>
                  </div>
                  <div className={classNames('flexStart', styles.info, 'itemCenter')}>
                    体重：
                    <div className={classNames('flexColBetween', 'itermCenter')}>
                      <span className={styles.perColor}>{perCommit.weight}</span>
                      <span className={styles.thisColor}>{thisCommit.weight}</span>
                    </div>
                  </div>
                </div>
                <div className={classNames('flexBetween', 'itemCenter', styles.row)}>
                  <div className={classNames('flexStart', styles.info, 'itemCenter')}>
                    腰围：
                    <div className={classNames('flexColBetween', 'itermCenter')}>
                      <span className={styles.perColor}>{perCommit.waistline}</span>
                      <span className={styles.thisColor}>{thisCommit.waistline}</span>
                    </div>
                  </div>
                  <div className={classNames('flexStart', styles.info, 'itemCenter')}>
                    血糖：
                    <div className={classNames('flexColBetween', 'itermCenter')}>
                      <span className={styles.perColor}>{perCommit.blood_sugar}</span>
                      <span className={styles.thisColor}>{thisCommit.blood_sugar}</span>
                    </div>
                  </div>
                </div>
                <div className={classNames('flexBetween', 'itemCenter', styles.row)}>
                  <div className={classNames('flexStart', styles.info, 'itemCenter')}>
                    收缩压：
                    <div className={classNames('flexColBetween', 'itermCenter')}>
                      <span className={styles.perColor}>{perCommit.systolic_pressure}</span>
                      <span className={styles.thisColor}>{thisCommit.systolic_pressure}</span>
                    </div>
                  </div>
                  <div className={classNames('flexStart', styles.info, 'itemCenter')}>
                    舒张压：
                    <div className={classNames('flexColBetween', 'itermCenter')}>
                      <span className={styles.perColor}>{perCommit.diastolic_pressure}</span>
                      <span className={styles.thisColor}>{thisCommit.diastolic_pressure}</span>
                    </div>
                  </div>
                </div>
              </>
            )}
            {(perCommit.remark || thisCommit.remake) && (
              <div className={classNames(styles.row)}>
                <div>
                  备注或其他症状：
                  <div className={classNames('flexColBetween', 'itermCenter')}>
                    <span className={styles.perColor}>{perCommit.remark}</span>
                    <span className={styles.thisColor}>{thisCommit.remark}</span>
                  </div>
                </div>
              </div>
            )}

            <div id={'card'} style={{ width: '100%' }}>
              <Card
                className={styles.card}
                title={this.renderTitle(entryInfoDetail.category || {})}
              >
                {entryInfoDetail.entrys.map(entry => {
                  return (
                    <Card.Grid
                      // onClick={() => this.nav(entry)}
                      style={{ textAlign: 'center' }}
                      key={entry.id}
                      className={this.getCardGridClassName(entry.id)}
                    >
                      <Tooltip placement="top" title={entry.title} trigger="click">
                        <div className={classNames('flexCenter', 'itemCenter')}>
                          <div className={'textOverflow'}>{entry.title}</div>
                        </div>
                      </Tooltip>
                    </Card.Grid>
                  );
                })}
              </Card>
            </div>
            <div className={classNames(styles.row, 'flexCenter')}>
              <Button customtype={'select'} onClick={this.domToImage}>
                分享
              </Button>
            </div>
            <Modal {...modalProps}>
              <Img image={picture} className={styles.image} previewImg={true} />
            </Modal>
          </div>
        </Spin>
      </div>
    );
  }

  getCardGridClassName = id => {
    const { userEntrys } = this.props;
    const perCommit = userEntrys[0];
    const thisCommit = userEntrys[1];
    if (!perCommit || !thisCommit) {
      return '';
    }
    if (perCommit.entryship.includes(id) && thisCommit.entryship.includes(id)) {
      return styles.bothBackground;
    } else if (perCommit.entryship.includes(id)) {
      return styles.perBackground;
    } else if (thisCommit.entryship.includes(id)) {
      return styles.thisBackground;
    } else {
      return '';
    }
  };

  navCategory = category => {
    const userInfo = store.get('userInfo');
    const { protocol, link } = category;
    const { fxId } = userInfo;
    if (category.has_user_rule) {
      window.open(`${protocol}${fxId}${link}`);
    } else {
      window.open(`${protocol}${link}`);
    }
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

export default Compare;
