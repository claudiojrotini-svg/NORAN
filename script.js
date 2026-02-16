/**
 * NØRAN Assessoria Estratégica - Interactive Experience
 * Author: Frontend Team
 * Stack: Vanilla JS (ES6+)
 * Funcionalidades:
 * - Smart Sticky Header
 * - Mobile Navigation Controller
 * - Scroll Reveal Engine
 * - Number Counter Animation
 * - WhatsApp Form Integration (NOVO)
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

    // =================================================================
    // ⚙️ CONFIGURAÇÃO CENTRAL (EDITE SEU NÚMERO AQUI)
    // =================================================================
    const CONFIG = {
        whatsappNumber: '5545998613142', // <--- COLOQUE SEU NÚMERO AQUI (Com 55 e DDD)
        
        scrollThreshold: 50, // Ponto de ativação do header
        animationOffset: '15%', // Trigger da animação
        counterDuration: 2000, // Duração da animação dos números
        staggerDelay: 100 // Delay entre itens de grid
    };

    // =================================================================
    // 1. SMART STICKY HEADER
    // Adiciona classe para fundo sólido/glass e sombra ao rolar
    // =================================================================

    window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.classList.add('loaded');
    }, 1500); // Fica na tela por 1.5s garantidos
});
    const initStickyHeader = () => {
        const header = document.querySelector('.header');
        
        if (!header) return;

        const handleScroll = () => {
            if (window.scrollY > CONFIG.scrollThreshold) {
                header.classList.add('header-scrolled');
            } else {
                header.classList.remove('header-scrolled');
            }
        };

        // Otimização: Passive listener melhora a performance do scroll
        window.addEventListener('scroll', handleScroll, { passive: true });
    };

    // =================================================================
    // 2. MENU MOBILE INTELIGENTE
    // Abre/fecha e reseta estado ao clicar em links
    // =================================================================
    const initMobileMenu = () => {
        const menuBtn = document.querySelector('.mobile-toggle');
        const navList = document.querySelector('.nav-menu'); // Ajustado para .nav-menu
        const navLinks = document.querySelectorAll('.nav-link');

        if (!menuBtn || !navList) return;

        const toggleMenu = () => {
            const isActive = navList.classList.contains('active');
            navList.classList.toggle('active');
            menuBtn.classList.toggle('active'); // Para animar o ícone hambúrguer
            
            // Acessibilidade: Atualiza ARIA
            menuBtn.setAttribute('aria-expanded', !isActive);
        };

        menuBtn.addEventListener('click', toggleMenu);

        // Fecha o menu automaticamente ao clicar em um link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navList.classList.contains('active')) {
                    toggleMenu();
                }
            });
        });

        // Fecha o menu se clicar fora dele (UX refinada)
        document.addEventListener('click', (e) => {
            if (!navList.contains(e.target) && !menuBtn.contains(e.target) && navList.classList.contains('active')) {
                toggleMenu();
            }
        });
    };

    // =================================================================
    // 3. SCROLL REVEAL ENGINE (Observer)
    // Gerencia animações de entrada e delays escalonados
    // =================================================================
    const initScrollReveal = () => {
        // Seleciona elementos padrão e containers de grid
        const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
        const staggerContainers = document.querySelectorAll('.stagger-grid');

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15 // Gatilho visual
        };

        const revealCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Adiciona classe que dispara o CSS transition
                    entry.target.classList.add('visible');
                    
                    // Se for um contador de números, inicia a contagem
                    if (entry.target.hasAttribute('data-count')) {
                        animateValue(entry.target);
                    }

                    observer.unobserve(entry.target); // Performance: para de observar
                }
            });
        };

        const observer = new IntersectionObserver(revealCallback, observerOptions);

        // Observa elementos individuais
        revealElements.forEach(el => observer.observe(el));

        // Lógica de Stagger (Delay Escalonado) para Grids
        staggerContainers.forEach(container => {
            const children = container.children;
            Array.from(children).forEach((child, index) => {
                child.classList.add('reveal-up'); // Força animação base
                child.style.transitionDelay = `${index * CONFIG.staggerDelay}ms`;
                observer.observe(child);
            });
        });
    };

    // =================================================================
    // 4. CONTADOR DE NÚMEROS (Number Counter)
    // Anima de 0 até o valor final (ex: +50 Clientes)
    // =================================================================
    const animateValue = (obj) => {
        const target = +obj.getAttribute('data-count'); // O "+" converte string para número
        const suffix = obj.getAttribute('data-suffix') || ''; // Ex: "%", "+"
        const duration = CONFIG.counterDuration;
        
        let startTimestamp = null;

        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);

            // Easing function (Ease Out Quart) para movimento natural
            const easeProgress = 1 - Math.pow(1 - progress, 4); 

            obj.innerHTML = Math.floor(easeProgress * target) + suffix;

            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                obj.innerHTML = target + suffix; // Garante o valor final exato
            }
        };

        window.requestAnimationFrame(step);
    };

    // =================================================================
    // 5. INTEGRAÇÃO WHATSAPP (Formulário)
    // Captura os dados e envia formatado para o WhatsApp
    // =================================================================
    const setupContactForm = () => {
        const form = document.querySelector('#contact-form');
        
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault(); // Impede o recarregamento da página

            // Captura os dados dos campos
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('whatsapp').value;
            const message = document.getElementById('message').value;

            // Cria a mensagem formatada
            const text = `
*NOVA SOLICITAÇÃO - NØRAN* 🚀

👤 *Nome:* ${name}
📧 *Email:* ${email}
📱 *WhatsApp:* ${phone}

📝 *Descrição da Empresa:*
${message}

-----------------------------------
_Enviado pelo site_
            `.trim();

            // Gera o link do WhatsApp
            const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`;
            
            // Abre o WhatsApp em nova aba
            window.open(url, '_blank');

            // Limpa o formulário (Opcional)
            form.reset();
        });
    };

    // =================================================================
    // INICIALIZAÇÃO
    // =================================================================
    const init = () => {
        initStickyHeader();
        initMobileMenu();
        initScrollReveal();
        setupContactForm(); // Inicia o formulário
        
        console.log('NØRAN UI Loaded | System Online 🟢');
    };

    init();
    // --- MAGIC CURSOR ---
const initCursor = () => {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    // Movimento
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        // O ponto segue instantaneamente
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // O círculo tem um leve delay (efeito magnético)
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // Efeito Hover em Links e Botões
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, summary');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
    });
};

// Chame a função no final
initCursor();
});

// --- COOKIES ---
const initCookies = () => {
    const banner = document.getElementById('cookie-banner');
    const btn = document.getElementById('accept-cookies');
    
    // Verifica se já aceitou
    if (!localStorage.getItem('noran_cookies')) {
        setTimeout(() => {
            banner.classList.add('show');
        }, 2000); // Aparece depois de 2 segundos
    }

    if(btn){
        btn.addEventListener('click', () => {
            localStorage.setItem('noran_cookies', 'true');
            banner.classList.remove('show');
        });
    }
};

// Adicione initCookies() dentro da função init() principal ou no final do arquivo.
initCookies();