import DataPoint from '../models/data_point';
import Peer from '../models/peer';
import HttpClient from './HttpClient';
import { AddPeerResponse } from './types';
import Report from '../models/report';

class API extends HttpClient {
  public constructor() {
    super(process.env.REACT_APP_API_BASE_URL);
  }

  public getReport = async () => this.instance.get<Report>('/report');

  public getRXTraffic = async () => {
    type RespDataType = {
      TimeStamp: string,
      Bytes: number,
    };
    const data = await this.instance.get<RespDataType[]>('/report/traffic/rx');
    if (!data) return;
    return data.map((d) => new DataPoint(d.TimeStamp, d.Bytes));
  }

  public getTXTraffic = async () => {
    type RespDataType = {
      TimeStamp: string,
      Bytes: number,
    };
    const data = await this.instance.get<RespDataType[]>('/report/traffic/tx');
    if (!data) return;
    return data.map((d) => new DataPoint(d.TimeStamp, d.Bytes));
  }

  public addPeer = async (newPeer: Peer): Promise<string> => {
    const payload = peerPayload(newPeer);
    const resp = await this.instance.post<AddPeerResponse>('/peer', payload);
    return resp.Conf;
  };

  public updatePeer = async (newPeer: Peer): Promise<string> => {
    const payload = peerPayload(newPeer);
    const resp = await this.instance.patch<AddPeerResponse>('/peer', payload);
    return resp.Conf;
  };

  public deletePeer = async (hostname: string) => this.instance.delete(`/peer/${hostname}`);
};

const peerPayload = (p: Peer): Peer => {
  return {
    Owner: p.Owner,
    Hostname: p.Hostname,
    Description: p.Description, 
  } as Peer;
}

export const api = new API();
