// SPA Navigation
function showPage(pageId) {
  // Hide all pages
  document.getElementById('main-vetvita').classList.add('hidden');
  document.getElementById('vetvita-app').classList.add('hidden');
  
  // Show selected page
  if (pageId === 'home' || pageId === 'sobre' || pageId === 'contato' || pageId === 'admin') {
    document.getElementById('main-vetvita').classList.remove('hidden');
    
    // Scroll to section if needed
    if (pageId === 'home') {
      window.scrollTo(0, 0);
    } else if (pageId === 'sobre') {
      document.getElementById('sobre').scrollIntoView({ behavior: 'smooth' });
    } else if (pageId === 'contato') {
      document.getElementById('contato').scrollIntoView({ behavior: 'smooth' });
    } else if (pageId === 'admin') {
      document.getElementById('admin').scrollIntoView({ behavior: 'smooth' });
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
  
  // Auto-show VetVita App if PWA, otherwise show VetVita Main
  if (isPWA()) {
    showPage('vetvita');
    console.log('PWA detectado - Mostrando VetVita App');
  } else {
    showPage('home');
    console.log('Navegador normal - Mostrando VetVita Principal');
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
    // fallback: navigate to VetVita App
    showPage('vetvita');
  });
});

window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
});

window.addEventListener('appinstalled', e => {
  console.log('PWA VetVita instalado', e);
  // Quando instalar, já mostra o VetVita App
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

// Botão de limpar formulário de contato
document.querySelectorAll('.clear-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const form = this.closest('.form-section') || this.closest('.admin-form');
    if (form) {
      const inputs = form.querySelectorAll('input, textarea');
      inputs.forEach(input => {
        input.value = '';
      });
    }
  });
});

// Botão de login admin
const loginBtn = document.querySelector('.login-btn');
if (loginBtn) {
  loginBtn.addEventListener('click', function() {
    const email = document.getElementById('admin-email').value;
    const password = document.getElementById('admin-password').value;
    
    if (email && password) {
      alert('Login realizado com sucesso!');
      // Aqui você pode adicionar a lógica de autenticação real
    } else {
      alert('Por favor, preencha todos os campos.');
    }
  });
}