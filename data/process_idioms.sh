#!/bin/bash

cd `dirname "$0"`

if [ ! -f idiom.json ]
then
    echo "idiom.json not found. Downloading..."
    wget https://ghproxy.com/https://github.com/pwxcoo/chinese-xinhua/raw/master/data/idiom.json
fi

if [ ! -f THUOCL_chengyu.txt ]
then
    echo "THUOCL_chengyu.txt not found. Downloading..."
    wget http://thuocl.thunlp.org/source/THUOCL_chengyu.txt
fi

python3 process_idioms.py
