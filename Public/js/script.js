// ===== CONFIGURAÇÃO PRINCIPAL =====
class VetVitaApp {
  constructor() {
    this.currentPage = 'home';
    this.deferredPrompt = null;
    this.selectedTimeSlot = null;
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupNavigation();
    this.detectPWA();
    this.registerServiceWorker();
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
    // PWA Install Prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      console.log('PWA pode ser instalado');
    });

    window.addEventListener('appinstalled', () => {
      console.log('PWA VetVita instalado com sucesso!');
      this.showPage('vetvita');
      this.deferredPrompt = null;
    });

    // Botão de instalação na página principal
    const installBtn = document.getElementById('install-vetvita');
    if (installBtn) {
      installBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.showInstallPrompt();
      });
    }

    // Modal de instalação
    const installConfirm = document.getElementById('install-confirm');
    const installCancel = document.getElementById('install-cancel');
    
    if (installConfirm) {
      installConfirm.addEventListener('click', () => {
        this.installPWA();
        this.hideInstallModal();
      });
    }
    
    if (installCancel) {
      installCancel.addEventListener('click', () => {
        this.hideInstallModal();
        // Mostra o VetVita mesmo sem instalar
        this.showPage('vetvita');
      });
    }

    // Cadastro
    const btnCadastro = document.getElementById('btnCadastro');
    if (btnCadastro) {
      btnCadastro.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleCadastro();
      });
    }

    // Finalizar agendamento
    const finalizarBtn = document.getElementById('finalizar-agendamento');
    if (finalizarBtn) {
      finalizarBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.finalizarAgendamento();
      });
    }

    // Time slots
    this.setupTimeSlots();
    
    // Agendamento
    this.setupAgendamentoButtons();
  }

  showInstallPrompt() {
    if (this.deferredPrompt) {
      // Mostra prompt nativo de instalação
      this.installPWA();
    } else {
      // Mostra modal customizado
      this.showInstallModal();
    }
  }

  showInstallModal() {
    const modal = document.getElementById('install-modal');
    modal.classList.remove('hidden');
  }

  hideInstallModal() {
    const modal = document.getElementById('install-modal');
    modal.classList.add('hidden');
  }

  async installPWA() {
    if (this.deferredPrompt) {
      try {
        this.deferredPrompt.prompt();
        const { outcome } = await this.deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
          console.log('Usuário aceitou a instalação do PWA');
          this.showPage('vetvita');
        } else {
          console.log('Usuário recusou a instalação do PWA');
          // Mostra o VetVita mesmo sem instalar
          this.showPage('vetvita');
        }
        
        this.deferredPrompt = null;
      } catch (error) {
        console.error('Erro durante instalação:', error);
        // Fallback: mostra o VetVita
        this.showPage('vetvita');
      }
    } else {
      // Fallback: mostra o VetVita
      this.showPage('vetvita');
    }
  }

  handleCadastro() {
    const nome = document.getElementById('nome').value;
    if (!nome) {
      alert('Por favor, informe seu nome completo.');
      return;
    }
    
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
          s.classList.remove('selected');
        });
        
        // Seleciona atual
        slot.classList.add('selected');
        this.selectedTimeSlot = slot.textContent;
      });
    });
  }

  setupAgendamentoButtons() {
    document.querySelectorAll('.vv-agendar-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const service = btn.getAttribute('data-service');
        this.agendarServico(service);
      });
    });
  }

  agendarServico(service) {
    // Rola para a seção de agendamento
    document.querySelector('.vv-agendamento-section')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
    
    // Aqui você pode customizar baseado no serviço selecionado
    console.log(`Agendando serviço: ${service}`);
  }

  finalizarAgendamento() {
    if (!this.selectedTimeSlot) {
      alert('Por favor, selecione um horário para o agendamento.');
      return;
    }
    
    // Simulação de agendamento
    alert(`Agendamento confirmado para ${this.selectedTimeSlot}! Valor: R$ 120,00`);
    
    // Limpa seleção
    this.selectedTimeSlot = null;
    document.querySelectorAll('.vv-time-slot').forEach(s => {
      s.classList.remove('selected');
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
let vetVitaApp;

document.addEventListener('DOMContentLoaded', () => {
  vetVitaApp = new VetVitaApp();
  window.vetVitaApp = vetVitaApp; // Disponibiliza globalmente se necessário
});

// ===== FUNÇÕES GLOBAIS PARA INSTALAÇÃO =====
function installVetVita() {
  if (window.vetVitaApp) {
    window.vetVitaApp.showInstallPrompt();
  }
}