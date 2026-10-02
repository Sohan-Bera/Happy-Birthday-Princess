import React, { useEffect, useRef, useState } from 'react';

export default function MatrixOverlay({ oldAge, newAge, onComplete }) {
  const canvasRef = useRef(null);
  const [showBtn, setShowBtn] = useState(false);
  const [subtitle, setSubtitle] = useState("Another beautiful year of you");
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // High-resolution canvas dimensions
    canvas.width = 340;
    canvas.height = 170;

    const chars = "♥0123456789✦LOVE forever✨";
    let particles = [];
    let state = "OLD_AGE";
    let burnProgress = 0;
    let animId;

    // Soft gradient text renderer for high-end romantic feel
    function drawText(text, isNewAge) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create vertical linear gradient for digits
      const gradient = ctx.createLinearGradient(0, 20, 0, 140);

      if (!isNewAge) {
        // Soft Dusky Rose Gold (for Old Age / 19)
        gradient.addColorStop(0, '#ffe4e8');
        gradient.addColorStop(0.5, '#f49ac2');
        gradient.addColorStop(1, '#e64a75');
        ctx.shadowColor = 'rgba(244, 154, 194, 0.75)';
        ctx.shadowBlur = 24;
      } else {
        // Warm Champagne & Honey Glow (for New Age / 20)
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.45, '#fce3b8');
        gradient.addColorStop(1, '#f3a683');
        ctx.shadowColor = 'rgba(252, 227, 184, 0.85)';
        ctx.shadowBlur = 28;
      }

      ctx.fillStyle = gradient;
      // Clean non-italic serif font font rendering
      ctx.font = "600 96px 'Playfair Display', Georgia, serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, canvas.width / 2, canvas.height / 2 + 4);
    }

    function initParticles() {
      drawText(oldAge, false);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      particles = [];

      for (let y = 0; y < canvas.height; y += 4) {
        for (let x = 0; x < canvas.width; x += 4) {
          const index = (y * canvas.width + x) * 4;
          if (imgData.data[index + 3] > 128) {
            particles.push({
              x, y,
              char: chars[Math.floor(Math.random() * chars.length)],
              vy: -Math.random() * 2 - 0.8,
              vx: (Math.random() - 0.5) * 1.5,
              life: 1,
              isBurning: false
            });
          }
        }
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (state === "OLD_AGE") {
        drawText(oldAge, false);
      } else if (state === "BURNING") {
        burnProgress += 0.035;

        particles.forEach((p) => {
          if (!p.isBurning && Math.random() < burnProgress * 0.4) {
            p.isBurning = true;
          }

          if (p.isBurning) {
            p.y += p.vy;
            p.x += p.vx;
            p.life -= 0.02;
            p.char = chars[Math.floor(Math.random() * chars.length)];
            
            // Soft ember glow colors
            ctx.fillStyle = p.life > 0.5 ? "#fce3b8" : "#f49ac2";
            ctx.shadowColor = "#ff758c";
            ctx.shadowBlur = 10;
          } else {
            ctx.fillStyle = "#f49ac2";
            ctx.shadowColor = "#e64a75";
            ctx.shadowBlur = 4;
          }

          if (p.life > 0) {
            ctx.font = "11px monospace";
            ctx.fillText(p.char, p.x, p.y);
          }
        });

        if (burnProgress >= 1.2) {
          state = "NEW_AGE";
          setSubtitle("FOREVER & ALWAYS ❤️🎉🎈");
          setTimeout(() => setShowBtn(true), 400);
        }
      } else if (state === "NEW_AGE") {
        drawText(newAge, true);
      }

      animId = requestAnimationFrame(render);
    }

    initParticles();
    render();

    const timer = setTimeout(() => { state = "BURNING"; }, 1200);

    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(timer);
    };
  }, [oldAge, newAge]);

  const handleStart = () => {
    setFadeOut(true);
    setTimeout(onComplete, 600);
  };

  return (
    <div 
      onClick={showBtn ? handleStart : undefined}
      className={`matrix-overlay ${fadeOut ? 'fade-out' : ''}`}
    >
      <div className="canvas-container">
        <canvas ref={canvasRef} />
      </div>

      <p className="matrix-subtitle">{subtitle}</p>

      {showBtn && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleStart();
          }}
          className="matrix-btn"
        >
          Let's enter in {newAge}
        </button>
      )}
    </div>
  );
}