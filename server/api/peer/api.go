package peer

import (
	"errors"
	"fmt"
	"net/http"

	"github.com/botto/dsnet-gui/server/api/report"
	"github.com/botto/dsnet-gui/server/auth"
	"github.com/botto/dsnet-gui/server/util"
	"github.com/gin-gonic/gin"
	"github.com/naggie/dsnet"
)

var conf *util.DSConf

type peer struct {
	Owner       string `json:",omitempty"`
	Hostname    string
	Description string
}

// Routes sets up endpoints for peers.
func Routes(router *gin.RouterGroup, dsConf *util.DSConf) {
	conf = dsConf
	router.POST("", handleNew)
	router.DELETE("/:hostname", handleRemove)
	router.PATCH("", handleUpdate)
}

func handleNew(c *gin.Context) {
	peerData, err := getPeerData(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"Error": err.Error(),
		})
		return
	}

	peer, err := addPeer(peerData)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"Error": err.Error(),
		})
		return
	}

	peerConf, err := dsnet.GetWGPeerTemplate(dsnet.WGQuick, peer, conf.C)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"Error": fmt.Sprintf("could not get wg template: %s", err.Error()),
		})
	}

	report.UpdateReport()
	c.JSON(http.StatusOK, gin.H{
		"Conf": peerConf.String(),
	})
}

func handleRemove(c *gin.Context) {
	hostName := c.Param("hostname")
	err := removePeer(hostName)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"Error": err.Error(),
		})
		return
	}
	report.UpdateReport()
	c.Status(http.StatusNoContent)
}

func handleUpdate(c *gin.Context) {
	peerData, err := getPeerData(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"Error": err.Error(),
		})
		return
	}

	err = updatePeer(peerData)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"Error": err.Error(),
		})
		return
	}
	report.UpdateReport()
}

func getPeerData(c *gin.Context) (peer, error) {
	conf.Lock()
	defer conf.Unlock()
	var peerData peer
	var auth auth.Headers

	if err := c.BindJSON(&peerData); err != nil {
		return peer{}, err
	}

	// Grab auth headers
	c.ShouldBindHeader(&auth)

	// Override user field if set
	if auth.User != "" {
		peerData.Owner = auth.User
	}

	if peerData.Owner == "" {
		return peer{}, errors.New("missing Owner field")
	}

	if auth.MaxPeers != 0 {
		peerCount := util.GetOwnerPeerCount(conf.C, peerData.Owner)
		if peerCount >= auth.MaxPeers {
			return peer{}, errors.New("user has exceeded allowed number of peers")
		}
	}
	return peerData, nil
}
