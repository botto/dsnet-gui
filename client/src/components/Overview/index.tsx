import { Card, HTMLTable } from '@blueprintjs/core';
import sortBy from 'lodash/sortBy';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { api } from '../../api';
import Report from '../../models/report';
import ReportPeer from '../../models/report_peer';
import AddPeer from '../AddPeer';
import PeerComp from '../PeerComp';
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
      <Card className={ styles.AddPeer } key="add_new">
        <AddPeer />
      </Card>
      <PeerList peers={ props.report.Peers } />
  </div>
));

const PeerList = React.memo((props: { peers: ReportPeer[] }) =>
  <HTMLTable bordered={true} striped={true} className={ styles.PeerList }>
    <thead>
    <tr>
      <th className={styles.Presence}></th>
      <th className={styles.Hostname}>Hostname</th>
      <th className={styles.IP}>IP</th>
      <th className={styles.Owner}>Owner</th>
      <th className={styles.LastSeen}>Last Seen</th>
      <th className={styles.Buttons}></th>
    </tr>
    </thead>
    <tbody>
    { sortBy(props.peers, 'Hostname').map((p, i) =>
       <PeerComp key={ i } peer={ p } />
    ) }
    </tbody>
  </HTMLTable>
);

export default Overview;
