import React, { PureComponent } from 'react';
import { connect } from '@/utils/decorators';
import classNames from 'classnames';
import { FormComponentProps } from '@/components/Library/type';
import { GlobalState, UmiComponentProps, WrappedFormUtils } from '@/common/type';
import { Card, Badge } from '@/components/Library';
import styles from './index.less';

const mapStateToProps = ({ result }: GlobalState) => {
  return {
    resultData: result.resultData,
    entryGroups: result.entryGroups,
  };
};

type ResultStateProps = ReturnType<typeof mapStateToProps>;
type ResultProps = ResultStateProps & UmiComponentProps & FormComponentProps;

interface ResultState {}

@connect(
  mapStateToProps,
  null,
)
class Result extends PureComponent<ResultProps, ResultState> {
  form: WrappedFormUtils;

  constructor(props: Readonly<ResultProps>) {
    super(props);
    this.state = {};
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
    return (
      <div className={classNames('height100', 'flexColStart', 'itemCenter', styles.container)}>
        <div className={styles.title}>健康状况结果表</div>
        <div className={classNames('flexBetween', 'itemCenter', styles.row)}>
          <div>姓名:{resultData.name}</div>
          <div>手机:{resultData.phone}</div>
        </div>
        <div className={classNames('flexBetween', 'itemCenter', styles.row)}>
          <div>地址:{resultData.address}</div>
        </div>
        <div className={classNames('flexBetween', 'itemCenter', styles.row)}>
          <div>年龄:{resultData.age}</div>
          <div>性别:{resultData.gender}</div>
        </div>
        <div className={classNames('flexBetween', 'itemCenter', styles.row)}>
          <div>身高:{resultData.height}</div>
          <div>体重:{resultData.weight}</div>
        </div>
        <div className={classNames('flexBetween', 'itemCenter', styles.row)}>
          <div>腰围:{resultData.waistline}</div>
        </div>
        <div className={classNames('flexBetween', 'itemCenter', styles.row)}>
          <div>收缩压:{resultData.systolic_pressure}</div>
          <div>舒张压:{resultData.diastolic_pressure}</div>
        </div>
        <div className={classNames('flexBetween', 'itemCenter', styles.row)}>
          <div>血糖:{resultData.blood_sugar}</div>
        </div>
        <div className={classNames('flexBetween', 'itemCenter', styles.row)}>
          <div>备注或其他症状:{resultData.remark}</div>
        </div>

        {entryGroups.map(item => (
          <Card className={styles.card} title={item.category} key={item.category}>
            {item.entrys.map(entry => (
              <Card.Grid
                style={{ width: '50%', textAlign: 'center', height: '80px' }}
                key={entry.id}
              >
                <Badge count={entry.number}>
                  <div className={styles.entry}>{entry.title}</div>
                </Badge>
              </Card.Grid>
            ))}
          </Card>
        ))}
      </div>
    );
  }
}

export default Result;
