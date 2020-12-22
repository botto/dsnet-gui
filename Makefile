.PHONY: all build

all: build

deps:
	go get github.com/GeertJohan/go.rice/rice

build:
	cd client && yarn install && yarn build
	rice embed-go
	GOOS=linux CGO_ENABLED=0 go build -a -ldflags="-s -w" -o dist/dsnet-gui .
	(type upx && upx dist/dsnet-gui) || { echo "Missing upx, can't make smaller bin :("; }
	rice clean
