/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
/* eslint-disable no-dupe-class-members */
import React, { PureComponent } from 'react';
import { connect } from '@/utils/decorators';
import classNames from 'classnames';
import {
  FormComponentProps,
  // PaginationConfig,
} from '@/components/Library/type';
// import dark from '@/themes/templates/dark';
// import light from '@/themes/templates/light';
import { GlobalState, UmiComponentProps } from '@/common/type';

// import { add, minus } from '@/actions/app';

const mapStateToProps = ({ home }: GlobalState) => {
  return {
    userEntryList: home.userEntryList,
    entryInfoList: home.entryInfoList,
  };
};

type HomeStateProps = ReturnType<typeof mapStateToProps>;
type HomeProps = HomeStateProps & UmiComponentProps & FormComponentProps;

interface HomeState {}

@connect(
  mapStateToProps,
  null,
)
class Home extends PureComponent<HomeProps, HomeState> {
  constructor(props: Readonly<HomeProps>) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    const { dispatch } = this.props;
    const data = await dispatch({ type: 'home/getEntryInfoList', payload: {} });
    console.log('data: ', data);
    if (data) {
      dispatch({ type: 'home/getUserEntryList', payload: { entry_info: data[0].id } });
    }
    console.log('this.props.match: ', this.props.location.pathname);
    window.location.host;
  }

  render() {
    const { entryInfoList } = this.props;
    console.log('entryInfoList: ', entryInfoList);
    return (
      <div className={classNames('height100', 'flexColStart', 'itemCenter')}>
        {entryInfoList.length > 0 &&
          entryInfoList.map(item => (
            <div key={item.id}>
              {'http://' + window.location.host + '/dashboard/fillfrom/' + item.id}
            </div>
          ))}
      </div>
    );
  }
}

export default Home;
