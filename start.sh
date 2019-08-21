#!/bin/bash

sed -i "s/here_for_flag/$FLAG/g" /pptruser/challenge/tool/make_flag.js

export FLAG=not_flag
FLAG=not_flag

cd /pptruser/challenge/ && node app.js >> log.txt
