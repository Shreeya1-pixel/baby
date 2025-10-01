class SwimmingPoolGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('score');
        this.timerElement = document.getElementById('timer');
        this.gameOverScreen = document.getElementById('gameOverScreen');
        this.finalScoreElement = document.getElementById('finalScore');
        
        // Game state
        this.gameRunning = false;
        this.score = 0;
        this.timeLeft = 30;
        this.gameStartTime = 0;
        
        // Player
        this.player = {
            x: this.canvas.width / 2,
            y: this.canvas.height - 80,
            width: 40,
            height: 40,
            speed: 5,
            emoji: '🏊‍♂️'
        };
        
        // Game objects
        this.collectibles = [];
        this.hazards = [];
        this.bubbles = [];
        this.powerUps = [];
        
        // Power-up effects
        this.speedBoost = 0;
        this.shield = 0;
        
        // Input handling
        this.keys = {};
        this.setupEventListeners();
        
        // Spawn rates
        this.collectibleSpawnRate = 0.02;
        this.hazardSpawnRate = 0.01;
        this.powerUpSpawnRate = 0.005;
        this.bubbleSpawnRate = 0.1;
        
        this.init();
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
    }
    
    init() {
        this.createBubbles();
        this.startGame();
    }
    
    startGame() {
        this.gameRunning = true;
        this.gameStartTime = Date.now();
        this.gameLoop();
    }
    
    gameLoop() {
        if (!this.gameRunning) return;
        
        this.update();
        this.render();
        
        requestAnimationFrame(() => this.gameLoop());
    }
    
    update() {
        if (!this.gameRunning) return;
        
        // Update timer
        const elapsed = (Date.now() - this.gameStartTime) / 1000;
        this.timeLeft = Math.max(0, 30 - elapsed);
        this.timerElement.textContent = Math.ceil(this.timeLeft);
        
        // Check game over
        if (this.timeLeft <= 0) {
            this.endGame();
            return;
        }
        
        // Update player
        this.updatePlayer();
        
        // Spawn objects
        this.spawnObjects();
        
        // Update game objects
        this.updateCollectibles();
        this.updateHazards();
        this.updatePowerUps();
        this.updateBubbles();
        
        // Update power-up effects
        this.updatePowerUpEffects();
        
        // Check collisions
        this.checkCollisions();
    }
    
    updatePlayer() {
        // Handle input
        if (this.keys['arrowleft'] || this.keys['a']) {
            this.player.x -= this.player.speed + this.speedBoost;
        }
        if (this.keys['arrowright'] || this.keys['d']) {
            this.player.x += this.player.speed + this.speedBoost;
        }
        
        // Keep player in bounds
        this.player.x = Math.max(0, Math.min(this.canvas.width - this.player.width, this.player.x));
    }
    
    spawnObjects() {
        // Spawn collectibles (chess pieces)
        if (Math.random() < this.collectibleSpawnRate) {
            this.collectibles.push({
                x: Math.random() * (this.canvas.width - 30),
                y: -30,
                width: 30,
                height: 30,
                type: 'chess',
                emoji: ['♟️', '♞', '♛'][Math.floor(Math.random() * 3)],
                speed: 2 + Math.random() * 2,
                glow: 0
            });
        }
        
        // Spawn hazards (bugs)
        if (Math.random() < this.hazardSpawnRate) {
            this.hazards.push({
                x: Math.random() * (this.canvas.width - 25),
                y: -25,
                width: 25,
                height: 25,
                type: 'bug',
                emoji: '🐞',
                speed: 1.5 + Math.random() * 1.5,
                rotation: 0
            });
        }
        
        // Spawn power-ups (code snippets)
        if (Math.random() < this.powerUpSpawnRate) {
            const codeSnippets = [
                'if(love){++happiness;}',
                'while(true){hug();}',
                'return happiness;',
                'const joy = ∞;',
                'function smile(){return true;}'
            ];
            
            this.powerUps.push({
                x: Math.random() * (this.canvas.width - 200),
                y: -30,
                width: 200,
                height: 30,
                type: 'code',
                text: codeSnippets[Math.floor(Math.random() * codeSnippets.length)],
                speed: 1.5,
                glow: 0
            });
        }
        
        // Spawn bubbles
        if (Math.random() < this.bubbleSpawnRate) {
            this.bubbles.push({
                x: Math.random() * this.canvas.width,
                y: this.canvas.height + 10,
                radius: 3 + Math.random() * 8,
                speed: 1 + Math.random() * 2,
                opacity: 0.3 + Math.random() * 0.4,
                drift: (Math.random() - 0.5) * 0.5
            });
        }
    }
    
    updateCollectibles() {
        for (let i = this.collectibles.length - 1; i >= 0; i--) {
            const collectible = this.collectibles[i];
            collectible.y += collectible.speed;
            collectible.glow += 0.1;
            
            if (collectible.y > this.canvas.height) {
                this.collectibles.splice(i, 1);
            }
        }
    }
    
    updateHazards() {
        for (let i = this.hazards.length - 1; i >= 0; i--) {
            const hazard = this.hazards[i];
            hazard.y += hazard.speed;
            hazard.rotation += 0.1;
            
            if (hazard.y > this.canvas.height) {
                this.hazards.splice(i, 1);
            }
        }
    }
    
    updatePowerUps() {
        for (let i = this.powerUps.length - 1; i >= 0; i--) {
            const powerUp = this.powerUps[i];
            powerUp.y += powerUp.speed;
            powerUp.glow += 0.15;
            
            if (powerUp.y > this.canvas.height) {
                this.powerUps.splice(i, 1);
            }
        }
    }
    
    updateBubbles() {
        for (let i = this.bubbles.length - 1; i >= 0; i--) {
            const bubble = this.bubbles[i];
            bubble.y -= bubble.speed;
            bubble.x += bubble.drift;
            bubble.opacity *= 0.999;
            
            if (bubble.y < -bubble.radius || bubble.opacity < 0.1) {
                this.bubbles.splice(i, 1);
            }
        }
    }
    
    updatePowerUpEffects() {
        if (this.speedBoost > 0) {
            this.speedBoost -= 0.01;
            if (this.speedBoost < 0) this.speedBoost = 0;
        }
        
        if (this.shield > 0) {
            this.shield -= 0.01;
            if (this.shield < 0) this.shield = 0;
        }
    }
    
    checkCollisions() {
        // Check collectible collisions
        for (let i = this.collectibles.length - 1; i >= 0; i--) {
            const collectible = this.collectibles[i];
            if (this.isColliding(this.player, collectible)) {
                this.score += 10;
                this.scoreElement.textContent = this.score;
                this.collectibles.splice(i, 1);
                this.createCollectEffect(collectible.x, collectible.y);
            }
        }
        
        // Check hazard collisions
        for (let i = this.hazards.length - 1; i >= 0; i--) {
            const hazard = this.hazards[i];
            if (this.isColliding(this.player, hazard)) {
                if (this.shield <= 0) {
                    this.score = Math.max(0, this.score - 5);
                    this.scoreElement.textContent = this.score;
                    this.createHazardEffect(hazard.x, hazard.y);
                }
                this.hazards.splice(i, 1);
            }
        }
        
        // Check power-up collisions
        for (let i = this.powerUps.length - 1; i >= 0; i--) {
            const powerUp = this.powerUps[i];
            if (this.isColliding(this.player, powerUp)) {
                // Random power-up effect
                if (Math.random() < 0.5) {
                    this.speedBoost = 3;
                } else {
                    this.shield = 5;
                }
                this.powerUps.splice(i, 1);
                this.createPowerUpEffect(powerUp.x, powerUp.y);
            }
        }
    }
    
    isColliding(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
    
    createBubbles() {
        for (let i = 0; i < 20; i++) {
            this.bubbles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: 3 + Math.random() * 8,
                speed: 1 + Math.random() * 2,
                opacity: 0.3 + Math.random() * 0.4,
                drift: (Math.random() - 0.5) * 0.5
            });
        }
    }
    
    createCollectEffect(x, y) {
        // Create particle effect for collectible
        for (let i = 0; i < 8; i++) {
            this.bubbles.push({
                x: x + (Math.random() - 0.5) * 40,
                y: y + (Math.random() - 0.5) * 40,
                radius: 2 + Math.random() * 4,
                speed: 2 + Math.random() * 3,
                opacity: 0.8,
                drift: (Math.random() - 0.5) * 2
            });
        }
    }
    
    createHazardEffect(x, y) {
        // Create red particle effect for hazard
        for (let i = 0; i < 6; i++) {
            this.bubbles.push({
                x: x + (Math.random() - 0.5) * 30,
                y: y + (Math.random() - 0.5) * 30,
                radius: 1 + Math.random() * 3,
                speed: 1 + Math.random() * 2,
                opacity: 0.6,
                drift: (Math.random() - 0.5) * 1.5,
                color: '#ef4444'
            });
        }
    }
    
    createPowerUpEffect(x, y) {
        // Create golden particle effect for power-up
        for (let i = 0; i < 10; i++) {
            this.bubbles.push({
                x: x + (Math.random() - 0.5) * 60,
                y: y + (Math.random() - 0.5) * 60,
                radius: 3 + Math.random() * 5,
                speed: 3 + Math.random() * 4,
                opacity: 0.9,
                drift: (Math.random() - 0.5) * 2.5,
                color: '#fbbf24'
            });
        }
    }
    
    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw background gradient
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#1e3a8a');
        gradient.addColorStop(0.25, '#1e40af');
        gradient.addColorStop(0.5, '#1d4ed8');
        gradient.addColorStop(0.75, '#2563eb');
        gradient.addColorStop(1, '#3b82f6');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw bubbles
        this.renderBubbles();
        
        // Draw collectibles
        this.renderCollectibles();
        
        // Draw hazards
        this.renderHazards();
        
        // Draw power-ups
        this.renderPowerUps();
        
        // Draw player
        this.renderPlayer();
        
        // Draw power-up indicators
        this.renderPowerUpIndicators();
    }
    
    renderBubbles() {
        this.bubbles.forEach(bubble => {
            this.ctx.save();
            this.ctx.globalAlpha = bubble.opacity;
            
            if (bubble.color) {
                this.ctx.fillStyle = bubble.color;
            } else {
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            }
            
            this.ctx.beginPath();
            this.ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Add glow effect
            this.ctx.shadowColor = bubble.color || 'rgba(255, 255, 255, 0.8)';
            this.ctx.shadowBlur = 10;
            this.ctx.beginPath();
            this.ctx.arc(bubble.x, bubble.y, bubble.radius * 0.7, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.restore();
        });
    }
    
    renderCollectibles() {
        this.collectibles.forEach(collectible => {
            this.ctx.save();
            
            // Glow effect
            this.ctx.shadowColor = '#fbbf24';
            this.ctx.shadowBlur = 15 + Math.sin(collectible.glow) * 5;
            
            this.ctx.font = '24px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(collectible.emoji, 
                collectible.x + collectible.width / 2, 
                collectible.y + collectible.height / 2 + 8);
            
            this.ctx.restore();
        });
    }
    
    renderHazards() {
        this.hazards.forEach(hazard => {
            this.ctx.save();
            
            // Glow effect
            this.ctx.shadowColor = '#ef4444';
            this.ctx.shadowBlur = 10;
            
            this.ctx.translate(hazard.x + hazard.width / 2, hazard.y + hazard.height / 2);
            this.ctx.rotate(hazard.rotation);
            
            this.ctx.font = '20px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(hazard.emoji, 0, 6);
            
            this.ctx.restore();
        });
    }
    
    renderPowerUps() {
        this.powerUps.forEach(powerUp => {
            this.ctx.save();
            
            // Glow effect
            this.ctx.shadowColor = '#fbbf24';
            this.ctx.shadowBlur = 20 + Math.sin(powerUp.glow) * 10;
            
            this.ctx.fillStyle = 'rgba(251, 191, 36, 0.9)';
            this.ctx.font = 'bold 12px monospace';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(powerUp.text, 
                powerUp.x + powerUp.width / 2, 
                powerUp.y + powerUp.height / 2 + 4);
            
            this.ctx.restore();
        });
    }
    
    renderPlayer() {
        this.ctx.save();
        
        // Shield effect
        if (this.shield > 0) {
            this.ctx.shadowColor = '#3b82f6';
            this.ctx.shadowBlur = 20;
            this.ctx.strokeStyle = 'rgba(59, 130, 246, 0.8)';
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.arc(this.player.x + this.player.width / 2, 
                        this.player.y + this.player.height / 2, 
                        this.player.width / 2 + 10, 0, Math.PI * 2);
            this.ctx.stroke();
        }
        
        // Speed boost effect
        if (this.speedBoost > 0) {
            this.ctx.shadowColor = '#10b981';
            this.ctx.shadowBlur = 15;
        }
        
        this.ctx.font = '32px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(this.player.emoji, 
            this.player.x + this.player.width / 2, 
            this.player.y + this.player.height / 2 + 10);
        
        this.ctx.restore();
    }
    
    renderPowerUpIndicators() {
        if (this.speedBoost > 0 || this.shield > 0) {
            this.ctx.save();
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            this.ctx.fillRect(10, this.canvas.height - 60, 200, 50);
            
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'left';
            
            if (this.speedBoost > 0) {
                this.ctx.fillText(`⚡ Speed Boost: ${Math.ceil(this.speedBoost * 10)}`, 15, this.canvas.height - 40);
            }
            if (this.shield > 0) {
                this.ctx.fillText(`🛡️ Shield: ${Math.ceil(this.shield * 10)}`, 15, this.canvas.height - 25);
            }
            
            this.ctx.restore();
        }
    }
    
    endGame() {
        this.gameRunning = false;
        this.finalScoreElement.textContent = this.score;
        this.gameOverScreen.classList.remove('hidden');
        
        // Create floating bubbles effect
        this.createFloatingBubbles();
    }
    
    createFloatingBubbles() {
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                this.bubbles.push({
                    x: Math.random() * this.canvas.width,
                    y: this.canvas.height + 10,
                    radius: 5 + Math.random() * 15,
                    speed: 2 + Math.random() * 4,
                    opacity: 0.6 + Math.random() * 0.4,
                    drift: (Math.random() - 0.5) * 1
                });
            }, i * 100);
        }
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new SwimmingPoolGame();
});
