package api

import (
	"io/fs"
	"net/http"
	"path/filepath"
	"strings"

	"github.com/gin-contrib/static"
)

// From: https://observiq.com/blog/embed-react-in-golang/

type staticFileSystem struct {
	http.FileSystem
}

var _ static.ServeFileSystem = (*staticFileSystem)(nil)

func newStaticFileSystem() *staticFileSystem {
	sub, err := fs.Sub(clientUI, "client/build")

	if err != nil {
		panic(err)
	}

	return &staticFileSystem{
		FileSystem: http.FS(sub),
	}
}

func (s *staticFileSystem) Exists(prefix string, path string) bool {
	// Remove the URL prefix (i.e. /client)
	basePath := strings.TrimPrefix(path, prefix)

	// Build path to FS object
	pathToObject := filepath.Join("client", "build", basePath)

	// support for folders
	if strings.HasSuffix(pathToObject, "/") {
		_, err := clientUI.ReadDir(strings.TrimSuffix(pathToObject, "/"))
		return err == nil
	}

	// support for files
	f, err := clientUI.Open(pathToObject)
	if f != nil {
		f.Close()
	}
	return err == nil
}
