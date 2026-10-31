# AI 观察笔记

个人 AI 博客，纯静态 HTML，无构建步骤，托管于 GitHub Pages。

## 目录

```
index.html              首页（文章列表）
assets/site.css         公共配色、字体、页眉页脚（含深色模式）
assets/site.js          深浅色切换
posts/study-shared/     所有系列共用的样式和脚本（series.css / series.js），以及各系列专用组件
posts/<slug>/index.html 每篇文章一个文件夹，自包含
src/agent-series/       深入理解 AI Agent 系列（2026-10-31 起改用 study_build.py）
src/study_build.py      通用系列构建脚本：python3 study_build.py <系列目录> all（或 0 1 2 …）
src/adp-series/         智能体设计模式系列（series.py 为配置，chN.html 为片段）
src/infra-series/       AI Infra 系列
src/nndl-series/        神经网络与深度学习（第二版）系列（ch0 由 gen_ch0.py 按 ch0.tpl.html 汇总各章生成，改章节后先运行它再 build）
src/handbook-series/    AI Agent Handbook 系列（专用组件在 posts/study-shared/handbook.js/.css；ch0 同样由 gen_ch0.py 汇总生成）
src/easyvibe-series/    Easy-Vibe 系列（专用组件在 posts/study-shared/easyvibe.js/.css：提示词卡、模板填空、请求流、动手清单；ch0 由 gen_ch0.py 汇总三问、易混、提示词库和清单进度）
src/rsi-series/         可信递归自我改进（Trustworthy RSI 综述）系列（专用组件在 posts/study-shared/rsi.js/.css：分阶段对照、证据标记、分步流程、研究条目列表）
演进链与通用新组件（RL 两个系列先行试点）：series.py 里 HEAD 给每页追加标签、RAIL = True 启用阅读进度与宽屏侧栏目录；
                        posts/study-shared/rlevo.js 是两个 RL 系列共用的演进链数据（每站做了什么 / 卡在哪，每篇一张“为什么需要这一篇”卡），series.js 自动插到三问前；
                        正文里写 <div class="eqx"> 即彩色拆解公式（data-t="1".."5" 对应图例），S.ablate 是“拿掉一个零件会怎样”，.pipe 是流程图
```

## 首页的主题地图

首页默认“按主题”看，数据在 index.html 末尾的 TOPICS（另有“按时间”的发布列表）。分类原则（以后内容多了可以再调）：

- 大类参照 Chrome 收藏夹的文件夹：AI 基础 → 大模型 → 智能体 → AI 编程 → 6G 与通信 → 工程开发，从底层到应用排列。
- 每个大类下的方向按学习顺序从左到右排；还没写的方向也列出来，标“待补”，首页同时就是待写清单。
- 同一方向有多套系列时，用 seq 标先读、后读；有演进链的主题用 chain 链到演进链所在页。
- 新文章写好后两处都要加：按时间列表最上面一条，以及 TOPICS 里对应的方向。

## 学习链与全站搜索

- 主题学习链：posts/study-shared/rlevo.js（强化学习演进链，按篇写卡）、agentevo.js（智能体能力链，卡写在站上、同站各篇共用）；全览页 posts/topic-rl/、posts/topic-agent/。系列要显示篇首位置卡，就在它的 series.py 里用 HEAD 加载对应的数据文件。
- 全览页上的篇名来自 posts/study-shared/evo-titles.js：新增系列或改篇名后运行 `python3 src/gen_evo_titles.py`。
- 全站搜索（页眉“搜索”按钮，⌘K / Ctrl+K 或 /）：索引 assets/search-index.js 由 `python3 src/gen_search.py` 生成，发布新文章后要重新运行；收录篇名、小节、速记、易混辨析、公式卡和正文里的加粗要点。

## 新增文章

1. 新建 `posts/<日期-主题>/index.html`，引用 `../../assets/site.css` 和 `../../assets/site.js`，沿用页眉页脚结构。
2. 在 `index.html` 的 TOPICS 里把它挂到对应方向，并在文章列表最上面加一条 `<li class="post" data-kind="learn|report">`，标签第一个用分类徽章（`<span class="cat">技术学习</span>` 或 `<span class="cat rep">报告解读</span>`），并更新"共 N 篇"。文章页 kicker 第一项也写分类名。
3. 运行 `python3 src/gen_search.py` 更新搜索索引。
4. 推送到 GitHub，Pages 自动发布。

## 本地预览

```
python3 -m http.server 8765
```

然后打开 http://localhost:8765/

## 约定

- 不依赖任何外部 CDN 和网络字体，图表用原生 SVG 手写，保证国内网络下打开不卡。
- 文字最小 15px；每张图都注明数据出处。

## 写作原则

这个博客首先是自己的学习笔记：帮我快速消化资料、理解概念、记住要点，方便以后复习和查阅；分享是其次。

博客有两类文章，写法不同：

### 技术学习（data-kind="learn"）

把一个具体技术拆开学懂。

- 改写别人的文章时不复述原文：用自己的话重新讲，做成可交互的页面（模拟器、分步演示、对比切换、小游戏），页尾注明受哪篇文章启发并附链接。长文可以拆成系列。
- 每一节的结构：开头 2–4 段介绍（概念是什么、为什么重要、原文想讲的要点），最后一句过渡到互动；中间是互动；末尾是“记下来”（左栏概念的一句话定义，右栏命令或公式与要点，带自测遮挡开关）。
- 容易混淆的概念要专门讲清边界（例如 Git 和 GitHub、tag 和 Release），能用对照表的就用对照表。
- 系列文章的额外结构（从设计模式、AI Infra 系列开始）：
  - 每篇开头列“读完应该能回答的三个问题”，篇末“回扣三问”，答案折叠，先自己答再点开。
  - 同类条目用统一格式的卡片收住：模式类用“模式卡”（问题 / 做法 / 何时用 / 代价 / 相关），计算类用“公式卡”和“关键数字”。
  - 易混内容放进“易混辨析”框，总览页汇总成索引。
  - 计算类实验尽量“先估再算”：先让读者给出估计，再揭晓结果。
  - 总览页同时是复习工具：地图、闪卡（记录只存在本地浏览器）、按问题反查的选择器、全系列速记。
- 演示用的数值必须标“示意”；真实计算要写明假设；原书数据标“原书数据”。

### 报告解读（data-kind="report"）

行业报告、白皮书、前沿综述。目的是快速掌握原作观点、把握业内新动向。

- 尊重原文，不发挥：转述原作的判断和论证，不加自己的推断；用“原作观点”框突出作者立场，金句附英文原句。
- 开头给“一页读懂”：原作的核心观点逐条列出，点击跳到对应章节。
- 每节标原文页码；每个数字标来源，区分第三方数据和作者自己（厂商）的数据。
- 交互只为帮助理解结构（对照切换、分步流程、按来源筛选），比技术学习类轻。
- 不写“记下来”自测；结尾放术语速查。
- 个人整理（行业动向、引用前要核对的地方）放在最后的“读后”，与原文内容明确分开。
