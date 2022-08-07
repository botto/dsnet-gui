package peer

import (
	"fmt"
	"time"

	"github.com/naggie/dsnet/cmd/cli"
	"github.com/naggie/dsnet/lib"
)

func addPeer(newPeer peer) (lib.Peer, error) {
	conf.Lock()
	defer conf.Unlock()

	server := cli.GetServer(conf.C)

	privateKey, err := lib.GenerateJSONPrivateKey()
	if err != nil {
		return lib.Peer{}, fmt.Errorf("failed to generate private key: %s", err)
	}
	publicKey := privateKey.PublicKey()

	psk, err := lib.GenerateJSONKey()
	if err != nil {
		return lib.Peer{}, fmt.Errorf("failed to generate psk key: %s", err)
	}

	peer := lib.Peer{
		Owner:        newPeer.Owner,
		Hostname:     newPeer.Hostname,
		Description:  newPeer.Description,
		Added:        time.Now(),
		PublicKey:    publicKey,
		PrivateKey:   privateKey, // omitted from server config JSON!
		PresharedKey: psk,
		Networks:     []lib.JSONIPNet{},
	}

	if len(conf.C.Network.IPNet.Mask) > 0 {
		peer.IP, err = server.AllocateIP()
		if err != nil {
			return lib.Peer{}, fmt.Errorf("failed to allocate ip: %s", err)
		}
	}

	if len(conf.C.Network6.IPNet.Mask) > 0 {
		peer.IP6, err = server.AllocateIP6()
		if err != nil {
			return lib.Peer{}, fmt.Errorf("failed to allocate ip6: %s", err)
		}
	}

	if err := conf.C.AddPeer(peer); err != nil {
		return lib.Peer{}, fmt.Errorf("failed to add peer: %s", err)
	}

	if err := conf.C.Save(); err != nil {
		return lib.Peer{}, fmt.Errorf("failed to save peer: %s", err)
	}

	if err := server.ConfigureDevice(); err != nil {
		return lib.Peer{}, err
	}

	return peer, nil
}
