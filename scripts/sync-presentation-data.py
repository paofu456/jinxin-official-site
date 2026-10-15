"""Derive presentation records from the authorized original site; keep full HTML."""
from pathlib import Path
from bs4 import BeautifulSoup
import json,re,shutil
ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'.tmp/source-copy/public'
assets=json.loads((ROOT/'src/data/assets.json').read_text(encoding='utf-8'))
archive=json.loads((ROOT/'src/data/archive.json').read_text(encoding='utf-8'))
def media(path):
    return assets['https://copy-gsin.fanfu749.workers.dev'+path]
home=BeautifulSoup((SOURCE/'index.html').read_text(encoding='utf-8'),'html.parser')
slides=[media(re.search(r'url\((.*?)\)',a['style']).group(1)) for a in home.select('#home-slider .slides a')]
video=home.select_one('.vide-play a')['href']
sourcevideo=SOURCE/video.lstrip('/')
if sourcevideo.exists():
    target=ROOT/'public/media/company/company-introduction.mp4'
    target.parent.mkdir(parents=True,exist_ok=True)
    if not target.exists():shutil.copy2(sourcevideo,target)
    video='/media/company/company-introduction.mp4'
else:video=''
homeData={'slides':slides,'companyImage':media('/skin/jx/images/home_01.jpg'),'video':video,
 'businessImages':[media(re.search(r'url\((.*?)\)',a['style']).group(1)) for a in home.select('.h-business-item')],
 'historicalMetrics':[{'value':'56+','label':'专利'},{'value':'500+','label':'项目案例'},{'value':'3.2 万吨','label':'年产能'}]}
about=BeautifulSoup(next(p['html'] for p in archive if p['path']=='/page/gsjs.html'),'html.parser')
tech=BeautifulSoup(next(p['html'] for p in archive if p['path']=='/page/zpsgjgqbjztx.html'),'html.parser')
history=BeautifulSoup(next(p['html'] for p in archive if p['path']=='/page/fzlc.html'),'html.parser')
def records(prefix):
    result=[];seen=set()
    for page in archive:
        if not page['path'].startswith(prefix):continue
        s=BeautifulSoup(page['html'],'html.parser')
        for a in s.select('.honor-itme a'):
            img=a.select_one('img');title=a.select_one('.m-tit')
            if not img or not title:continue
            key=(img['src'],title.get_text(strip=True))
            if key in seen:continue
            seen.add(key);result.append({'src':key[0],'title':key[1],'source':page['path']})
    return result
data={'aboutParagraphs':[str(p) for p in about.select('.about-des > p') if p.get_text(strip=True)],
 'aboutImages':[{'src':i['src'],'alt':i.get('alt','公司资料')} for i in about.select('img')],
 'technologyHtml':str(tech.select_one('.techno-des')),
 'technologyProjects':[a['href'] for a in tech.select('.sec-case a[href]')],
 'history':[{'date':li.select_one('.year').get_text(strip=True),'text':li.select_one('.des').get_text(' ',strip=True)} for li in history.select('.history li')],
 'certificates':records('/article/zzzs'),'honors':records('/article/gsry')}
for name,value in [('home-presentation',homeData),('corporate-presentation',data)]:
    (ROOT/f'src/data/{name}.json').write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('Generated original homepage assets and complete corporate presentation records.')
