import React, { PureComponent } from 'react';
import { Table as AntdTable } from 'antd';
import styles from './index.less';
import { TableProps as AntdTableProps } from 'antd/lib/table/interface';
import nores from '../assets/images/nodata.png';
import CommonComponent from '../commonComponent';
export { PaginationConfig, ColumnProps } from 'antd/lib/table/interface';

export interface TableProps<T> extends AntdTableProps<T> {
  hiddenPagination?: boolean;
  type?: 'checkbox' | 'radio' | 'none';
  onSelectRow?: (selectedRowKeys: string[] | number[], selectedRows: T[]) => void;
  selectedRow?: any[];
}

interface TableState {
  selectedRowKeys: [];
}

class Table extends PureComponent<TableProps<any>, TableState> {
  constructor(props: Readonly<TableProps<any>>) {
    super(props);

    this.state = {
      selectedRowKeys: [],
    };
  }

  componentDidMount() {}

  render() {
    const {
      dataSource,
      loading,
      columns = [],
      rowKey,
      scroll,
      type,
      onRowClick,
      pagination = { current: 1 },
      bordered,
    } = this.props;

    const paginationProps = this.getPaginationProps();
    if (columns[0] && columns[0].title !== '序号' && paginationProps && paginationProps.current) {
      columns.unshift({
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        width: '5.4%',
        render: (text: any, record: object, rowIndex) => {
          if (paginationProps && paginationProps.current && paginationProps.pageSize) {
            return CommonComponent.renderTableCol(
              rowIndex + 1 + (paginationProps.current - 1) * paginationProps.pageSize,
              record,
            );
          }
        },
      });
    }

    const rowSelection = this.getRowSelection();

    return (
      <div className={styles.container}>
        <AntdTable
          bordered={bordered}
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          rowClassName={(record, index) => 'table-row'}
          onChange={this.onTableChange}
          pagination={pagination ? paginationProps : false}
          rowKey={rowKey || 'id'}
          rowSelection={type === 'none' ? undefined : rowSelection}
          scroll={scroll}
          locale={this.getLocale()}
          // onRowClick={onRowClick}
          onRow={(record, index) => ({
            onClick: (e: any) => {
              if (onRowClick) {
                onRowClick(record, index, e);
              }
            },
          })}
        />
      </div>
    );
  }

  getLocale = () => {
    return {
      emptyText: (
        <div>
          <img src={nores} alt={'暂无数据'} />
          <br />
          暂无数据
        </div>
      ),
    };
  };

  getRowSelection = () => {
    const { type, selectedRow } = this.props;
    const { selectedRowKeys } = this.state;

    return {
      columnWidth: '60px',
      selectedRowKeys: selectedRow || selectedRowKeys,
      onChange: this.onRowSelectionChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
      type: type === 'none' ? undefined : type,
    };
  };

  getPaginationProps = () => {
    const { pagination, hiddenPagination, selectedRow, type } = this.props;
    const { selectedRowKeys } = this.state;
    const selectList = selectedRow || selectedRowKeys;
    let paginationProps: typeof pagination = false;

    const showTotal = (total, range) => (
      <div className={styles.footer}>
        {type ? <div /> : <div className={styles.selectedNum}>已选中{selectList.length}条</div>}
        <div>{`${range[1] - range[0] + 1}条/页， 共 ${total} 条`}</div>
      </div>
    );

    if (!hiddenPagination) {
      paginationProps = {
        showSizeChanger: true,
        showQuickJumper: true,
        ...pagination,
      };
      paginationProps.showTotal = paginationProps.showTotal || showTotal;
    }
    return paginationProps;
  };

  onRowSelectionChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys });
    if (this.props.onSelectRow) {
      this.props.onSelectRow(selectedRowKeys, selectedRows);
    }
  };

  onTableChange = (pagination, filters, sorter, extra) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(pagination, filters, sorter, extra);
    }
  };

  // cleanSelectedKeys = () => {
  //   this.handleRowSelectChange([], []);
  // };
}

export default Table;
