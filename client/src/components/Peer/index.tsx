import { Button, Icon, Text } from '@blueprintjs/core';
import DayJS from 'dayjs';
import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { api } from '../../api';
import ReportPeer from '../../models/report_peer';
import styles from './styles.module.sass';

interface Props {
  peer: ReportPeer
}

const PresenceIcon = React.memo((props: Props) =>
  props.peer.Online ? <Icon className={ styles.Online } icon='pulse' /> : <Icon className={ styles.Offline } icon='offline' />);

const TimeStamp = React.memo((props: Props) => {
  const date = DayJS(props.peer.LastHandshakeTime).toDate();
  return <Text>{ date.toLocaleDateString() } - { date.toLocaleTimeString() }</Text>;
});

const LastHandshake = React.memo((props: Props) => {
  if (props.peer.LastHandshakeTime && props.peer.LastHandshakeTime.length > 0) {
    return (
      <div className={ styles.LastHandshakeTime }>
        <Icon icon='eye-open' className={ styles.PeerDetailIcon } iconSize={20} />
        <TimeStamp peer={ props.peer } />
      </div>
    );
  }
  return <></>;
});

const DeleteButton = React.memo((props: Props) => {
  const queryClient = useQueryClient();
  const deleteMutate = useMutation(api.deletePeer, {
    onSuccess: () => { queryClient.invalidateQueries('report'); },
  });
  const doDelete = () => deleteMutate.mutate(props.peer.Hostname);
  return (
    <div className={ styles.Delete }>
      <Button
        icon="cross"
        large={ true }
        onClick={ doDelete }
        outlined={ false }
        className={ styles.Button }
        intent="danger"
      />
    </div>
  );
});

const PeerComp = React.memo((props: Props) => (
  <div className={ styles.Peer }>
    <div className={ `${ styles.Left } ${ props.peer.Online ? styles.online : styles.offline } ` }>
      <div className={ styles.Top }>
        <div className={ styles.PresenceIcon }><PresenceIcon peer={ props.peer } /></div>
        <div className={ styles.Hostname }><Text>{ props.peer.Hostname }</Text></div>
      </div>
      <div className={ styles.Bottom }>
        <div className={ styles.Owner }><Icon icon='person' className={ styles.PeerDetailIcon } iconSize={20} /><Text>{ props.peer.Owner }</Text></div>
        <div className={ styles.IP }><Icon icon='ip-address' className={ styles.PeerDetailIcon } iconSize={20} /><Text>{ props.peer.IP }</Text></div>
        <LastHandshake peer={ props.peer } />
      </div>
    </div>
    <div className={ styles.Right }>
      <DeleteButton peer={ props.peer } />
    </div>
  </div>
));

export default PeerComp;
