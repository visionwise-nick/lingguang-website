const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const size = 1024;
const canvas = createCanvas(size, size);
const ctx = canvas.getContext('2d');
const centerX = size / 2;
const centerY = size / 2;

// 清空画布，填充深紫黑色背景
ctx.fillStyle = '#00000a';
ctx.fillRect(0, 0, size, size);

// 创建渐变光线效果
function drawLightBeam(startX, startY, offset, intensity) {
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    
    // 青蓝色到紫色的渐变
    gradient.addColorStop(0, `rgba(50, 150, 255, ${intensity * 0.3})`);
    gradient.addColorStop(0.3, `rgba(100, 150, 255, ${intensity * 0.5})`);
    gradient.addColorStop(0.6, `rgba(150, 100, 255, ${intensity * 0.7})`);
    gradient.addColorStop(1, `rgba(255, 200, 255, ${intensity * 0.9})`);
    
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 80 + offset * 20;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // 绘制S形路径
    ctx.beginPath();
    const points = 100;
    for (let i = 0; i <= points; i++) {
        const t = i / points;
        const progress = t * 3 - 1.5;
        
        // S形曲线方程
        const x = (progress + 1.5) * size / 5 + size / 10;
        const y = centerY + Math.sin(progress) * (size / 3) + offset * size / 8;
        
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    
    ctx.stroke();
    
    // 添加光晕效果（node-canvas 支持 shadowBlur）
    ctx.shadowBlur = 60 + offset * 20;
    ctx.shadowColor = `rgba(100, 150, 255, ${intensity * 0.6})`;
    ctx.stroke();
    ctx.shadowBlur = 0;
}

// 绘制多条光线
for (let i = 0; i < 3; i++) {
    const offset = (i - 1) * 0.5;
    const intensity = 0.7 + i * 0.1;
    drawLightBeam(0, 0, offset, intensity);
}

// 添加光粒子效果
ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
const particles = 150;
for (let i = 0; i < particles; i++) {
    const t = Math.random() * 3;
    const baseX = (t + 1.5) * size / 5 + size / 10;
    const baseY = centerY + Math.sin(t) * (size / 3);
    
    const x = baseX + (Math.random() - 0.5) * size / 1.5;
    const y = baseY + (Math.random() - 0.5) * size / 1.5;
    
    if (x >= 0 && x < size && y >= 0 && y < size) {
        const particleSize = 2 + Math.random() * 4;
        const alpha = 0.3 + Math.random() * 0.5;
        
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(x, y, particleSize, 0, Math.PI * 2);
        ctx.fill();
    }
}
ctx.globalAlpha = 1.0;

// 添加额外的光效增强
const glowGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, size / 2);
glowGradient.addColorStop(0, 'rgba(100, 150, 255, 0.1)');
glowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
ctx.fillStyle = glowGradient;
ctx.fillRect(0, 0, size, size);

// 保存图标
const outputPath = path.join(__dirname, 'assets', 'icon', 'app_icon.png');
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync(outputPath, buffer);

console.log('✅ 图标已成功生成并保存到:', outputPath);

