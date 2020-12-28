package api

import (
	"log"
	"net/http"

	rice "github.com/GeertJohan/go.rice"
	"github.com/botto/dsnet-gui/server/api/report"
	"github.com/botto/dsnet-gui/server/api/user"
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

// Routes all the gin routes
func Routes(router *gin.Engine) {
	box, err := rice.FindBox("client/build")

	if err == nil {
		// Serve frontend static files
		router.StaticFS("/client", box.HTTPBox())

		router.GET("/", func(c *gin.Context) {
			c.Redirect(http.StatusPermanentRedirect, "/client")
		})
	}

	apiGroup := router.Group("/api/v1")
	report.Routes(apiGroup.Group("report"), conf)
	user.Routes(apiGroup.Group("user"), conf)
}
