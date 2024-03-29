import { GlobalState, UmiComponentProps } from '@/common/type';
import { Button, Card, FormSimple, Img, Message, Modal, Spin } from '@/components/Library';
import { FormComponentProps, WrappedFormUtils } from '@/components/Library/type';
import { connect } from '@/utils/decorators';
import classNames from 'classnames';
import domtoimage from 'dom-to-image';
import { isEmpty } from 'lodash';
import moment from 'moment';
import React, { PureComponent } from 'react';
import store from 'store';
import urlencode from 'urlencode';
import Graph from './components/Graph';
import Pie from './components/Pie';
import styles from './index.less';

const mapStateToProps = ({ result, loading: { effects } }: GlobalState) => {
  return {
    resultData: result.resultData,
    entryGroups: result.entryGroups,
    resultLoading: effects['result/getResult'],
    updateUserEntryLoading: effects['result/updateUserEntry'],
  };
};

type ResultStateProps = ReturnType<typeof mapStateToProps>;
type ResultProps = ResultStateProps & UmiComponentProps & FormComponentProps;

interface ResultState {
  picture: string;
  pieModalVisible: boolean;
  modalVisible: boolean;
  pieData: any;
  graphModalVisible: boolean;
  graphData: any;
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
      pieModalVisible: false,
      pieData: {},
      graphModalVisible: false,
      graphData: {},
    };
  }

  componentDidMount() {
    this.getData();
  }

  async getData() {
    const { dispatch } = this.props;
    if (this.props.match.params) {
      const res = await dispatch({
        type: 'result/getResult',
        payload: { id: this.props.match.params.id },
      });

      this.getGraphData(res);
    }
  }
  getGraphData(res: any) {
    const categories: any[] = [];
    const links: any[] = [];
    const nodes: any[] = [];
    res.forEach((item, index) => {
      categories.push(item.category);
      if (item.entrys && item.entrys.length > 0) {
        item.entrys.forEach(entry => {
          if (entry.number > entry.category.show_count || !entry.number) {
            nodes.push({
              name: entry.title,
              category: index,
              value: entry.number || '',
              id: entry.id + '',
              symbolSize: entry.number > 80 ? 100 : entry.number < 10 ? 10 : entry.number || 30,
            });
          }

          if (entry.entrys && entry.entrys.length > 0) {
            entry.entrys.forEach(subEntry => {
              links.push({
                source: entry.id + '',
                target: subEntry.id + '',
                label: {
                  show: false,
                },
                ignoreForceLayout: true,
              });
            });
          }
        });
      }
    });
    this.setState({
      graphData: {
        categories,
        links,
        nodes,
      },
    });
  }

  getHealthFormProps = () => {
    const { updateUserEntryLoading } = this.props;
    const items: any = [
      {
        type: 'textArea',
        field: 'suggestion',
        span: 24,
        autoSize: { minRows: 3, maxRows: 8 },
        maxLength: 1024,
        rules: [{ required: true, message: '请填写参考意见！' }],
        placeholder: '调理方案及备注（可多次提交升级补充方案）',
        label: '',
      },
    ];
    return {
      items: items,
      className: styles.form,
      onGetFormRef: this.onGetFormRef,
      onSubmit: this.onFormSubmit,
      actions: [
        {
          customtype: 'select',
          title: '提交意见',
          loading: !!updateUserEntryLoading,
          htmlType: 'submit' as 'submit',
        },
      ],
    };
  };

  onGetFormRef = (form: WrappedFormUtils) => {
    this.form = form;
  };

  onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault();
    }
    const { resultData } = this.props;
    this.form.validateFields(async (err, fieldsValue) => {
      if (err) return;
      fieldsValue.id = resultData.id;
      fieldsValue.suggestion =
        moment().format('YYYY-MM-DD HH:mm') +
        ':\n' +
        fieldsValue.suggestion +
        (resultData.suggestion ? '\n\n' + resultData.suggestion : '');
      const res = await this.props.dispatch({
        type: 'result/updateUserEntry',
        payload: fieldsValue,
      });
      if (res && res.success) {
        Message.success('提交成功');
        this.form.setFieldsValue({
          suggestion: undefined,
        });
        this.getData();
      }
    });
  };

  renderTitle(item, index) {
    const { category = {} } = item;
    return (
      <div className={classNames('flexStart', 'itemBaseline')}>
        <div className={styles.title} onClick={() => this.navCategory(category)}>
          {category.name}
        </div>
        {category.name === '病因' && (
          <span className={styles.titleTip}>(仅供参考，不具医学效力)</span>
        )}
        <div className={classNames('flexAuto', 'flexEnd')}>
          <Button
            customtype="icon"
            icon={index === 0 ? 'radar-chart' : 'pie-chart'}
            onClick={() => (index === 0 ? this.showGraphModal() : this.showPieModal(item))}
          />
        </div>
      </div>
    );
  }

  showGraphModal = () => {
    this.setState({
      graphModalVisible: true,
    });
  };
  showPieModal = (pieData): void => {
    this.setState({
      pieData,
      pieModalVisible: true,
    });
  };

  renderImgModal() {
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
      <Modal {...modalProps}>
        <Img image={picture} className={styles.image} previewImg={true} />
      </Modal>
    );
  }

  renderPieModal() {
    const { pieModalVisible, pieData } = this.state;
    if (!pieData || !pieModalVisible) return null;
    const name = pieData && pieData.category ? pieData.category.name : '';
    const modalProps = {
      onCancel: this.cancelModal,
      visible: pieModalVisible,
      title: `${name}统计`,
      destroyOnClose: true,
      centered: true,
      footer: null,
      maskClosable: true,
      bodyStyle: {},
      width: '100%',
      height: '90%',
      wrapClassName: 'modal',
    };

    const data: any = {
      category: pieData.category.name,
      seriesData: [],
      legendData: [],
    };
    pieData.entrys.forEach(item => {
      data.seriesData.push({ name: item.title, value: item.number });
      data.legendData.push(item.title);
    });

    return (
      <Modal {...modalProps}>
        <Pie data={data} />
      </Modal>
    );
  }

  renderGraphModal() {
    const { graphModalVisible, graphData } = this.state;
    if (isEmpty(graphData) || !graphModalVisible) return null;
    const modalProps = {
      onCancel: this.cancelModal,
      visible: graphModalVisible,
      title: '总关系图',
      destroyOnClose: true,
      centered: true,
      footer: null,
      maskClosable: true,
      bodyStyle: {},
      width: '100%',
      height: '90%',
      wrapClassName: 'modal',
    };

    return (
      <Modal {...modalProps}>
        <Graph data={graphData} />
      </Modal>
    );
  }

  renderBaseInfo(resultData) {
    const userInfo = store.get('userInfo');
    const { isStaff } = userInfo;
    if (!isStaff) {
      return null;
    }
    return (
      <>
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
      </>
    );
  }

  render() {
    const { resultData, entryGroups, resultLoading } = this.props;

    const len = entryGroups.length || 0;

    return (
      <Spin tip="分析中，稍等5-10秒..." spinning={!!resultLoading}>
        <div id={'result'} className={classNames('flexColStart', 'itemCenter', styles.container)}>
          <div className={styles.title}>自检结果</div>
          <div className={styles.createdTime}>
            提交时间：{moment(resultData.created).format('YYYY-MM-DD HH:mm:ss')}
          </div>
          {this.renderBaseInfo(resultData)}
          {resultData.remark && (
            <div className={classNames(styles.row)}>
              <div>备注或其他症状：{resultData.remark}</div>
            </div>
          )}
          {resultData.suggestion && (
            <div className={classNames(styles.row)}>
              <div>
                参考意见：
                <pre
                  style={{
                    color: 'Green',
                    fontWeight: 'bold',
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                  }}
                >
                  {resultData.suggestion}
                </pre>
              </div>
            </div>
          )}
          <FormSimple {...this.getHealthFormProps()} />
          {!isEmpty(entryGroups) && len > 0 && (
            <div id={'card'} style={{ width: '100%' }}>
              {entryGroups.map((item, index) => {
                return (
                  <Card className={styles.card} title={this.renderTitle(item, index)} key={index}>
                    {item.entrys.map(entry => {
                      if (entry.number <= item.category.show_count) {
                        return null;
                      }
                      return (
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
                      );
                    })}
                  </Card>
                );
                // }
              })}
            </div>
          )}
          <div className={classNames(styles.row, 'flexCenter')}>
            <Button customtype={'select'} onClick={this.domToImage}>
              分享
            </Button>
          </div>
          {this.renderPieModal()}
          {this.renderGraphModal()}
          {this.renderImgModal()}
        </div>
      </Spin>
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

  nav = entry => {
    const userInfo = store.get('userInfo');
    const { remark, title, category } = entry;
    const { fxId } = userInfo;
    if (remark) {
      window.open(`${remark}`);
    } else {
      if (category.has_user_rule) {
        window.open(`${category.protocol}${fxId}${category.child_link}${urlencode(title, 'gbk')}`);
      } else {
        window.open(`${category.protocol}${category.child_link}${urlencode(title, 'gbk')}`);
      }
    }
  };

  random = () => {
    return Math.round(Math.random());
  };

  cancelModal = () => {
    this.setState({
      pieData: {},
      pieModalVisible: false,
      modalVisible: false,
      graphModalVisible: false,
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
