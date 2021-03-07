import DSNetReport from '../models/report';
import TimeSeries, { TimeSeriesResponse } from '../models/time_series';

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
export interface OverviewReport {
  Report: DSNetReport;
  TimeSeries: TimeSeries;
};
