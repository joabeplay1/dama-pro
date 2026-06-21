/**
 * JESUS REINA AI V3 ULTRA ENGINE — CORE PARTICLE SYSTEM
 * Motor de alta performance para renderização de partículas em Canvas 2D
 */

(function () {
    'use strict';

    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    let particlesArray = [];
    let numberOfParticles = 0;
    
    // Configurações do Mouse para Interação
    const mouse = {
        x: null,
        y: null,
        radius: 150 // Raio de influência interativa
    };

    // Paleta de Cores Energéticas Néon
    const colors = [
        'rgba(0, 240, 255, ',  // Néon Ciano
        'rgba(255, 0, 127, ',  // Néon Magenta
        'rgba(157, 0, 255, '   // Néon Roxo
    ];

    /**
     * Redimensiona o canvas dinamicamente mantendo a proporção da tela
     */
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Ajusta densidade de partículas de acordo com a área da tela
        const area = canvas.width * canvas.height;
        numberOfParticles = Math.min(Math.floor(area / 9000), 120); 
        
        initParticles();
    }

    // Escuta eventos de redimensionamento de janela
    window.addEventListener('resize', resizeCanvas);

    // Escuta movimento do mouse para atualizar coordenadas vetoriais
    window.addEventListener('mousemove', function (event) {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    // Remove a influência quando o mouse sai da tela
    window.addEventListener('mouseout', function () {
        mouse.x = null;
        mouse.y = null;
    });

    /**
     * Classe Construtora da Partícula Espacial
     */
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.8; // Velocidade X sutil
            this.vy = (Math.random() - 0.5) * 0.8; // Velocidade Y sutil
            this.radius = Math.random() * 2.5 + 1; // Tamanho molecular variado
            this.colorBase = colors[Math.floor(Math.random() * colors.length)];
            this.alpha = Math.random() * 0.5 + 0.2; // Opacidade inicial instável
            this.pulseDir = Math.random() > 0.5 ? 0.005 : -0.005; // Direção do brilho
        }

        /**
         * Renderiza a partícula individualmente no canvas
         */
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            ctx.fillStyle = this.colorBase + this.alpha + ')';
            
            // Efeito de Glow nativo do Canvas para efeito Ultra Futurista
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.colorBase + '0.8)';
            
            ctx.fill();
        }

        /**
         * Atualiza posições, colisões de borda e atração do cursor
         */
        update() {
            // Colisão com as bordas laterais do viewport
            if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
                this.vx = -this.vx;
            }
            // Colisão com as bordas superiores/inferiores do viewport
            if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
                this.vy = -this.vy;
            }

            // Movimentação contínua
            this.x += this.vx;
            this.y += this.vy;

            // Oscilação sutil do alpha (Efeito Estrela/Pulsante)
            this.alpha += this.pulseDir;
            if (this.alpha > 0.7 || this.alpha < 0.1) {
                this.pulseDir = -this.pulseDir;
            }

            // Interação Vetorial com o Cursor (Efeito Magnetismo Fluido)
            if (mouse.x !== null && mouse.y !== null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouse.radius) {
                    // Empurra ou puxa dependendo da aproximação
                    const force = (mouse.radius - distance) / mouse.radius;
                    this.x -= dx * force * 0.02;
                    this.y -= dy * force * 0.02;
                }
            }
        }
    }

    /**
     * Inicializa o array populando com novas instâncias de partículas
     */
    function initParticles() {
        particlesArray = [];
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }

    /**
     * Desenha linhas de conexão eletromagnética entre partículas próximas (Plexus Effect)
     */
    function connectParticles() {
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let dx = particlesArray[a].x - particlesArray[b].x;
                let dy = particlesArray[a].y - particlesArray[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                // Se a distância for menor que o limiar, cria o feixe de luz
                if (distance < 110) {
                    // Opacidade proporcional à distância (mais longe = mais invisível)
                    let opacity = (1 - (distance / 110)) * 0.15;
                    
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    
                    // Conexão herda uma cor neutra futurista com opacidade flutuante
                    ctx.strokeStyle = `rgba(0, 240, 255, ${opacity})`;
                    ctx.lineWidth = 0.8;
                    ctx.shadowBlur = 0; // Desliga shadow blur nas linhas para preservar CPU
                    ctx.stroke();
                }
            }
        }
    }

    /**
     * Loop de Animação Principal (Ciclo Render contínuo a 60fps)
     */
    function animate() {
        // Limpa o canvas de forma transparente para permitir a fusão com o CSS background gradiente
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        
        connectParticles();
        requestAnimationFrame(animate);
    }

    // Dispara a montagem inicial do ecossistema de partículas
    resizeCanvas();
    animate();

})();
