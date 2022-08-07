package server

import (
	"embed"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strings"

	"github.com/botto/dsnet-gui/server/api"
	"github.com/botto/dsnet-gui/server/util"
	"github.com/gin-gonic/gin"
	"github.com/spf13/viper"
	"golang.zx2c4.com/wireguard/wgctrl"
)

var router = gin.New()

// Start launches the HTTP server. This method will not return until the server
// is shutdown.
func Start(clientUI *embed.FS) {
	port := viper.GetString("port")

	wg, err := wgctrl.New()
	if err != nil {
		log.Fatalf("could not get wgctrl handler")
	}
	defer wg.Close()

	dsnetConfig, err := util.LoadConfigFile()
	if err != nil {
		log.Fatalf("failed to load config file: %s", err)
	}

	conf := &util.DSConf{
		C: dsnetConfig,
	}

	_, err = wg.Device(conf.C.InterfaceName)
	if err != nil {
		log.Panicf("could not get device, %s", err)
		return
	}

	listenString := fmt.Sprintf(":%v", port)

	router.Use(gin.Recovery())
	addCORSHandler()
	add404Handler()

	api.Routes(router, clientUI, conf)

	listenAndServe(listenString)
}

// Add CORS header handling
func addCORSHandler() {
	router.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})
}

// Add 404 handler for unknown routes
func add404Handler() {
	router.NoRoute(func(c *gin.Context) {
		path := c.Request.URL.Path
		if strings.HasPrefix(path, "/api") {
			c.JSON(404, map[string]interface{}{"error": "API endpoint not found"})
		} else {
			c.String(404, "404 not found")
		}
	})
}

// Start a HTTP listener and handle requests. Blocks until the server is stopped.
func listenAndServe(listenString string) {
	srv := &http.Server{
		Addr:    listenString,
		Handler: router,
	}
	go func() {
		err := srv.ListenAndServe()
		if err != nil && err != http.ErrServerClosed {
			log.Fatalf("server error: %s\n", err)
		}
	}()

	log.Printf("waiting for incoming connections on: %s", listenString)

	quit := make(chan os.Signal)
	signal.Notify(quit, os.Interrupt)
	sig := <-quit
	log.Printf("shutting down: %+v\n", sig)
}
