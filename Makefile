.PHONY: all build

all: build

deps:
	go get github.com/GeertJohan/go.rice/rice

build:
	export REACT_APP_API_BASE_URL="//:20080/api/v1"
	cd client && yarn install && yarn build
	rice embed-go
	GOOS=linux GIN_MODE=release CGO_ENABLED=0 go build -a -ldflags="-s -w" -o dist/dsnet-gui .
	(type upx && upx dist/dsnet-gui) || { echo "Missing upx, can't make smaller bin :("; }
