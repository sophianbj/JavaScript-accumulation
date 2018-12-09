/*要实现的功能：1、绘制星空，（旋转且随机生成星星）2、绘制fireworks烟花（随机位置生成后散落成粒子后消失）*/
window.onload = function() {
    window.requestAnimationFrame = window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.msRequestAnimationFrame||function(fn){setTimeout(fn,1000/60)};
    var canvas = document.getElementById("fireworks"),
        ctx = canvas.getContext("2d"),
        cw = window.innerWidth,
        ch = window.innerHeight,
        fireworks = [],
        particles = [],
        hue = 120,
        limiterTotal = 5,
        limiterTick = 0,
        timerTotal = 80,
        timerTick = 0,
        mousedown = false,
        mx,
        my;
    canvas.width = cw;
    canvas.height = ch;
    //随机数
    function random(min, max) {
        return Math.random() * (max - min) + min;
    }
    //计算斜边的长度（烟花的路径）
    function calculateDistance(p1x, p1y, p2x, p2y) {
        var xDistance = p1x - p2x,
            yDistance = p1y - p2y;
        return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2))
    }
    /**烟花的轨迹
    * sx：初始位置的x坐标，sy：初始位置的y坐标；默认[cw/2,ch];
    * tx：结束位置的x坐标，ty：结束位置的y坐标,随机位置
    * */
    function Firework(sx, sy, tx, ty) {
        this.x = sx;
        this.y = sy;
        this.sx = sx;
        this.sy = sy;
        this.tx = tx;
        this.ty = ty;
        this.distanceToTarget = calculateDistance(sx, sy, tx, ty);
        this.distanceTraveled = 0;
        this.coordinates = [];//坐标
        this.coordinateCount = 3;
        while (this.coordinateCount--) {
            this.coordinates.push([this.x, this.y])
        }
        this.angle = Math.atan2(ty - sy, tx - sx);
        this.speed = 2;//速度
        this.acceleration = 1.05;//加速度
        this.brightness = random(50, 70);//烟花的明亮度
        this.targetRadius = 1;//默认初始半径
    }
    Firework.prototype.update = function(index) {
        this.coordinates.pop();//从后移除一位；
        this.coordinates.unshift([this.x, this.y]);//从初始位置添加
        if (this.targetRadius < 8) {
            this.targetRadius += 0.3
        } else {
            this.targetRadius = 1
        }
        this.speed *= this.acceleration;
        var vx = Math.cos(this.angle) * this.speed,//x方向的速度
            vy = Math.sin(this.angle) * this.speed;//y方向的速度
        this.distanceTraveled = calculateDistance(this.sx, this.sy, this.x + vx, this.y + vy);//运行的路程
        if (this.distanceTraveled >= this.distanceToTarget) {
            createParticles(this.tx, this.ty);
            fireworks.splice(index, 1)
        } else {
            this.x += vx;
            this.y += vy
        }
    };
    Firework.prototype.draw = function() {
        ctx.beginPath();
        ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = "hsl(" + hue + ", 100%, " + this.brightness + "%)";
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(this.tx, this.ty, this.targetRadius, 0, Math.PI * 2);
        ctx.stroke()
    };
    //形成随机的粒子状
    function Particle(x, y) {
        this.x = x;
        this.y = y;
        this.coordinates = [];//粒子坐标
        this.coordinateCount = 5;
        while (this.coordinateCount--) {
            this.coordinates.push([this.x, this.y])
        }
        this.angle = random(0, Math.PI * 2);
        this.speed = random(1, 10);
        this.friction = 0.95;
        this.gravity = 1;
        this.hue = random(hue - 20, hue + 20);
        this.brightness = random(50, 80);
        this.alpha = 1;
        this.decay = random(0.015, 0.03);
    }
    Particle.prototype.update = function(index) {
        this.coordinates.pop();
        this.coordinates.unshift([this.x, this.y]);
        this.speed *= this.friction;
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed + this.gravity;
        this.alpha -= this.decay;
        if (this.alpha <= this.decay) {
            particles.splice(index, 1)
        }
    };
    Particle.prototype.draw = function() {
        ctx.beginPath();
        ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = "hsla(" + this.hue + ", 100%, " + this.brightness + "%, " + this.alpha + ")";
        ctx.stroke()
    };
    //到达指定位置（终点）散落成粒子
    function createParticles(x, y) {
        var particleCount = 30;//默认的粒子数
        while (particleCount--) {
            particles.push(new Particle(x, y))
        }
    }
    function loop() {
        requestAnimationFrame(loop);
        hue += 0.5;
        ctx.globalCompositeOperation = "destination-out";//新绘制的图像透明只有新图像未覆盖到的地方显示(在源图像之外显示目标图像。)
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(0, 0, cw, ch);
        ctx.globalCompositeOperation = "lighter";//绘制的新(源)图像覆盖到旧（目标）图像上(显示源图像 + 目标图像。)
        var i = fireworks.length;
        while (i--) {
            fireworks[i].draw();
            fireworks[i].update(i)
        }
        var j = particles.length;
        while (j--) {
            particles[j].draw();
            particles[j].update(j)
        }
        if (timerTick >= timerTotal) {
            if (!mousedown) {
                fireworks.push(new Firework(cw / 2, ch, random(0, cw), random(0, ch / 2)));
                timerTick = 0
            }
        } else {
            timerTick++
        }
        if (limiterTick >= limiterTotal) {
            if (mousedown) {
                fireworks.push(new Firework(cw / 2, ch, mx, my));
                limiterTick = 0
            }
        } else {
            limiterTick++
        }
    }
    canvas.addEventListener("mousemove", function(e) {
        mx = e.pageX - canvas.offsetLeft;
        my = e.pageY - canvas.offsetTop
    });
    canvas.addEventListener("mousedown", function(e) {
        e.preventDefault();
        mousedown = true
    });
    canvas.addEventListener("mouseup", function(e) {
        e.preventDefault();
        mousedown = false
    });
    loop();
    canvas2("stars", 230, 1000, 60, 2, 50000, 0.5)
};
/*  星空
 * @param参数 id获取dom元素
 *   starscolor -->HSL(H,S,L)【H：(色调)。0(或360)表示红色，120表示绿色，240表示蓝色，也可取其他数值来指定颜色。取值为：0 - 360;  S：Saturation(饱和度)。取值为：0.0% - 100.0%; L：Lightness(亮度)。取值为：0.0% - 100.0%)】
 *starsamount :星星的最大数量
 *starsradius : 星星的默认半径
 *movrange ：移动范围
 * speed
 * trailing ：新绘制图像的透明度
 * */
