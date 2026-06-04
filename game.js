var cg = {
    lastTime: (new Date()).getTime(),
    config: {
        width: 640,
        height: 960,
        autosize: true,
        circle: {
            count: 1.75,
            minRadius: 5,
            maxRadius: 55,
            playerRadius: 10,
            radiusInterval: 10,
            speedScale: 3,
            colors: [
                '#00BFFF', '#1E90FF', '#7B68EE', '#7FFFD4',
                '#00FF7F', '#6A0DAD', '#FF3333', '#CC0000',
                '#FF00FF', '#FF1493', '#FF8C00', '#FF4500',
                '#ADFF2F', '#9400D3'
            ]
        },
        touchmove: isEventSupported('touchmove')
    },
    circles: [],
    particles: [],
    highScore: 0,
    deathPts: 0,
    shakeTime: 0,
    shakeAmt: 0,

    // ── Death ────────────────────────────────────────────────────────────────
    death: function() {
        cg.deathPts = cg.player.radius - cg.config.circle.playerRadius;
        if (cg.deathPts > cg.highScore) cg.highScore = cg.deathPts;
        this.stop();
        cg.shakeTime = 18;
        cg.shakeAmt = 12;

        this.dispText = function() {
            var shaking = cg.shakeTime > 0;
            if (shaking) {
                cg.ctx.save();
                cg.ctx.translate(
                    (Math.random() - 0.5) * cg.shakeAmt,
                    (Math.random() - 0.5) * cg.shakeAmt
                );
                cg.shakeAmt *= 0.82;
                cg.shakeTime--;
            }

            cg.ctx.fillStyle = 'rgba(0,0,0,0.72)';
            cg.ctx.fillRect(0, 0, cg.config.width, cg.config.height);

            // "YOU DIED"
            cg.ctx.font = 'bold 52pt Verdana';
            cg.ctx.shadowColor = '#FF2222';
            cg.ctx.shadowBlur = 25;
            cg.ctx.fillStyle = '#FF4444';
            var w = cg.ctx.measureText('YOU DIED').width;
            cg.ctx.fillText('YOU DIED', (cg.config.width - w) / 2, cg.config.height / 2 - 50);

            cg.ctx.shadowBlur = 0;
            cg.ctx.font = 'bold 30pt Verdana';
            cg.ctx.fillStyle = '#FFD700';
            w = cg.ctx.measureText(cg.deathPts + ' pts').width;
            cg.ctx.fillText(cg.deathPts + ' pts', (cg.config.width - w) / 2, cg.config.height / 2 + 20);

            cg.ctx.font = '16pt Verdana';
            cg.ctx.fillStyle = '#AAAAAA';
            w = cg.ctx.measureText('Best: ' + cg.highScore + ' pts').width;
            cg.ctx.fillText('Best: ' + cg.highScore + ' pts', (cg.config.width - w) / 2, cg.config.height / 2 + 72);

            cg.ctx.fillStyle = 'rgba(255,255,255,0.8)';
            w = cg.ctx.measureText('click to restart').width;
            cg.ctx.fillText('click to restart', (cg.config.width - w) / 2, cg.config.height / 2 + 118);

            if (shaking) cg.ctx.restore();
        };

        $(this.canvas).click(function() {
            cg.dispText = function() {};
            cg.start();
        });
    },

    // ── Stop / Start ─────────────────────────────────────────────────────────
    stop: function() {
        $(window).unbind('keydown');
        $(window).unbind('blur');
        $(document).unbind('touchmove');
        $(this.canvas).unbind('mousemove');
        cg.showCursor();
        this.player = false;
    },

    start: function() {
        cg.dispText = function() {};
        $(cg.canvas).unbind('click');
        cg.player = new Player();
        cg.circles = [];
        cg.particles = [];
        cg.hideCursor();
        if (cg.config.touchmove)
            $(document).bind('touchmove', cg.touchMove);
        else
            $(cg.canvas).mousemove(cg.mouseMove);
        $(window).blur(function() { cg.pause(); });
        $(window).keydown(function(e) {
            if (e.keyCode === 32) {
                cg.togglePause();
                e.preventDefault();
            }
        });
    },

    maxCircles: function() {
        return Math.round(cg.config.width * cg.config.height / 10000 / cg.config.circle.count);
    },

    hideCursor: function() { $(cg.canvas).css('cursor', 'none'); },
    showCursor: function() { $(cg.canvas).css('cursor', 'default'); },

    // ── Pause ────────────────────────────────────────────────────────────────
    pause: function() {
        if (!this.paused) {
            cg.showCursor();
            cg.dispText = function() {
                cg.ctx.fillStyle = 'rgba(0,0,0,0.6)';
                cg.ctx.fillRect(0, 0, cg.config.width, cg.config.height);

                cg.ctx.font = 'bold 44pt Verdana';
                cg.ctx.shadowColor = '#00BFFF';
                cg.ctx.shadowBlur = 18;
                cg.ctx.fillStyle = '#FFFFFF';
                var w = cg.ctx.measureText('PAUSED').width;
                cg.ctx.fillText('PAUSED', (cg.config.width - w) / 2, cg.config.height / 2);
                cg.ctx.shadowBlur = 0;

                cg.ctx.font = '18pt Verdana';
                cg.ctx.fillStyle = '#AAAAAA';
                w = cg.ctx.measureText('press space to continue').width;
                cg.ctx.fillText('press space to continue', (cg.config.width - w) / 2, cg.config.height / 2 + 55);
            };
            this.paused = true;
        }
    },

    unpause: function() {
        if (this.paused) {
            cg.dispText = function() {};
            cg.hideCursor();
            this.paused = false;
        }
    },

    togglePause: function() {
        if (this.paused) this.unpause();
        else this.pause();
    },

    // ── Background ───────────────────────────────────────────────────────────
    drawBackground: function() {
        // Deep space radial gradient
        var grad = cg.ctx.createRadialGradient(
            cg.config.width / 2, cg.config.height / 2, 0,
            cg.config.width / 2, cg.config.height / 2,
            Math.max(cg.config.width, cg.config.height) * 0.85
        );
        grad.addColorStop(0, '#0d0d1e');
        grad.addColorStop(1, '#020208');
        cg.ctx.fillStyle = grad;
        cg.ctx.fillRect(0, 0, cg.config.width, cg.config.height);

        // Subtle grid — one stroke() call for perf
        cg.ctx.strokeStyle = 'rgba(255,255,255,0.03)';
        cg.ctx.lineWidth = 1;
        var gs = 60;
        cg.ctx.beginPath();
        for (var x = 0; x < cg.config.width; x += gs) {
            cg.ctx.moveTo(x, 0);
            cg.ctx.lineTo(x, cg.config.height);
        }
        for (var y = 0; y < cg.config.height; y += gs) {
            cg.ctx.moveTo(0, y);
            cg.ctx.lineTo(cg.config.width, y);
        }
        cg.ctx.stroke();
    },

    // ── HUD ──────────────────────────────────────────────────────────────────
    drawHUD: function() {
        if (!cg.player) return;
        var score = cg.player.radius - cg.config.circle.playerRadius;

        cg.ctx.save();
        cg.ctx.font = 'bold 22pt Verdana';
        cg.ctx.shadowColor = '#00BFFF';
        cg.ctx.shadowBlur = 10;
        cg.ctx.fillStyle = 'rgba(255,255,255,0.9)';
        cg.ctx.fillText('Score: ' + score, 20, 42);
        cg.ctx.shadowBlur = 0;

        if (cg.highScore > 0) {
            cg.ctx.font = '14pt Verdana';
            cg.ctx.fillStyle = 'rgba(255,215,0,0.75)';
            cg.ctx.fillText('Best: ' + cg.highScore, 20, 72);
        }

        cg.ctx.font = '11pt Verdana';
        cg.ctx.fillStyle = 'rgba(255,255,255,0.25)';
        cg.ctx.fillText('SPACE to pause', 20, cg.config.height - 15);
        cg.ctx.restore();
    },

    // ── Particles ────────────────────────────────────────────────────────────
    spawnParticles: function(x, y, color, count) {
        for (var i = 0; i < count; i++) {
            var angle = Math.random() * Math.PI * 2;
            var speed = Math.random() * 4.5 + 1;
            cg.particles.push({
                x: x, y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                radius: Math.random() * 3 + 1,
                color: color,
                alpha: 1
            });
        }
    },

    tickParticles: function() {
        for (var i = cg.particles.length - 1; i >= 0; i--) {
            var p = cg.particles[i];
            p.x  += p.vx * elapsed / 15;
            p.y  += p.vy * elapsed / 15;
            p.vx *= 0.94;
            p.vy *= 0.94;
            p.alpha -= 0.04;
            if (p.alpha <= 0) { cg.particles.splice(i, 1); continue; }
            cg.ctx.save();
            cg.ctx.globalAlpha  = p.alpha;
            cg.ctx.shadowColor  = p.color;
            cg.ctx.shadowBlur   = 8;
            cg.ctx.beginPath();
            cg.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            cg.ctx.fillStyle = p.color;
            cg.ctx.fill();
            cg.ctx.restore();
        }
    },

    // ── Init ─────────────────────────────────────────────────────────────────
    init: function() {
        cg.autosize();
        this.canvas = $('canvas');
        this.canvas.attr({ width: this.config.width, height: this.config.height });
        this.canvas = this.canvas[0];
        this.ctx = this.canvas.getContext('2d');

        for (var i = this.circles.length; i < cg.maxCircles(); i++)
            this.circles[i] = new Circle(true);

        $(this.canvas).click(function() {
            $(cg.canvas).unbind('click');
            cg.start();
        });

        this.tick();
    },

    autosize: function() {
        if (cg.config.autosize) {
            cg.config.width  = window.innerWidth;
            cg.config.height = window.innerHeight;
            if (cg.canvas)
                $(cg.canvas).attr({ width: cg.config.width, height: cg.config.height });
        }
    },

    // ── Main loop ────────────────────────────────────────────────────────────
    tick: function() {
        var now = (new Date()).getTime();
        window.elapsed = now - cg.lastTime;
        cg.lastTime = now;

        requestAnimFrame(cg.tick);
        cg.autosize();
        cg.drawBackground();   // replaces clearRect

        if (cg.paused) {
            for (var i = 0; i < cg.circles.length; i++)
                if (cg.circles[i] && cg.circles[i].render()) i--;
        } else {
            if (cg.circles.length < cg.maxCircles() && Math.random() < 0.25)
                cg.circles.push(new Circle());
            for (var i = 0; i < cg.circles.length; i++)
                if (cg.circles[i] && cg.circles[i].tick()) i--;
        }

        cg.tickParticles();

        if (typeof cg.player !== 'undefined' && cg.player)
            cg.player.tick();
        if (typeof cg.player !== 'undefined' && cg.player && !cg.paused)
            cg.drawHUD();

        cg.dispText();
    },

    touchMove: function(e) {
        e.preventDefault();
        var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
        cg.mouseMove(touch);
    },

    mouseMove: function(e) {
        if (!cg.paused) {
            cg.player.x = e.clientX;
            cg.player.y = e.clientY;
        }
    },

    // ── Start screen ─────────────────────────────────────────────────────────
    dispText: function() {
        cg.ctx.fillStyle = 'rgba(0,0,0,0.55)';
        cg.ctx.fillRect(0, 0, cg.config.width, cg.config.height);

        cg.ctx.font = 'bold 52pt Verdana';
        cg.ctx.shadowColor = '#00BFFF';
        cg.ctx.shadowBlur = 22;
        cg.ctx.fillStyle = '#FFFFFF';
        var w = cg.ctx.measureText('CIRCLE GAME').width;
        cg.ctx.fillText('CIRCLE GAME', (cg.config.width - w) / 2, cg.config.height / 2 - 110);
        cg.ctx.shadowBlur = 0;

        cg.ctx.font = '22pt Verdana';
        cg.ctx.fillStyle = '#AADDFF';
        w = cg.ctx.measureText('Eat smaller circles to grow').width;
        cg.ctx.fillText('Eat smaller circles to grow', (cg.config.width - w) / 2, cg.config.height / 2 - 45);

        w = cg.ctx.measureText('Avoid bigger circles').width;
        cg.ctx.fillText('Avoid bigger circles', (cg.config.width - w) / 2, cg.config.height / 2 + 15);

        cg.ctx.font = '18pt Verdana';
        cg.ctx.fillStyle = 'rgba(255,255,255,0.9)';
        w = cg.ctx.measureText('— click to begin —').width;
        cg.ctx.fillText('— click to begin —', (cg.config.width - w) / 2, cg.config.height / 2 + 85);

        if (cg.highScore > 0) {
            cg.ctx.font = '16pt Verdana';
            cg.ctx.fillStyle = '#FFD700';
            w = cg.ctx.measureText('Best: ' + cg.highScore + ' pts').width;
            cg.ctx.fillText('Best: ' + cg.highScore + ' pts', (cg.config.width - w) / 2, cg.config.height / 2 + 135);
        }
    }
};

