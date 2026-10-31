#!/usr/bin/env python3
"""扫描 posts/*/index.html，生成全站搜索索引 assets/search-index.js（由 assets/site.js 在第一次打开搜索时加载）。
收录：篇名、小节标题、易混辨析、“记下来”速记条目、公式卡。发布新文章或改完内容后在 src 下运行：python3 gen_search.py"""
import html, json, os, re
ROOT = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
POSTS = os.path.join(ROOT, 'posts')
def text(s):
    s = re.sub(r'<sub>(.*?)</sub>', r'\1', s); s = re.sub(r'<sup>(.*?)</sup>', r'^\1', s)
    return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', '', s))).strip()
def js_str(s):
    try: return json.loads('"' + s.replace('\\\'', "'").replace('"', '\\"') + '"')
    except Exception: return s
rows = []
for d in sorted(os.listdir(POSTS)):
    p = os.path.join(POSTS, d, 'index.html')
    if not os.path.exists(p) or d.endswith('-shared'): continue
    s = open(p).read()
    url = 'posts/%s/' % d
    title = text(re.search(r'<title>(.*?)</title>', s, re.S).group(1))
    k = re.search(r'<p class="kicker">(.*?)</p>', s, re.S)
    spans = re.findall(r'<span>(.*?)</span>', k.group(1)) if k else []
    if len(spans) > 1 and re.search(r' · \d+$', text(spans[1])): title = text(spans[1]) + '：' + title
    rows.append([url, title, '篇', title, ''])
    for m in re.finditer(r'<section[^>]*\bid="([^"]+)"[^>]*>\s*(?:<div class="part-head">)?\s*<h2[^>]*>(.*?)</h2>', s, re.S):
        rows.append([url + '#' + m.group(1), title, '节', text(m.group(2)), ''])
    for m in re.finditer(r'<div class="confuse"><h4>(.*?)</h4>(.*?)</div>', s, re.S):
        t = re.sub(r'^易混辨析[：:]\s*', '', text(m.group(1)))
        rows.append([url, title, '易混', t, text(m.group(2))[:160]])
    for m in re.finditer(r"S\.notes\(\$\('#([^']+)'\), \{(.*?)\n\}\);", s, re.S):
        for a, b in re.findall(r"\[\s*'((?:[^'\\]|\\.)*)'\s*,\s*'((?:[^'\\]|\\.)*)'\s*\]", m.group(2)):
            rows.append([url + '#' + m.group(1), title, '速记', text(js_str(a)), text(js_str(b))[:160]])
    for m in re.finditer(r'<dt>(.*?)</dt>\s*<dd>(.*?)</dd>', s, re.S):
        rows.append([url, title, '速记', text(m.group(1)), text(m.group(2))[:160]])
    # 正文里加粗的关键词：连同它所在的那句话，每页每个词只收一次
    body = s.split('<main', 1)[-1].split('<script', 1)[0]
    for sec in re.finditer(r'<section[^>]*\bid="([^"]+)"(.*?)</section>', body, re.S) or []:
        for para in re.findall(r'<p[^>]*>(.*?)</p>', sec.group(2), re.S):
            for b in re.findall(r'<strong>(.*?)</strong>', para, re.S):
                t = text(b)
                if not (1 < len(t) <= 24): continue
                plain = text(para)
                i = plain.find(t)
                a = max(plain.rfind('。', 0, i), plain.rfind('；', 0, i)) + 1
                e = min([x for x in (plain.find('。', i), plain.find('；', i)) if x >= 0] or [len(plain)])
                rows.append([url + '#' + sec.group(1), title, '正文', t, plain[a:e + 1][:64]])
    for m in re.finditer(r'<div class="fx">(.*?)</div>', s, re.S):
        rows.append([url, title, '公式', text(m.group(1))[:200], ''])
# 篇名只存一份：P = [[地址, 篇名]]，R = [[篇序号, 锚点, 类别, 文字, 补充]]
seen, P, pid, R = set(), [], {}, []
for url, title, kind, t, sub in rows:
    base, _, anc = url.partition('#')
    k = (base, kind, t)
    if k in seen or not t: continue
    seen.add(k)
    if base not in pid: pid[base] = len(P); P.append([base, title])
    R.append([pid[base], anc, kind, t[:80], sub[:64]])
dst = os.path.join(ROOT, 'assets', 'search-index.js')
open(dst, 'w').write('// 由 src/gen_search.py 生成，不要手改\nwindow.SEARCH_INDEX = ' + json.dumps({'P': P, 'R': R}, ensure_ascii=False, separators=(',', ':')) + ';\n')
from collections import Counter
print(len(R), dict(Counter(r[2] for r in R)), os.path.getsize(dst) // 1024, 'KB')
