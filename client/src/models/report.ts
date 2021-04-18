// import PeerData from './report_peer';
import Peer from './peer';
interface Report {
  ExternalIP   : string;
  InterfaceName: string;
  ListenPort   : number;
  Domain       : string;
  IP           : string;
  Network      : string;
  DNS          : string;
  PeersOnline  : number;
  PeersTotal   : number;
  ReceiveBytes : number;
  TransmitByes : number;
  TXBytesTimeSeries : number[];
  Peers        : Peer[];
}

export default Report;
