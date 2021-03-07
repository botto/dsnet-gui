package peer

import (
	"fmt"
	"net/http"

	"github.com/botto/dsnet-gui/server/auth"
	"github.com/botto/dsnet-gui/server/util"
	"github.com/gin-gonic/gin"
	"github.com/naggie/dsnet"
)

var conf *dsnet.DsnetConfig

type peer struct {
	Owner       string `json:",omitempty"`
	Hostname    string
	Description string
}

// Routes sets up endpoints for peers.
func Routes(router *gin.RouterGroup, dsConf *dsnet.DsnetConfig) {
	conf = dsConf
	router.POST("", handleNewPeer)
	router.DELETE("/:hostname", handleRemovePeer)
}

func handleNewPeer(c *gin.Context) {
	var newPeerData peer
	var auth auth.Headers

	if err := c.BindJSON(&newPeerData); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"Error": err,
		})
		return
	}

	// Grab auth headers
	c.ShouldBindHeader(&auth)

	// Override user field if set
	if auth.User != "" {
		newPeerData.Owner = auth.User
	}

	if newPeerData.Owner == "" {
		c.JSON(http.StatusForbidden, gin.H{
			"Error": "missing Owner field",
		})
		return
	}

	if auth.MaxPeers != 0 {
		peerCount := util.GetOwnerPeerCount(conf, newPeerData.Owner)
		if peerCount >= auth.MaxPeers {
			c.JSON(http.StatusForbidden, gin.H{
				"Error": "user has exceeded allowed number of peers",
			})
			return
		}
	}

	peer, err := addNewPeer(newPeerData)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"Error": err.Error(),
		})
		return
	}

	peerConf, err := dsnet.GetWGPeerTemplate(dsnet.WGQuick, peer, conf)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"Error": fmt.Sprintf("could not get wg template: %s", err.Error()),
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"Conf": peerConf.String(),
	})
}

func handleRemovePeer(c *gin.Context) {
	hostName := c.Param("hostname")

	err := conf.RemovePeer(hostName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"Error": fmt.Sprintf("could not remove peer: %s", err.Error()),
		})
		return
	}
	c.Status(http.StatusNoContent)
}
