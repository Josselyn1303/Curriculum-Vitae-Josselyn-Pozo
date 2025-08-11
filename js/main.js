// ===== Smooth scroll con offset =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#' || href.length === 1) return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const offsetTop = target.offsetTop - 80;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  });
});

// ===== Toggle de tema con persistencia =====
const themeToggle = document.getElementById('theme-toggle');
const root = document.documentElement;
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const themes = [
  { '--neon-cyan':'#00ffff','--neon-pink':'#ff0080','--neon-green':'#39ff14','--neon-purple':'#bf00ff','--neon-yellow':'#ffff00','--electric-blue':'#0080ff' },
  { '--neon-cyan':'#ff6b35','--neon-pink':'#f7931e','--neon-green':'#ffd100','--neon-purple':'#c5299b','--neon-yellow':'#d40078','--electric-blue':'#7209b7' },
  { '--neon-cyan':'#2de2e6','--neon-pink':'#261447','--neon-green':'#028090','--neon-purple':'#36213e','--neon-yellow':'#f18f01','--electric-blue':'#c73e1d' },
  { '--neon-cyan':'#ff4757','--neon-pink':'#3742fa','--neon-green':'#2ed573','--neon-purple':'#a55eea','--neon-yellow':'#ffa502','--electric-blue':'#70a1ff' }
];
let currentTheme = parseInt(localStorage.getItem('themeIndex') || '0',10);

applyTheme(currentTheme);
themeToggle?.addEventListener('click', () => {
  currentTheme = (currentTheme + 1) % themes.length;
  applyTheme(currentTheme);
  localStorage.setItem('themeIndex', String(currentTheme));
});
function applyTheme(i){
  Object.entries(themes[i]).forEach(([k,v])=>root.style.setProperty(k,v));
  if (!prefersReduced && themeToggle){
    themeToggle.style.animation = 'spin 0.5s ease-in-out';
    setTimeout(()=> themeToggle.style.animation = '', 500);
  }
}

// ===== EmailJS: init =====
document.addEventListener('DOMContentLoaded', () => {
  if (typeof emailjs !== 'undefined' && emailjs.init){
    emailjs.init({ publicKey: "XOFu19pY9Covtlhvp" });
  }
});

// ===== Formulario =====
const messageForm = document.getElementById('messageForm');
let lastSentAt = 0;

messageForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (document.getElementById('website')?.value) return;

  const formData = {
    from_name: document.getElementById('name').value.trim(),
    from_email: document.getElementById('email').value.trim(),
    subject: document.getElementById('subject').value.trim(),
    message: document.getElementById('message').value.trim(),
    date_sent: new Date().toISOString()
  };

  if (!formData.from_name || !formData.from_email || !formData.message) {
    showNotification('⚠️ Completa los campos obligatorios.', 'warning');
    return;
  }

  const now = Date.now();
  if (now - lastSentAt < 15000) {
    showNotification('⏳ Espera unos segundos antes de enviar de nuevo.', 'warning');
    return;
  }

  const submitBtn = document.querySelector('.submit-btn');
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
  submitBtn.disabled = true;
  submitBtn.style.opacity = '0.7';

  try {
    await emailjs.send("service_ddobqne", "template_sx2mqe9", formData);
    showNotification('✅ ¡Mensaje enviado! Te contactaré pronto.', 'success');
    messageForm.reset();
    lastSentAt = now;
  } catch (error) {
    console.error('Error:', error);
    showNotification('❌ Ocurrió un error. Intenta más tarde.', 'error');
  } finally {
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
    submitBtn.style.opacity = '1';
  }
});

// ===== Notificaciones =====
function showNotification(message, type){
  const n = document.createElement('div');
  n.style.cssText = `
    position: fixed; top: 20px; right: 20px; padding: 1rem 2rem;
    background: ${type === 'success' ? 'var(--neon-green)' : (type==='error'?'#ff4d4f':'var(--neon-yellow)')};
    color: var(--dark-bg); border-radius: 10px; font-weight: 600; z-index: 10000;
    transform: translateX(100%); transition: all .3s ease; box-shadow: 0 10px 30px rgba(0,0,0,.3);
  `;
  n.textContent = message;
  document.body.appendChild(n);
  setTimeout(()=> n.style.transform = 'translateX(0)', 50);
  setTimeout(()=>{
    n.style.transform = 'translateX(100%)';
    setTimeout(()=> n.remove(), 300);
  }, 3000);
}

