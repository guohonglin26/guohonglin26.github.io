#!/usr/bin/env python3
"""从各系列配置里收集篇名，写成 posts/study-shared/evo-titles.js，供主题学习链全览页显示“系列 · 篇号 篇名”。
新增系列或改篇名后在 src 下运行：python3 gen_evo_titles.py"""
import json, os, re
HERE = os.path.dirname(os.path.abspath(__file__))
out = {}
for d in sorted(os.listdir(HERE)):
    if not d.endswith('-series'): continue
    for f in ('series.py', 'build.py'):
        p = os.path.join(HERE, d, f)
        if not os.path.exists(p): continue
        m = re.search(r'^FULL = (\{.*?\n\})', open(p).read(), re.S | re.M)
        if m:
            out[d] = {int(k): v for k, v in eval(m.group(1)).items()}
            break
js = '// 由 src/gen_evo_titles.py 生成，不要手改\nwindow.EVO_TITLES = ' + json.dumps(out, ensure_ascii=False, indent=0) + ';\n'
open(os.path.join(HERE, '..', 'posts', 'study-shared', 'evo-titles.js'), 'w').write(js)
print(', '.join('%s %d' % (k, len(v)) for k, v in out.items()))
