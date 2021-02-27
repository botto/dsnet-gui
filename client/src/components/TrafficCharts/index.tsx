import React from "react";
import TimeSeries from "../../models/time_series";
import Chart from "./Chart";
import styles from "./styles.module.sass";

const TrafficCharts = (props: { timeSeries: TimeSeries }) =>
  <div className={styles.Charts}>
    <div className={styles.Transmit}>
      <Chart 
        data={props.timeSeries.TX}
        baseColor='#7D71AD'
        name='Transmit'
      />
    </div>
    <div className={styles.Receive}>
      <Chart
        data={props.timeSeries.RX}
        baseColor='#4798AE'
        name='Receive'
      />
    </div>
  </div>

export default TrafficCharts;
