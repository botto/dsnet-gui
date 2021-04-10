interface ReportPeer {
  Hostname         : string;
  Owner            : string;
  Description      : string;
  Online           : boolean;
  Dormant          : boolean;
  Added            : string;
  IP               : string;
  ExternalIP       : string;
  Networks         : string[];
  LastHandshakeTime: string;
  ReceiveBytes     : number;
  TransmitBytes    : number;
  ReceiveBytesSI   : string;
  TransmitBytesSI  : string;
}

export default ReportPeer;
