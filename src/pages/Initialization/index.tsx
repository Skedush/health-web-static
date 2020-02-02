import React, { PureComponent } from 'react';
import styles from './index.less';
import { connect } from '@/utils/decorators';
import classNames from 'classnames';
// import { isEmpty } from 'lodash';
import { Steps, Tabs } from '@/components/Library';
import { FormComponentProps } from '@/components/Library/type';
import { GlobalState, UmiComponentProps } from '@/common/type';
import VillageConfig from './components/VillageConfig';
import EntryAndExitConfig from './components/EntryAndExitConfig';
import BuildingAndUnitConfig from './components/BuildingAndUnitConfig';
import PersonPassConfiog from './components/PersonPassConfig';
import HouseConfig from './components/HouseConfig';
import CarPassConfig from './components/CarPassConfig';
import ParkingLotConfig from './components/ParkingLotConfig';
import ParkingLotItemConfig from './components/ParkingLotItemConfig';

const { TabPane } = Tabs;

const mapStateToProps = ({ app }: GlobalState) => {
  return {
    initSetting: app.initSetting,
  };
};

type InitializationStateProps = ReturnType<typeof mapStateToProps>;
type InitializationProps = InitializationStateProps & UmiComponentProps & FormComponentProps;

interface InitializationState {
  tabsActiveKey: string;
  stepCurrent: number;
  isInit: boolean;
}

@connect(
  mapStateToProps,
  null,
)
class Initialization extends PureComponent<InitializationProps, InitializationState> {
  static getDerivedStateFromProps(nextProps, preState: InitializationState) {
    const getStepCurrent = (currentStep: string = '1') => {
      const step = parseInt(currentStep);
      switch (step) {
        case 1:
        case 2:
        case 3:
          return step - 1;
        case 4:
          return 2;
        case 5:
        case 6:
          return 3;
        case 7:
          return 4;
        case 8:
          return 5;
        default:
          return 0;
      }
    };
    if (nextProps.currentStep !== preState.tabsActiveKey && preState.isInit) {
      return {
        tabsActiveKey: nextProps.initSetting.currentStep,
        isInit: false,
        stepCurrent: getStepCurrent(nextProps.initSetting.currentStep),
      };
    }
    return null;
  }

  constructor(props: Readonly<InitializationProps>) {
    super(props);

    this.state = {
      isInit: true,
      tabsActiveKey: '1',
      stepCurrent: 0,
    };
  }

  componentDidMount() {}

  renderSteps() {
    const steps = [
      { title: '基本信息', description: 'ESSENTIAL INFORMATION' },
      { title: '出入口配置', description: 'ENTRANCE AND RXIT CONFIG' },
      { title: '楼房结构', description: 'BUILDING STRUCTURE' },
      { title: '停车场', description: 'PARKING LOT CONFIG' },
      { title: '门禁配置', description: 'ACCESS CONTROL CONFIG' },
      { title: '道闸配置', description: 'ROAD GATE CONFIG' },
    ];
    return (
      <Steps current={this.state.stepCurrent} direction={'vertical'}>
        {steps.map(item => (
          <Steps.Step key={item.title} title={item.title} description={item.description} />
        ))}
      </Steps>
    );
  }

  renderTabs() {
    return (
      <Tabs hiddenTabButton activeKey={this.state.tabsActiveKey}>
        <TabPane tab={'1'} key={'1'}>
          <VillageConfig onFormNext={this.onFormNext} onStepNext={this.onStepNext} />
        </TabPane>
        <TabPane tab={'2'} key={'2'}>
          <EntryAndExitConfig onFormNext={this.onFormNext} onStepNext={this.onStepNext} />
        </TabPane>
        <TabPane tab={'3'} key={'3'}>
          <BuildingAndUnitConfig onFormNext={this.onFormNext} />
        </TabPane>
        <TabPane tab={'4'} key={'4'}>
          <HouseConfig onFormNext={this.onFormNext} onStepNext={this.onStepNext} />
        </TabPane>
        <TabPane tab={'5'} key={'5'}>
          <ParkingLotConfig onFormNext={this.onFormNext} onStepNext={this.onStepNext} />
        </TabPane>
        <TabPane tab={'6'} key={'6'}>
          <ParkingLotItemConfig onFormNext={this.onFormNext} onStepNext={this.onStepNext} />
        </TabPane>
        <TabPane tab={'7'} key={'7'}>
          <PersonPassConfiog onStepNext={this.onStepNext} onFormNext={this.onFormNext} />
        </TabPane>
        <TabPane tab={'8'} key={'8'}>
          <CarPassConfig onStepNext={this.onStepNext} onFormNext={this.onFormNext} />
        </TabPane>
      </Tabs>
    );
  }

  render() {
    return (
      <div className={classNames('height100', 'flexColStart')}>
        <div className={classNames(styles.back, 'flexColStart')}>
          <div className={classNames(styles.block, 'flexColStart')}>
            <div className={styles.header}>初始化</div>
            <div className={classNames(styles.main, 'flexBetween')}>
              <div className={classNames(styles.left, 'flexColStart')}>{this.renderTabs()}</div>
              <div className={classNames(styles.right, 'flexColCenter')}>{this.renderSteps()}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  onFormNext = () => {
    this.setState(
      {
        tabsActiveKey: (parseInt(this.state.tabsActiveKey) + 1).toString(),
      },
      () => {
        this.props.dispatch({
          type: 'app/updateInitSetting',
          payload: {
            endState: this.state.tabsActiveKey === '8' ? '1' : '0',
            currentStep: this.state.tabsActiveKey,
          },
        });
      },
    );
  };
  onStepNext = () => {
    this.setState({
      stepCurrent: this.state.stepCurrent + 1,
    });
  };
}
export default Initialization;
