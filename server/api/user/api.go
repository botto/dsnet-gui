package user

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/naggie/dsnet"
)

var conf *dsnet.DsnetConfig

// Routes sets up endpoints for peers.
func Routes(router *gin.RouterGroup, dsConf *dsnet.DsnetConfig) {
	conf = dsConf
	router.POST("", handleNewUser)
}

func handleNewUser(c *gin.Context) {
	peer, err := addNewUser(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"Error": err,
		})
		return
	}

	peerConf, err := dsnet.GetWGPeerTemplate(dsnet.WGQuick, peer, conf)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"Error": fmt.Sprintf("could not get wg template: %s", err),
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"Conf": peerConf.String(),
	})
}
