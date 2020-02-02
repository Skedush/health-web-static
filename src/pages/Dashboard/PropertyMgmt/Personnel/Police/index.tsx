import React, { PureComponent } from 'react';
import styles from './index.less';
import { connect } from '@/utils/decorators';
import classNames from 'classnames';
// import { isEmpty } from 'lodash';
import { Form, Button, Row, Col, Input, Upload, Spin } from '@/components/Library';
import { isPhone } from '@/utils/validater';
import { FormComponentProps, UploadFile, UploadChangeParam } from '@/components/Library/type';
import { GlobalState, UmiComponentProps } from '@/common/type';

const { Item } = Form;
const mapStateToProps = ({ police, loading: { effects } }: GlobalState) => {
  return {
    policeData: police.policeData,
    getPoliceLoading: effects['police/getPolice'],
    updatePoliceLoading: effects['police/updatePolice'],
  };
};

type onUploadChange = (info: UploadChangeParam) => void;

type PoliceStateProps = ReturnType<typeof mapStateToProps>;
type PoliceProps = PoliceStateProps & UmiComponentProps & FormComponentProps;

interface PoliceState {
  fileList?: UploadFile[];
}

@connect(
  mapStateToProps,
  null,
)
class Police extends PureComponent<PoliceProps, PoliceState> {
  // static getDerivedStateFromProps(props: PoliceProps, state: PoliceState) {
  //   if (props.policeData && props.policeData.image !== '' && !state.fileList) {
  //     console.log('props.policeData.image: ', props.policeData.image);
  //     const fileList = [
  //       {
  //         uid: '1',
  //         name: 'image.jpg',
  //         size: 1435417,
  //         type: 'image/png',
  //         url: props.policeData.image,
  //       },
  //     ];
  //     return {
  //       fileList: fileList,
  //     };
  //   }
  //   return null;
  // }
  constructor(props: Readonly<PoliceProps>) {
    super(props);
    this.state = {
      // fileList: undefined,
    };
  }

  componentDidMount() {
    this.getPoliceData({});
  }

  // eslint-disable-next-line max-lines-per-function
  renderForm() {
    const { getFieldDecorator } = this.props.form;
    const { policeData = {}, getPoliceLoading, updatePoliceLoading } = this.props;
    const { fileList } = this.state;
    return (
      <Form
        className={styles.AddOrEditForm}
        labelAlign={'right'}
        onSubmit={this.onSubmit}
        // {...formItemLayout}
        autoComplete={'off'}
      >
        <Spin spinning={getPoliceLoading}>
          {getFieldDecorator('id', {
            initialValue: policeData.id,
          })(<Input placeholder={'辖区名称' as string} hidden />)}
          {/* {getFieldDecorator('id', {
          initialValue: policeData.villageId,
        })(<Input placeholder={'辖区名称' as string} hidden />)} */}
          <Row gutter={16}>
            <Col span={16}>
              <Item label={'社区民警'}>
                {getFieldDecorator('image', {
                  initialValue: policeData.image,
                  rules: [{ required: true, message: '请上传照片!' }],
                })(
                  <Upload
                    uploadType={'picture'}
                    title={''}
                    onChange={this.onFileChange as onUploadChange}
                    maxFiles={1}
                    fileList={fileList}
                  />,
                )}
              </Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Item label={'所属辖区'}>
                {getFieldDecorator('policeOrganizationId', {
                  initialValue: policeData.jurisdiction,
                  rules: [{ required: true, message: '请输入辖区!' }],
                })(<Input placeholder={'辖区名称' as string} disabled maxLength={30} />)}
              </Item>
            </Col>
            <Col span={8}>
              <Item label={'所属单位'}>
                {getFieldDecorator('policeOrganizationName', {
                  initialValue: policeData.policeOrganizationName,
                  rules: [{ required: true, message: '请输入单位!' }],
                })(<Input placeholder={'单位名称' as string} disabled maxLength={30} />)}
              </Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Item label={'民警姓名'}>
                {getFieldDecorator('name', {
                  initialValue: policeData.name,
                  rules: [{ required: true, message: '请输入姓名!' }],
                })(<Input placeholder={'姓名' as string} maxLength={10} />)}
              </Item>
            </Col>
            <Col span={8}>
              <Item label={'民警电话'}>
                {getFieldDecorator('phone', {
                  initialValue: policeData.phone,
                  rules: [
                    { required: true, message: '请输入电话!' },
                    {
                      validator: isPhone,
                    },
                  ],
                })(<Input placeholder={'电话' as string} maxLength={20} />)}
              </Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Item label={'民警警号'}>
                {getFieldDecorator('code', {
                  initialValue: policeData.code,
                  rules: [{ required: true, message: '请输入警号!' }],
                })(<Input placeholder={'警号' as string} maxLength={10} />)}
              </Item>
            </Col>
          </Row>
        </Spin>
        <Row>
          <Col span={16} className={styles.buttonCol}>
            <Button htmlType={'submit'} customtype={'select'} loading={updatePoliceLoading}>
              保存并更新
            </Button>
            <Button onClick={this.onReset} customtype={'reset'} style={{ marginLeft: 10 }}>
              重置
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    return (
      <div className={classNames('height100', 'flexColStart')}>
        <div className={classNames(styles.content, 'flexColStart')}>
          <div className={styles.header}>社区民警信息</div>
          <div className={styles.form}>{this.renderForm()}</div>
        </div>
      </div>
    );
  }

  getPoliceData = Fileds => {
    const { dispatch } = this.props;
    const { fileList } = this.state;
    dispatch({ type: 'police/getPolice', payload: { ...Fileds } }).then(res => {
      console.log('res: ', res);
      if (res && res.data.image !== '' && !fileList) {
        console.log('props.policeData.image: ', res.data.image);
        const fileList = [
          {
            uid: '1',
            name: 'image.jpg',
            size: 1435417,
            type: 'image/png',
            url: res.data.image,
          },
        ];
        this.setState({
          fileList,
        });
      }
    });
  };

  onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault();
    }
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return;
      const formData = new FormData();
      for (const key in fieldsValue) {
        if (fieldsValue[key] === undefined) {
          continue;
        }
        if (key !== 'image' && fieldsValue.hasOwnProperty(key)) {
          formData.set(key, fieldsValue[key]);
        } else if (key === 'image' && fieldsValue[key].file) {
          formData.set(key, fieldsValue[key].file);
        }
      }
      this.onUpdatePolice(formData);
      // for (const item in fieldsValue) {
      //   if (fieldsValue.hasOwnProperty(item)) {
      //     fieldsValue[item] = fieldsValue[item] === -1 ? undefined : fieldsValue[item];
      //   }
      // }
    });
  };

  onFileChange = info => {
    this.setState({
      fileList: info.fileList,
    });
  };

  onReset = () => {
    const { form, policeData = {} } = this.props;
    form.resetFields();
    const fileList = [
      {
        uid: '1',
        name: 'image.jpg',
        size: 1435417,
        type: 'image/png',
        url: policeData.image,
      },
    ];
    this.setState({
      fileList: fileList,
    });
  };

  onUpdatePolice = fieldsValue => {
    const { dispatch } = this.props;
    dispatch({
      type: 'police/updatePolice',
      payload: fieldsValue,
    }).then(res => {
      if (res && res.success) {
        this.getPoliceData({});
      }
    });
  };
}

export default Form.create<PoliceProps>()(Police);
