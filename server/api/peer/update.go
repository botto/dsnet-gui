package peer

import (
	"fmt"
	"log"
)

func updatePeer(newPeer peer) error {
	// Create a backup of the peers slice so we can restore it on problems
	backupPeers := conf.C.Peers
	defer func() {
		if r := recover(); r != nil {
			log.Printf("recovered from update, restoring peers")
			conf.C.Peers = backupPeers
			conf.C.Save()
		}
	}()

	// Track how many peers we update
	updated := 0

	for _, c := range conf.C.Peers {
		if newPeer.Hostname == c.Hostname {
			c.Description = newPeer.Description
			c.Owner = newPeer.Owner
			updated++
		}
	}

	// Error out if we get more than 1 peer updated
	if updated > 1 {
		conf.C.Peers = backupPeers
		return fmt.Errorf("updatedd %d peers instead of just 1 peer", updated)
	}

	// Save new peer list
	err := conf.C.Save()
	if err != nil {
		return fmt.Errorf("error while updating peers: %s", err.Error())
	}
	return nil
}