// ── Circle ───────────────────────────────────────────────────────────────────
var Circle = function(inCenter) {
    var min = cg.config.circle.minRadius;
    var max = cg.config.circle.maxRadius;

    if (typeof cg.player !== 'undefined' && cg.player) {
        if (min < cg.player.radius - 35) min = cg.player.radius - 35;
        if (max < cg.player.radius + 15) max = cg.player.radius + 15;
    }

    this.radius     = rand(min, max, cg.config.circle.radiusInterval);
    this.color      = cg.config.circle.colors[Math.floor(Math.random() * cg.config.circle.colors.length)];
    this.pulsePhase = Math.random() * Math.PI * 2;

    if (inCenter) {
        this.x  = Math.random() * cg.config.width;
        this.y  = Math.random() * cg.config.height;
        this.vx = Math.random() - 0.5;
        this.vy = Math.random() - 0.5;
    } else {
        var r = Math.random();
        if (r <= 0.25) {
            this.x = -this.radius;
            this.y = Math.random() * cg.config.height;
            this.vx =  Math.random();
            this.vy =  Math.random() - 0.5;
        } else if (r <= 0.5) {
            this.x = cg.config.width + this.radius;
            this.y = Math.random() * cg.config.height;
            this.vx = -Math.random();
            this.vy =  Math.random() - 0.5;
        } else if (r <= 0.75) {
            this.x = Math.random() * cg.config.width;  // bugfix: was cg.config.height
            this.y = -this.radius;
            this.vx = Math.random() - 0.5;
            this.vy = Math.random();
        } else {
            this.x = Math.random() * cg.config.width;  // bugfix: was cg.config.height
            this.y = cg.config.height + this.radius;
            this.vx =  Math.random() - 0.5;
            this.vy = -Math.random();
        }
    }

    this.vx *= cg.config.circle.speedScale;
    this.vy *= cg.config.circle.speedScale;
    if (Math.abs(this.vx) + Math.abs(this.vy) < 1) {
        this.vx = this.vx < 0 ? -1 : 1;
        this.vy = this.vy < 0 ? -1 : 1;
    }

    this.tick = function() {
        if (!this.inBounds()) {
            for (var i = 0; i < cg.circles.length; i++) {
                if (cg.circles[i] === this) {   // bugfix: reference check, not x/y compare
                    cg.circles.splice(i, 1);
                    return true;
                }
            }
        } else {
            this.move();
            this.render();
        }
    };

    this.inBounds = function() {
        return !(
            this.x + this.radius < 0 ||
            this.x - this.radius > cg.config.width ||
            this.y + this.radius < 0 ||
            this.y - this.radius > cg.config.height
        );
    };

    this.move = function() {
        this.x += this.vx * elapsed / 15;
        this.y += this.vy * elapsed / 15;
        this.pulsePhase += 0.04;
    };

    this.render = function() {
        var r = this.radius + Math.sin(this.pulsePhase) * 1.5;

        cg.ctx.save();
        cg.ctx.shadowColor = this.color;
        cg.ctx.shadowBlur  = 14;

        var grad = cg.ctx.createRadialGradient(
            this.x - r * 0.3, this.y - r * 0.35, r * 0.1,
            this.x, this.y, r
        );
        grad.addColorStop(0,    '#FFFFFF');
        grad.addColorStop(0.35, this.color);
        grad.addColorStop(1,    'rgba(0,0,0,0.4)');

        cg.ctx.beginPath();
        cg.ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
        cg.ctx.fillStyle = grad;
        cg.ctx.fill();
        cg.ctx.restore();
    };

    this.render();
};

