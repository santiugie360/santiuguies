var io='IntersectionObserver' in window?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12}):null;
function reveal(){document.querySelectorAll('.page.on .rv:not(.in)').forEach(function(el,i){if(!el.style.getPropertyValue('--d'))el.style.setProperty('--d',(i%4)*.08+'s');io?io.observe(el):el.classList.add('in')})}
function show(){var id=(location.hash||'#inicio').slice(1),pg=document.getElementById(id);if(!pg||!pg.classList.contains('page'))id='inicio';
document.querySelectorAll('.page').forEach(function(p){p.classList.toggle('on',p.id===id)});
document.querySelectorAll('nav ul a').forEach(function(a){a.classList.toggle('act',a.getAttribute('href')==='#'+id)});
window.scrollTo(0,0);reveal();if(id==='inicio')go(cur)}
/* carrusel */
var tr=document.getElementById('track'),sl=tr.children,dots=document.getElementById('dots'),bar=document.getElementById('bar'),cur=0,tm,paused=false,x0=null;
for(var i=0;i<sl.length;i++){(function(i){var b=document.createElement('button');b.setAttribute('aria-label','Ir al platillo '+(i+1));b.onclick=function(){go(i)};dots.appendChild(b)})(i)}
function go(n){cur=(n+sl.length)%sl.length;tr.style.transform='translate3d(-'+cur*100+'%,0,0)';
Array.prototype.forEach.call(sl,function(s,i){s.classList.toggle('cur',i===cur)});
Array.prototype.forEach.call(dots.children,function(d,i){d.classList.toggle('on',i===cur)});
bar.classList.remove('run');void bar.offsetWidth;clearTimeout(tm);
if(!paused&&!document.hidden){bar.classList.add('run');tm=setTimeout(function(){go(cur+1)},5500)}}
document.getElementById('prev').onclick=function(){go(cur-1)};document.getElementById('next').onclick=function(){go(cur+1)};
var car=document.getElementById('car');
document.addEventListener('visibilitychange',function(){go(cur)});
car.addEventListener('touchstart',function(e){x0=e.touches[0].clientX;paused=true;clearTimeout(tm);bar.classList.remove('run')},{passive:true});
car.addEventListener('touchend',function(e){var d=x0===null?0:e.changedTouches[0].clientX-x0;x0=null;paused=false;go(Math.abs(d)>45?cur+(d<0?1:-1):cur)});
car.addEventListener('touchcancel',function(){x0=null;paused=false;go(cur)});
/* menú */
var bg=document.getElementById('burger'),ml=document.getElementById('menu-list');
function setMenu(o){ml.classList.toggle('open',o);document.documentElement.classList.toggle('nav-open',o);bg.setAttribute('aria-expanded',o);bg.setAttribute('aria-label',o?'Cerrar menú':'Abrir menú')}
bg.onclick=function(){setMenu(!ml.classList.contains('open'))};
ml.addEventListener('click',function(e){if(e.target.closest('a'))setMenu(false)});
document.addEventListener('click',function(e){if(ml.classList.contains('open')&&!e.target.closest('header'))setMenu(false)});
document.addEventListener('keydown',function(e){if(e.key==='Escape')setMenu(false)});
addEventListener('resize',function(){if(innerWidth>1024)setMenu(false)});
window.addEventListener('hashchange',show);show();
/* reseñas */
var rating=0,rate=document.getElementById('rate');
for(var s=1;s<=5;s++){(function(s){var b=document.createElement('button');b.type='button';b.textContent='★';b.setAttribute('role','radio');b.setAttribute('aria-checked','false');b.setAttribute('aria-label',s+(s===1?' estrella':' estrellas'));
b.onclick=function(){rating=s;Array.prototype.forEach.call(rate.children,function(c,i){c.classList.toggle('on',i<s);c.setAttribute('aria-checked',i===s-1)})};rate.appendChild(b)})(s)}
document.getElementById('rvf').addEventListener('submit',function(e){e.preventDefault();
var f=e.target,n=f.n.value.trim(),c=f.c.value.trim(),err=document.getElementById('err');
if(!n||!rating||!c){err.textContent='Escribe tu nombre, elige una calificación y cuéntanos tu opinión.';return}
err.textContent='';
var q=document.createElement('blockquote');q.className='new';
var st=document.createElement('span');st.className='stars';st.textContent='★★★★★'.slice(0,rating)+'☆☆☆☆☆'.slice(0,5-rating);
var p=document.createElement('p');p.textContent=c;var ci=document.createElement('cite');ci.textContent=n;
q.appendChild(st);q.appendChild(p);q.appendChild(ci);
var box=document.getElementById('revs');box.insertBefore(q,box.firstChild);
f.reset();rating=0;Array.prototype.forEach.call(rate.children,function(b){b.classList.remove('on');b.setAttribute('aria-checked','false')});
q.scrollIntoView({behavior:'smooth',block:'center'})});
/* imágenes: sin arrastre y con respaldo si no cargan */
Array.prototype.forEach.call(document.images,function(im){im.draggable=false;function bad(){im.classList.add('broken')}im.addEventListener('error',bad);if(im.complete&&im.naturalWidth===0)bad()});
/* reservaciones (sin WhatsApp: se confirma desde Contacto) */
(function(){var f=document.getElementById('rf'),ok=document.getElementById('ok'),t=new Date();
f.f.min=t.getFullYear()+'-'+('0'+(t.getMonth()+1)).slice(-2)+'-'+('0'+t.getDate()).slice(-2);
function msg(s){ok.textContent=s;ok.className='ok show'}
f.addEventListener('submit',function(e){e.preventDefault();
var d=new FormData(f),dt=new Date(d.get('f')+'T12:00:00'),h=d.get('h'),t0=new Date();t0.setHours(0,0,0,0);
if(isNaN(dt)||dt<t0)return msg('Elige una fecha que no haya pasado.');
if(dt.getDay()===1)return msg('Los lunes estamos cerrados. Elige de martes a domingo.');
if(h<'13:00'||h>'22:00')return msg('Atendemos de 1:00 pm a 10:00 pm. Elige una hora dentro de ese horario.');
ok.textContent='';var s=document.createElement('strong');s.textContent='Solicitud lista, '+d.get('n');ok.appendChild(s);
var p=document.createElement('p');p.textContent=dt.toLocaleDateString('es-MX',{weekday:'long',day:'numeric',month:'long'})+' a las '+h+' · '+d.get('p')+' persona(s)';ok.appendChild(p);
var q=document.createElement('p');q.appendChild(document.createTextNode('Aún no está confirmada. Llámanos o escríbenos por WhatsApp desde '));
var a=document.createElement('a');a.href='#contacto';a.textContent='Contacto';q.appendChild(a);q.appendChild(document.createTextNode(' para apartar tu mesa.'));ok.appendChild(q);
ok.className='ok show';f.reset()})})();

