import React from 'react';
import { Text, Icon } from '@blueprintjs/core';
import DayJS from 'dayjs';
import ReportPeer from '../../models/report_peer';

import styles from './styles.module.sass';

interface Props {
  peer: ReportPeer
}

const PresenceIcon = React.memo((props: Props) =>
  props.peer.Online ? <Icon className={styles.Online} icon='pulse' /> : <Icon className={styles.Offline} icon='offline' />);

const TimeStamp = React.memo((props: Props) => {
  const date = DayJS(props.peer.LastHandshakeTime).toDate();
  return <Text>{ date.toLocaleDateString() } - { date.toLocaleTimeString() }</Text>;
});

const LastHandshake = React.memo((props: Props) => {
  if (props.peer.LastHandshakeTime && props.peer.LastHandshakeTime.length > 0) {
    return (
      <div className={ styles.LastHandshakeTime }>
        <Icon icon='eye-open' className={ styles.PeerDetailIcon } />
        <TimeStamp peer={ props.peer } />
      </div>
    );
  }
  return <></>;
});

const PeerComp = React.memo((props: Props) => (
  <div className={ `${styles.Peer} ${props.peer.Online ? styles.online : styles.offline}` }>
    <div className={ styles.Top }>
      <div className={ styles.PresenceIcon }><PresenceIcon peer={ props.peer } /></div>
      <div className={ styles.Hostname }><Text>{ props.peer.Hostname }</Text></div>
    </div>
    <div className={ styles.Bottom }>
      <div className={ styles.Owner }><Icon icon='person' className={ styles.PeerDetailIcon } /><Text>{ props.peer.Owner }</Text></div>
      <div className={ styles.IP }><Icon icon='ip-address' className={ styles.PeerDetailIcon } /><Text>{ props.peer.IP }</Text></div>
      <LastHandshake peer={ props.peer } />
    </div>
  </div>
));

export default PeerComp;
