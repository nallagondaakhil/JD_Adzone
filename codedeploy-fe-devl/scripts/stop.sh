ps -ef | grep democodedeploy-0.0.1-SNAPSHOT.war | grep -v grep | awk '{if(length($2)>0) system("sudo kill -9 " $2)}'
