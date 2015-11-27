#!/bin/bash

DIRNAME=`dirname "$0"`
DIRNAME=$(readlink -f "$DIRNAME")

casperjs $DIRNAME/noip_auto_renew.js
