interface TimeSeriesData { 
  TimeStamp: string,
  Bytes: number,
}
interface TimeSeriesResponse {
  RX: TimeSeriesData[];
  TX: TimeSeriesData[];
}

export default TimeSeriesResponse;
