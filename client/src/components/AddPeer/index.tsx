import { Button, Callout, Card, Dialog } from '@blueprintjs/core';
import React, { useState } from 'react';
import { QRCode } from "react-qr-svg";
import NewPeerForm from './NewPeerForm';
import styles from './styles.module.sass';

const AddPeer = React.memo(() => {
  const [formOpen, setFormOpen] = useState(false);
  const [qrOpen, setQROpen] = useState(false);
  const [peerConf, setPeerConf] = useState('');

  const toggleForm = () => setFormOpen(!formOpen);
  const toggleQR = () => {
    if (qrOpen) {
      setPeerConf('');
      setQROpen(false);
    }
    else {
      setQROpen(true);
    }
  }

  const doneHandler = (conf: string) => {
    setPeerConf(conf);
    // Close the form and open the QR code
    setFormOpen(false);
    setQROpen(true);
  }

  return (
    <div>
      <Button
        icon='plus'
        text='Add Peer'
        outlined={ true }
        fill={ true }
        large={ true }
        onClick={ toggleForm }
      />
      <Dialog isOpen={ formOpen } onClose={ toggleForm }>
        <NewPeerForm
          done={ doneHandler }
        />
      </Dialog>
      <Dialog isOpen={ qrOpen } onClose={ toggleQR }>
        <Card>
          <QRCode
            level="H"
            value={ peerConf }
          />
          <Callout>
            <pre className={ styles.Conf }>
              { peerConf }
            </pre>
          </Callout>
        </Card>
        <Button
          icon='cross'
          text='Done'
          outlined={ true }
          large={ true }
          onClick={ toggleQR }
          className={ styles.Done }
        />
      </Dialog>
    </div>
  );
});

export default AddPeer;
