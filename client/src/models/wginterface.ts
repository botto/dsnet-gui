import Peer from './peer';

interface WGInterface {
  ExternalIP   : string;
  ListenPort   : number;
  Domain       : string;
  InterfaceName: string;
  Network      : string;
  IP           : string;
  DNS          : string;
  Networks     : string;
  ReportFile   : string;
  Peers        : Peer[];
}

export default WGInterface;
