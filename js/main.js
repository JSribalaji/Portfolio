document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- theme toggle (light/dark) ---------- */
(function initTheme(){
  const root = document.documentElement;
  const btn = document.getElementById('theme-toggle');
  let saved = null;
  try{ saved = localStorage.getItem('theme'); }catch(e){}
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  const initial = saved || (prefersLight ? 'light' : 'dark');
  applyTheme(initial);

  function applyTheme(theme){
    if(theme === 'light'){ root.setAttribute('data-theme','light'); }
    else{ root.removeAttribute('data-theme'); }
    if(btn){ btn.setAttribute('aria-label', theme==='light' ? 'Switch to dark mode' : 'Switch to light mode'); }
  }
  if(btn){
    btn.addEventListener('click', ()=>{
      const isLight = root.getAttribute('data-theme') === 'light';
      const next = isLight ? 'dark' : 'light';
      applyTheme(next);
      try{ localStorage.setItem('theme', next); }catch(e){}
    });
  }
})();

/* ---------- respect reduced motion ---------- */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- typing effect for role line ---------- */
const roles = ['Backend Software Engineer — TCS', 'Java / Spring Boot / Microservices', 'AWS Certified Solutions Architect', 'Spring Batch · high-throughput pipelines', 'Docker · Kubernetes · OpenShift'];
const typeEl = document.getElementById('type-role');
if(!reduceMotion){
  let ri=0, ci=0, deleting=false;
  function tick(){
    const full = roles[ri];
    ci += deleting ? -1 : 1;
    typeEl.innerHTML = full.slice(0, ci) + '<span class="type-caret"></span>';
    let delay = deleting ? 30 : 55;
    if(!deleting && ci===full.length){ delay = 1600; deleting = true; }
    else if(deleting && ci===0){ deleting=false; ri=(ri+1)%roles.length; delay=300; }
    setTimeout(tick, delay);
  }
  tick();
} else {
  typeEl.textContent = roles[0];
}

/* ---------- custom cursor ---------- */
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
if(!reduceMotion && matchMedia('(hover:hover)').matches){
  let mx=0,my=0, rx=0, ry=0;
  window.addEventListener('mousemove', e=>{
    mx=e.clientX; my=e.clientY;
    cursor.style.left = mx+'px'; cursor.style.top = my+'px';
  });
  function loop(){
    rx += (mx-rx)*0.18; ry += (my-ry)*0.18;
    ring.style.left = rx+'px'; ring.style.top = ry+'px';
    requestAnimationFrame(loop);
  }
  loop();
  document.querySelectorAll('a, button, .chip, .project, .stat-card, .commit-body, .cred-card').forEach(el=>{
    el.addEventListener('mouseenter', ()=>{ cursor.classList.add('grow'); ring.classList.add('grow'); });
    el.addEventListener('mouseleave', ()=>{ cursor.classList.remove('grow'); ring.classList.remove('grow'); });
  });
}

/* ---------- scroll progress + active nav/pipeline stage ---------- */
const rail = document.getElementById('progress-rail');
const sections = ['about','skills','experience','projects','credentials','contact'].map(id=>document.getElementById(id));
const navLinks = document.querySelectorAll('#site-nav a');
const stages = document.querySelectorAll('.stage');

const pipelineWrap = document.querySelector('.pipeline .wrap');
let lastActiveStage = null;

function onScroll(){
  const doc = document.documentElement;
  const scrolled = (doc.scrollTop) / (doc.scrollHeight - doc.clientHeight) * 100;
  rail.style.width = scrolled + '%';

  let current = sections[0].id;
  const trigger = window.innerHeight * 0.4;
  sections.forEach(sec=>{
    const r = sec.getBoundingClientRect();
    if(r.top <= trigger) current = sec.id;
  });
  navLinks.forEach(a=> a.classList.toggle('active', a.dataset.nav===current));
  stages.forEach(s=> s.classList.toggle('active', s.dataset.stage===current));

  if(current !== lastActiveStage){
    lastActiveStage = current;
    const activeStage = document.querySelector(`.stage[data-stage="${current}"]`);
    if(activeStage && pipelineWrap){
      const target = activeStage.offsetLeft - (pipelineWrap.clientWidth - activeStage.offsetWidth) / 2;
      pipelineWrap.scrollTo({ left: Math.max(0, target), behavior: reduceMotion ? 'auto' : 'smooth' });
    }
  }
}
document.addEventListener('scroll', onScroll, {passive:true});
onScroll();

