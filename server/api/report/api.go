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
	router.GET("/traffic/rx", handleGetRXTimeSeries)
	router.GET("/traffic/tx", handleGetTXTimeSeries)

	// Once routes are up and the conf is set, start the background tasks
	start()
}

func handleGetReport(c *gin.Context) {
	newReport := getReport()
	c.JSON(200, newReport)
}

func handleGetRXTimeSeries(c *gin.Context) {
	data := getRxDataPoints()
	c.JSON(200, data)
}

func handleGetTXTimeSeries(c *gin.Context) {
	data := getTXDataPoints()
	c.JSON(200, data)
}
