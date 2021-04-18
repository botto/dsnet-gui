import IReport from '../models/report';

export interface NewPeerPayload {
  Owner: string
  Hostname: string
  Description: string
}

export interface AddPeerResponse {
  Conf: string
}

export interface ErrorResponse {
  Error: string
}
