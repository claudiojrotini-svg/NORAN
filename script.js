/**
 * NØRAN Assessoria Estratégica - Interactive Experience
 * Author: Frontend Team
 * Stack: Vanilla JS (ES6+)
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

    // =================================================================
    // ⚙️ 1. CONFIGURAÇÃO
    // =================================================================
    const CONFIG = {
        whatsappNumber: '5545998613142', 
        scrollThreshold: 50,
        counterDuration: 2000,
        staggerDelay: 100
    };

    // =================================================================
    // 🖥️ 2. INTERFACE & NAVEGAÇÃO
    // =================================================================
    
    // Sticky Header
    const initStickyHeader = () => {
        const header = document.querySelector('.header');
        if (!header) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > CONFIG.scrollThreshold) {
                header.classList.add('header-scrolled');
            } else {
                header.classList.remove('header-scrolled');
            }
        }, { passive: true });
    };

    // Menu Mobile
    const initMobileMenu = () => {
        const menuBtn = document.querySelector('.mobile-toggle');
        const navList = document.querySelector('.nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');

        if (!menuBtn || !navList) return;

        const toggleMenu = () => {
            const isActive = navList.classList.contains('active');
            navList.classList.toggle('active');
            menuBtn.classList.toggle('active');
            menuBtn.setAttribute('aria-expanded', !isActive);
        };

        menuBtn.addEventListener('click', toggleMenu);

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navList.classList.contains('active')) toggleMenu();
            });
        });

        document.addEventListener('click', (e) => {
            if (!navList.contains(e.target) && !menuBtn.contains(e.target) && navList.classList.contains('active')) {
                toggleMenu();
            }
        });
    };

    // Preloader
    const initPreloader = () => {
        const preloader = document.getElementById('preloader');
        if(preloader) {
            setTimeout(() => {
                preloader.classList.add('loaded');
            }, 1500);
        }
    };

    // Cookies
    const initCookies = () => {
        const banner = document.getElementById('cookie-banner');
        const btn = document.getElementById('accept-cookies');
        
        if (banner && !localStorage.getItem('noran_cookies')) {
            setTimeout(() => {
                banner.classList.add('show');
            }, 2500);
        }

        if(btn){
            btn.addEventListener('click', () => {
                localStorage.setItem('noran_cookies', 'true');
                banner.classList.remove('show');
            });
        }
    };

    // =================================================================
    // ✨ 3. ANIMAÇÕES VISUAIS
    // =================================================================

    // Scroll Reveal
    const initScrollReveal = () => {
        const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
        const staggerContainers = document.querySelectorAll('.stagger-grid');

        const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };

        const revealCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    if (entry.target.hasAttribute('data-count')) {
                        animateValue(entry.target);
                    }
                    observer.unobserve(entry.target);
                }
            });
        };

        const observer = new IntersectionObserver(revealCallback, observerOptions);
        revealElements.forEach(el => observer.observe(el));

        staggerContainers.forEach(container => {
            Array.from(container.children).forEach((child, index) => {
                child.classList.add('reveal-up');
                child.style.transitionDelay = `${index * CONFIG.staggerDelay}ms`;
                observer.observe(child);
            });
        });
    };

    // Contador de Números
    const animateValue = (obj) => {
        const target = +obj.getAttribute('data-count');
        const suffix = obj.getAttribute('data-suffix') || '';
        const duration = CONFIG.counterDuration;
        let startTimestamp = null;

        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 4); 

            obj.innerHTML = Math.floor(easeProgress * target) + suffix;

            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                obj.innerHTML = target + suffix;
            }
        };
        window.requestAnimationFrame(step);
    };

    // Cursor Mágico
    const initCursor = () => {
        const cursorDot = document.querySelector('.cursor-dot');
        const cursorOutline = document.querySelector('.cursor-outline');
        
        // Só ativa em desktop
        if (!cursorDot || !cursorOutline || !window.matchMedia("(pointer: fine)").matches) return;

        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        const interactiveElements = document.querySelectorAll('a, button, input, textarea, summary');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
        });
    };

    // =================================================================
    // 🚀 4. FUNCIONALIDADES ESPECÍFICAS (TIMELINE & CALC)
    // =================================================================

    // Calculadora ROI
    const initCalculator = () => {
        const slider = document.getElementById('investimento');
        const investVal = document.getElementById('investimento-val');
        const resultado = document.getElementById('resultado');
        
        if(!slider) return;

        const ROAS = 5; 

        slider.addEventListener('input', (e) => {
            const val = parseInt(e.target.value);
            investVal.innerText = val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
            resultado.innerText = (val * ROAS).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
        });
    };

    // Timeline Híbrida (Scroll + Hover)
    const initTimeline = () => {
        const timeline = document.querySelector('.timeline');
        const line = document.querySelector('.timeline-progress');
        const items = document.querySelectorAll('.timeline-item');

        if (!timeline || !line) return;

        const updateOnScroll = () => {
            if (timeline.classList.contains('is-hovering')) return;

            const rect = timeline.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const triggerPoint = windowHeight * 0.55; 
            
            let progress = ((triggerPoint - rect.top) / rect.height) * 100;
            progress = Math.max(0, Math.min(100, progress));

            line.style.height = `${progress}%`;
            activateItems(progress);
        };

        const activateItems = (progress) => {
            items.forEach(item => {
                const itemTop = item.offsetTop;
                const timelineHeight = timeline.offsetHeight;
                const itemPercent = (itemTop / timelineHeight) * 100;

                if (progress >= itemPercent - 5) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        };

        items.forEach(item => {
            item.addEventListener('mouseenter', () => {
                timeline.classList.add('is-hovering');
                const itemTop = item.offsetTop;
                const timelineHeight = timeline.offsetHeight;
                let targetPercent = (itemTop / timelineHeight) * 100 + 15; 
                targetPercent = Math.min(100, targetPercent);

                line.style.height = `${targetPercent}%`;
                activateItems(targetPercent);
            });

            item.addEventListener('mouseleave', () => {
                timeline.classList.remove('is-hovering');
                updateOnScroll(); 
            });
        });

        window.addEventListener('scroll', updateOnScroll);
        updateOnScroll(); 
    };

    // Formulário WhatsApp
    const setupContactForm = () => {
        const form = document.querySelector('#contact-form');
        
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault(); 

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('whatsapp').value;
            const message = document.getElementById('message').value;

            const text = `*NOVA SOLICITAÇÃO - NØRAN* 🚀\n\n👤 *Nome:* ${name}\n📧 *Email:* ${email}\n📱 *WhatsApp:* ${phone}\n\n📝 *Descrição da Empresa:*\n${message}\n\n-----------------------------------\n_Enviado pelo site_`;

            const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`;
            window.open(url, '_blank');
            form.reset();
        });
    };

    // =================================================================
    // 🏁 INICIALIZAÇÃO
    // =================================================================
// =================================================================
    // 📊 5. ANIMAÇÃO ESPECÍFICA DO GRÁFICO (NOVO)
    // =================================================================
    const initChartAnimation = () => {
        const chartCard = document.querySelector('.comparison-card');
        
        if (!chartCard) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Adiciona a classe que dispara o CSS
                    chartCard.classList.add('chart-active');
                    // Para de observar depois que ativou (roda só uma vez)
                    observer.unobserve(entry.target); 
                }
            });
        }, { threshold: 0.3 }); // Dispara quando 30% do gráfico estiver visível

        observer.observe(chartCard);
    };

    const init = () => {
        initStickyHeader();
        initMobileMenu();
        initScrollReveal();
        initPreloader();
        initCookies();
        initCursor();
        initCalculator();
        initTimeline();
        setupContactForm();
        
        console.log('NØRAN System | Online 🟢');
    };

    init();
});