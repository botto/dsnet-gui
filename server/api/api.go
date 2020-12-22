package api

import (
	"net/http"

	rice "github.com/GeertJohan/go.rice"
	reportapi "github.com/botto/dsnet-gui/server/api/report"
	"github.com/gin-gonic/gin"
)

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
	reportapi.Routes(apiGroup.Group("report"))
}
