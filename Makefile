.PHONY: all build

all: build

build:
	cd client && yarn install && yarn build
	GOOS=linux CGO_ENABLED=0 go build -a -ldflags="-s -w" -o dist/dsnet-gui .
	(type upx && upx dist/dsnet-gui) || { echo "Missing upx, can't make smaller bin :("; }

clean_ui:
	rm -rf client/build/*
	touch client/build/.keep
