import ReactECharts from 'echarts-for-react';
import React from 'react';

type Props = {
  data: any;
};
const Graph = (props: Props) => {
  const { data } = props;

  const option = {
    color: [
      '#5470c6',
      '#91cc75',
      '#fac858',
      '#ee6666',
      '#73c0de',
      '#3ba272',
      '#fc8452',
      '#9a60b4',
      '#ea7ccc',
      '#669999',
      '#FF0000',
      '#006666',
    ],
    legend: {
      type: 'scroll',
      data: data.categories.map(a => a.name),
    },
    tooltip: {},
    animationDurationUpdate: 1500,
    animationEasingUpdate: 'quinticInOut',
    series: [
      {
        scaleLimit: { min: 0.5, max: 5 },
        nodeScaleRatio: 1,
        symbol: 'pin',
        type: 'graph',
        layout: 'force',
        animation: true,
        roam: true,
        legendHoverLink: false,
        label: {
          show: true,
          position: 'right',
          formatter: '{b}',
        },
        draggable: true,
        data: data.nodes,
        categories: data.categories,
        force: {
          edgeLength: [40, 5],
          layoutAnimation: true,
          repulsion: 20,
          gravity: 0.1,
          friction: 0.1,
        },
        edges: data.links,
        emphasis: {
          focus: 'adjacency',
          blurScope: 'global',
          lineStyle: {
            width: 10,
          },
        },
      },
    ],
  };

  return (
    <ReactECharts
      option={option}
      style={{ width: '100%', height: '100%', backgroundColor: 'none', margin: 0 }}
    />
  );
};

export default Graph;
