import React from "react";
import Chart from "./Chart";
import styles from "./styles.module.sass";
import { api } from '../../api';

const TrafficCharts = () => {
  return (
  <div className={styles.Charts}>
    <div className={styles.Transmit}>
      <Chart 
        baseColor='#7D71AD'
        name='Transmit'
        getData={api.getTXTraffic}
      />
    </div>
    <div className={styles.Receive}>
      <Chart
        baseColor='#4798AE'
        getData={api.getRXTraffic}
        name='Receive'
      />
    </div>
  </div>
  )
};

export default TrafficCharts;