/* partículas */
(function(){var c=document.getElementById('fx');if(!c||!c.getContext)return;
var x=c.getContext('2d'),W=0,H=0,ps=[],col=['#EE7A2C','#FFB347'],dpr=Math.min(window.devicePixelRatio||1,2),still=false;
try{still=matchMedia('(prefers-reduced-motion:reduce)').matches}catch(e){}
function cols(){var s=getComputedStyle(document.documentElement);col=[s.getPropertyValue('--ember').trim()||col[0],s.getPropertyValue('--gold').trim()||col[1]]}
function mk(init){return{x:Math.random()*W,y:init?Math.random()*H:H+10,r:Math.random()*2.2+.8,v:Math.random()*.7+.25,w:Math.random()*6.283,a:Math.random()*.5+.4}}
function rs(){W=innerWidth;H=innerHeight;c.width=W*dpr;c.height=H*dpr;x.setTransform(dpr,0,0,dpr,0,0);cols();if(still)draw(false)}
function draw(mv){x.clearRect(0,0,W,H);
for(var i=0;i<ps.length;i++){var p=ps[i];if(mv){p.y-=p.v;p.w+=.02;p.x+=Math.sin(p.w)*.4;if(p.y<-10)p=ps[i]=mk(false)}
var a=p.a*(1-Math.max(0,p.y/H)*.6);x.fillStyle=p.r>1.8?col[1]:col[0];
x.globalAlpha=a*.2;x.beginPath();x.arc(p.x,p.y,p.r*3.2,0,6.283);x.fill();
x.globalAlpha=a;x.beginPath();x.arc(p.x,p.y,p.r,0,6.283);x.fill()}}
rs();for(var i=0,n=W<700?32:55;i<n;i++)ps.push(mk(true));
var ow=W,oh=H;addEventListener('resize',function(){if(innerWidth!==ow||Math.abs(innerHeight-oh)>120){ow=innerWidth;oh=innerHeight;rs()}});
try{matchMedia('(prefers-color-scheme:dark)').addEventListener('change',cols)}catch(e){}
if(still){draw(false);return}
var raf=window.requestAnimationFrame||function(f){return setTimeout(f,33)};
(function loop(){draw(true);raf(loop)})()})();