import React, { PureComponent } from 'react';
import styles from './index.less';
import { Tree } from '@/components/Library';
import { AntTreeNode } from 'antd/lib/tree';

interface Props {
  dispatch: Function;
  setSelectValue: Function;
}

interface State {
  treeData: any[];
  defaultSelectedKey: any[];
  expandNodes: any[];
}

export default class HouseTree extends PureComponent<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      treeData: [],
      defaultSelectedKey: [],
      expandNodes: [],
    };
  }

  componentDidMount() {
    this.getTreeData();
  }

  async getTreeData() {
    const { setSelectValue } = this.props;
    const list = await this.props.dispatch({ type: 'person/getBuildingList' });
    this.handleTreeData(list);
    const ids: any[] = this.getKeyValue(list);
    setSelectValue(ids);
    if (ids) {
      this.setState({
        defaultSelectedKey: [ids[2].key],
        treeData: list,
        // expandNodes: [ids[0].key, ids[1].key],
      });
    }
  }

  getKeyValue(list: any[], searchHouse?: string) {
    if (list && list.length) {
      if (list[0].isLeaf && !searchHouse) {
        return [list[0]];
      }
      for (let i = 0; i < list.length; i++) {
        if (searchHouse && searchHouse === list[i].key && list[i].isLeaf) {
          return [list[i]];
        }
        const ids: any[] | undefined = this.getKeyValue(list[i].children, searchHouse);
        if (ids && ids.length) {
          ids.unshift(list[i]);
          return ids;
        }
      }
    }
  }

  handleTreeData(treeData: any[], depth = 0, parent?) {
    if (treeData && treeData.length) {
      treeData.forEach(item => {
        item.title = item.name;
        if (depth === 2) {
          item.isLeaf = true;
          item.key = `${item.id}`;
          item.title = item.code;
        } else {
          item.key = `${parent ? parent.id + '-' : ''}${item.id}`;
          item.selectable = false;
        }
        this.handleTreeData(item.children, depth + 1, item);
      });
    }
  }

  onExpand = (id, event) => {
    this.onClick(null, event.node);
  };

  onClick = (event, treeNode: AntTreeNode) => {
    const { eventKey, children } = treeNode.props;
    if (!children || (children instanceof Array && !children.length)) {
      return;
    }
    console.log(event, treeNode);
    const { expandNodes } = this.state;
    const list = [...expandNodes];
    const findIndex = list.indexOf(eventKey);
    if (findIndex > -1) {
      list.splice(findIndex, 1);
    } else {
      list.push(eventKey);
    }
    this.setState({ expandNodes: list });
  };

  onSelect = value => {
    if (value && value.length) {
      const data = this.getKeyValue(this.state.treeData, value[0]);
      this.props.setSelectValue(data);
    }
  };

  renderTreeNodes = data => {
    const { TreeNode } = Tree;

    return data.map(item => {
      if (item.children) {
        return (
          <TreeNode
            title={item.title}
            key={item.key}
            selectable={item.selectable}
            dataRef={item}
            {...item}
          >
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} {...item} dataRef={item} />;
    });
  };

  render() {
    const { defaultSelectedKey, expandNodes } = this.state;
    return (
      <div className={styles.houseTree}>
        {!!defaultSelectedKey.length && (
          <Tree
            onExpand={this.onExpand}
            className={styles.tree}
            onClick={this.onClick}
            onSelect={this.onSelect}
            // defaultExpandedKeys={expandNodes}
            expandedKeys={expandNodes}
            defaultSelectedKeys={defaultSelectedKey}
          >
            {this.renderTreeNodes(this.state.treeData)}
          </Tree>
        )}
      </div>
    );
  }
}