// ===== Intersection Observer =====
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries)=>{
  entries.forEach((entry)=>{ if(entry.isIntersecting){ entry.target.classList.add('revealed'); } });
}, observerOptions);
document.querySelectorAll('.section').forEach(sec => observer.observe(sec));

// ===== Barras de idioma =====
const languageProgressBars = document.querySelectorAll('.language-progress');
const progressObserver = new IntersectionObserver((entries)=>{
  entries.forEach((entry, index)=>{
    if(entry.isIntersecting){
      const width = entry.target.style.width || '0%';
      entry.target.style.width = '0%';
      setTimeout(()=>{ entry.target.style.width = width; }, 800 + (index*200));
    }
  });
}, observerOptions);
languageProgressBars.forEach(bar => progressObserver.observe(bar));

// ===== Año actual =====
document.getElementById('current-year').textContent = new Date().getFullYear();

// ===== Partículas y puntero neón (se conservan) =====
function createFloatingParticle(){
  if (document.documentElement.classList.contains('exporting')) return;
  const particle = document.createElement('div');
  const colors = ['var(--neon-cyan)','var(--neon-pink)','var(--neon-green)','var(--electric-blue)'];
  const c = colors[Math.floor(Math.random()*colors.length)];
  const size = Math.random()*4 + 2;
  particle.style.cssText = `
    position: fixed; width:${size}px; height:${size}px; background:${c};
    border-radius:50%; pointer-events:none; z-index:-1; box-shadow:0 0 ${size*3}px ${c};
    left:${Math.random()*100}vw; animation: enhancedFloatUp ${8 + Math.random()*4}s linear infinite;
    opacity:${0.6 + Math.random()*0.4};
  `;
  document.body.appendChild(particle);
  setTimeout(()=> particle.remove(), 12000);
}
const enhancedStyle = document.createElement('style');
enhancedStyle.textContent = `
@keyframes enhancedFloatUp{
  0%{transform:translateY(100vh) rotate(0) scale(0);opacity:0}
  10%{opacity:1;transform:translateY(90vh) rotate(45deg) scale(1)}
  90%{opacity:1;transform:translateY(10vh) rotate(315deg) scale(1)}
  100%{transform:translateY(-10vh) rotate(360deg) scale(0);opacity:0}
}`;
document.head.appendChild(enhancedStyle);

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  window.__particlesIntervalId = setInterval(createFloatingParticle, 1500);
}