/* ---------- scroll reveal ---------- */
const io = new IntersectionObserver((entries)=>{
  entries.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } });
}, {threshold:0.15});
document.querySelectorAll('.reveal').forEach(el=> io.observe(el));

/* ---------- project card tilt + spotlight ---------- */
document.querySelectorAll('[data-tilt]').forEach(card=>{
  card.addEventListener('mousemove', e=>{
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    card.style.setProperty('--mx', x+'px');
    card.style.setProperty('--my', y+'px');
    if(!reduceMotion){
      const rx = ((y / r.height) - 0.5) * -4;
      const ry = ((x / r.width) - 0.5) * 4;
      card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
    }
  });
  card.addEventListener('mouseleave', ()=>{ card.style.transform = ''; });
});

/* ---------- background node network canvas ---------- */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let W, H, nodes=[];
function resize(){
  W = canvas.width = window.innerWidth;
  H = canvas.height = document.body.scrollHeight;
}
function initNodes(){
  const count = Math.min(70, Math.floor((W*H)/28000));
  nodes = Array.from({length:count}, ()=>({
    x:Math.random()*W, y:Math.random()*H,
    vx:(Math.random()-0.5)*0.25, vy:(Math.random()-0.5)*0.25
  }));
}
resize(); initNodes();
window.addEventListener('resize', ()=>{ resize(); initNodes(); });

function drawBG(){
  ctx.clearRect(0,0,W,H);
  const viewTop = window.scrollY, viewBottom = viewTop + window.innerHeight;
  for(const n of nodes){
    n.x += n.vx; n.y += n.vy;
    if(n.x<0||n.x>W) n.vx*=-1;
    if(n.y<0||n.y>H) n.vy*=-1;
  }
  ctx.strokeStyle = 'rgba(73,217,138,0.10)';
  ctx.lineWidth = 1;
  for(let i=0;i<nodes.length;i++){
    if(nodes[i].y < viewTop-100 || nodes[i].y > viewBottom+100) continue;
    for(let j=i+1;j<nodes.length;j++){
      const dx=nodes[i].x-nodes[j].x, dy=nodes[i].y-nodes[j].y;
      const d = Math.sqrt(dx*dx+dy*dy);
      if(d<120){
        ctx.globalAlpha = 1-(d/120);
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.stroke();
      }
    }
  }
  ctx.globalAlpha=1;
  ctx.fillStyle = 'rgba(73,217,138,0.35)';
  for(const n of nodes){
    if(n.y < viewTop-50 || n.y > viewBottom+50) continue;
    ctx.beginPath();
    ctx.arc(n.x, n.y, 1.6, 0, Math.PI*2);
    ctx.fill();
  }
  if(!reduceMotion) requestAnimationFrame(drawBG);
}
drawBG();

/* ---------- keep pipeline flush under the status bar (its height varies on mobile) ---------- */
const statusbarEl = document.querySelector('.statusbar');
function syncStatusbarHeight(){
  if(statusbarEl){
    document.documentElement.style.setProperty('--sb-h', statusbarEl.offsetHeight + 'px');
  }
}
syncStatusbarHeight();
window.addEventListener('resize', syncStatusbarHeight);
window.addEventListener('orientationchange', syncStatusbarHeight);
if(document.fonts && document.fonts.ready){ document.fonts.ready.then(syncStatusbarHeight); }
