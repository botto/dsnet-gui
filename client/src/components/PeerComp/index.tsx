import { Button, Icon, Text } from '@blueprintjs/core';
import moment from 'moment'
import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { api } from '../../api';
import ReportPeer from '../../models/report_peer';
import EditPeer from '../EditPeer';
import styles from './styles.module.sass';

interface Props {
  peer: ReportPeer
}

const PresenceIcon = React.memo((props: Props) =>
  props.peer.Online ? <Icon className={ styles.Online } icon='full-circle' intent='success' /> : <Icon className={ styles.Offline } icon='circle' intent='danger' />
);
const TimeStamp = React.memo((props: Props) => {
  const date = moment(props.peer.LastHandshakeTime).toDate();
  return <>{ date.toLocaleDateString() } - { date.toLocaleTimeString() }</>;
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
        icon="trash"
        large={ true }
        onClick={ doDelete }
        outlined={ false }
        className={ styles.Button }
        intent="danger"
        disabled={!props.peer.Online}
      />
    </div>
  );
});

const Buttons = React.memo((props: Props) => (
  <div className={ styles.Buttons }>
    <EditPeer peer={ props.peer } />
    <DeleteButton peer={ props.peer } />
  </div>
));

const PeerComp = React.memo((props: Props) => (
  <tr className={` ${ props.peer.Online ? styles.Online : styles.Offline } `}>
    <td className={ styles.PresenceIcon }><span className={ styles.RowContents }><PresenceIcon peer={ props.peer } /></span></td>
    <td className={ styles.Hostname}><span className={ styles.RowContents }>{ props.peer.Hostname }</span></td>
    <td className={ styles.IP}><span className={ styles.RowContents }>{ props.peer.IP }</span></td>
    <td className={ styles.Owner}><span className={ styles.RowContents }>{ props.peer.Owner }</span></td>
    <td className={ styles.LastSeen}><span className={ styles.RowContents }><TimeStamp peer={ props.peer } /></span></td>
    <td className={ styles.ButtonsCell }><span className={ styles.RowContents }><Buttons peer={ props.peer } /></span></td>
  </tr>
));

export default PeerComp;
