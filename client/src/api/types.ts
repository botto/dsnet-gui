import DSNetReport from '../models/dsnet_report';
import TimeSeriesResponse from '../models/time_series_response';

export interface NewPeerPayload {
  Owner: string
  Hostname: string
  Description: string
}

export interface AddPeerResponse {
  Conf: string
}

export interface ReportResponse {
  Report: DSNetReport,
  TimeSeries: TimeSeriesResponse,
}

export interface ErrorResponse {
  Error: string
}
