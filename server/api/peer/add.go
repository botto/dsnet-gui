package peer

import (
	"time"

	"github.com/naggie/dsnet"
)

func addNewPeer(newPeer peer) (*dsnet.PeerConfig, error) {
	privateKey := dsnet.GenerateJSONPrivateKey()
	publicKey := privateKey.PublicKey()

	peer := dsnet.PeerConfig{
		Owner:        newPeer.Owner,
		Hostname:     newPeer.Hostname,
		Description:  newPeer.Description,
		Added:        time.Now(),
		PublicKey:    publicKey,
		PrivateKey:   privateKey, // omitted from server config JSON!
		PresharedKey: dsnet.GenerateJSONKey(),
		Networks:     []dsnet.JSONIPNet{},
	}

	if len(conf.Network.IPNet.Mask) > 0 {
		peer.IP = conf.MustAllocateIP()
	}

	if len(conf.Network6.IPNet.Mask) > 0 {
		peer.IP6 = conf.MustAllocateIP6()
	}

	if err := conf.AddPeer(peer); err != nil {
		return nil, err
	}

	if err := conf.Save(); err != nil {
		return nil, err
	}

	if err := dsnet.ConfigureDevice(conf); err != nil {
		return nil, err
	}

	return &peer, nil
}
