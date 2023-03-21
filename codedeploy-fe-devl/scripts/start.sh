#!/bin/bash
echo "APPLICATION START"
cd /home/ec2-user/server
sudo nohup java -jar *.jar > /dev/null 2> /dev/null < /dev/null &
