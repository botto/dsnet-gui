package report

import (
	"github.com/botto/dsnet-gui/server/util"
	"github.com/gin-gonic/gin"
)

var conf *util.DSConf

// Routes sets up endpoints for peers.
func Routes(router *gin.RouterGroup, dsConf *util.DSConf) {
	conf = dsConf
	router.GET("", handleGetReport)
}

func handleGetReport(c *gin.Context) {
	conf.Lock()
	newReport := getReport()
	conf.Unlock()
	c.JSON(200, newReport)
}
