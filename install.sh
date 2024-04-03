#!/bin/bash -ue

yarn install
mkdir -p /opt/busylight
cp -r node_modules cli.js package.json yarn.lock /opt/busylight
test -e busylight.json && cp "$_" /opt/busylight
