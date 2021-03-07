import { Card } from '@blueprintjs/core';
import sortBy from 'lodash/sortBy';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { api } from '../../api';
import Report from '../../models/report';
import ReportPeer from '../../models/report_peer';
import TimeSeries from '../../models/time_series';
import AddPeer from '../AddPeer';
import PeerComp from '../Peer';
import TrafficCharts from '../TrafficCharts';
import WGNicComp from '../WGNic';
import styles from './styles.module.sass';

const Overview = React.memo(() => {
  const [ report, setReport ] = useState<Report>();
  const [ timeSeries, setTimeSeries ] = useState<TimeSeries>({
    RX: [],
    TX: [],
  });

  const { isLoading, error, data } = useQuery(
    'report',
    api.getReport,
    {
      refetchInterval: 2000,
      refetchIntervalInBackground: true
    }
  );

  useEffect(() => {
    if (data) {
      setReport(data.Report);
      setTimeSeries(data.TimeSeries);
    }
  }, [ data ]);

  if (isLoading) return (<div>Loading...</div>);

  if (error) {
    console.error(error);
    return (<div>There was a problem retrieving data</div>);
  }

  const content = report ?
    <Content report={ report } timeSeries={ timeSeries } /> :
    <Empty />;

  return content;
});


const Empty = () => <>No interfaces available yet</>;

const Content = React.memo((props: { report: Report, timeSeries: TimeSeries }) => (
  <div className={ styles.Overview }>
    <Card>
      <WGNicComp report={ props.report } />
    </Card>
    <Card className={ styles.Charts }>
      <TrafficCharts timeSeries={ props.timeSeries } />
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
      <Card className={ styles.Peer } key={ i }>
        <PeerComp peer={ p } />
      </Card>
    ) }
  </>
);

export default Overview;
