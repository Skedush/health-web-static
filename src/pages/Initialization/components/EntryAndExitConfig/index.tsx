import React, { PureComponent, RefObject, createRef } from 'react';
import styles from './index.less';
import { connect } from '@/utils/decorators';
import classNames from 'classnames';
import { WrappedFormUtils } from '@/components/Library/type';
import { GlobalState, UmiComponentProps } from '@/common/type';

import inOut from '@/assets/images/inOut.png';
import StepTitle from '../StepTitle';
import { Button, Img, Icon, FormEasy, OperatingResults, Confirm, Spin } from '@/components/Library';
const mapStateToProps = ({ initGlobal, loading: { effects } }: GlobalState) => {
  return {
    entranceList: initGlobal.entranceList,
    loading: {
      updateEntrance: effects['initGlobal/updateEntrance'],
      addEntrance: effects['initGlobal/addEntrance'],
      getEntranceList: effects['initGlobal/getEntranceList'],
    },
  };
};

type EntryAndExitConfigStateProps = ReturnType<typeof mapStateToProps>;
type EntryAndExitConfigProps = EntryAndExitConfigStateProps &
  UmiComponentProps & { onFormNext?: Function; onStepNext?: Function };

interface EntryAndExitConfigState {
  add: boolean;
  modify: boolean;
  modifyData: any;
  batchHandleResultsData: any;
  operatingResultsVisible: boolean;
}

@connect(
  mapStateToProps,
  null,
)
class EntryAndExitConfig extends PureComponent<any, EntryAndExitConfigState> {
  form: WrappedFormUtils;
  confirmRef: RefObject<Confirm> = createRef();
  constructor(props: Readonly<EntryAndExitConfigProps>) {
    super(props);
    this.state = {
      add: false,
      modify: false,
      modifyData: {},
      batchHandleResultsData: {},
      operatingResultsVisible: false,
    };
  }

  componentDidMount() {
    this.getEntranceList();
  }

  renderButton() {
    const ButtonProps = { customtype: 'main', onClick: this.submit };
    return (
      <div className={classNames(styles.bottomButton, 'flexCenter', 'itemCenter')}>
        <Button {...ButtonProps}>下一步</Button>
      </div>
    );
  }

  renderAddOrEditItem() {
    const { modify, modifyData } = this.state;
    const { loading } = this.props;
    let items: any[] = [
      {
        type: 'input',
        field: 'name',
        initialValue: modify ? modifyData.name : undefined,
        maxLength: 15,
        span: 24,
        rules: [{ required: true, message: '出入口名称不能为空' }],
        placeholder: '出入口名称',
      },
    ];
    if (modify) {
      items = [
        {
          type: 'hiddenInput',
          field: 'id',
          hidden: true,
          initialValue: modifyData.id,
        },
      ].concat(items);
    }
    const formProps = {
      items: items,
      modify,
      onGetFormRef: (form: WrappedFormUtils) => {
        this.form = form;
      },
    };
    return (
      <div
        key={modify ? modifyData.id : undefined}
        className={classNames(styles.eidtItem, styles.item, 'flexColBetween')}
      >
        <FormEasy {...formProps} />
        <div className={classNames('flexEnd')}>
          <Button
            customtype={'icon'}
            icon={'pm-save'}
            title={'保存'}
            onClick={this.save}
            loading={loading.updateEntrance || loading.addEntrance}
          />
          {modify && (
            <Button
              customtype={'icon'}
              icon={'pm-trash-can'}
              title={modify ? '删除' : '取消'}
              onClick={this.delete}
            />
          )}
          <Button
            customtype={'icon'}
            icon={'pm-delete'}
            title={'取消'}
            onClick={() => {
              this.setState({ add: false, modify: false });
            }}
          />
        </div>
      </div>
    );
  }

  renderList() {
    const { entranceList } = this.props;
    const { modify, modifyData } = this.state;
    return (
      <div className={classNames(styles.list, 'flexColStart')}>
        <div className={classNames('flexStart', 'flexWrap')}>
          {entranceList.map(item => {
            if (modify && item.id === modifyData.id) {
              return this.renderAddOrEditItem();
            }
            return (
              <div
                key={item.id}
                className={classNames(styles.itemNormal, styles.item, 'flexColBetween')}
              >
                <div className={classNames('flexStart', 'itemCenter')}>
                  <Img className={styles.icon} image={inOut} unClick={true} />
                  <div className={styles.title}>{item.name}</div>
                </div>
                <div className={classNames('flexEnd')}>
                  <Button
                    customtype={'icon'}
                    icon={'pm-edit'}
                    title={'修改'}
                    onClick={() => this.edit(item)}
                  />
                  <Button
                    customtype={'icon'}
                    icon={'pm-trash-can'}
                    title={'删除'}
                    onClick={() => this.delete(item.id)}
                  />
                </div>
              </div>
            );
          })}

          {this.state.add && this.renderAddOrEditItem()}

          {!this.state.add && (
            <div
              className={classNames(styles.addItem, styles.item, 'flexColCenter', 'itemCenter')}
              onClick={this.add}
            >
              <Icon type={'pm-add'} />
              <div className={styles.addText}>新增出入口</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  renderOperatingResults() {
    const { operatingResultsVisible, batchHandleResultsData } = this.state;
    const props = {
      visible: operatingResultsVisible,
      onCancel: this.onCancelOperatingResults,
      data: batchHandleResultsData,
    };
    return <OperatingResults {...props} />;
  }

  render() {
    const { loading, onFormNext } = this.props;
    return (
      <div className={classNames('flexColStart', styles.content)}>
        <Confirm type={'warning'} ref={this.confirmRef} />
        <StepTitle title={'出入口设置'} />
        <Spin spinning={loading.getEntranceList}>{this.renderList()}</Spin>
        {onFormNext && this.renderButton()}
        {this.renderOperatingResults()}
      </div>
    );
  }

  onCancelOperatingResults = () => {
    this.setState({ operatingResultsVisible: false });
  };

  getEntranceList = () => {
    this.props.dispatch({ type: 'initGlobal/getEntranceList' });
  };

  edit = item => {
    this.setState({ modifyData: item, modify: true, add: false });
  };

  delete = id => {
    if (this.confirmRef.current) {
      const payload = [id];
      this.confirmRef.current.open(
        async () => {
          const data = await this.props.dispatch({
            type: 'initGlobal/deleteEntrance',
            payload,
          });
          if (data && data.error) {
            this.setState({
              operatingResultsVisible: true,
              batchHandleResultsData: data,
            });
          } else {
            this.getEntranceList();
          }
        },
        '删除',
        `确定要删除该出入口吗？`,
      );
    }
  };

  add = () => {
    this.setState({
      add: true,
      modify: false,
    });
  };

  save = () => {
    this.form.validateFields(async (err, fieldsValue) => {
      console.log('fieldsValue: ', fieldsValue);
      if (!err) {
        const { add } = this.state;
        let url = '';
        if (add) {
          url = 'initGlobal/addEntrance';
        } else {
          url = 'initGlobal/updateEntrance';
        }
        const res = await this.props.dispatch({ type: url, payload: fieldsValue });
        if (res && res.success) {
          this.getEntranceList();
          this.setState({
            add: false,
            modify: false,
          });
        }
      }
    });
  };

  submit = () => {
    const { onFormNext, onStepNext } = this.props;
    onFormNext();
    onStepNext();
  };
}
export default EntryAndExitConfig;