// ===== Puntero neón (robusto con override y diagnóstico) =====
(function initMouseTrail(){
  // Preferencia de movimiento del sistema
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Permite forzar encendido: localStorage.trail = 'on' | 'off'
  const stored = localStorage.getItem('trail');
  let trailEnabled = stored ? (stored === 'on') : !reduceMotion;

  const MAX_Z = 2147483647; // top de z-index
  const maxTrail = 28;
  const colors = ['var(--neon-cyan)','var(--neon-pink)','var(--neon-green)','var(--electric-blue)'];
  let trail = [];
  let idx = 0;
  let ticking = false;

  function addDot(e){
    if (!trailEnabled) return;
    if (document.documentElement.classList.contains('exporting')) return;

    if (!ticking){
      window.requestAnimationFrame(()=>{
        const dot = document.createElement('div');
        const c = colors[idx];
        dot.className = 'neon-trail-dot';
        dot.style.cssText = `
          position: fixed;
          width: 13px; height: 13px;
          background: ${c};
          border-radius: 50%;
          pointer-events: none;
          z-index: ${MAX_Z};
          left: ${e.clientX - 6.5}px; top: ${e.clientY - 6.5}px;
          transform: scale(1);
          opacity: 1;
          transition: transform .35s ease, opacity .35s ease;
          box-shadow: 0 0 20px ${c}, 0 0 36px ${c};
          will-change: transform, opacity;
        `;
        document.body.appendChild(dot);
        trail.push(dot);

        if (trail.length > maxTrail){
          const old = trail.shift();
          old.style.transform = 'scale(0)'; 
          old.style.opacity = '0';
          setTimeout(()=> old.remove(), 360);
        }
        idx = (idx + 1) % colors.length;

        setTimeout(()=>{
          dot.style.transform = 'scale(0)'; 
          dot.style.opacity = '0';
          setTimeout(()=> dot.remove(), 360);
        }, 950);

        ticking = false;
      });
      ticking = true;
    }
  }

  function attach(){
    if (!window.__mouseTrailHandlerAttached){
      window.__mouseTrailHandler = addDot;
      document.addEventListener('mousemove', addDot, { passive:true });
      window.__mouseTrailHandlerAttached = true;
    }
  }
  function detach(){
    if (window.__mouseTrailHandlerAttached){
      document.removeEventListener('mousemove', addDot, { passive:true });
      window.__mouseTrailHandlerAttached = false;
    }
  }

  // Export/print pausa el rastro
  const exportObserver = new MutationObserver(()=>{
    const exporting = document.documentElement.classList.contains('exporting');
    if (exporting){ detach(); } else { attach(); }
  });
  exportObserver.observe(document.documentElement, { attributes:true, attributeFilter:['class'] });

  // Toggle con teclado: Ctrl+Alt+T
  function kbToggle(e){
    if (e.ctrlKey && e.altKey && (e.key === 't' || e.key === 'T')){
      trailEnabled = !trailEnabled;
      localStorage.setItem('trail', trailEnabled ? 'on' : 'off');
      console.info(`[trail] ${trailEnabled ? 'ON' : 'OFF'} (via teclado)`);
    }
  }
  document.addEventListener('keydown', kbToggle);

  // Botón de prueba (junto al botón de tema)
  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn){
    const tgl = document.createElement('button');
    tgl.type = 'button';
    tgl.title = 'Toggle trail (prueba)';
    tgl.setAttribute('aria-label','Toggle trail');
    tgl.style.cssText = `
      position: fixed; top: 20px; right: 90px; 
      width: 44px; height: 44px; border-radius: 50%;
      background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.2);
      color: #fff; cursor: pointer; z-index: ${MAX_Z};
      backdrop-filter: blur(8px); font-size: 14px;
    `;
    tgl.textContent = '✨';
    tgl.addEventListener('click', ()=>{
      trailEnabled = !trailEnabled;
      localStorage.setItem('trail', trailEnabled ? 'on' : 'off');
      console.info(`[trail] ${trailEnabled ? 'ON' : 'OFF'} (via botón)`);
    });
    document.body.appendChild(tgl);
  }

  // Arranque
  if (!trailEnabled){
    console.warn('[trail] desactivado (reduce-motion o preferencia guardada). Pulsa Ctrl+Alt+T o el botón ✨ para activarlo.');
  } else {
    console.debug('[trail] activo');
  }
  attach();
})();



// ===== Menú de descarga con PORTAL (no se recorta por overflow) =====
const menuBtn = document.getElementById('download-menu-btn');
const inlineMenu = document.getElementById('download-menu'); // el que está dentro del hero
let portalMenu = null;
let portalOpen = false;

