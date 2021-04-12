import React, { useEffect, useRef } from 'react';
import { Chart, registerables, TooltipItem } from 'chart.js';
import filesize from 'filesize';
import times from 'lodash/times';
import MooColor from 'moo-color';
import moment from 'moment';
import 'chartjs-adapter-moment';
import { useQuery } from 'react-query';
import { isNumber, isArray } from 'lodash';
import styles from './styles.module.sass';
import DataPoint from '../../models/data_point';
Chart.register(
  ...registerables,
);
export interface ChartDataPoint {
  y: number;
  x: moment.Moment;
};

const initChart = (
  ctx: CanvasRenderingContext2D,
  data: ChartDataPoint[] | undefined,
  pointColor: string,
  backgroundGradient: CanvasGradient,
  lineColor: string,
) => {
  return new Chart(ctx, {
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
      plugins: {
        tooltip: {
          callbacks: {
            label: (context: TooltipItem<"line">) => {
              if (context && context.raw) {
                const data = context.raw as ChartDataPoint;
                if (isNumber(data.y) && !isArray(data.y)) {
                  const y = data.y;
                  return `${ filesize(y, { bits: true, fullform: false }) }/s`;
                }
              }
              return '';
            }
          }
        }
      },
      scales: {
        y: {
          grid: {
            color: '#293742',
          },
          beginAtZero: true,
          suggestedMax: 61000,
          ticks: {
            color: '#f5f8fa',
            font: {
              size: 20
            },
            maxTicksLimit: 5,
            callback: (value: number | string) => {
              if (typeof value === 'string') return value;
              return `${ filesize(value, { base: 10, bits: true, fullform: false }) }/s`;
            },
          },
        },

        x: {
          type: 'time',
          time: {
            unit: 'minute',
          },
        },
      },
    },
  })
};

interface ChartProps {
  baseColor: string,
  name: string,
  getData: () => void,
}

const ChartComp = React.memo((props: ChartProps) => {
  const dataRef = useRef<ChartDataPoint[]>([]);
  const chartRef = useRef<any>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointColor = useRef();
  const lineColor = useRef(new MooColor(props.baseColor));
  const queryEnabled = useRef(false);

  const getTimeseries = (points: DataPoint[]): ChartDataPoint[] => points.reduce((out: ChartDataPoint[], d: DataPoint, i: number, arr: DataPoint[]) => {
    // Ignore the first item as we can't do delta against nothing
    if (i === 0) {
      return out;
    }
    if (!d) {
      return out;
    }
    const durationDelta = d.TimeStamp.diff(arr[i - 1].TimeStamp, 'second');
    const bps = (d.Bytes - arr[i - 1].Bytes) / durationDelta;
    const bytesDelta = {
      y: bps,
      x: d.TimeStamp,
    } as ChartDataPoint;
    return [
      ...out,
      bytesDelta,
    ];
  }, []);


  const { error } = useQuery(
    props.name,
    props.getData,
    {
      refetchInterval: 2000,
      refetchIntervalInBackground: true,
      onSuccess: (dataPoints: DataPoint[]) => {
        if (!chartRef || !chartRef.current) return;
        if (dataRef.current.length >= 10) {
          dataRef.current.shift();
        }
        const ts = getTimeseries(dataPoints);
        if (!ts || ts.length <= 0) return;
        chartRef.current.data.datasets[0].data = ts;
        chartRef.current.update();
      }
    }
  );

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const pointColor = lineColor.current.clone().darken(10);
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    // Make a copy of the lineColor, it gets mutated by the later steps.
    const gradientBaseColor = lineColor.current.clone();
    times(3, (i: number) => {
      gradient.addColorStop(i * 0.5, gradientBaseColor.rotate(i * 2).darken(i * 5).setAlpha(0.2).toRgb());
    });

    chartRef.current = initChart(
      ctx,
      dataRef.current,
      pointColor.lighten(5).whiten(5).toRgb(),
      gradient,
      lineColor.current.clone().lighten(10).toRgb(),
    );
    queryEnabled.current = true;
  }, [canvasRef, pointColor, lineColor, props.baseColor]);


  if (error) {
    console.error(error);
    return (<div>There was a problem retrieving data</div>);
  }

  return (
    <div className={ styles.Chart }>
      <h2 className={ styles.Header }>{ props.name }</h2>
      <canvas id="main" ref={ canvasRef }></canvas>
    </div>
  );
});

export default ChartComp;
