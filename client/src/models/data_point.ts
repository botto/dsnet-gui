import moment from 'moment';

class DataPoint {
  public readonly TimeStamp: moment.Moment;
  public readonly Bytes: number;
  constructor(timeString: string, bytes: number) {
    this.TimeStamp = moment(timeString);
    this.Bytes = bytes;
  }
}

export default DataPoint;
