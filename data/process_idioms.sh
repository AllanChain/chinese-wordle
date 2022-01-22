#!/bin/bash

cd `dirname "$0"`

if [ ! -f idiom.json ]
then
    echo "idiom.json not found. Downloading..."
    wget https://ghproxy.com/https://github.com/pwxcoo/chinese-xinhua/raw/master/data/idiom.json
    sed -i 's/　/ /g;s/ɡ/g/g;s/ùo/uò/g;s/ùo/uò/g;s/oǔ/ǒu/g;s/ùi/uì/g;s/íe/ié/g;s/ùi/uì/g;s/ǐe/iě/g;s/aō/āo/g;s/ìan/iàn/g;s/īan/iān/g' idiom.json
fi

if [ ! -f THUOCL_chengyu.txt ]
then
    echo "THUOCL_chengyu.txt not found. Downloading..."
    wget http://thuocl.thunlp.org/source/THUOCL_chengyu.txt
fi

if [ ! -f zdic_cybs.txt ]
then
    echo "zdic_cybs.txt not found. Downloading..."
    wget https://ghproxy.com/https://github.com/mozillazg/phrase-pinyin-data/raw/master/zdic_cybs.txt
fi

python3 process_idioms.py