function buildPortalMenu(){
  if (portalMenu) return portalMenu;
  portalMenu = document.createElement('div');
  portalMenu.id = 'download-float-menu';
  portalMenu.setAttribute('role','menu');
  portalMenu.setAttribute('aria-hidden','true');
  portalMenu.style.cssText = `
    position: fixed;
    min-width: 260px;
    background: #0e0e0e;
    border: 1px solid rgba(255,255,255,.12);
    border-radius: 12px;
    box-shadow: 0 14px 40px rgba(0,0,0,.55);
    padding: .6rem;
    z-index: 10000;
    display: none;
  `;
  // Copiamos el contenido del menú inline
  portalMenu.innerHTML = `
    <button id="portal-download-design" class="dropdown-item" type="button" role="menuitem" style="width:100%;text-align:left;background:transparent;border:0;color:#fff;padding:.7rem .9rem;border-radius:10px;cursor:pointer;display:flex;gap:.6rem;align-items:center;">
      <i class="fas fa-file-pdf"></i> CV con diseño (PDF)
    </button>
    <a id="portal-download-ats" class="dropdown-item" href="print.html?auto=1" target="_blank" rel="noopener" role="menuitem" style="width:100%;text-align:left;color:#fff;padding:.7rem .9rem;border-radius:10px;display:flex;gap:.6rem;align-items:center;text-decoration:none;">
      <i class="fas fa-file-alt"></i> CV ATS (PDF)
    </a>
  `;
  document.body.appendChild(portalMenu);

  // Eventos hover
  [...portalMenu.querySelectorAll('.dropdown-item')].forEach(el=>{
    el.addEventListener('mouseenter', ()=> el.style.background = 'rgba(255,255,255,.08)');
    el.addEventListener('mouseleave', ()=> el.style.background = 'transparent');
  });

  // Reusar el botón de export design existente
  const exportDesignBtn = document.getElementById('download-pdf-design');
  portalMenu.querySelector('#portal-download-design')
    .addEventListener('click', () => {
      portalClose();
      exportDesignBtn?.click();
    });

  return portalMenu;
}

function portalOpenAt(btn){
  const menu = buildPortalMenu();
  const rect = btn.getBoundingClientRect();
  const gap = 8;
  const top = rect.bottom + gap;
  // Alinear por la derecha del botón si queda más cómodo
  const left = Math.max(12, Math.min(rect.left, window.innerWidth - menu.offsetWidth - 12));

  menu.style.top = `${top}px`;
  menu.style.left = `${left}px`;
  menu.style.display = 'block';
  menu.setAttribute('aria-hidden','false');
  portalOpen = true;
  document.addEventListener('click', outsideClose, { once: true });
  window.addEventListener('scroll', portalReposition, { passive:true });
  window.addEventListener('resize', portalReposition);
}

function portalReposition(){
  if (!portalOpen) return;
  portalClose(); // al hacer scroll/resize lo cerramos: UX estándar
}

function portalClose(){
  if (!portalMenu) return;
  portalMenu.style.display = 'none';
  portalMenu.setAttribute('aria-hidden','true');
  portalOpen = false;
  window.removeEventListener('scroll', portalReposition);
  window.removeEventListener('resize', portalReposition);
}

function outsideClose(e){
  if (!portalMenu) return;
  if (e.target === menuBtn || portalMenu.contains(e.target)) {
    // Si clic dentro, dejamos abierto (el botón ya tiene su toggle)
    document.addEventListener('click', outsideClose, { once: true });
    return;
  }
  portalClose();
}

menuBtn?.addEventListener('click', (e)=>{
  e.stopPropagation();
  if (portalOpen) { portalClose(); return; }
  portalOpenAt(menuBtn);
});


// ===== Exportar a PDF (CV con diseño, texto negro) =====
const exportDesignBtn = document.getElementById('download-pdf-design');
exportDesignBtn?.addEventListener('click', async ()=>{
  const rootNode = document.getElementById('cv-root') || document.body;

  try { if (document.fonts && document.fonts.ready) await document.fonts.ready; } catch {}

  document.documentElement.classList.add('exporting');

  // Pausa efectos
  if (window.__particlesIntervalId){ clearInterval(window.__particlesIntervalId); window.__particlesIntervalId = null; }
  if (window.__mouseTrailHandler){ document.removeEventListener('mousemove', window.__mouseTrailHandler, { passive:true }); }

  try{
    const opt = {
      margin: [0,0,0,0],
      filename: 'Josselyn-Pozo-CV-Diseno.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff', scrollY: 0, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['css','legacy'] }
    };
    await html2pdf().set(opt).from(rootNode).save();
  }catch(err){
    console.error('PDF error', err);
    showNotification('❌ No se pudo generar el PDF.', 'error');
  }finally{
    document.documentElement.classList.remove('exporting');
    // Reactivar
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && !window.__particlesIntervalId){
      window.__particlesIntervalId = setInterval(createFloatingParticle, 1500);
    }
    if (window.__mouseTrailHandler){
      document.addEventListener('mousemove', window.__mouseTrailHandler, { passive:true });
    }
  }
});
