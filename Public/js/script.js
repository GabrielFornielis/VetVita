// SPA Navigation
function showPage(pageId) {
  // Hide all pages
  document.getElementById('main-zoone').classList.add('hidden');
  document.getElementById('vetvita-app').classList.add('hidden');
  
  // Show selected page
  if (pageId === 'home' || pageId === 'projetos' || pageId === 'contato') {
    document.getElementById('main-zoone').classList.remove('hidden');
    
    // Scroll to section if needed
    if (pageId === 'home') {
      window.scrollTo(0, 0);
    } else if (pageId === 'projetos') {
      document.getElementById('projetos').scrollIntoView({ behavior: 'smooth' });
    }
  } else if (pageId === 'vetvita') {
    document.getElementById('vetvita-app').classList.remove('hidden');
    window.scrollTo(0, 0);
  }
}

// Detect if app is running as PWA
function isPWA() {
  return window.matchMedia('(display-mode: standalone)').matches || 
         window.navigator.standalone === true ||
         document.referrer.includes('android-app://') ||
         new URLSearchParams(window.location.search).has('source=pwa');
}

// Initialize SPA
document.addEventListener('DOMContentLoaded', function() {
  // Set up navigation
  document.querySelectorAll('[data-page]').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const page = this.getAttribute('data-page');
      showPage(page);
    });
  });
  
  // Auto-show VetVita if PWA, otherwise show ZOONE
  if (isPWA()) {
    showPage('vetvita');
    console.log('PWA detectado - Mostrando VetVita');
  } else {
    showPage('home');
    console.log('Navegador normal - Mostrando ZOONE');
  }
});

// PWA install & VetVita mode
let deferredPrompt;

document.querySelectorAll('[data-install]').forEach(btn => {
  btn.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      deferredPrompt = null;
      return;
    }
    // fallback: navigate to VetVita
    showPage('vetvita');
  });
});

window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
});

window.addEventListener('appinstalled', e => {
  console.log('PWA VetVita instalado', e);
  // Quando instalar, já mostra o VetVita
  showPage('vetvita');
});

// registra SW
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(reg => console.log('SW registrado', reg.scope))
    .catch(err => console.warn('Erro SW:', err));
}

// Simulação cadastro
const btnCadastro = document.getElementById('btnCadastro');
if (btnCadastro) {
  btnCadastro.addEventListener('click', () => {
    alert('Cadastro realizado com sucesso!');
    // Rola para a seção de serviços após cadastro
    document.querySelector('.vv-services-section').scrollIntoView({ 
      behavior: 'smooth' 
    });
  });
}

// Time slot selection
document.querySelectorAll('.vv-time-slot').forEach(slot => {
  slot.addEventListener('click', function() {
    if (this.classList.contains('empty')) return;
    
    // Remove selection from all slots
    document.querySelectorAll('.vv-time-slot').forEach(s => {
      s.style.background = '#fff';
      s.style.borderColor = 'rgba(162, 86, 18, 0.3)';
    });
    
    // Select this slot
    this.style.background = '#e7cda2';
    this.style.borderColor = '#a25612';
  });
});

// Botão agendar V8/V10
document.querySelectorAll('.vv-agendar-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    // Rola para a seção de agendamento
    document.querySelector('.vv-agendamento-section').scrollIntoView({ 
      behavior: 'smooth' 
    });
  });
});