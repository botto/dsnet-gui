import Peer from '../models/peer';
import TimeSeries from '../models/time_series';
import HttpClient from './HttpClient';
import { AddPeerResponse, OverviewReport, ReportResponse } from './types';

class API extends HttpClient {
  public constructor() {
    super(process.env.REACT_APP_API_BASE_URL);
  }

  public getReport = async () => {
    const resp = await this.instance.get<ReportResponse>('/report');
    return {
      Report: resp.Report,
      TimeSeries: new TimeSeries(resp.TimeSeries),
    } as OverviewReport;
  };

  public addPeer = async (newPeer: Peer): Promise<string> => {
    const payload: Peer = {
      Owner: newPeer.Owner,
      Hostname: newPeer.Hostname,
      Description: newPeer.Description,
    };
    const resp = await this.instance.post<AddPeerResponse>('/peer', payload);
    return resp.Conf;
  };

  public deletePeer = async (hostname: string) => this.instance.delete(`/peer/${hostname}`);
};

export const api = new API();
