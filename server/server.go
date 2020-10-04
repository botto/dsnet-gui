package server

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strings"

	"github.com/botto/dsnet-gui/server/api"
	"github.com/gin-gonic/gin"
	"github.com/spf13/viper"
)

var router = gin.Default()

// Start launches the HTTP server. This method will not return until the server
// is shutdown.
func Start() {
	port := viper.GetString("port")
	env := viper.GetString("env")

	gin.SetMode(env)

	listenString := fmt.Sprintf(":%v", port)

	addCORSHandler()
	add404Handler()

	api.Routes(router)

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
			c.JSON(404, map[string]interface{}{"Error": "API Endpoint not found"})
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
