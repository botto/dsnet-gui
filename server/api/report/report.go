package report

import (
	"container/ring"
	"fmt"
	"log"
	"sync"
	"time"

	"github.com/naggie/dsnet/cmd/cli"
	"golang.zx2c4.com/wireguard/wgctrl"
)

// SampleRate is how often it will refresh the report data
const SampleRate = 5 * time.Second

var reportDataLock sync.RWMutex

var reportData *cli.DsnetReport

type Report struct {
	Report *cli.DsnetReport
}

func start() {
	timeRing = &TimeData{
		TX: ring.New(SampleSize),
		RX: ring.New(SampleSize),
	}

	go func() {
		// Wait to the next whole minute, makes things neater when sampling
		waitUntil := time.Duration(60 - time.Now().Second())
		<-time.After(waitUntil * time.Second)
		for {
			UpdateReport()
			updateDataPoints()
			<-time.After(SampleRate)
		}
	}()
}

func UpdateReport() {
	wg, err := wgctrl.New()
	if err != nil {
		fmt.Printf("there was a problem creating a new wireguard controller: %s", err)
	}
	defer wg.Close()

	reportDataLock.Lock()
	defer reportDataLock.Unlock()
	conf.RLock()
	defer conf.RUnlock()

	dev, err := wg.Device(conf.C.InterfaceName)
	if err != nil {
		log.Printf("there was a problem getting a wireguard device: %s", err)
	}
	newData := cli.GetReport(dev, conf.C, nil)
	reportData = &newData
}

func getReport() *cli.DsnetReport {
	reportDataLock.RLock()
	defer reportDataLock.RUnlock()
	return reportData
}
