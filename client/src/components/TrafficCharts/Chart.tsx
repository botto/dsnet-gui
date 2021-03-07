import Chart from 'chart.js';
import filesize from 'filesize';
import { isArray, isNumber } from 'lodash';
import times from 'lodash/times';
import MooColor from 'moo-color';
import React, { useEffect, useRef } from 'react';
import DataPoint from '../../models/data_point';
import styles from './styles.module.sass';

export interface ChartDataPoint {
  y: number;
  t: string;
};

const initChart = (
  ctx: CanvasRenderingContext2D,
  data: ChartDataPoint[] | undefined,
  pointColor: string,
  backgroundGradient: CanvasGradient,
  lineColor: string,
) =>
  new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [
        {
          data,
          borderWidth: 2,
          borderColor: lineColor,
          backgroundColor: backgroundGradient,
          pointBackgroundColor: pointColor,
          pointBorderColor: pointColor,
        },
      ],
    },
    options: {
      responsive: true,
      aspectRatio: 3,
      legend: {
        display: false,
      },
      tooltips: {
        callbacks: {
          label: (toolTipItem: Chart.ChartTooltipItem, data: Chart.ChartData) => {
            if (data && data.datasets) {
              const setIndex = toolTipItem.datasetIndex || 0;
              const dataSet = data.datasets[setIndex];
              if (dataSet && dataSet.data) {
                const dataIndex = toolTipItem.index || 0;
                const rate = dataSet.data[dataIndex];
                if (rate && !isNumber(rate) && !isArray(rate) && rate.y) {
                  const y = rate.y as number;
                  return `${filesize(y, { bits: true, fullform: false })}/s`;
                }
              }
            }
            return '';
          }
        }
      },
      scales: {
        yAxes: [
          {
            type: 'linear',
            gridLines: {
              color: '#293742',
            },
            ticks: {
              fontColor: '#F5F8FA',
              fontSize: 20,
              beginAtZero: true,
              suggestedMax: 61000,
              maxTicksLimit: 5,
              callback: (value: number) => {
                return `${filesize(value, { base: 10, bits: true, fullform: false }) }/s`;
              },
            },
          },
        ],
        xAxes: [
          {
            type: 'time',
            time: {
              unit: 'minute',
            },
          },
        ],
      },
    },
  });

const getDeltaSeries = (points: DataPoint[]): ChartDataPoint[] => points.reduce((out: ChartDataPoint[], d: DataPoint, i: number, arr: DataPoint[]) => {
  // Ignore the first item as we can't do delta against nothing
  if (i === 0) {
    return out;
  }
  if (!d) {
    return out;
  }
  const durationDelta = d.TimeStamp.diff(arr[i-1].TimeStamp, 'second');
  const bps = (d.Bytes - arr[i-1].Bytes)/durationDelta;
  const bytesDelta = {
    y: bps,
    t: d.TimeStamp.format(),
  };
  return [
    ...out,
    bytesDelta,
  ];
}, []);

interface ChartProps {
  data: DataPoint[],
  baseColor: string,
  name: string,
}

const ChartComp = React.memo((props: ChartProps) => {
  const chartRef = useRef<Chart>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointColor = useRef();
  const lineColor = useRef(new MooColor(props.baseColor));

  useEffect(() => {
    if (canvasRef.current) {
      const pointColor = lineColor.current.clone().darken(10);
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        const gradient = ctx.createLinearGradient(0,0,0,400);
        // Make a copy of the lineColor, it gets mutated by the later steps.
        const gradientBaseColor = lineColor.current.clone();
        times(3, (i: number) => {
          gradient.addColorStop(i * 0.5, gradientBaseColor.rotate(i * 2).darken(i * 5).setAlpha(0.2).toRgb());
        });
        chartRef.current = initChart(
          ctx,
          [],
          pointColor.lighten(5).whiten(5).toRgb(),
          gradient,
          lineColor.current.clone().lighten(10).toRgb(),
        );
      }
    }
  }, [canvasRef, pointColor, lineColor, props.baseColor]);

  useEffect(() => {
    if (chartRef.current) {
      if (chartRef.current.data.datasets) {
        const delta = getDeltaSeries(props.data);
        chartRef.current.data.datasets[0].data = delta;
        chartRef.current.update();
      }
    }
  }, [props.data]);

  return (
    <div className={ styles.Chart }>
      <h2 className={ styles.Header }>{ props.name }</h2>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
});

export default ChartComp;
