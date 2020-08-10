package reportapi

import (
	"sort"

	"github.com/naggie/dsnet"
	"golang.zx2c4.com/wireguard/wgctrl"
)

var wg *wgctrl.Client

type TimeSeriesType struct {
	TX []*DataPoint
	RX []*DataPoint
}

type Report struct {
	Report     *dsnet.DsnetReport
	TimeSeries *TimeSeriesType
}

func getReport() *Report {
	timeSeriesLock.Lock()
	defer func() {
		timeSeriesLock.Unlock()
	}()

	newData := dsnet.GenerateReport(dev, conf, nil)

	if timeRing.TX.Len() == 0 || timeRing.RX.Len() == 0 {
		return &Report{&newData, nil}
	}

	txSeries := make([]*DataPoint, 0, SampleSize)
	rxSeries := make([]*DataPoint, 0, SampleSize)

	timeRing.TX.Do(func(v interface{}) {
		if v != nil {
			txSeries = append(txSeries, v.(*DataPoint))
		}
	})

	timeRing.RX.Do(func(v interface{}) {
		if v != nil {
			rxSeries = append(rxSeries, v.(*DataPoint))
		}
	})

	sort.Slice(txSeries, func(i, j int) bool { return txSeries[i].TimeStamp.Before(txSeries[j].TimeStamp) })
	sort.Slice(rxSeries, func(i, j int) bool { return rxSeries[i].TimeStamp.Before(rxSeries[j].TimeStamp) })

	timeSeries := &TimeSeriesType{
		TX: txSeries,
		RX: rxSeries,
	}

	return &Report{&newData, timeSeries}
}
