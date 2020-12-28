package report

import (
	"github.com/gin-gonic/gin"
	"github.com/naggie/dsnet"
)

var conf *dsnet.DsnetConfig

// Routes sets up endpoints for peers.
func Routes(router *gin.RouterGroup, dsConf *dsnet.DsnetConfig) {
	conf = dsConf
	router.GET("", handleGetReport)
}

func handleGetReport(c *gin.Context) {
	newReport := getReport()
	c.JSON(200, newReport)
}
