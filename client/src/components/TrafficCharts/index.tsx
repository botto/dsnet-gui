import React from "react";
import styles from "./styles.module.sass";
import TimeSeries from "../../models/time_series";
import Chart from "./Chart";

const TrafficCharts = (props: { timeSeries: TimeSeries }) =>
  <div className={styles.Charts}>
    <div className={styles.Transmit}>
      <Chart 
        data={props.timeSeries.TX}
        baseColor='#5a4e89'
        name='Transmit'
      />
    </div>
    <div className={styles.Receive}>
      <Chart
        data={props.timeSeries.RX}
        baseColor='#346e7e'
        name='Receive'
      />
    </div>
  </div>

export default TrafficCharts;
