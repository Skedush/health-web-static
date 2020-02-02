import React, { PureComponent, RefObject, createRef } from 'react';
import { Button, KVTable } from '@/components/Library';
import Form, { FormComponentProps } from '@/components/Library/Form';
import { PersonBaseInfo } from '@/models/person';
import styles from './index.less';
import { EPersonType } from '../PerosonForm';
import CarInfoForm from '../../../Car/components/CarInfoForm';

interface CarFormProps extends FormComponentProps {
  close: () => void;
  addCar: () => void;
  dispatch: Function;
  personType?: EPersonType;
  personData: PersonBaseInfo | null;
  carTypes: any[];
}

// -----------------------------车辆表单-----------------
export class CarForm extends PureComponent<CarFormProps, any> {
  carFormRef: RefObject<CarInfoForm>;

  constructor(props) {
    super(props);
    this.carFormRef = createRef();
    this.state = {
      isForm: false,
      carProvince: [],
      carLetter: [],
      typeCN: '',
      carType: '',
      reject: () => {},
      resolve: () => {},
    };
  }

  componentDidMount() {
    this.getProvince();
  }

  async getProvince() {
    this.props.dispatch({ type: 'carGlobal/getCarProvince' });
  }

  getLetter = async (province: string) => {
    const list = await this.props.dispatch({ type: 'person/getCarArea', data: { province } });
    this.setState({
      carLetter: list,
    });
  };

  reset() {
    this.judgeCarType({});
    if (this.carFormRef.current) {
      this.carFormRef.current.carInfoForm.resetFields();
    }
    this.setState({
      isForm: false,
    });
  }

  addCar = () => {
    this.setState({
      isForm: true,
    });
    this.judgeCarType({});
    this.props.addCar();
  };

  close = () => {
    this.props.close();
  };

  submit = data => {
    if (this.carFormRef.current) {
      return this.carFormRef.current.personFormSubmit();
    }
  };

  judgeCarType = values => {
    const { carTypes, personType } = this.props;
    let typeCN = '';
    if (personType === EPersonType.owner || personType === EPersonType.child) {
      typeCN = '业主车辆';
    } else if (personType === EPersonType.property) {
      typeCN = '物业车辆';
    } else if (personType === EPersonType.temp) {
      typeCN = '其他车辆';
    }
    const findType = carTypes.find(item => item.value === typeCN);
    if (findType) {
      this.setState({
        carType: findType.key,
        typeCN,
      });
    } else {
      this.setState({ typeCN });
    }
  };

  render() {
    const { personData } = this.props;
    const { isForm, typeCN, carType, reject } = this.state;

    const processPersonData = { ...personData, id: personData ? personData.personId : '' };
    return (
      <Form className={styles.form}>
        {!isForm && (
          <div className={styles.carTip}>
            有无车辆（有：
            <Button customtype={'master'} onClick={this.addCar}>
              添加
            </Button>
            无：可直接关闭窗口）
          </div>
        )}
        <div className={styles.topInfo}>
          <KVTable style={{ marginBottom: 0 }}>
            <KVTable.Item name={'车主姓名'}>{personData ? personData.name : ''}</KVTable.Item>
            <KVTable.Item name={'车主电话'}>{personData ? personData.phone : ''}</KVTable.Item>
            <KVTable.Item name={'车辆类型'}> {typeCN}</KVTable.Item>
          </KVTable>
        </div>
        <CarInfoForm
          inPersonForm
          ref={this.carFormRef}
          reject={reject}
          carType={carType}
          owner={processPersonData}
          onFormNext={() => {}}
          onCancelModel={() => {}}
          setCarId={() => {}}
        />
      </Form>
    );
  }
}

const CarFormInstance = Form.create<CarFormProps>({})(CarForm);

export default CarFormInstance;
