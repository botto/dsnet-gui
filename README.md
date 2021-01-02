# dsnet-gui

![screenshot of gui](../assets/screenshot.png)

dsnet-gui gives you an overview of all your connected WireGuard clients when using [dsnet](https://github.com/naggie/dsnet).  

To make `make`  
To run do `sudo ./dsnet-gui`  
Open your browser to `http://127.0.0.1:20080`  

This is an initial prototype for a more complex management interface that will let you control/manage your whole dsnet network

**NOTE: There is no security model currently implemented. If you wish to use dsnet-gui you must do so at your own risk and with your own security provisions. At minimum, the interface and API should be behind a HTTPS proxy with valid certificates together with an authentication mechanism such as authelia.**

## Dev

dsnet-gui is split in to 2 parts:

- An API server that uses dsnet library and serves the static app site
- A frontend client that's written in React/Typescript and talks to the API server

This will eventually just be one command

`git clone git@github.com/botto/dsnet-gui.git`  
`cd dsnet-gui/client`  
`yarn`  
`yarn start`  
New terminal  
`cd dsnet-gui`  
`sudo go run .`  
