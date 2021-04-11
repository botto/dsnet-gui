import React, { useState } from 'react';
import { Button, Dialog } from '@blueprintjs/core';
import styles from './styles.module.sass';
import Peer from '../../models/peer';
import { useMutation, useQueryClient } from 'react-query';
import { api } from '../../api';
import PeerForm from '../PeerForm';

interface Props {
  peer: Peer
}

const EditPeer = (props: Props) => {
  const [open, setOpen] = useState(false);
  const onClose = () => setOpen(false);

  const queryClient = useQueryClient();
  const updatePeerMutation = useMutation(api.updatePeer, {
    onSuccess: () => {
      queryClient.invalidateQueries('report');
      setOpen(false);
    }
  });
  return (
    <>
      <Button
        icon="wrench"
        large={ true }
        onClick={ () => setOpen(true) }
        outlined={ false }
        className={ styles.Button }
        intent="none"
      />
      <Dialog isOpen={ open } onClose={ onClose }>
        <PeerForm submit={ updatePeerMutation.mutateAsync } peer={ props.peer } />
      </Dialog>
    </>
  )
}

export default EditPeer;
