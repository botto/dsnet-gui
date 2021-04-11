package util

import (
	"sync"

	"github.com/naggie/dsnet"
)

// GetOwnerPeerCount returns number of peers an owner has
func GetOwnerPeerCount(conf *dsnet.DsnetConfig, owner string) int {
	peerCount := 0
	for _, p := range conf.Peers {
		if p.Owner == owner {
			peerCount++
		}
	}
	return peerCount
}

type DSConf struct {
	sync.RWMutex
	C *dsnet.DsnetConfig
}
