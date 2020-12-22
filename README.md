dsnet-gui is a web based gui for [dsnet](https://github.com/naggie)

!TODO add image when public

It's a very simple tool that gives you a self updating web ui about the dsnet controlled wireguard interface.

To make `make`  
To run do `sudo ./dsnet-gui`  
Open your browser to `http://127.0.0.1:20080`  

There are plenty of cleanup items left to do on the list

### Dev

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
