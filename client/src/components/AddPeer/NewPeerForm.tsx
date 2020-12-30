import { Button, Card, Classes, Intent, Label } from '@blueprintjs/core';
import React, { useRef } from 'react';
import { postAddPeer } from '../../api';
import Peer from '../../models/peer';
import { TopToast } from '../Toast';

const NewPeerForm = (props: { done: (conf: string) => void }) => {
  const owner = useRef<HTMLInputElement>(null);
  const hostname = useRef<HTMLInputElement>(null);
  const description = useRef<HTMLInputElement>(null);

  const submitForm = async () => {
    if (owner.current == null
      || hostname.current == null 
      || description.current == null)
    {
      TopToast.show({
        message: 'Some fields are missing',
        intent: Intent.DANGER,
        timeout: 2000,
      });
      return;
    }
    const newPeer = new Peer(
      hostname.current.value,
      owner.current.value,
      description.current.value,
    );

    try {
      const resp = await postAddPeer(newPeer);
      props.done(resp.Conf);
    }
    catch (err) {
      TopToast.show({
        message: `There was a problem adding the new peer: ${err}`,
        intent: Intent.DANGER,
        timeout: 10000,
      });
    }
  }

  return (
    <Card>
      <Label>
        Owner
        <input
          ref={owner}
          placeholder="Bob"
          className={`${Classes.INPUT} ${Classes.FILL}`}
          required={true}
        />
      </Label>
      <Label>
        Hostname (unique)
        <input
          ref={hostname}
          placeholder="peer.example.com"
          className={`${Classes.INPUT} ${Classes.FILL}`}
          required={true}
        />
      </Label>
      <Label>
        Description
        <input
          ref={description}
          placeholder="Peer is in server closet"
          className={`${Classes.INPUT} ${Classes.FILL}`}
          required={true}
        />
      </Label>
      <Button
        fill={true}
        text='Save'
        onClick={submitForm}
      />
    </Card>
  );
};

export default NewPeerForm;