function canvas2(id, starscolor, starsamount, starsradius, movrange, speed, trailing) {
    var canvas = document.getElementById(id),
        ctx = canvas.getContext("2d"),
        w = canvas.width = window.innerWidth,
        h = canvas.height = window.innerHeight,
        hue = starscolor,
        stars = [],
        count = 0,
        maxStars = starsamount;
    var canvas2 = document.createElement("canvas"),
        ctx2 = canvas2.getContext("2d");
    canvas2.width = 100;
    canvas2.height = 100;
    var half = canvas2.width / 2,
        gradient2 = ctx2.createRadialGradient(half, half, 0, half, half, half);//径向渐变
    gradient2.addColorStop(0.025, "#CCC");
    gradient2.addColorStop(0.1, "hsl(" + hue + ", 61%, 33%)");
    gradient2.addColorStop(0.25, "hsl(" + hue + ", 64%, 6%)");
    gradient2.addColorStop(1, "transparent");
    ctx2.fillStyle = gradient2;
    ctx2.beginPath();
    ctx2.arc(half, half, half, 0, Math.PI * 2);
    ctx2.fill();
    function random(min, max) {
        if (arguments.length < 2) {
            max = min;
            min = 0
        }
        if (min > max) {
            var hold = max;
            max = min;
            min = hold
        }
        return Math.floor(Math.random() * (max - min + 1)) + min;//[min,max]随机数
    }
    function maxOrbit(x, y) {
        var max = Math.max(x, y),
            diameter = Math.round(Math.sqrt(max * max + max * max));
        return diameter / movrange;
    }
    var Star = function() {
        this.orbitRadius = random(maxOrbit(w, h));
        this.radius = random(starsradius, this.orbitRadius) / 8;
        this.orbitX = w / 2;
        this.orbitY = h / 2;
        this.timePassed = random(0, maxStars);
        this.speed = random(this.orbitRadius) / speed;
        this.alpha = random(2, 10) / 10;
        count++;
        stars[count] = this
    };
    Star.prototype.draw = function() {
        var x = Math.sin(this.timePassed) * this.orbitRadius + this.orbitX,
            y = Math.cos(this.timePassed) * this.orbitRadius + this.orbitY,
            twinkle = random(10);
        if (twinkle === 1 && this.alpha > 0) {
            this.alpha -= 0.05
        } else {
            if (twinkle === 2 && this.alpha < 1) {
                this.alpha += 0.05
            }
        }
        ctx.globalAlpha = this.alpha;
        ctx.drawImage(canvas2, x - this.radius / 2, y - this.radius / 2, this.radius, this.radius);
        this.timePassed += this.speed
    };
    for (var i = 0; i < maxStars; i++) {new Star();}
    function animation() {
        ctx.globalCompositeOperation = "source-over";
        ctx.globalAlpha = trailing;//新绘制图像的透明度
        ctx.fillStyle = "hsla(" + hue + ", 64%, 6%, 2)";
        ctx.fillRect(0, 0, w, h);
        ctx.globalCompositeOperation = "lighter";
        for (var i = 1,l = stars.length; i < l; i++) {
            stars[i].draw();
        }
        window.requestAnimationFrame(animation);
    }
    animation();
}