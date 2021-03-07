import DataPoint from './data_point';
interface TimeSeriesData { 
  TimeStamp: string,
  Bytes: number,
}
export interface TimeSeriesResponse {
  RX: TimeSeriesData[];
  TX: TimeSeriesData[];
}
export default class TimeSeries {
  readonly RX: DataPoint[];
  readonly TX: DataPoint[];
  constructor(timeSeries: TimeSeriesResponse) {
    this.RX = timeSeries.RX.map(tsData => new DataPoint(tsData.TimeStamp, tsData.Bytes));
    this.TX = timeSeries.TX.map(tsData => new DataPoint(tsData.TimeStamp, tsData.Bytes));
  }
}
