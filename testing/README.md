# Testing

This is a fixture for testing with dsnet-gui to do development.  
It will set up 3 nodes, 2 in namespaces to pretend they are remote and one in the main.  
IT WILL OVERWRITE YOUR `/etc/dsnetconfig.json` FILE, however it does make a backup and 
restores it when running the teardown.  

# Usage

To set up run `sudo ./setup-test.sh` which will set up the nodes and start dsnet.  
You can then execute commands in the namespaces.  

## Simulate traffic

To simulate some traffic between nodes you can use `iperf3`.  
Host: `iperf3 -s`  
Net0 NS: `sudo ip netns exec net0 iperf3 -c 10.253.140.1 --bidir -t 120`
Net2 NS: `sudo ip netns exec net2 iperf3 -c 10.253.140.1 --bidir -t 120`

This will send traffic bidirectionally between the host and the namespace for 2 minutes 
from both nodes.  

## Teardown

Once your finished run `sudo ./teardown-test.sh` which will remove the 
namespaces and restore the old dsnet config


# Warning
Don't ever use the dsnetconfig in this repo for your own set up, as the keys here are tainted by being public.  