class CelebrationAnimation {
    constructor() {
        this.canvas = document.getElementById('animationCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particlesContainer = document.getElementById('particlesContainer');
        this.mainMessage = document.querySelector('.main-message');
        
        this.resizeCanvas();
        this.setupEventListeners();
        
        // Animation state
        this.animationPhase = 'waiting'; // waiting, burst, floating, fade
        this.startTime = null;
        this.burstParticles = [];
        this.floatingParticles = [];
        
        // Configuration
        this.config = {
            burstDuration: 4000, // 4 seconds of burst
            floatingDuration: 3000, // 3 seconds of floating
            fadeDuration: 2000, // 2 seconds of fade
            replayDelay: 3000, // 3 seconds before replay
            chessPieces: ['♟️', '♞', '♛'],
            codeSnippets: [
                '{++love;}',
                'if(you) {happiness++;}',
                'while(true) {hug();}',
                'return joy;',
                'const us = ∞;',
                'function smile() {return true;}',
                'you.makeMe = happy;',
                'love += 1;'
            ]
        };
        
        this.init();
    }
    
    setupEventListeners() {
        window.addEventListener('resize', () => this.resizeCanvas());
        window.addEventListener('load', () => this.startAnimation());
    }
    
    resizeCanvas() {
        // Use device pixel ratio for crisp rendering on high DPI displays
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();
        
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        
        this.ctx.scale(dpr, dpr);
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
    }
    
    init() {
        // Start the animation sequence
        setTimeout(() => this.startAnimation(), 1000);
    }
    
    startAnimation() {
        this.startTime = Date.now();
        this.animationPhase = 'burst';
        
        // Reset message state
        this.resetMessageState();
        
        // Start burst phase
        this.createBurstEffect();
        
        // Transition to floating phase
        setTimeout(() => {
            this.animationPhase = 'floating';
            this.createFloatingEffect();
        }, this.config.burstDuration);
        
        // Transition to fade phase
        setTimeout(() => {
            this.animationPhase = 'fade';
            this.startFadeEffect();
        }, this.config.burstDuration + this.config.floatingDuration);
        
        // Add gentle floating to message after initial reveal
        setTimeout(() => {
            this.mainMessage.classList.add('revealed');
        }, 3000);
        
        // Schedule replay
        setTimeout(() => {
            this.scheduleReplay();
        }, this.config.burstDuration + this.config.floatingDuration + this.config.fadeDuration);
    }
    
    createBurstEffect() {
        const rect = this.canvas.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Create chess pieces burst
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                this.createChessParticle(centerX, centerY);
            }, i * 100);
        }
        
        // Create code snippets burst
        for (let i = 0; i < 12; i++) {
            setTimeout(() => {
                this.createCodeParticle(centerX, centerY);
            }, i * 120);
        }
        
        // Create hearts burst
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                this.createHeartParticle(centerX, centerY);
            }, i * 80);
        }
    }
    
    createChessParticle(startX, startY) {
        const particle = document.createElement('div');
        particle.className = 'particle chess-particle';
        particle.textContent = this.config.chessPieces[Math.floor(Math.random() * this.config.chessPieces.length)];
        
        // Random direction and distance
        const angle = Math.random() * Math.PI * 2;
        const distance = 200 + Math.random() * 300;
        const randomX = Math.cos(angle) * distance;
        const randomY = Math.sin(angle) * distance;
        
        particle.style.setProperty('--random-x', `${randomX}px`);
        particle.style.setProperty('--random-y', `${randomY}px`);
        particle.style.left = `${startX}px`;
        particle.style.top = `${startY}px`;
        
        this.particlesContainer.appendChild(particle);
        
        // Remove after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 4000);
    }
    
    createCodeParticle(startX, startY) {
        const particle = document.createElement('div');
        particle.className = 'particle code-particle';
        particle.textContent = this.config.codeSnippets[Math.floor(Math.random() * this.config.codeSnippets.length)];
        
        // Random direction and distance
        const angle = Math.random() * Math.PI * 2;
        const distance = 150 + Math.random() * 250;
        const randomX = Math.cos(angle) * distance;
        const randomY = Math.sin(angle) * distance;
        
        particle.style.setProperty('--random-x', `${randomX}px`);
        particle.style.setProperty('--random-y', `${randomY}px`);
        particle.style.left = `${startX}px`;
        particle.style.top = `${startY}px`;
        
        this.particlesContainer.appendChild(particle);
        
        // Remove after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 6000);
    }
    
    createHeartParticle(startX, startY) {
        const particle = document.createElement('div');
        particle.className = 'particle heart-particle';
        particle.textContent = '❤️';
        
        // Random direction and distance
        const angle = Math.random() * Math.PI * 2;
        const distance = 100 + Math.random() * 200;
        const randomX = Math.cos(angle) * distance;
        const randomY = Math.sin(angle) * distance;
        
        particle.style.setProperty('--random-x', `${randomX}px`);
        particle.style.setProperty('--random-y', `${randomY}px`);
        particle.style.left = `${startX}px`;
        particle.style.top = `${startY}px`;
        
        this.particlesContainer.appendChild(particle);
        
        // Remove after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 8000);
    }
    
    createFloatingEffect() {
        // Create subtle floating particles
        const createFloatingParticle = () => {
            if (this.animationPhase !== 'floating') return;
            
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random type
            const types = ['chess', 'code', 'heart'];
            const type = types[Math.floor(Math.random() * types.length)];
            
            switch (type) {
                case 'chess':
                    particle.classList.add('chess-particle');
                    particle.textContent = this.config.chessPieces[Math.floor(Math.random() * this.config.chessPieces.length)];
                    break;
                case 'code':
                    particle.classList.add('code-particle');
                    particle.textContent = this.config.codeSnippets[Math.floor(Math.random() * this.config.codeSnippets.length)];
                    break;
                case 'heart':
                    particle.classList.add('heart-particle');
                    particle.textContent = '❤️';
                    break;
            }
            
            // Random position
            const rect = this.canvas.getBoundingClientRect();
            particle.style.left = `${Math.random() * rect.width}px`;
            particle.style.top = `${rect.height + 50}px`;
            
            // Gentle upward movement
            const randomX = (Math.random() - 0.5) * 100;
            const randomY = -200 - Math.random() * 300;
            
            particle.style.setProperty('--random-x', `${randomX}px`);
            particle.style.setProperty('--random-y', `${randomY}px`);
            
            this.particlesContainer.appendChild(particle);
            
            // Remove after animation
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 8000);
        };
        
        // Create floating particles periodically
        const floatingInterval = setInterval(() => {
            if (this.animationPhase === 'floating') {
                createFloatingParticle();
            } else {
                clearInterval(floatingInterval);
            }
        }, 300);
    }
    
    startFadeEffect() {
        // Fade out the main message
        this.mainMessage.style.animation = 'none';
        this.mainMessage.style.transition = 'opacity 2s ease-out, transform 2s ease-out';
        this.mainMessage.style.opacity = '0';
        this.mainMessage.style.transform = 'scale(0.95) translateY(-20px)';
        
        // Continue subtle floating particles
        const createSubtleParticle = () => {
            if (this.animationPhase !== 'fade') return;
            
            const particle = document.createElement('div');
            particle.className = 'particle heart-particle';
            particle.textContent = '❤️';
            particle.style.opacity = '0.6';
            
            // Random position
            const rect = this.canvas.getBoundingClientRect();
            particle.style.left = `${Math.random() * rect.width}px`;
            particle.style.top = `${rect.height + 50}px`;
            
            // Very gentle upward movement
            const randomX = (Math.random() - 0.5) * 50;
            const randomY = -150 - Math.random() * 200;
            
            particle.style.setProperty('--random-x', `${randomX}px`);
            particle.style.setProperty('--random-y', `${randomY}px`);
            
            this.particlesContainer.appendChild(particle);
            
            // Remove after animation
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 10000);
        };
        
        // Create subtle particles periodically
        const subtleInterval = setInterval(() => {
            if (this.animationPhase === 'fade') {
                createSubtleParticle();
            } else {
                clearInterval(subtleInterval);
            }
        }, 800);
        
        // Stop after fade duration
        setTimeout(() => {
            this.animationPhase = 'complete';
            clearInterval(subtleInterval);
        }, this.config.fadeDuration);
    }
    
    resetMessageState() {
        // Reset main message
        this.mainMessage.style.animation = '';
        this.mainMessage.style.transition = '';
        this.mainMessage.style.opacity = '';
        this.mainMessage.style.transform = '';
        this.mainMessage.classList.remove('revealed');
        
        // Clear all particles
        this.particlesContainer.innerHTML = '';
        
        // Reset animation phase
        this.animationPhase = 'waiting';
    }
    
    scheduleReplay() {
        // Wait for replay delay, then start again
        setTimeout(() => {
            this.startAnimation();
        }, this.config.replayDelay);
    }
    
    // Canvas-based particle system for additional effects
    createCanvasParticles() {
        const rect = this.canvas.getBoundingClientRect();
        this.ctx.clearRect(0, 0, rect.width, rect.height);
        
        // Create subtle sparkle effects
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * rect.width;
            const y = Math.random() * rect.height;
            const size = Math.random() * 2;
            const opacity = Math.random() * 0.5;
            
            this.ctx.save();
            this.ctx.globalAlpha = opacity;
            this.ctx.fillStyle = '#ffffff';
            this.ctx.shadowColor = '#ffffff';
            this.ctx.shadowBlur = 10;
            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        }
    }
    
    animate() {
        this.createCanvasParticles();
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize the celebration animation
document.addEventListener('DOMContentLoaded', () => {
    const celebration = new CelebrationAnimation();
    celebration.animate();
});

// Add some interactive sparkles on mouse move
document.addEventListener('mousemove', (e) => {
    // Create temporary sparkle at mouse position
    const sparkle = document.createElement('div');
    sparkle.style.position = 'fixed';
    sparkle.style.left = e.clientX + 'px';
    sparkle.style.top = e.clientY + 'px';
    sparkle.style.width = '4px';
    sparkle.style.height = '4px';
    sparkle.style.background = 'radial-gradient(circle, #ffffff 0%, transparent 70%)';
    sparkle.style.borderRadius = '50%';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.zIndex = '1000';
    sparkle.style.animation = 'sparkleFade 1s ease-out forwards';
    
    document.body.appendChild(sparkle);
    
    setTimeout(() => {
        if (sparkle.parentNode) {
            sparkle.parentNode.removeChild(sparkle);
        }
    }, 1000);
});

// Add sparkle fade animation
const style = document.createElement('style');
style.textContent = `
    @keyframes sparkleFade {
        0% {
            opacity: 1;
            transform: scale(1);
        }
        100% {
            opacity: 0;
            transform: scale(0);
        }
    }
`;
document.head.appendChild(style);
