import DSNetReport from '../models/report';

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
}

export interface ErrorResponse {
  Error: string
}

export interface OverviewReport {
  Report: DSNetReport;
};
