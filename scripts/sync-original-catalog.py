"""Audit the authorized copy-gsin checkout and derive public project/news indexes.
Usage: python scripts/sync-original-catalog.py [path-to-copy-gsin]
Original archive HTML remains the complete source of public detail content.
"""
from pathlib import Path
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import json, re, sys, hashlib, shutil
ROOT=Path(__file__).resolve().parents[1]
SOURCE=Path(sys.argv[1]) if len(sys.argv)>1 else ROOT/'.tmp/source-copy'
BASE='https://copy-gsin.fanfu749.workers.dev'
archive=json.loads((ROOT/'src/data/archive.json').read_text(encoding='utf-8'))
assets=json.loads((ROOT/'src/data/assets.json').read_text(encoding='utf-8'))
restored=[]
for p in (SOURCE/'public').rglob('*'):
    if p.is_file() and p.suffix.lower() in ('.jpg','.jpeg','.png','.gif','.webp','.svg'):
        url=BASE+'/'+p.relative_to(SOURCE/'public').as_posix()
        target=assets.get(url,'/media/'+hashlib.sha256(url.encode()).hexdigest()[:16]+p.suffix.lower())
        if not (ROOT/'public'/target.lstrip('/')).exists():
            shutil.copy2(p,ROOT/'public'/target.lstrip('/'));restored.append(target)
        assets[url]=target
categories=[('超高层钢结构','/article/gjg'),('大跨度空间结构','/article/mkhgjg'),('装配式建筑','/article/zpsjz'),('城市运营建筑','/article/zpsgjgcsyycp'),('钢结构住宅','/article/gjgxcbscp')]
members={}
for page in archive:
    for category,prefix in categories:
        if page['path'].startswith(prefix):
            for a in BeautifulSoup(page['html'],'html.parser').select('a.business-item[href]'):
                members.setdefault(a['href'],[])
                if category not in members[a['href']]:members[a['href']].append(category)
projects=[];news=[];missing_body=[]
for page in archive:
    soup=BeautifulSoup(page['html'],'html.parser')
    if page['kind']=='project':
        info=soup.select_one('.business-fir .m-info')
        images=[]
        for img in soup.select('.business-fir img,.business-sec img'):
            if img.get('src') and img['src'] not in [i['src'] for i in images]:
                images.append({'src':img['src'],'alt':page['title']+'项目资料图片'})
        specs=[]
        if info:
            for p in info.find_all('p'):
                if p.find('p'):continue
                t=re.sub(r'\s+','',p.get_text('',strip=True))
                if '：' in t and len(t)<60:
                    label,value=t.split('：',1)
                    if len(label)<12 and value:specs.append({'label':label,'value':value})
        summary=info.get_text('',strip=True) if info else page['text']
        related=[]
        for a in soup.select('.business-thr a.business-item[href]'):
            title=a.select_one('.m-tit');desc=a.select_one('.m-des');img=a.select_one('img')
            if title:related.append({'href':a['href'],'title':title.get_text(strip=True),'summary':desc.get_text(' ',strip=True) if desc else '', 'image':img['src'] if img else ''})
        projects.append({'path':page['path'],'title':page['title'],'categories':members.get(page['path'],['其他工程']),'summary':summary[:130],'bodyHtml':str(info) if info else '', 'images':images,'specifications':specs,'related':related,'source':page['source']})
    if page['kind']=='news':
        date=soup.select_one('.news-time');body=soup.select_one('.news-detail')
        image=soup.select_one('.news-detail img')
        sourcefile=SOURCE/'public'/page['path'].lstrip('/')
        original=BeautifulSoup(sourcefile.read_text(encoding='utf-8'),'html.parser').select_one('.news-detail') if sourcefile.exists() else None
        if not original or not original.get_text(strip=True):missing_body.append(page['path'])
        summary=body.get_text(' ',strip=True).split('此页保留原官网')[0].strip() if body else ''
        news.append({'path':page['path'],'title':page['title'],'date':date.get_text(strip=True) if date else '', 'image':image['src'] if image else '', 'summary':summary[:150], 'bodyHtml':str(body) if body else '', 'hasSourceText':bool(original and original.get_text(strip=True))})
# Preserve legacy alias URLs without publishing duplicated documents.
aliases={'/article/zpsjz.html.html':'/article/zpsjz.html','/article/zzzs/index.html':'/article/zzzs.html','/download/jszl/index.html':'/download/jszl.html','/page/gsjs/index.html':'/page/gsjs.html','/page/lxwm/index.html':'/contact/','/article/hyzx.html':'/article/xyzx.html'}
for route,target in aliases.items():
    p=ROOT/'public'/route.lstrip('/');p.parent.mkdir(parents=True,exist_ok=True)
    p.write_text(f'<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="description" content="金鑫绿建栏目地址更新"><meta http-equiv="refresh" content="0;url={target}"><title>金鑫绿建栏目</title></head><body><h1>金鑫绿建</h1><a href="{target}">浏览栏目</a></body></html>',encoding='utf-8')
for name,data in [('assets',assets),('project-catalog',projects),('news-catalog',sorted(news,key=lambda n:n['date'],reverse=True))]:
    (ROOT/f'src/data/{name}.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
report={'sourceRepository':'https://github.com/paofu456/copy-gsin','archivePagesRetained':len(archive),'projects':len(projects),'news':len(news),'additionalMedia':len(restored),'legacyAliases':len(aliases),'sourceNewsWithoutBody':missing_body}
(ROOT/'notes/source-content-audit.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({k:v for k,v in report.items() if k!='sourceNewsWithoutBody'},ensure_ascii=False))
print('Source news without text body:',len(missing_body))
