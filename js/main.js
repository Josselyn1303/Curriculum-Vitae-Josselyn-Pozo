        // Enhanced smooth scrolling with offset
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Enhanced theme toggle with more sophisticated transitions
        const themeToggle = document.getElementById('theme-toggle');
        let currentTheme = 0;
        const themes = [
            {
                '--neon-cyan': '#00ffff',
                '--neon-pink': '#ff0080',
                '--neon-green': '#39ff14',
                '--neon-purple': '#bf00ff',
                '--neon-yellow': '#ffff00',
                '--electric-blue': '#0080ff'
            },
            {
                '--neon-cyan': '#ff6b35',
                '--neon-pink': '#f7931e',
                '--neon-green': '#ffd100',
                '--neon-purple': '#c5299b',
                '--neon-yellow': '#d40078',
                '--electric-blue': '#7209b7'
            },
            {
                '--neon-cyan': '#2de2e6',
                '--neon-pink': '#261447',
                '--neon-green': '#028090',
                '--neon-purple': '#36213e',
                '--neon-yellow': '#f18f01',
                '--electric-blue': '#c73e1d'
            },
            {
                '--neon-cyan': '#ff4757',
                '--neon-pink': '#3742fa',
                '--neon-green': '#2ed573',
                '--neon-purple': '#a55eea',
                '--neon-yellow': '#ffa502',
                '--electric-blue': '#70a1ff'
            }
        ];

        themeToggle.addEventListener('click', () => {
            currentTheme = (currentTheme + 1) % themes.length;
            const root = document.documentElement;
            
            // Add loading animation
            themeToggle.style.animation = 'spin 0.5s ease-in-out';
            
            Object.entries(themes[currentTheme]).forEach(([property, value]) => {
                root.style.setProperty(property, value);
            });
            
            setTimeout(() => {
                themeToggle.style.animation = '';
            }, 500);
        });

        // Enhanced form submission with better UX
        const messageForm = document.getElementById('messageForm');
        messageForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };
            
            if (!formData.name || !formData.email || !formData.message) {
                showNotification('⚠️ Por favor, completa todos los campos obligatorios.', 'warning');
                return;
            }
            
            const submitBtn = document.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';
            
            setTimeout(() => {
                showNotification('✅ ¡Mensaje enviado exitosamente! Te contactaré pronto.', 'success');
                messageForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
            }, 2000);
        });

        // Enhanced notification system
        function showNotification(message, type) {
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 2rem;
                background: ${type === 'success' ? 'var(--neon-green)' : 'var(--neon-yellow)'};
                color: var(--dark-bg);
                border-radius: 10px;
                font-weight: 600;
                z-index: 10000;
                transform: translateX(100%);
                transition: all 0.3s ease;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            `;
            notification.textContent = message;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.transform = 'translateX(0)';
            }, 100);
            
            setTimeout(() => {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }

        // Enhanced Intersection Observer with stagger effects
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0) scale(1)';
                    }, index * 100);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.section').forEach(section => {
            observer.observe(section);
        });

        // Enhanced language progress bars with sequential animation
        const languageProgressBars = document.querySelectorAll('.language-progress');
        const progressObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    const width = entry.target.style.width;
                    entry.target.style.width = '0%';
                    setTimeout(() => {
                        entry.target.style.width = width;
                    }, 800 + (index * 200));
                }
            });
        }, observerOptions);

        languageProgressBars.forEach(bar => {
            progressObserver.observe(bar);
        });

        // Set current year
        document.getElementById('current-year').textContent = new Date().getFullYear();

        // Enhanced floating particles with variety
        function createFloatingParticle() {
            const particle = document.createElement('div');
            const colors = ['var(--neon-cyan)', 'var(--neon-pink)', 'var(--neon-green)', 'var(--electric-blue)'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            const size = Math.random() * 4 + 2;
            
            particle.style.cssText = `
                position: fixed;
                width: ${size}px;
                height: ${size}px;
                background: ${randomColor};
                border-radius: 50%;
                pointer-events: none;
                z-index: -1;
                box-shadow: 0 0 ${size * 3}px ${randomColor};
                left: ${Math.random() * 100}vw;
                animation: enhancedFloatUp ${8 + Math.random() * 4}s linear infinite;
                opacity: ${0.6 + Math.random() * 0.4};
            `;
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 12000);
        }

        // Enhanced CSS animations
        const enhancedStyle = document.createElement('style');
        enhancedStyle.textContent = `
            @keyframes enhancedFloatUp {
                0% {
                    transform: translateY(100vh) rotate(0deg) scale(0);
                    opacity: 0;
                }
                10% {
                    opacity: 1;
                    transform: translateY(90vh) rotate(45deg) scale(1);
                }
                90% {
                    opacity: 1;
                    transform: translateY(10vh) rotate(315deg) scale(1);
                }
                100% {
                    transform: translateY(-10vh) rotate(360deg) scale(0);
                    opacity: 0;
                }
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg) scale(1); }
                50% { transform: rotate(180deg) scale(1.2); }
                100% { transform: rotate(360deg) scale(1); }
            }
        `;
        document.head.appendChild(enhancedStyle);

        setInterval(createFloatingParticle, 1500);

        // Enhanced mouse trail with color cycling
        let mouseTrail = [];
        const maxTrailLength = 25;
        let colorIndex = 0;

        document.addEventListener('mousemove', (e) => {
            const trailDot = document.createElement('div');
            const colors = ['var(--neon-cyan)', 'var(--neon-pink)', 'var(--neon-green)', 'var(--electric-blue)'];
            
            trailDot.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${colors[colorIndex]};
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                left: ${e.clientX - 5}px;
                top: ${e.clientY - 5}px;
                transform: scale(1);
                opacity: 1;
                transition: transform 0.3s ease, opacity 0.3s ease;
                box-shadow: 0 0 15px ${colors[colorIndex]};
            `;
            
            document.body.appendChild(trailDot);
            mouseTrail.push(trailDot);
            
            if (mouseTrail.length > maxTrailLength) {
                const oldDot = mouseTrail.shift();
                oldDot.style.transform = 'scale(0)';
                oldDot.style.opacity = '0';
                setTimeout(() => oldDot.remove(), 300);
            }
            
            colorIndex = (colorIndex + 1) % colors.length;
            
            setTimeout(() => {
                trailDot.style.transform = 'scale(0)';
                trailDot.style.opacity = '0';
                setTimeout(() => trailDot.remove(), 300);
            }, 1000);
        });