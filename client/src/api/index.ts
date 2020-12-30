
import DSNetReport from '../models/dsnet_report';
import Peer from '../models/peer';
import TimeSeries from '../models/time_series';
import TimeSeriesResponse from '../models/time_series_response';
import rawReq from './rawReq';
import {
  AddPeerResponse, NewPeerPayload
} from './types';

enum GetEndpoint {
  report = 'report'
}

enum PostEndpoint {
  addPeer = 'peer'
}

interface ReportResponse {
  Report: DSNetReport,
  TimeSeries: TimeSeriesResponse,
}

type ResponseTypes<E> =
  E extends GetEndpoint.report ? ReportResponse :
  E extends PostEndpoint.addPeer ? AddPeerResponse :
  never;

type PayloadType<E> =
  E extends PostEndpoint.addPeer ? NewPeerPayload :
  never;

const doGet = <R extends GetEndpoint>(endpoint: R): Promise<ResponseTypes<R>> =>
  rawReq(endpoint)
    .then(resp => {
      if (resp.status >= 200 && resp.status < 300) {
        return resp.json();
      }
      throw new Error('Did not get 2xx response from server');
    })
    .then(d => d as ResponseTypes<R>);

const doPost = <R extends PostEndpoint>(endpoint: R, payLoad: PayloadType<R>): Promise<ResponseTypes<R>> =>
    rawReq(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payLoad),
    })
      .then(resp => {
        if (resp.status >= 200 && resp.status < 300) {
          return resp.json();
        }
        console.log(`Response: ${resp}`);
        throw new Error('Did not get 2xx response from server');
      })
      .then(d => d as ResponseTypes<R>);

/***** GET Endpoints *****/
const getReport = async () => {
  try {
    const data = await doGet(GetEndpoint.report);
    return {
      TimeSeries: new TimeSeries(data.TimeSeries),
      Report: data.Report,
    };
  } catch (err) {
    console.error(`failed getting report data - ${err}`);
    throw err;
  }
}

const postAddPeer = async (newPeer: Peer): Promise<AddPeerResponse> => {
  try {
    const payload: NewPeerPayload = {
      Owner: newPeer.Owner,
      Hostname: newPeer.Hostname,
      Description: newPeer.Description,
    };
    const data = await doPost(PostEndpoint.addPeer, payload);
    return {Conf: data.Conf};
  }
  catch (err) {
    console.error(`failed creating new peer - ${err}`);
    throw err;
  }
}

export {
  getReport,
  postAddPeer
};
