#!/usr/bin/env bash

WGNET=10.253.140.0/24

if [[ $EUID -ne 0 ]]; then
   echo "You think this works without root?" 
   exit 1
fi

function setup() {
    let peerVethId=$1+1
    peerVethDev="net${peerVethId}veth"
    hostVethDev="net${1}veth"
    ip netns add "net$1"
    ip link add "wgc$1" type wireguard
    ip link set "wgc$1" netns "net$1"
    ip -n "net$1" addr add $2 dev "wgc$1"
    ip link add $hostVethDev type veth peer name $peerVethDev netns "net$1"
    ip addr add "$3.1/24" dev $hostVethDev
    ip link set $hostVethDev up
    ip -n "net$1" addr add "$3.2/24" dev $peerVethDev
    ip -n "net$1" link set $peerVethDev up
    ip netns exec "net$1" wg setconf "wgc$1" "./wgc$1.conf"
    ip -n "net$1" link set "wgc$1" up
    ip -n "net$1" route add $WGNET dev "wgc$1"
}

function configureDsnet() {
    if [[ -f /etc/dsnetconfig.json ]]; then
        cp /etc/dsnetconfig.json /etc/dsnetconfig.json.bak
    fi
    cp ./dsnetconfig.json /etc/dsnetconfig.json
    dsnet up
}

setup 0 10.253.140.2/32 10.150.1
setup 2 10.253.140.3/32 10.150.2
configureDsnet
