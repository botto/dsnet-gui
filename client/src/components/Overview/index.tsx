import { Card } from '@blueprintjs/core';
import sortBy from 'lodash/sortBy';
import React, { useState } from 'react';
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
import { OverviewReport } from '../../api/types';

const Overview = React.memo(() => {
  const [ report, setReport ] = useState<Report>();

  const { isLoading, error } = useQuery(
    'report',
    api.getReport,
    {
      refetchInterval: 2000,
      refetchIntervalInBackground: true,
      onSuccess: (data: OverviewReport) => {
        setReport(data.Report);
      }
    }
  );

  if (isLoading) return (<div>Loading...</div>);

  if (error) {
    console.error(error);
    return (<div>There was a problem retrieving data</div>);
  }

  const content = report ?
    <Content report={ report } /> :
    <Empty />;

  return content;
});


const Empty = () => <>No interfaces available yet</>;

const Content = React.memo((props: { report: Report }) => (
  <div className={ styles.Overview }>
    <Card>
      <WGNicComp report={ props.report } />
    </Card>
    <Card className={ styles.Charts }>
      <TrafficCharts />
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
