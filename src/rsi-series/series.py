# 「可信递归自我改进（Trustworthy RSI）」学习系列配置（study_build.py 读取）
PREFIX = '2026-10-30-rsi'
SERIES_KEY = 'rsi-series'
PARTS = [
    ('', '总览', '复习台'),
    ('1', '01', '什么是 RSI'), ('2', '02', '可信框架'), ('3', '03', '真实提升'), ('4', '04', '约束与对齐'),
    ('5', '05', '安全与隐私'), ('6', '06', '透明与可控'), ('7', '07', '怎么评估'), ('8', '08', '应用与难题'),
]
FULL = {
    '1': 'RSI 的定义：h、B、U 三层与 S1–S4 循环', '2': '可信框架：八组要求、四个主题、三层主张',
    '3': '真实且持续的提升', '4': '行为约束、对齐与公平', '5': '系统安全、韧性、隐私与数据治理',
    '6': '透明与可控：监督还管用吗', '7': '评估可信 RSI：成对续跑与联合判据', '8': '应用场景、开放问题与结论',
}
REPO = 'https://arxiv.org/abs/2610.35193'
REPO_NAME = 'arXiv:2610.35193'
BOOK = 'Trustworthy Recursive Self-Improvement in the Era of Large Models: Foundation, Risks, Evaluation and Open Challenges'
AUTHOR = 'Jiayue Pu、Ang Gao 等，中国人民大学高瓴人工智能学院，2026 年 10 月 26 日 v1'
BOOK_KIND = '综述论文'
CREDIT = '原文正文 56 页，另有约 25 页参考文献和附录。这里按原文第 2–8 节重排成八篇，用自己的话重讲：定义和框架做成可以动手的分类、分步演示，风险和保障按 S1–S4 / RI 做成可切换的对照，评估设计配真实计算。每节标出原文页码；原文数字标“原文数据”，演示数值标“示意”。原文把证据分成“RSI 中直接观察到的”和“相关系统中的”，本笔记沿用这个区分。'
ICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 4a8 8 0 1 1-7.4 5' fill='none' stroke='%2313171C' stroke-width='2.2' stroke-linecap='round'/%3E%3Cpath d='M2 6l2.6 3 3-2.4' fill='none' stroke='%2313171C' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'/%3E%3Ccircle cx='12' cy='12' r='3.2' fill='%232340D6'/%3E%3C/svg%3E"
RAIL = True
HEAD = '<script src="../study-shared/agentevo.js"></script>'
