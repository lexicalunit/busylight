#!/bin/bash -ue

npm install
mkdir -p /opt/busylight
cp -r node_modules cli.js /opt/busylight
test -e busylight.json && cp "$_" /opt/busylight
