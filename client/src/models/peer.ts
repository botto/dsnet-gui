interface Peer {
  Hostname   : string;
  Owner      : string;
  Description: string;
  IP         : string;
  Added      : string;
  Networks   : string[];
  PublicKey  : string;
}

export default Peer;
