package reportapi

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/naggie/dsnet"
	"golang.zx2c4.com/wireguard/wgctrl"
)

var conf *dsnet.DsnetConfig

func init() {
	wg, err := wgctrl.New()
	if err != nil {
		log.Panic("could not get wgctrl handler")
	}
	defer wg.Close()
	conf = dsnet.MustLoadDsnetConfig()
	_, err = wg.Device(conf.InterfaceName)
	if err != nil {
		log.Panicf("could not get device, %s", err)
		return
	}
}

// Routes sets up endpoints for peers.
func Routes(router *gin.RouterGroup) {
	router.GET("", handleGetReport)
}

func handleGetReport(c *gin.Context) {
	newReport := getReport()
	c.JSON(200, newReport)
}
