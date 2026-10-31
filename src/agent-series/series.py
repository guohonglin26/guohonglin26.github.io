# 「深入理解 AI Agent」学习系列配置（study_build.py 读取；原 build.py 已停用）
PREFIX = '2026-10-16-agent'
SERIES_KEY = 'agent-series'
PARTS = [
    ('', '总览', '系列目录'),
    ('1', '01', 'Agent 入门'), ('2', '02', '上下文工程'), ('3', '03', '记忆与知识库'),
    ('4', '04', '工具'), ('5', '05', 'Coding Agent'), ('6', '06', '交互扩展'),
    ('7', '07', '评估'), ('8', '08', '后训练'), ('9', '09', '持续进化'), ('10', '10', '多 Agent'),
]
FULL = {
    '1': 'AI Agent 入门', '2': '上下文工程', '3': '用户记忆和知识库', '4': '工具', '5': 'Coding Agent 与通用 Agent',
    '6': '交互：观察与动作空间的扩展', '7': 'Agent 的评估', '8': '模型后训练', '9': 'Agent 的持续进化', '10': '多 Agent 协作',
}
REPO = 'https://github.com/bojieli/ai-agent-book'
REPO_NAME = 'bojieli/ai-agent-book'
BOOK = '深入理解 AI Agent：设计原理与工程实践'
AUTHOR = '李博杰 著，Apache-2.0 协议'
BOOK_KIND = '开源书'
CREDIT = '不逐段复述原书，而是用自己的话把关键概念讲一遍，配上能动手点的小实验；原书的实验代码和思考题推荐对照阅读。'
ICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Crect x='5' y='2' width='14' height='20' rx='3' fill='none' stroke='%2313171C' stroke-width='2'/%3E%3Crect x='7' y='9' width='10' height='11' rx='1.5' fill='%232340D6'/%3E%3C/svg%3E"
HEAD = '<script src="../study-shared/agentevo.js"></script>'
RAIL = True
