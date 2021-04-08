package report

import (
	"container/ring"
	"fmt"
	"sync"
	"time"

	"github.com/naggie/dsnet"
	"golang.zx2c4.com/wireguard/wgctrl"
)

// SampleRate is how often it will refresh the report data
const SampleRate = 10 * time.Second

var reportDataLock sync.RWMutex

var reportData *dsnet.DsnetReport

var wg *wgctrl.Client

type Report struct {
	Report *dsnet.DsnetReport
}

func start() {
	timeRing = &TimeData{
		TX: ring.New(SampleSize),
		RX: ring.New(SampleSize),
	}

	go func() {
		// Wait to the next whole minute, makes things neater when sampling
		// waitUntil := time.Duration(60 - time.Now().Second())
		// <-time.After(waitUntil * time.Second)
		for {
			updateReport()
			updateDataPoints()
			<-time.After(SampleRate)
		}
	}()
}

func updateReport() {
	wg, err := wgctrl.New()
	if err != nil {
		fmt.Printf("There was a problem: %s", err)
	}
	defer wg.Close()

	reportDataLock.Lock()
	defer reportDataLock.Unlock()
	conf.Lock()
	defer conf.Unlock()

	dev, err := wg.Device(conf.C.InterfaceName)
	newData := dsnet.GenerateReport(dev, conf.C, nil)
	reportData = &newData
}

func getReport() Report {
	reportDataLock.RLock()
	defer reportDataLock.RLock()

	return Report{reportData}
}
