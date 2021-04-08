package report

import (
	"container/ring"
	"sort"
	"sync"
	"time"
)

// DataPoint is a single timestamped point
type DataPoint struct {
	TimeStamp time.Time
	Bytes     uint64
}

// TimeData is timeseries data for TX and RX
type TimeData struct {
	RX *ring.Ring
	TX *ring.Ring
}

// SampleSize is how many of xmit points we are keeping
const SampleSize = 10

var timeRing *TimeData

var timeSeriesLock sync.RWMutex

func updateDataPoints() {
	timeSeriesLock.Lock()
	defer timeSeriesLock.Unlock()
	reportDataLock.RLock()
	defer reportDataLock.RUnlock()

	timeRing.TX.Value = &DataPoint{
		TimeStamp: time.Now().Truncate(time.Microsecond).Truncate(time.Second),
		Bytes:     reportData.TransmitBytes,
	}

	timeRing.RX.Value = &DataPoint{
		TimeStamp: time.Now().Truncate(time.Microsecond).Truncate(time.Second),
		Bytes:     reportData.ReceiveBytes,
	}

	timeRing.TX = timeRing.TX.Next()
	timeRing.RX = timeRing.RX.Next()
}

func getTXDataPoints() []*DataPoint {
	timeSeriesLock.RLock()
	defer timeSeriesLock.RUnlock()
	txSeries := make([]*DataPoint, 0, SampleSize)
	timeRing.TX.Do(func(v interface{}) {
		if v != nil {
			txSeries = append(txSeries, v.(*DataPoint))
		}
	})
	sort.Slice(txSeries, func(i, j int) bool { return txSeries[i].TimeStamp.Before(txSeries[j].TimeStamp) })
	return txSeries
}

func getRxDataPoints() []*DataPoint {
	timeSeriesLock.RLock()
	defer timeSeriesLock.RUnlock()
	rxSeries := make([]*DataPoint, 0, SampleSize)

	timeRing.RX.Do(func(v interface{}) {
		if v != nil {
			rxSeries = append(rxSeries, v.(*DataPoint))
		}
	})
	sort.Slice(rxSeries, func(i, j int) bool { return rxSeries[i].TimeStamp.Before(rxSeries[j].TimeStamp) })
	return rxSeries
}
