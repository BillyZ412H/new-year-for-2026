document.addEventListener('DOMContentLoaded', function() {
    // 页面元素
    const pages = document.querySelectorAll('.page');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const canvas = document.getElementById('fireworksCanvas');
    const ctx = canvas.getContext('2d');
    
    // 用户设备系统时间
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-11
    const currentDate = now.getDate();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentSeconds = now.getSeconds();
    
    // 目标时间：2026年1月1日 00:00:00
    const targetDate = new Date('2026-01-01T00:00:00');
    
    // 是否已进入2026年
    const is2026 = now >= targetDate;
    
    // 倒计时元素
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    const countdownTitle = document.getElementById('countdown-title');
    
    // 第一页元素
    const page1Title = document.getElementById('page1-title');
    const currentDateElement = document.getElementById('current-date');
    
    // 烟花容器
    const fireworksContainers = [
        document.getElementById('fireworks1'),
        document.getElementById('fireworks2'),
        document.getElementById('fireworks3')
    ];
    
    // 设置画布尺寸
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // 初始化页面内容
    function initializePageContent() {
        // 更新第一页日期显示
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        currentDateElement.textContent = now.toLocaleDateString('zh-CN', options);
        
        // 根据当前时间设置第一页内容
        if (is2026) {
            // 如果已经是2026年，显示原始文案
            page1Title.textContent = "当您看到这个网页时，已经2026了！";
        } else {
            // 如果还没到2026年，显示倒计时
            page1Title.textContent = "距离2026年还有...";
            
            // 在第一页添加倒计时
            const page1Content = document.querySelector('#page1 .content');
            const countdownElement = document.createElement('div');
            countdownElement.className = 'pre-countdown';
            countdownElement.innerHTML = `
                <div class="pre-countdown-title">新年倒计时</div>
                <div class="pre-countdown-display">
                    <div class="pre-time-unit">
                        <span id="pre-days">00</span>
                        <div class="pre-unit-label">天</div>
                    </div>
                    <div class="pre-separator">:</div>
                    <div class="pre-time-unit">
                        <span id="pre-hours">00</span>
                        <div class="pre-unit-label">小时</div>
                    </div>
                    <div class="pre-separator">:</div>
                    <div class="pre-time-unit">
                        <span id="pre-minutes">00</span>
                        <div class="pre-unit-label">分钟</div>
                    </div>
                    <div class="pre-separator">:</div>
                    <div class="pre-time-unit">
                        <span id="pre-seconds">00</span>
                        <div class="pre-unit-label">秒</div>
                    </div>
                </div>
            `;
            
            // 插入到标题之后
            page1Title.insertAdjacentElement('afterend', countdownElement);
            
            // 更新第一页倒计时
            updatePreCountdown();
            setInterval(updatePreCountdown, 1000);
        }
        
        // 第三页倒计时处理
        if (!is2026) {
            // 如果还没到2026年，隐藏第三页倒计时
            const countdownElement = document.querySelector('#page3 .countdown');
            if (countdownElement) {
                countdownElement.style.display = 'none';
            }
        }
    }
    
    // 更新第一页倒计时
    function updatePreCountdown() {
        const now = new Date();
        const timeLeft = targetDate - now;
        
        if (timeLeft <= 0) {
            // 时间到，刷新页面
            location.reload();
            return;
        }
        
        const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hoursLeft = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const secondsLeft = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        const preDaysElement = document.getElementById('pre-days');
        const preHoursElement = document.getElementById('pre-hours');
        const preMinutesElement = document.getElementById('pre-minutes');
        const preSecondsElement = document.getElementById('pre-seconds');
        
        if (preDaysElement) preDaysElement.textContent = String(daysLeft).padStart(2, '0');
        if (preHoursElement) preHoursElement.textContent = String(hoursLeft).padStart(2, '0');
        if (preMinutesElement) preMinutesElement.textContent = String(minutesLeft).padStart(2, '0');
        if (preSecondsElement) preSecondsElement.textContent = String(secondsLeft).padStart(2, '0');
    }
    
    // 当前页面索引
    let currentPageIndex = 0;
    
    // 更新页面显示
    function updatePageDisplay() {
        // 移除所有页面的active类，添加previous类给非当前页面
        pages.forEach((page, index) => {
            page.classList.remove('active', 'previous');
            if (index < currentPageIndex) {
                page.classList.add('previous');
            }
        });
        
        // 给当前页面添加active类
        pages[currentPageIndex].classList.add('active');
        
        // 更新导航点
        dots.forEach((dot, index) => {
            dot.classList.remove('active');
            if (index === currentPageIndex) {
                dot.classList.add('active');
            }
        });
        
        // 根据页面索引启动对应烟花
        startFireworks(currentPageIndex);
    }
    
    // 导航到指定页面
    function goToPage(index) {
        if (index < 0) index = 0;
        if (index >= pages.length) index = pages.length - 1;
        
        currentPageIndex = index;
        updatePageDisplay();
    }
    
    // 下一页
    function nextPage() {
        if (currentPageIndex < pages.length - 1) {
            goToPage(currentPageIndex + 1);
        } else {
            // 如果是最后一页，循环回到第一页
            goToPage(0);
        }
    }
    
    // 上一页
    function prevPage() {
        if (currentPageIndex > 0) {
            goToPage(currentPageIndex - 1);
        } else {
            // 如果是第一页，循环到最后一页
            goToPage(pages.length - 1);
        }
    }
    
    // 初始化页面
    initializePageContent();
    updatePageDisplay();
    
    // 事件监听
    prevBtn.addEventListener('click', prevPage);
    nextBtn.addEventListener('click', nextPage);
    
    // 点击导航点跳转
    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            const pageIndex = parseInt(this.getAttribute('data-page'));
            goToPage(pageIndex);
        });
    });
    
    // 键盘导航
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
            nextPage();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            prevPage();
        }
    });
    
    // 烟花粒子系统
    class Particle {
        constructor(x, y, color, velocity, size = 2) {
            this.x = x;
            this.y = y;
            this.color = color;
            this.velocity = velocity;
            this.size = size;
            this.alpha = 1;
            this.gravity = 0.005;
            this.friction = 0.99;
        }
        
        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.restore();
        }
        
        update() {
            this.velocity.x *= this.friction;
            this.velocity.y *= this.friction;
            this.velocity.y += this.gravity;
            
            this.x += this.velocity.x;
            this.y += this.velocity.y;
            this.alpha -= 0.008;
            
            this.draw();
        }
    }
    
    // 烟花类
    class Firework {
        constructor(x, y, targetX, targetY) {
            this.x = x;
            this.y = y;
            this.targetX = targetX;
            this.targetY = targetY;
            this.distance = Math.hypot(targetX - x, targetY - y);
            this.speed = 4;
            this.angle = Math.atan2(targetY - y, targetX - x);
            this.velocity = {
                x: Math.cos(this.angle) * this.speed,
                y: Math.sin(this.angle) * this.speed
            };
            this.gravity = 0.2;
            this.trail = [];
            this.exploded = false;
            this.particles = [];
            this.color = `hsl(${Math.random() * 60 + 20}, 100%, 60%)`;
        }
        
        update() {
            // 如果还没爆炸，继续移动
            if (!this.exploded) {
                this.velocity.y += this.gravity * 0.3;
                this.x += this.velocity.x;
                this.y += this.velocity.y;
                
                // 添加到轨迹
                this.trail.push({x: this.x, y: this.y});
                if (this.trail.length > 8) this.trail.shift();
                
                // 检查是否到达目标
                if (Math.hypot(this.targetX - this.x, this.targetY - this.y) < 5) {
                    this.explode();
                }
            }
            
            // 更新粒子
            this.particles.forEach((particle, index) => {
                if (particle.alpha <= 0) {
                    this.particles.splice(index, 1);
                } else {
                    particle.update();
                }
            });
        }
        
        explode() {
            this.exploded = true;
            const particleCount = 80;
            const colors = [this.color, '#ff9e6d', '#ffd166', '#6aebff', '#a9e4a9'];
            
            for (let i = 0; i < particleCount; i++) {
                const angle = Math.PI * 2 * (i / particleCount);
                const speed = Math.random() * 3 + 1;
                const velocity = {
                    x: Math.cos(angle) * speed,
                    y: Math.sin(angle) * speed
                };
                const color = colors[Math.floor(Math.random() * colors.length)];
                const size = Math.random() * 2 + 1;
                
                this.particles.push(new Particle(this.x, this.y, color, velocity, size));
            }
        }
        
        draw() {
            // 绘制轨迹
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(this.trail[0]?.x || this.x, this.trail[0]?.y || this.y);
            
            for (let i = 1; i < this.trail.length; i++) {
                ctx.lineTo(this.trail[i].x, this.trail[i].y);
            }
            
            ctx.stroke();
            
            // 绘制烟花主体
            if (!this.exploded) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }
    }
    
    // 烟花数组
    let fireworks = [];
    
    // 创建烟花
    function createFirework() {
        const x = Math.random() * canvas.width;
        const y = canvas.height;
        const targetX = Math.random() * canvas.width;
        const targetY = Math.random() * canvas.height * 0.6;
        
        fireworks.push(new Firework(x, y, targetX, targetY));
    }
    
    // 动画循环
    function animate() {
        // 清空画布，添加半透明黑色背景实现拖尾效果
        ctx.fillStyle = 'rgba(10, 10, 40, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 更新和绘制所有烟花
        fireworks.forEach((firework, index) => {
            firework.update();
            firework.draw();
            
            // 移除已经爆炸且粒子全部消失的烟花
            if (firework.exploded && firework.particles.length === 0) {
                fireworks.splice(index, 1);
            }
        });
        
        requestAnimationFrame(animate);
    }
    
    // 开始烟花动画
    animate();
    
    // 根据页面索引启动烟花
    function startFireworks(pageIndex) {
        // 清除现有定时器
        if (window.fireworkInterval) {
            clearInterval(window.fireworkInterval);
        }
        
        // 根据页面设置不同的烟花频率
        let fireworkFrequency;
        switch(pageIndex) {
            case 0:
                fireworkFrequency = 800; // 第一页：每800ms一个烟花
                break;
            case 1:
                fireworkFrequency = 600; // 第二页：每600ms一个烟花
                break;
            case 2:
                fireworkFrequency = 400; // 第三页：每400ms一个烟花，最密集
                break;
            default:
                fireworkFrequency = 800;
        }
        
        // 创建初始烟花
        for (let i = 0; i < 3; i++) {
            setTimeout(() => createFirework(), i * 300);
        }
        
        // 设置定时器持续创建烟花
        window.fireworkInterval = setInterval(createFirework, fireworkFrequency);
    }
    
    // 第三页倒计时更新函数
    function updateCountdown() {
        if (!is2026) return;
        
        const now = new Date();
        const elapsed = now - targetDate;
        const elapsedHours = Math.floor(elapsed / (1000 * 60 * 60));
        const elapsedMinutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
        const elapsedSeconds = Math.floor((elapsed % (1000 * 60)) / 1000);
        
        hoursElement.textContent = String(elapsedHours).padStart(2, '0');
        minutesElement.textContent = String(elapsedMinutes).padStart(2, '0');
        secondsElement.textContent = String(elapsedSeconds).padStart(2, '0');
    }
    
    // 初始化第三页倒计时（如果已进入2026年）
    if (is2026) {
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }
});