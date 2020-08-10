import ReportPeer from './report_peer';

interface DSNetReport {
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
  Peers        : ReportPeer[];
}

export default DSNetReport;
