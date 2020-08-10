import dayjs from "dayjs";

class DataPoint {
  public readonly TimeStamp: dayjs.Dayjs;
  public readonly Bytes: number;
  constructor(timeString: string, bytes: number) {
    this.TimeStamp = dayjs(timeString);
    this.Bytes = bytes;
  }
}

export default DataPoint;
