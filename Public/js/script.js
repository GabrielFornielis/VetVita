// ===== CONFIGURAÇÃO PRINCIPAL =====
class VetVitaApp {
  constructor() {
    this.currentPage = 'home';
    this.deferredPrompt = null;
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupNavigation();
    this.detectPWA();
  }

  // ===== NAVEGAÇÃO =====
  setupNavigation() {
    document.querySelectorAll('[data-page]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = e.target.getAttribute('data-page');
        this.showPage(page);
      });
    });
  }

  showPage(pageId) {
    // Esconder todas as páginas
    document.getElementById('main-zoone').classList.add('hidden');
    document.getElementById('vetvita-app').classList.add('hidden');
    
    // Mostrar página selecionada
    if (['home', 'contato', 'empresa'].includes(pageId)) {
      document.getElementById('main-zoone').classList.remove('hidden');
      this.scrollToSection(pageId);
    } else if (pageId === 'vetvita') {
      document.getElementById('vetvita-app').classList.remove('hidden');
      window.scrollTo(0, 0);
    }
    
    this.currentPage = pageId;
  }

  scrollToSection(sectionId) {
    if (sectionId === 'home') {
      window.scrollTo(0, 0);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  // ===== PWA DETECTION =====
  detectPWA() {
    const isPWA = window.matchMedia('(display-mode: standalone)').matches || 
                 window.navigator.standalone === true ||
                 document.referrer.includes('android-app://') ||
                 new URLSearchParams(window.location.search).has('source=pwa');
    
    if (isPWA) {
      this.showPage('vetvita');
      console.log('PWA detectado - Mostrando VetVita');
    } else {
      this.showPage('home');
      console.log('Navegador normal - Mostrando ZOONE');
    }
  }

  // ===== PWA INSTALL =====
  setupEventListeners() {
    // PWA Install
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
    });

    window.addEventListener('appinstalled', () => {
      console.log('PWA VetVita instalado');
      this.showPage('vetvita');
    });

    // Cadastro
    const btnCadastro = document.getElementById('btnCadastro');
    if (btnCadastro) {
      btnCadastro.addEventListener('click', () => {
        this.handleCadastro();
      });
    }

    // Time slots
    this.setupTimeSlots();
    
    // Agendamento
    this.setupAgendamentoButtons();
  }

  handleCadastro() {
    alert('Cadastro realizado com sucesso!');
    document.querySelector('.vv-services-section')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  }

  setupTimeSlots() {
    document.querySelectorAll('.vv-time-slot').forEach(slot => {
      slot.addEventListener('click', () => {
        if (slot.classList.contains('empty')) return;
        
        // Remove seleção anterior
        document.querySelectorAll('.vv-time-slot').forEach(s => {
          s.style.background = '#fff';
          s.style.borderColor = 'rgba(162, 86, 18, 0.3)';
        });
        
        // Seleciona atual
        slot.style.background = '#e7cda2';
        slot.style.borderColor = '#a25612';
      });
    });
  }

  setupAgendamentoButtons() {
    document.querySelectorAll('.vv-agendar-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelector('.vv-agendamento-section')?.scrollIntoView({ 
          behavior: 'smooth' 
        });
      });
    });
  }

  // ===== SERVICE WORKER =====
  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js')
        .then(reg => console.log('Service Worker registrado:', reg.scope))
        .catch(err => console.warn('Erro no Service Worker:', err));
    }
  }
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
  const app = new VetVitaApp();
  app.registerServiceWorker();
});

// ===== INSTALAÇÃO PWA =====
document.querySelectorAll('[data-install]').forEach(btn => {
  btn.addEventListener('click', async () => {
    if (window.vetVitaApp?.deferredPrompt) {
      window.vetVitaApp.deferredPrompt.prompt();
      const choice = await window.vetVitaApp.deferredPrompt.userChoice;
      window.vetVitaApp.deferredPrompt = null;
      return;
    }
    // Fallback para navegação
    window.vetVitaApp?.showPage('vetvita');
  });
});