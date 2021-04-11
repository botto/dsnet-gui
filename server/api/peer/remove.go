package peer

import "fmt"

func removePeer(hostName string) error {
	conf.Lock()
	defer conf.Unlock()

	err := conf.C.RemovePeer(hostName)
	if err != nil {
		return fmt.Errorf("could not remove peer: %s", err.Error())
	}
	conf.C.Save()
	return nil
}
