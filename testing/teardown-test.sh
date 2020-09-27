#!/usr/bin/env bash

if [[ $EUID -ne 0 ]]; then
   echo "You think this works without root?" 
   exit 1
fi


function teardown() {
    ip netns delete "net$1"
}

function restoreDsnet() {
    dsnet down
    rm /etc/dsnetconfig.json
    if [[ -f /etc/dsnetconfig.json ]]; then
        cp /etc/dsnetconfig.json.bak /etc/dsnetconfig.json
    fi
}

teardown 0
teardown 2
restoreDsnet
