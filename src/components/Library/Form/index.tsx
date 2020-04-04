import React, { PureComponent } from 'react';
import { Form as AntdForm } from 'antd';
import {
  FormProps as AntdFormProps,
  FormComponentProps as AntdFormComponentProps,
  WrappedFormUtils as AntdWrappedFormUtils,
} from 'antd/lib/form/Form';

export interface FormProps extends AntdFormProps {}
export interface FormComponentProps extends AntdFormComponentProps {}
export interface WrappedFormUtils extends AntdWrappedFormUtils {}

class Form extends PureComponent<FormProps> {
  static create = AntdForm.create;
  static Item = AntdForm.Item;
  render() {
    return <AntdForm {...this.props} />;
  }
}
export default Form;
