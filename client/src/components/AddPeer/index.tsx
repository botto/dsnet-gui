import { Button, Callout, Card, Dialog } from '@blueprintjs/core';
import React, { useState } from 'react';
import { QRCode } from "react-qr-svg";
import styles from './styles.module.sass';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api';
import PeerForm from '../PeerForm';
import Peer from '../../models/peer';

const AddPeer = React.memo(() => {
  const [ formOpen, setFormOpen ] = useState(false);
  const [ qrOpen, setQROpen ] = useState(false);
  const [ peerConf, setPeerConf ] = useState('');

  const queryClient = useQueryClient();
  const addPeerMutation = useMutation(api.addPeer, {
    onSuccess: (conf: string) => {
      queryClient.invalidateQueries([ 'report' ]);

      setPeerConf(conf);

      // Close the form and open the QR code
      setFormOpen(false);
      setQROpen(true);
    }
  });


  const closeForm = () => setFormOpen(false);
  const openForm = () => setFormOpen(true);

  const closeQR = () => {
    setPeerConf('');
    setQROpen(false);
  }

  const openQR = () => setQROpen(true);

  return (
    <div>
      <Button
        icon='plus'
        text='Add Peer'
        fill={true}
        large={true}
        onClick={openForm}
        intent='primary'
      />
      <Dialog isOpen={formOpen} onClose={closeForm}>
        <PeerForm submit={addPeerMutation.mutateAsync} peer={new Peer('', '', '', false)} />
      </Dialog>
      <Dialog isOpen={qrOpen} onClose={closeQR}>
        <Card>
          <QRCode
            level="H"
            value={peerConf}
          />
          <Callout>
            <pre className={styles.Conf}>
              {peerConf}
            </pre>
          </Callout>
        </Card>
        <Button
          icon='cross'
          text='Done'
          outlined={true}
          large={true}
          onClick={closeQR}
          className={styles.Done}
        />
      </Dialog>
    </div>
  );
});

export default AddPeer;
