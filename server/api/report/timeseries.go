package report

import (
	"container/ring"
	"log"
	"sync"
	"time"

	"github.com/naggie/dsnet"
	"golang.zx2c4.com/wireguard/wgctrl"
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

// SampleRate is how often it will refresh the report data
const SampleRate = 10 * time.Second

// SampleSize is how many of xmit points we are keeping
const SampleSize = 10

var timeRing *TimeData

var timeSeriesLock *sync.Mutex = &sync.Mutex{}

func init() {
	timeRing = &TimeData{
		TX: ring.New(SampleSize),
		RX: ring.New(SampleSize),
	}

	go func() {
		// Wait to the next whole minute, makes things neater when sampling
		waitUntil := time.Duration(60 - time.Now().Second())
		<-time.After(waitUntil * time.Second)
		for {
			updateTimeSeriesData()
			<-time.After(SampleRate)
		}
	}()
}

func updateTimeSeriesData() {
	timeSeriesLock.Lock()
	defer timeSeriesLock.Unlock()
	wg, err := wgctrl.New()
	if err != nil {
		log.Println(err)
		return
	}
	defer wg.Close()
	dev, err := wg.Device(conf.C.InterfaceName)
	if err != nil {
		log.Println(err)
		return
	}
	newData := dsnet.GenerateReport(dev, conf.C, nil)

	timeRing.TX.Value = &DataPoint{
		TimeStamp: time.Now().Truncate(time.Microsecond).Truncate(time.Second),
		Bytes:     newData.TransmitBytes,
	}

	timeRing.RX.Value = &DataPoint{
		TimeStamp: time.Now().Truncate(time.Microsecond).Truncate(time.Second),
		Bytes:     newData.ReceiveBytes,
	}

	timeRing.TX = timeRing.TX.Next()
	timeRing.RX = timeRing.RX.Next()
}
