package cmd

import (
	"github.com/botto/dsnet-gui/server"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

// serveCmd represents the serve command
var serveCmd = &cobra.Command{
	Use:   "serve",
	Short: "Run server",
	Long:  `Start the api server to interact with dsnet`,
	Run: func(cmd *cobra.Command, args []string) {
		server.Start()
	},
}

func init() {
	rootCmd.AddCommand(serveCmd)

	viper.SetDefault("port", "20080")
}
