package api

import (
	"net/http"

	reportapi "github.com/botto/dsnet-gui/server/api/report"
	"github.com/gin-gonic/gin"
	"github.com/gobuffalo/packr"
)

// Routes all the gin routes
func Routes(router *gin.Engine) {

	clientBox := packr.NewBox("../../client/build")

	// Serve frontend static files
	router.StaticFS("/client/", clientBox)

	router.GET("/", func(c *gin.Context) {
		c.Redirect(http.StatusPermanentRedirect, "/client")
	})

	apiGroup := router.Group("/api/v1")

	reportapi.Routes(apiGroup.Group("report"))
}
