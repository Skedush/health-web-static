#!/bin/bash
docker build -t 192.168.70.225/property-management-static-web:1.0.1 .
docker push 192.168.70.225/property-management-static-web:1.0.1
