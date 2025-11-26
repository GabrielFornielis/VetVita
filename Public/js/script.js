// ===== CONFIGURAÇÃO PRINCIPAL =====
class VetVitaApp {
  constructor() {
    this.currentPage = 'home';
    this.deferredPrompt = null;
    this.isPWAInstalled = false;
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupNavigation();
    this.detectPWA();
    this.registerServiceWorker();
    this.checkPWAInstallation();
    this.removeBackButton();
    this.setupVetVitaApp();
  }

  // ===== REMOVER BOTÃO VOLTAR =====
  removeBackButton() {
    const backButton = document.querySelector('.back-to-zoone');
    if (backButton) {
      backButton.style.display = 'none';
      backButton.remove();
    }
  }

  // ===== CONFIGURAÇÃO DO VETVITA APP =====
  setupVetVitaApp() {
    // Cadastro
    const btnCadastro = document.getElementById('vv-btnCadastro');
    if (btnCadastro) {
      btnCadastro.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleCadastro();
      });
    }

    // Botões de agendamento
    this.setupAgendamentoButtons();
  }

  handleCadastro() {
    const nome = document.getElementById('vv-nome').value;
    const email = document.getElementById('vv-email').value;
    const cpf = document.getElementById('vv-cpf').value;
    const senha = document.getElementById('vv-senha').value;
    
    if (!nome || !email || !cpf || !senha) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    alert('Cadastro realizado com sucesso!');
    // Rola para a seção de serviços
    document.querySelector('.vv-servicos')?.scrollIntoView({ 
      behavior: 'smooth' 
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
    alert(`Agendamento para ${service} iniciado! Em breve você poderá selecionar data e horário.`);
  }

  // ===== DETECÇÃO DE PWA =====
  detectPWA() {
    const isPWA = window.matchMedia('(display-mode: standalone)').matches || 
                 window.navigator.standalone === true ||
                 document.referrer.includes('android-app://') ||
                 new URLSearchParams(window.location.search).has('source=pwa');
    
    if (isPWA) {
      this.isPWAInstalled = true;
      this.showOnlyVetVitaApp();
      console.log('PWA detectado - Mostrando apenas VetVitaApp');
    } else {
      this.showPage('home');
      console.log('Navegador normal - Mostrando VetVitaWeb');
    }
  }

  // ===== VERIFICAÇÃO DE INSTALAÇÃO =====
  checkPWAInstallation() {
    if ('getInstalledRelatedApps' in navigator) {
      navigator.getInstalledRelatedApps?.().then(apps => {
        if (apps && apps.length > 0) {
          this.isPWAInstalled = true;
          console.log('PWA já está instalado no dispositivo');
        }
      }).catch(err => {
        console.log('Não foi possível verificar apps instalados:', err);
      });
    }

    if (window.matchMedia('(display-mode: standalone)').matches) {
      this.isPWAInstalled = true;
    }
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

    // Botão VetVita Agendamentos (INSTALAÇÃO PWA)
    this.setupInstallButton();

    // Link "Acessar via Web" (REDIRECIONAMENTO NORMAL)
    const webLink = document.querySelector('.web-link');
    if (webLink) {
      webLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleWebAccess();
      });
    }
  }

  // ===== CONFIGURAÇÃO DO BOTÃO DE INSTALAÇÃO =====
  setupInstallButton() {
    const aboutButton = document.querySelector('.about-button');
    if (aboutButton) {
      // Remove event listeners antigos
      const newButton = aboutButton.cloneNode(true);
      aboutButton.parentNode.replaceChild(newButton, aboutButton);
      
      // Adiciona novo event listener
      newButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleInstallButton();
      }, { once: false });
    }
  }

  // ===== MANIPULAÇÃO DO BOTÃO DE INSTALAÇÃO =====
  handleInstallButton() {
    console.log('Botão agendamento clicado - PWA instalado:', this.isPWAInstalled);
    
    // BLOQUEIO TOTAL se PWA instalado
    if (this.isPWAInstalled) {
      alert('📱 O VetVita já está instalado em seu dispositivo!\n\nProcure pelo ícone do VetVita na tela inicial ou no menu de aplicativos.');
      return false;
    }

    // Se não está instalado, prossegue normalmente
    if (this.deferredPrompt) {
      console.log('Iniciando instalação PWA...');
      this.installPWA();
    } else {
      console.log('Navegador não suporta instalação, redirecionando...');
      this.showPage('vetvita');
    }
  }

  // ===== ACESSO VIA WEB =====
  handleWebAccess() {
    this.showPage('vetvita');
  }

  showPage(pageId) {
    // Se PWA está instalado, NUNCA mostra a página principal
    if (this.isPWAInstalled && pageId !== 'vetvita') {
      this.showOnlyVetVitaApp();
      return;
    }

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

  showOnlyVetVitaApp() {
    document.getElementById('main-zoone').classList.add('hidden');
    document.getElementById('vetvita-app').classList.remove('hidden');
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

  // ===== PWA INSTALL =====
  setupEventListeners() {
    // PWA Install Prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('beforeinstallprompt disparado - PWA pode ser instalado');
      e.preventDefault();
      this.deferredPrompt = e;
      
      // Atualiza o botão novamente para garantir que está funcionando
      setTimeout(() => {
        this.setupInstallButton();
      }, 100);
    });

    window.addEventListener('appinstalled', () => {
      console.log('PWA VetVita instalado com sucesso!');
      this.isPWAInstalled = true;
      this.showOnlyVetVitaApp();
      this.deferredPrompt = null;
    });

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
        this.showPage('vetvita');
      });
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
        console.log('Chamando deferredPrompt.prompt()...');
        this.deferredPrompt.prompt();
        const { outcome } = await this.deferredPrompt.userChoice;
        
        console.log('Resultado da instalação:', outcome);
        
        if (outcome === 'accepted') {
          console.log('Usuário aceitou a instalação do PWA');
          this.isPWAInstalled = true;
          this.showOnlyVetVitaApp();
        } else {
          console.log('Usuário recusou a instalação do PWA');
          this.showPage('vetvita');
        }
        
        this.deferredPrompt = null;
      } catch (error) {
        console.error('Erro durante instalação:', error);
        this.showPage('vetvita');
      }
    } else {
      console.log('Nenhum deferredPrompt disponível, redirecionando...');
      this.showPage('vetvita');
    }
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
  window.vetVitaApp = vetVitaApp;
});

// ===== FUNÇÕES GLOBAIS PARA INSTALAÇÃO =====
function installVetVita() {
  if (window.vetVitaApp) {
    window.vetVitaApp.handleInstallButton();
  }
}