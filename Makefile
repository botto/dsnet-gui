.PHONY: all build

all: build

build:
	export REACT_APP_API_BASE_URL="//:20080/api/v1"
	cd client && npm i && npm run build
	GIN_MODE=release go build -a -ldflags="-s -w" -o dist/dsnet-gui .
	(type upx && upx dist/dsnet-gui) || { echo "Missing upx, can't make smaller bin :("; }
