package reportapi

import (
	"log"
	"os"
	"os/signal"

	"github.com/gin-gonic/gin"
	"github.com/naggie/dsnet"
	"golang.zx2c4.com/wireguard/wgctrl"
	"golang.zx2c4.com/wireguard/wgctrl/wgtypes"
)

var conf *dsnet.DsnetConfig
var dev *wgtypes.Device

func init() {
	var err error
	if wg, err = wgctrl.New(); err != nil {
		log.Panic("could not get wgctrl handler")
	}
	conf = dsnet.MustLoadDsnetConfig()
	dev, err = wg.Device(conf.InterfaceName)
	if err != nil {
		log.Panicf("could not get device, %s", err)
		return
	}

	go func() {
		quit := make(chan os.Signal)
		signal.Notify(quit, os.Interrupt)
		<-quit
		log.Println("closing wg control handler")
		wg.Close()
	}()
}

// Routes sets up endpoints for peers.
func Routes(router *gin.RouterGroup) {
	router.GET("", handleGetReport)
}

func handleGetReport(c *gin.Context) {
	newReport := getReport()
	c.JSON(200, newReport)
}
