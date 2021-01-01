
import Peer from '../models/peer';
import TimeSeries from '../models/time_series';
import rawReq from './rawReq';
import {
  AddPeerResponse,
  ErrorResponse,
  NewPeerPayload,
  ReportResponse
} from './types';

enum GetEndpoint {
  report = 'report'
}

enum PostEndpoint {
  addPeer = 'peer'
}

type ResponseTypes<E> =
  E extends GetEndpoint.report ? ReportResponse :
  E extends PostEndpoint.addPeer ? AddPeerResponse :
  never;

type PayloadType<E> =
  E extends PostEndpoint.addPeer ? NewPeerPayload :
  never;


const doGet = async <R extends GetEndpoint>(endpoint: R): Promise<ResponseTypes<R>> => {
  const resp = await rawReq(endpoint);
  const respData = await resp.json()
  if (resp.status >= 200 && resp.status < 300) {
    return respData as ResponseTypes<R>
  }
  else {
    const errData = respData as ErrorResponse;
    if (errData.Error !== '') {
      throw new Error(errData.Error);
    }
    else {
      throw new Error('Unknown error');
    }
  }
};

const doPost = async <R extends PostEndpoint>(endpoint: R, payLoad: PayloadType<R>): Promise<ResponseTypes<R>> => {
  const resp = await rawReq(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payLoad),
  });
  const respData = await resp.json();
  if (resp.status >= 200 && resp.status < 300) {
    return respData as ResponseTypes<R>;
  }
  else {
    const errData = respData as ErrorResponse;
    if (errData.Error !== '') {
      throw new Error(errData.Error);
    }
    else {
      throw new Error('Unknown error');
    }
  }
};

/***** GET Endpoints *****/
const getReport = async () => {
  const data = await doGet(GetEndpoint.report);
  return {
    TimeSeries: new TimeSeries(data.TimeSeries),
    Report: data.Report,
  };
}

const postAddPeer = async (newPeer: Peer): Promise<AddPeerResponse> => {
  const payload: NewPeerPayload = {
    Owner: newPeer.Owner,
    Hostname: newPeer.Hostname,
    Description: newPeer.Description,
  };
  const data = await doPost(PostEndpoint.addPeer, payload);
  return { Conf: data.Conf };
}

export {
  getReport,
  postAddPeer
};
