package util

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"sync"

	"github.com/go-playground/validator"
	"github.com/naggie/dsnet/cmd/cli"
	"github.com/spf13/viper"
)

// GetOwnerPeerCount returns number of peers an owner has
func GetOwnerPeerCount(conf *cli.DsnetConfig, owner string) int {
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
	C *cli.DsnetConfig
}

// LoadConfigFile parses the json config file, validates and stuffs
// it in to a struct
func LoadConfigFile() (*cli.DsnetConfig, error) {
	fmt.Printf("Port: %d\n", viper.GetInt("port"))
	configFile := viper.GetString("config_file")
	raw, err := ioutil.ReadFile(configFile)

	if os.IsNotExist(err) {
		return nil, fmt.Errorf("%s does not exist. `dsnet init` may be required", configFile)
	} else if os.IsPermission(err) {
		return nil, fmt.Errorf("%s cannot be accessed. Sudo may be required", configFile)
	} else if err != nil {
		return nil, err
	}

	conf := cli.DsnetConfig{}
	err = json.Unmarshal(raw, &conf)
	if err != nil {
		return nil, err
	}

	err = validator.New().Struct(conf)
	if err != nil {
		return nil, err
	}

	if conf.ExternalHostname == "" && len(conf.ExternalIP) == 0 && len(conf.ExternalIP6) == 0 {
		return nil, fmt.Errorf("config does not contain ExternalIP, ExternalIP6 or ExternalHostname")
	}

	return &conf, nil
}
