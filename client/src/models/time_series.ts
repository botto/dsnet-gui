import DataPoint from './data_point';
import TimeSeriesResponse from './time_series_response';

class TimeSeries {
  readonly RX: DataPoint[];
  readonly TX: DataPoint[];
  constructor(timeSeries: TimeSeriesResponse) {
    this.RX = timeSeries.RX.map(tsData => new DataPoint(tsData.TimeStamp, tsData.Bytes));
    this.TX = timeSeries.TX.map(tsData => new DataPoint(tsData.TimeStamp, tsData.Bytes));
  }
}

export default TimeSeries;
