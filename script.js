/**
 * NØRAN Assessoria Estratégica - Interactive Experience
 * Author: Frontend Team
 * Stack: Vanilla JS (ES6+)
 * * Funcionalidades:
 * - Smart Sticky Header (Glassmorphism effect)
 * - Mobile Navigation Controller
 * - Scroll Reveal Engine (Intersection Observer)
 * - Number Counter Animation
 * - Video Player Mockup
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

    // =================================================================
    // CONFIGURAÇÃO CENTRAL
    // =================================================================
    const CONFIG = {
        scrollThreshold: 50, // Ponto de ativação do header
        animationOffset: '15%', // O elemento anima quando estiver 15% dentro da viewport
        counterDuration: 2000, // Duração da animação dos números (ms)
        staggerDelay: 100 // Delay entre itens de grid (ms)
    };

    // =================================================================
    // 1. SMART STICKY HEADER
    // Adiciona classe para fundo sólido/glass e sombra ao rolar
    // =================================================================
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
        const navList = document.querySelector('.nav-list');
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
        // Adiciona delay via JS para não poluir o CSS
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
    // 5. VÍDEO MOCKUP INTERATIVO
    // Simula o player de vídeo
    // =================================================================
    const initVideoMockup = () => {
        const playButtons = document.querySelectorAll('.video-play-btn');

        playButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const card = btn.closest('.video-card'); // Busca o container pai
                
                // Feedback visual de clique
                btn.style.transform = 'scale(0.9)';
                setTimeout(() => btn.style.transform = 'scale(1)', 150);

                // Lógica de simulação
                console.log(`%c ▶ Play Video: ${card ? card.dataset.title : 'Demo'}`, 'color: #e50914; font-weight: bold;');
                
                // Opção A: Alert simples (conforme pedido)
                // alert('O vídeo seria carregado aqui.');

                // Opção B (Mais elegante): Substituir por texto de "Carregando..."
                const originalText = btn.innerHTML;
                btn.innerHTML = '<span style="font-size: 0.8rem;">Carregando...</span>';
                
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    alert('Neste mockup, o vídeo abriria em um modal ou player overlay.');
                }, 800);
            });
        });
    };

    // =================================================================
    // INICIALIZAÇÃO
    // =================================================================
    const init = () => {
        initStickyHeader();
        initMobileMenu();
        initScrollReveal();
        initVideoMockup();
        
        // Log de status para debug
        console.log('NØRAN UI Loaded | Creative Interaction Active');
    };

    init();
});
