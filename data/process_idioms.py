"""
reviewed.txt 中，“屡试不爽”及以前的是直接从 THUOCL 的高频成语中筛选得到的；
之后的是根据高考成语，从 THUOCL 的成语中选出的。

correction.csv 中是在 THUOCL 中的成语，利用 pypinyin 和“新华词典”校对得到的。
对于不在 THUOCL 中的，“新华词典”注音错误的成语，直接扔掉。
"""

import json
import re
from pathlib import Path

import pandas as pd
import pypinyin
from pypinyin_dict.pinyin_data import kxhc1983

kxhc1983.load()
pypinyin.load_single_dict(
    {
        ord("迹"): "jì",
        ord("绩"): "jì",
        ord("卓"): "zhuó",
    }
)

HERE = Path(__file__).parent
ASSETS = HERE.parent / "src" / "assets"

TONGJIAZI_PATTERN = r'(?:["，。]|^)([^"，。])通[^"，。]["“”，。]'


correction_df = pd.read_csv(HERE / "correction.csv", index_col="word")


def suggest_pinyin(word, pinyin_x, pinyin_y, explanation):
    pinyin_x_split = pinyin_x.split(" ")
    pinyin_y_split = pinyin_y.split(" ")
    pinyins = []
    all_tongjiazi = re.findall(TONGJIAZI_PATTERN, explanation)
    for i, char in enumerate(word):
        if char == "一":
            pinyins.append("yī")
            continue
        p = pypinyin.pinyin(char, heteronym=True)[0]
        if char in all_tongjiazi:
            pinyins.append(pinyin_x_split[i])
        elif len(p) == 1:
            pinyins.append(p[0])
        elif pinyin_x_split[i] in p:
            pinyins.append(pinyin_x_split[i])
        elif pinyin_y_split[i] in p:
            pinyins.append(pinyin_y_split[i])
        elif word in correction_df.index:
            return correction_df.loc[word].pinyin
        else:
            return ""
    return " ".join(pinyins)


xinhua_df = pd.read_json(HERE / "idiom.json")
xinhua_df = xinhua_df[["word", "pinyin", "explanation"]][xinhua_df.word.str.len() == 4]
zdic_df = pd.read_table(
    HERE / "zdic_cybs.txt",
    header=None,
    sep=": ",
    names=["word", "pinyin"],
    engine="python",
)
zdic_df = zdic_df[zdic_df.word.str.len() == 4]
cy_df = pd.merge(xinhua_df, zdic_df, on="word", how="inner")

cy_df["pinyin"] = cy_df.apply(
    lambda row: suggest_pinyin(row.word, row.pinyin_x, row.pinyin_y, row.explanation),
    axis=1,
)
cy_df.drop(["explanation"], axis=1, inplace=True)
cy_df[(cy_df.pinyin_x != cy_df.pinyin) & (cy_df.pinyin_y != cy_df.pinyin)].to_csv(
    HERE / "bad_df.csv", index=False
)
cy_df[cy_df.pinyin == ""].to_csv(HERE / "noop_df.csv", index=False)
cy_df = cy_df[cy_df.pinyin != ""][["word", "pinyin"]]
cy_df.to_csv(HERE / "zdic_df.csv", index=False)

output_idioms = {word: pinyin for (_, word, pinyin) in cy_df.itertuples()}

with open(ASSETS / "all-idioms.json", "w") as f:
    json.dump(output_idioms, f, ensure_ascii=False)

review_df = pd.read_table(HERE / "reviewed.txt", header=None, names=["word"])
idiom_df = pd.merge(review_df, cy_df, on="word", how="inner")

with open(ASSETS / "freq-idioms.json", "w") as f:
    json.dump(idiom_df["word"].tolist(), f, ensure_ascii=False)
