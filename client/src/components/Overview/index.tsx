import { Card } from '@blueprintjs/core';
import sortBy from 'lodash/sortBy';
import React, { useState } from 'react';
import { getReport } from '../../api';
import { usePeriodic } from '../../lib/hook-periodic';
import DSNetReport from '../../models/dsnet_report';
import ReportPeer from '../../models/report_peer';
import TimeSeries from '../../models/time_series';
import AddPeer from '../AddPeer';
import PeerComp from '../Peer';
import TrafficCharts from '../TrafficCharts';
import WGNicComp from '../WGNic';
import styles from './styles.module.sass';

const Overview = React.memo(() => {
  const [ report, setReport ] = useState<DSNetReport>();
  const [ timeSeries, setTimeSeries ] = useState<TimeSeries>({
    RX: [],
    TX: [],
  });

  usePeriodic(async () => {
    const newData = await getReport();
    if (newData) {
      setReport(newData.Report);
      setTimeSeries(newData.TimeSeries);
    }
  }, 1000);
  
  const content = report ?
      <Content report={ report } timeSeries={ timeSeries } /> :
      <Empty />;

  return content;
});


const Empty = () => <>No interfaces available yet</>;

const Content = React.memo((props: { report: DSNetReport, timeSeries: TimeSeries }) => (
  <div className={ styles.Overview }>
    <Card>
      <WGNicComp report={ props.report } />
    </Card>
    <Card className={ styles.Charts }>
      <TrafficCharts timeSeries={ props.timeSeries }/>
    </Card>
    <div className={ styles.PeerList }>
      <PeerList peers={ props.report.Peers } />
      <Card className={ styles.Peer } key="add_new">
        <AddPeer />
      </Card>
    </div>
  </div>
));

const PeerList = React.memo((props: { peers: ReportPeer[] }) => 
  <>
    { sortBy(props.peers, 'Hostname').map((p, i) => 
      <Card className={ styles.Peer } key={i}>
        <PeerComp peer={ p } />
      </Card>
    ) }
  </>
);

export default Overview;
