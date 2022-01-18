"""
This script is not intended to be run directly. It is used by `process_idioms.sh`.
This script will output a list of idioms to stdout.

Data used by the script:
    1. https://github.com/pwxcoo/chinese-xinhua/raw/master/data/idiom.json
    2. http://thuocl.thunlp.org/source/THUOCL_chengyu.txt
They are not included in the repository. Please download them and place them
in the same directory as this script.
"""


from pathlib import Path
from sys import stdout

import pandas as pd

HERE = Path(__file__).parent
PUBLIC = HERE.parent / "public"

thu_df = pd.read_table(
    HERE / "THUOCL_chengyu.txt", header=None, sep="\s+", names=["word", "freq"]
)
xinhua_df = pd.read_json(HERE / "idiom.json")
idiom_df = pd.merge(thu_df, xinhua_df, on="word", how="inner")

idiom_df = idiom_df.loc[(idiom_df.freq > 50) & (idiom_df.word.str.len() == 4)]
idiom_df = idiom_df[["word", "pinyin"]]
idiom_df.to_json(stdout, force_ascii=False, orient="records")
