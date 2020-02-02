import React, { Component } from 'react';
import styles from './index.less';
import connect from '@/utils/decorators/connect';
import { GlobalState, UmiComponentProps, DictionaryEnum } from '@/common/type';
// import Img from '@/components/Library/Img';
import { Button, Icon, CommonComponent, KVTable, Modal } from '@/components/Library';
import router from 'umi/router';
import villageImg from '../../../../components/Library/assets/images/villageImage.png';
import { VillageBaseInfo } from './model';
import Img from '@/components/Library/Img';
import { isEmpty } from 'lodash';
import moment from 'moment';
import EntryAndExitConfig from '@/pages/Initialization/components/EntryAndExitConfig';

const mapStateToProps = ({ loading, app }: GlobalState) => ({
  loading,
  constructionList: app.dictionry[DictionaryEnum.CONSTRUCTION_TYPE] || [],
  operateList: app.dictionry[DictionaryEnum.OPERATE_TYPE] || [],
});

type StateProps = ReturnType<typeof mapStateToProps>;
interface VillageProps extends StateProps, UmiComponentProps {}

interface VillageState {
  areaCN: string[];
  baseInfo: VillageBaseInfo;
  modalVisible: boolean;
}

@connect(
  mapStateToProps,
  null,
)
class Village extends Component<VillageProps, VillageState> {
  constructor(props) {
    super(props);
    this.state = {
      areaCN: [],
      baseInfo: {} as VillageBaseInfo,
      modalVisible: false,
    };
  }

  async componentDidMount() {
    const baseInfo = await this.props.dispatch({ type: 'village/getCommuntyInfo' });
    await Promise.all([
      this.props.dispatch({ type: 'app/getDic', payload: { type: DictionaryEnum.OPERATE_TYPE } }),
      this.props.dispatch({
        type: 'app/getDic',
        payload: { type: DictionaryEnum.CONSTRUCTION_TYPE },
      }),
    ]);
    if (!baseInfo || !baseInfo.village) {
      return;
    }
    baseInfo.village.buildDay = moment(baseInfo.village.buildDay).format('YYYY-MM-DD');
    const sourceAreaData = [
      baseInfo.village.provinceId,
      baseInfo.village.cityId,
      baseInfo.village.countyId,
      baseInfo.village.streetId,
    ];
    this.setState({ baseInfo });
    this.setOperateConstructionCN();
    this.getAreaCN(sourceAreaData);
  }

  setOperateConstructionCN() {
    const {
      baseInfo: { village },
    } = this.state;
    const findOperate = this.props.operateList.find(item => item.key === village.operate);
    if (findOperate) {
      village.operateCN = findOperate.value;
    }
  }

  async getAreaCN(sourceAreaData: number[]) {
    const areaData = await this.getAreaTree(this.state.baseInfo);
    if (!areaData) {
      return;
    }
    const stack = [...areaData];
    let flag = stack.pop();
    const result: string[] = [];
    while (flag) {
      const locationIndex = sourceAreaData.indexOf(+flag.value);
      if (locationIndex > -1) {
        result[locationIndex] = flag.label;
      }
      if (flag.children) {
        for (let i = 0; i < flag.children.length; i++) {
          stack.unshift(flag.children[i]);
        }
      }
      flag = stack.pop();
    }
    this.setState({
      areaCN: result,
    });
  }
  async getAreaTree(baseInfo) {
    const { dispatch } = this.props;
    const treeData = await dispatch({ type: 'village/getAreaByParent' });
    const areaData = baseInfo.village;
    if (!baseInfo.village) {
      return;
    }
    baseInfo.village.provinceId = `${baseInfo.village.provinceId}`;
    baseInfo.village.cityId = `${baseInfo.village.cityId}`;
    baseInfo.village.countyId = `${baseInfo.village.countyId}`;
    baseInfo.village.streetId = `${baseInfo.village.streetId}`;
    const requestList = [
      dispatch({ type: 'village/getAreaByParent', parentId: areaData.provinceId }),
    ];
    if (areaData.countyId) {
      requestList.push(dispatch({ type: 'village/getAreaByParent', parentId: areaData.cityId }));
    }
    if (areaData.streetId) {
      requestList.push(
        dispatch({ type: 'village/getAreaByParent', parentId: areaData.countyId, level: 4 }),
      );
    }
    const [cityList, countyList, streetList] = await Promise.all(requestList);
    if (streetList) {
      streetList.forEach(item => {
        item.isLeaf = true;
      });
    }
    countyList.forEach(item => {
      item.isLeaf = item.leaf;
      if (item.value === areaData.countyId && streetList) {
        item.children = streetList;
      }
    });
    cityList.forEach(item => {
      item.isLeaf = item.leaf;
      if (item.value === areaData.cityId) {
        item.children = countyList;
      }
    });
    treeData.forEach(item => {
      item.isLeaf = item.leaf;
      if (item.value === areaData.provinceId) {
        item.children = cityList;
      }
    });
    return Promise.resolve(treeData);
  }