// ── Player ───────────────────────────────────────────────────────────────────
var Player = function() {
    this.x          = cg.config.width / 2;
    this.y          = cg.config.height / 2;
    this.radius     = cg.config.circle.playerRadius;
    this.pulsePhase = 0;

    this.tick = function() {
        this.detectCollision();
        this.render();
    };

    this.detectCollision = function() {
        for (var i = 0; i < cg.circles.length; i++) {
            var circle = cg.circles[i];
            var dist = Math.sqrt(
                (circle.x - this.x) * (circle.x - this.x) +
                (circle.y - this.y) * (circle.y - this.y)
            );
            if (dist < circle.radius + this.radius) {
                if (circle.radius > this.radius) {
                    cg.death();
                    return;
                } else {
                    cg.spawnParticles(circle.x, circle.y, circle.color, 10);
                    this.radius++;
                    cg.circles.splice(i, 1);
                    i--;
                }
            }
        }
    };

    this.render = function() {
        this.pulsePhase += 0.07;
        var r = this.radius + Math.sin(this.pulsePhase) * 1.2;

        cg.ctx.save();
        cg.ctx.shadowColor = '#00BFFF';
        cg.ctx.shadowBlur  = 22;

        var grad = cg.ctx.createRadialGradient(
            this.x - r * 0.3, this.y - r * 0.35, r * 0.05,
            this.x, this.y, r
        );
        grad.addColorStop(0,   '#FFFFFF');
        grad.addColorStop(0.5, '#88CCFF');
        grad.addColorStop(1,   '#0066BB');

        cg.ctx.beginPath();
        cg.ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
        cg.ctx.fillStyle = grad;
        cg.ctx.fill();

        cg.ctx.strokeStyle = 'rgba(255,255,255,0.4)';
        cg.ctx.lineWidth   = 1.5;
        cg.ctx.stroke();
        cg.ctx.restore();
    };
};
