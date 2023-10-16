import ReactECharts from 'echarts-for-react';
import React from 'react';

type Props = {
  data: any;
};
// eslint-disable-next-line max-lines-per-function
const Pie = (props: Props) => {
  const { data } = props;

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b} : {c} ({d}%)',
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
      iconStyle: {
        borderColor: '#22c2fe',
      },
      bottom: 0,
      itemSize: 20,
      right: '45%',
    },
    grid: {
      top: '17%',
      bottom: '64%',
    },
    legend: {
      type: 'scroll',
      orient: 'horizontal',
      top: 40,
      data: data.legendData,
    },
    series: [
      {
        name: data.category,
        type: 'pie',
        radius: '50%',
        center: ['50%', '50%'],
        data: data.seriesData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
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

export default Pie;
