
import DSNetReport from '../models/dsnet_report';
import TimeSeries from '../models/time_series';
import TimeSeriesResponse from '../models/time_series_response';
import rawReq from './rawReq';
enum GetEndpoint {
  report = 'report'
}


interface ReportResponse {
  Report: DSNetReport,
  TimeSeries: TimeSeriesResponse,
}

type ResponseTypes<E> =
  E extends GetEndpoint.report ? ReportResponse :
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

export {
  getReport
};
