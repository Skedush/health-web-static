#!/bin/bash
shaid=`curl -v --silent -H "Accept: application/vnd.docker.distribution.manifest.v2+json" -X GET http://192.168.70.225/v2/property-management-static-web/manifests/1.0.1 2>&1 | grep Docker-Content-Digest | awk '{print ($3)}'`
echo "sha is $shaid"
url="http://192.168.70.225/v2/property-management-static-web/manifests/$shaid"
echo "url is $url"
url=${url%$'\r'}
curl -v --silent -H "Accept: application/vnd.docker.distribution.manifest.v2+json" -X DELETE "$url"