  renderVillageInfo(baseInfo: VillageBaseInfo) {
    const { areaCN } = this.state;
    return (
      <div className={styles.block}>
        <div className={styles.blockTitle}>
          <div className={styles.line} />
          <label>小区信息建设</label>
        </div>
        <div className={styles.blockBody}>
          <div className={styles.image}>
            {baseInfo.village.image && (
              <Img
                type={'others'}
                className={styles.picture}
                defaultImg={villageImg}
                image={baseInfo.village.image}
                previewImg={true}
              />
            )}
          </div>
          <KVTable>
            <KVTable.Item name={'小区名称'}>{baseInfo.village.name}</KVTable.Item>
            <KVTable.Item name={'承建商/联系电话'}>
              {`${baseInfo.village.construction || ''}/${baseInfo.village.constructionPhone || ''}`}
            </KVTable.Item>
            <KVTable.Item name={'运营商/联系电话'}>
              {`${baseInfo.village.operateCN || ''}/${baseInfo.village.operatePhone || ''}`}
            </KVTable.Item>
            <KVTable.Item name={'建设时间'}>{`${baseInfo.village.buildDay}`}</KVTable.Item>
            <KVTable.Item name={'省市区'}>{areaCN.join('')}</KVTable.Item>
            <KVTable.Item name={'详细地址'}>{baseInfo.village.address}</KVTable.Item>
            <KVTable.Item name={'出入口'}>{baseInfo.village.doorCount}</KVTable.Item>
          </KVTable>
        </div>
      </div>
    );
  }

  renderPoliceInfo(baseInfo: VillageBaseInfo) {
    return (
      <div className={styles.block}>
        <div className={styles.blockTitle}>
          <div className={styles.line} />
          <label>民警信息</label>
        </div>
        <div className={styles.blockBody}>
          <div className={styles.image}>
            <Img
              className={styles.picture}
              // defaultImg={baseInfo.villagePoliceResp.image}
              image={baseInfo.villagePoliceResp.image}
              previewImg={true}
            />
          </div>
          <KVTable>
            <KVTable.Item name={'民警姓名'}>{baseInfo.villagePoliceResp.name}</KVTable.Item>
            <KVTable.Item name={'所属单位'}>
              {baseInfo.villagePoliceResp.policeOrganizationName}
            </KVTable.Item>
            <KVTable.Item name={'所属辖区'}>{baseInfo.villagePoliceResp.jurisdiction}</KVTable.Item>
            <KVTable.Item name={'民警电话'}>{baseInfo.villagePoliceResp.phone}</KVTable.Item>
            <KVTable.Item name={'民警警号'}>{baseInfo.villagePoliceResp.code}</KVTable.Item>
          </KVTable>
        </div>
      </div>
    );
  }

  renderInOutModal = () => {
    const modalProps = {
      onCancel: async () => {
        this.cancelModal();
        const baseInfo = await this.props.dispatch({ type: 'village/getCommuntyInfo' });
        this.setState({ baseInfo });
      },
      visible: this.state.modalVisible,
      title: '出入口设置',
      destroyOnClose: true,
      centered: true,
      footer: null,
      maskClosable: false,
      bodyStyle: {},
      width: '80%',
      height: '80%',
      wrapClassName: 'modal',
    };
    return (
      <Modal {...modalProps}>
        <EntryAndExitConfig />
      </Modal>
    );
  };

  render() {
    const { baseInfo } = this.state;
    if (isEmpty(baseInfo)) {
      return CommonComponent.renderLoading();
    }

    return (
      <div className={styles.communityPage}>
        <div className={styles.baseInfo}>
          <div className={styles.title}>
            <div>小区信息</div>
          </div>
          <div className={styles.body}>
            {this.renderVillageInfo(baseInfo)}
            {/* 民警信息 */}
            {/* {this.renderPoliceInfo(baseInfo)} */}
            <Button
              className={styles.editButton}
              customtype={'select'}
              onClick={this.toEdit}
              type={'primary'}
            >
              <Icon type={'edit'} />
              编辑
            </Button>
          </div>
        </div>
        {this.renderInOutModal()}
      </div>
    );
  }

  openInOutModal = () => {
    this.setState({
      modalVisible: true,
    });
  };

  cancelModal = () => {
    this.setState({
      modalVisible: false,
    });
  };

  toEdit = () => {
    router.push(`/dashboard/basicdata/villageedit`);
  };
}
export default Village;
