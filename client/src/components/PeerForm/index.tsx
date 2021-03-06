import { Button, Card, Classes, Intent, Label } from '@blueprintjs/core';
import React, { useState } from 'react';
import Peer from '../../models/peer';
import { TopToast } from '../Toast';

enum DisabledFields {
  NONE = 0,
  FIELD_HOSTNAME = 1 << 0,
  FIELD_DESCRIPTION = 1 << 1,
  FIELD_OWNER = 1 << 2
}
interface Props {
  peer: Peer
  submit: (newPeer: Peer) => {}
  disabledFields?: DisabledFields,
}

const PeerForm = (props: Props) => {
  const [buttonEnabled, setButtonEnabled] = useState(true);
  const [owner, setOwner] = useState(props.peer.Owner);
  const [hostname, setHostName] = useState(props.peer.Hostname);
  const [description, setDescription] = useState(props.peer.Description);
  const [topToastId, setTopTostId] = useState('');
  const disabledFields = props.disabledFields ? props.disabledFields : DisabledFields.NONE;

  const submitForm = async () => {
    if (owner == null
      || hostname == null 
      || description == null)
    {
      setTopTostId(TopToast.show({
        message: 'Some fields are missing',
        intent: Intent.DANGER,
        timeout: 2000,
      }));
      return;
    }

    // Clear top toast if nothing was wrong
    TopToast.dismiss(topToastId);
    setTopTostId('');

    const newPeer = new Peer(
      hostname,
      owner,
      description,
      false,
    );

    try {
      setButtonEnabled(false);
      await props.submit(newPeer);
    }
    catch (err) {
      setButtonEnabled(true);
      setTopTostId(TopToast.show({
        message: `There was a problem adding the new peer: ${err}`,
        intent: Intent.DANGER,
        timeout: 7000,
      }));
    }
  }

  return (
    <Card>
      <Label>
        Owner
        <input
          placeholder="Bob"
          className={`${Classes.INPUT} ${Classes.FILL}`}
          required={true}
          onChange={(e) => setOwner(e.target.value)}
          value={owner}
          disabled={!!(disabledFields & DisabledFields.FIELD_OWNER)}
        />
      </Label>
      <Label>
        Hostname (unique)
        <input
          placeholder="peer.example.com"
          className={`${Classes.INPUT} ${Classes.FILL}`}
          required={true}
          onChange={(e) => setHostName(e.target.value)}
          value={hostname}
          disabled={!!(disabledFields & DisabledFields.FIELD_HOSTNAME)}
        />
      </Label>
      <Label>
        Description
        <input
          placeholder="Peer is in server closet"
          className={`${Classes.INPUT} ${Classes.FILL}`}
          required={true}
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          disabled={!!(disabledFields & DisabledFields.FIELD_DESCRIPTION)}
        />
      </Label>
      <Button
        fill={true}
        text='Save'
        onClick={submitForm}
        loading={!buttonEnabled}
      />
    </Card>
  );
};


PeerForm.Fields = DisabledFields;

export default PeerForm;
