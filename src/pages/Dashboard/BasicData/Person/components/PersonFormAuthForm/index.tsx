import React, { PureComponent, RefObject, createRef } from 'react';
import { Row, Col, Upload, Button, Message, Confirm, OperatingResults } from '@/components/Library';
import Form from '@/components/Library/Form';
import { PersonBaseInfo } from '@/models/person';
import styles from './index.less';
import Photo from '@/components/Library/photo';
import AntdIcon from '@/components/Library/Icon';
import IcCardReader from '@/components/Library/IcCardReader';
import { ERROR_IC_CARD_ADD, ERROR_IC_CARD_ADD_LIMIT } from '@/utils/message';
import { connect } from '@/utils/decorators';
import { GlobalState } from '@/common/type';

const mapStateToProps = (state: GlobalState) => {
  return {
    state,
    doorAuthConfig: state.carGlobal.doorBanAuthSettingData,
  };
};
interface Props {
  personData: PersonBaseInfo | null;
  limitMaxIcCard?: boolean;
  hiddenfaceCollect?: boolean;
  showIcCard?: boolean;
  [key: string]: any;
}

// -----------------------------授权表单-----------------
@connect(
  mapStateToProps,
  null,
  null,
  { forwardRef: true },
)
class AuthForm extends PureComponent<Props, any> {
  photoRef: RefObject<Photo>;

  IcCardReaderRef: RefObject<IcCardReader>;

  confirmRef: RefObject<Confirm>;

  operateRef: RefObject<OperatingResults>;

  editIdCards: any[] = [];

  isEdit: boolean;

  constructor(props) {
    super(props);
    this.photoRef = createRef();
    this.IcCardReaderRef = createRef();
    this.confirmRef = createRef();
    this.operateRef = createRef();
    this.state = {
      fileList: [],
      icCards: [],
      error: false,
      responseData: [],
      faceCollect: false,
      icCardCollect: false,
      showIcCard: false,
      authState: false,
    };
  }

  componentDidMount() {
    this.reset();
    this.getGlobalConfig();
  }

  async getGlobalConfig() {
    const { doorAuthConfig, dispatch } = this.props;
    let doorConfig = doorAuthConfig;
    if (!doorAuthConfig) {
      const [doorResConig] = await Promise.all([
        dispatch({ type: 'person/getDoorBanAuthSetting' }),
      ]);
      doorConfig = doorResConig;
    }
    const icCardCollect = doorConfig.passWay ? doorConfig.passWay.indexOf('2') > -1 : false;
    const faceCollect = doorConfig.passWay ? doorConfig.passWay.indexOf('1') > -1 : false;
    this.setState({
      faceCollect,
      authState: doorAuthConfig.authState,
      icCardCollect,
    });
  }

  removePhoto = () => {
    this.setState({
      fileList: [],
    });
  };

  openPhoto = () => {
    if (this.photoRef.current) {
      this.photoRef.current.open(data => {
        this.setState({
          fileList: [data.uploadFile],
        });
      });
    }
  };

  reset() {
    this.setState({
      fileList: [],
      icCards: [],
      error: false,
    });
  }

  removeIcCard = async (index: number, id) => {
    const cards = [...this.state.icCards];
    const foundCard = this.editIdCards.find(item => item.value === id);
    if (this.isEdit && foundCard) {
      const data = await this.props.dispatch({
        type: 'person/deleteIcCard',
        data: {
          personId: this.props.personData && this.props.personData.personId,
          id: foundCard.id,
        },
      });
      if (data && !data.error) {
        cards.splice(index, 1);
        this.setState({ icCards: cards });
      } else if (this.operateRef.current) {
        this.operateRef.current.open(data);
      }
    } else {
      cards.splice(index, 1);
      this.setState({ icCards: cards });
    }
  };

  removeImage = () => {
    this.setState({
      fileList: [],
    });
    // this.props.dispatch({ type: 'person/deleteIcCard', data: {} });
  };

  async setDefaultData(personData: PersonBaseInfo) {
    const data = await this.props.dispatch({
      type: 'person/getPersonAuthInfo',
      data: {
        licenceId: personData.licenceId,
        personId: personData.personId,
      },
    });
    if (data && data.length) {
      this.edit(data);
      this.isEdit = true;
    } else {
      this.isEdit = false;
    }
  }

  openReadIcCard = () => {
    // const { limitMaxIcCard } = this.props;
    if (this.IcCardReaderRef.current) {
      this.IcCardReaderRef.current.open(value => {
        const { icCards } = this.state;
        if (icCards.indexOf(value) > -1) {
          Message.warning(ERROR_IC_CARD_ADD);
          return;
        } else if (icCards.length >= 5) {
          Message.warning(ERROR_IC_CARD_ADD_LIMIT);
          return;
        }
        const list = [...icCards];
        list.unshift(value);
        this.setState({
          icCards: list,
        });
      });
    }
  };

