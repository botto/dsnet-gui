package peer

import (
	"time"

	"github.com/naggie/dsnet"
)

func addPeer(newPeer peer) (*dsnet.PeerConfig, error) {
	conf.Lock()
	defer conf.Unlock()
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

	if len(conf.C.Network.IPNet.Mask) > 0 {
		peer.IP = conf.C.MustAllocateIP()
	}

	if len(conf.C.Network6.IPNet.Mask) > 0 {
		peer.IP6 = conf.C.MustAllocateIP6()
	}

	if err := conf.C.AddPeer(peer); err != nil {
		return nil, err
	}

	if err := conf.C.Save(); err != nil {
		return nil, err
	}

	if err := dsnet.ConfigureDevice(conf.C); err != nil {
		return nil, err
	}

	return &peer, nil
}
