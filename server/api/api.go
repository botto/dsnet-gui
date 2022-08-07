package api

import (
	"embed"

	"github.com/botto/dsnet-gui/server/api/peer"
	"github.com/botto/dsnet-gui/server/api/report"
	"github.com/botto/dsnet-gui/server/util"
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
)

var clientUI embed.FS

// Routes all the gin routes
func Routes(router *gin.Engine, clientUI_ *embed.FS, conf_ *util.DSConf) {
	clientUI = *clientUI_

	apiGroup := router.Group("/api/v1")
	report.Routes(apiGroup.Group("report"), conf_)
	peer.Routes(apiGroup.Group("peer"), conf_)

	embeddedBuildFolder := newStaticFileSystem()
	router.Use(static.Serve("/client", embeddedBuildFolder))
}
