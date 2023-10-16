import ReactECharts from 'echarts-for-react';
import React from 'react';
const img = require('./病毒.svg');
const img2 = require('./内脏.svg');

// eslint-disable-next-line max-lines-per-function
const PictorialBar: React.FC = () => {
  var pathSymbols = {
    reindeer: `image://${img}`,
    neizhang: `image://${img2}`,
  };

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'none',
      },
      formatter: function(params) {
        return params[0].name + ': ' + params[0].value;
      },
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    xAxis: {
      data: ['毒素', '内脏'],
      axisTick: { show: false },
      axisLine: { show: false },
      axisLabel: {
        color: '#e54035',
      },
    },
    yAxis: {
      splitLine: { show: false },
      axisTick: { show: false },
      axisLine: { show: true },
      axisLabel: { show: true },
    },
    color: ['#e54035'],
    series: [
      {
        name: 'hill',
        type: 'bar',
        itemStyle: {
          opacity: 0.5,
        },
        emphasis: {
          itemStyle: {
            opacity: 1,
          },
        },
        data: [123, 60],
        z: 10,
      },
      {
        name: 'glyph',
        type: 'pictorialBar',
        barGap: '-100%',
        symbolPosition: 'end',
        symbolSize: 50,
        symbolOffset: [0, '-120%'],
        data: [
          {
            value: 123,
            symbol: pathSymbols.reindeer,
            symbolSize: [30, 30],
          },
          {
            value: 60,
            symbol: pathSymbols.neizhang,
            symbolSize: [30, 30],
          },
        ],
      },
    ],
  };

  return (
    <ReactECharts
      option={option}
      style={{ width: '100%', height: '100%', backgroundColor: 'none', margin: 0, zIndex: 9999 }}
    />
  );
};

export default PictorialBar;
