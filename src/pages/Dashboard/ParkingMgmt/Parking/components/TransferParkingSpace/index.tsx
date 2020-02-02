import React, { PureComponent, RefObject, createRef } from 'react';
import { Modal, FormSimple, Message, Spin } from '@/components/Library';
import { WrappedFormUtils } from '@/components/Library/type';
import connect from '@/utils/decorators/connect';
import { DictionaryEnum, GlobalState } from '@/common/type';
import PersonForm, { EPersonType } from '@/pages/Dashboard/BasicData/Person/components/PerosonForm';
import HouseholdModal from '@/pages/Dashboard/Home/components/HouseholdModal';
import { SUCCESS_CHANGE } from '@/utils/message';
import classNames from 'classnames';
import { debounce } from 'lodash';

const mapStateToProps = ({ parkingGlobal, app, loading: { effects } }: GlobalState) => {
  return {
    personList: parkingGlobal.personList,
    parkingSellState: app.dictionry[DictionaryEnum.PARKING_SELL_STATE],
    loading: {
      getPersonListLoading: effects['parkingGlobal/getPersonList'],
    },
  };
};

// interface Props extends ReturnType<typeof mapStateToProps>, UmiComponentProps {
//   visible: boolean;
//   parkingSpaceId: string;
//   onCancel: Function;
// }

interface State {
  haveSearchValue: boolean;
  bindPersonInfo: any;
}

@connect(
  mapStateToProps,
  null,
)
export default class TransferParkingSpace extends PureComponent<any, State> {
  personFormRef: RefObject<PersonForm> = createRef();
  modalForm: WrappedFormUtils;
  debounce: any;
  HouseholdRef: RefObject<HouseholdModal> = createRef();

  constructor(props) {
    super(props);
    this.state = {
      haveSearchValue: false,
      bindPersonInfo: {},
    };
  }

  getSelectPersonFormProps = () => {
    const { personList, loading } = this.props;
    const { bindPersonInfo } = this.state;
    const personSelectOption: any[] = [];
    if (personList && personList.content) {
      personList.content.forEach(item => {
        personSelectOption.push({
          key: item.id,
          value: item.name + '|' + item.phone,
        });
      });
    }
    const items: any = [
      {
        type: 'select',
        field: 'search',
        span: 16,
        showSearch: true,
        optionFilterProp: 'children',
        children: personSelectOption,
        placeholder: '搜索人员',
        rules: [{ required: true, message: '车位绑定人员不能为空' }],
        onSearch: this.onSelectSearch,
        onChange: this.onSearchSelectChange,
        notFoundContent: loading.getPersonListLoading ? (
          <Spin size={'small'} />
        ) : this.state.haveSearchValue ? (
          this.renderNoData()
        ) : null,
      },
      {
        type: 'label',
        span: 12,
        value: bindPersonInfo.name,
        placeholder: '关联人员',
      },
      {
        type: 'label',
        span: 12,
        value: bindPersonInfo.phone,
        placeholder: '联系电话',
      },
      {
        type: 'button',
        span: 6,
        customtype: 'master',
        onClick: this.addPerson,
        title: '添加人员',
      },
    ];
    return {
      items: items,
      actions: [
        {
          customtype: 'master',
          title: '提交',
          onClick: this.submit,
        },
        {
          customtype: 'warning',
          title: '关闭',
          onClick: this.close,
        },
      ],
      onGetFormRef: (modalForm: WrappedFormUtils) => {
        this.modalForm = modalForm;
      },
    };
  };

  renderNoData() {
    return <div className={classNames('flexColCenter', 'itemCenter')}>暂无数据</div>;
  }

  render() {
    const { visible } = this.props;

    return (
      <Modal
        visible={visible}
        title={'车位转让'}
        footer={null}
        onCancel={this.close}
        maskClosable={false}
      >
        <FormSimple {...this.getSelectPersonFormProps()} />
        <PersonForm personSuccess={() => {}} ref={this.personFormRef} />
        <HouseholdModal ref={this.HouseholdRef} />
      </Modal>
    );
  }

  addPerson = () => {
    if (this.HouseholdRef.current) {
      this.HouseholdRef.current.open(value => {
        if (this.personFormRef.current) {
          if (value === 'owner') {
            this.personFormRef.current.open('add', EPersonType.owner);
          } else if (value === 'property') {
            this.personFormRef.current.open('add', EPersonType.property);
          } else if (value === 'child') {
            this.personFormRef.current.open('add', EPersonType.child);
          } else if (value === 'temp') {
            this.personFormRef.current.open('add', EPersonType.temp);
          }
        }
      });
    }
  };

  onSearchSelectChange = (value, _item) => {
    console.log(value);
    const info = _item.props.children.split('|');
    this.setState({
      bindPersonInfo: { id: value, name: info[0], phone: info[1] },
    });
  };

  onSelectSearch = value => {
    if (this.debounce) {
      this.debounce.cancel();
    }
    if (value) {
      this.debounce = debounce(() => {
        this.setState({
          haveSearchValue: true,
        });
        this.getPersonList({ search: value });
      }, 300);
      this.debounce();
    } else {
      this.setState({
        haveSearchValue: false,
      });
      this.props.dispatch({
        type: 'parkingGlobal/updateState',
        payload: {
          personList: {},
        },
      });
    }
  };

  getPersonList = fields => {
    const { dispatch } = this.props;
    fields.page = 0;
    fields.size = 99;
    fields.searchEnum = 'PERSON';
    dispatch({ type: 'parkingGlobal/getPersonList', payload: fields });
  };

  // onSelectSearch = () =>
  submit = async () => {
    const { dispatch, parkingSpaceId, success } = this.props;
    const { bindPersonInfo } = this.state;
    const data = await dispatch({
      type: 'parkingGlobal/changeParkingItem',
      payload: { personId: bindPersonInfo.id, parkingSpaceId },
    });
    if (data) {
      Message.success(SUCCESS_CHANGE);
      if (success) {
        success();
        this.reSetSellData();
      }
      this.close();
    }
  };

  reSetSellData = () => {
    this.modalForm.resetFields();
    this.setState({
      bindPersonInfo: { name: null, phone: null, id: null },
    });
  };

  close = () => {
    const { onCancel } = this.props;
    if (onCancel) {
      onCancel();
    }
  };
}