  validator = () => {
    const { icCards, fileList } = this.state;
    if (!icCards.length && !fileList.length) {
      this.setState({ error: true });
      return false;
    }
    return {
      icCards,
      fileList: fileList[0],
    };
  };

  edit(data: any[]) {
    const findImage = data.find(item => item.passWayType === '1');
    const icCardList = data.filter(item => item.passWayType === '2');
    if (findImage) {
      this.setState({
        fileList: [
          {
            uid: '2',
            type: 'unchanged',
            size: 3,
            name: '无登记照',
            url: findImage.value,
          },
        ],
      });
    }
    this.editIdCards = icCardList;
    if (icCardList && icCardList.length) {
      this.setState({
        icCards: icCardList.map(item => item.value),
      });
    }
  }

  submit(record: PersonBaseInfo) {
    const { dispatch } = this.props;
    return new Promise(async (resolve, reject) => {
      const data = this.validator();
      if (data) {
        const passAuthData: any = {
          icCardList: data.icCards,
          licenceId: record.licenceId,
          personId: record.personId,
        };
        if (data.fileList && data.fileList.type === 'unchanged') {
          passAuthData.imageUrl = data.fileList.url;
        } else if (data.fileList instanceof File) {
          passAuthData.image = data.fileList;
        }
        if (data.icCards && data.icCards.length) {
          passAuthData.icCardList = data.icCards;
        }
        const resData = await dispatch({ type: 'person/addIcCard', data: passAuthData });
        if (resData && resData.error && this.confirmRef.current) {
          this.confirmRef.current.open(
            () => {},
            '提交异常',
            <div>
              {resData.message.map((item, i) => (
                <div key={i}>{item}</div>
              ))}
            </div>,
            'warning',
          );
          resolve(false);
        } else {
          resolve(resData);
        }
        return;
      }
      resolve(false);
    });
  }

  render() {
    const { showIcCard } = this.props;
    const { faceCollect, icCardCollect, authState } = this.state;
    const { fileList, icCards, error } = this.state;
    const noInputData = !fileList.length && !icCards.length;
    const hasCollect = faceCollect && (icCardCollect || showIcCard);
    return (
      <div style={{ display: 'inline-block', width: '100%' }}>
        <Photo ref={this.photoRef} />
        <Confirm ref={this.confirmRef} />
        <OperatingResults ref={this.operateRef} />
        <IcCardReader ref={this.IcCardReaderRef} />
        {error && hasCollect && noInputData && (
          <div className={styles.topTip} style={error ? { color: 'red' } : {}}>
            (场景照 和 IC卡必须录入其中一个，两者也可以同时录入)
          </div>
        )}
        <Col>
          {faceCollect && !this.props.hiddenfaceCollect && authState && (
            <Row>
              <Form.Item label={'登记照'} style={{ marginBottom: 0 }}>
                <Upload
                  textContent={'通过单击进行拍照录入照片'}
                  onClick={this.openPhoto}
                  fileList={fileList}
                  disabled={fileList && fileList.length}
                  onRemove={this.removePhoto}
                  openFileDialogOnClick={false}
                  uploadType={'picture'}
                  icon={<Button customtype={'master'}>点击拍照</Button>}
                />
                {error && faceCollect && noInputData && (
                  <div style={{ color: 'red' }}>(请录入场景照)</div>
                )}
              </Form.Item>
              {fileList && !!fileList.length && (
                <Button onClick={this.openPhoto} customtype={'master'}>
                  变更
                </Button>
              )}
            </Row>
          )}
          {(showIcCard ? true : icCardCollect && authState) && (
            <Row>
              <Form.Item label={'IC卡登记'}>
                <div className={styles.icCardButton} onClick={this.openReadIcCard}>
                  <Button customtype={'master'}>
                    <AntdIcon type={'plus'} />
                    新增IC卡
                  </Button>
                  <label>(给住户开通出入权限)</label>
                </div>
              </Form.Item>
            </Row>
          )}
          {(showIcCard ? true : icCardCollect && authState) && (
            <Row className={styles.icCardList}>
              {error && noInputData && <div style={{ color: 'red' }}>(请录入IC卡)</div>}
              <div className={styles.info}>
                <div className={styles.infoField}>
                  <div className={styles.fieldName}>IC卡编号</div>
                </div>
                <div className={styles.infoField}>
                  <div className={styles.fieldName}>操作</div>
                </div>
              </div>
              {icCards.map((item, i) => {
                return (
                  <div className={styles.info} key={i}>
                    <div className={styles.infoField}>
                      <div className={styles.fieldValue}>{item}</div>
                    </div>
                    <div className={styles.infoField}>
                      <div className={styles.fieldValue} style={{ color: 'red' }}>
                        <Button
                          className={styles.deleteBtn}
                          type={'icon' as any}
                          icon={'delete'}
                          onClick={() => this.removeIcCard(i, item)}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </Row>
          )}
        </Col>
      </div>
    );
  }
}

export default AuthForm;
