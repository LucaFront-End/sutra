import { useState, useRef, useEffect } from 'react';
import { aromas } from '../data/content';
import './AromaExperience.css';

export default function AromaExperience({ onNavigate }) {
  const [activeAroma, setActiveAroma] = useState(aromas[0]);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  
  // Track mouse for physics repulsion
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: false }); // Optimize
    let animationFrameId;
    let particles = [];
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Parse hex color to rgb
    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 255, g: 255, b: 255 };
    };

    const targetRgb = hexToRgb(activeAroma.color);

    class SmokeParticle {
      constructor() {
        this.x = Math.random() * canvas.width;
        // Start below the screen or randomly inside
        this.y = Math.random() * canvas.height + canvas.height / 2;
        this.size = Math.random() * 200 + 150; // Huge soft puffs
        this.speedX = (Math.random() - 0.5) * 1;
        this.speedY = Math.random() * -1.5 - 0.5; // Always floating up
        this.baseX = this.x;
        
        this.angle = Math.random() * Math.PI * 2;
        this.spin = (Math.random() - 0.5) * 0.02;
        this.life = Math.random() * 0.5 + 0.2; 
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.angle += this.spin;
        
        // Gentle sway (Wind)
        this.x += Math.sin(this.angle) * 0.5;

        // Interaction: Mouse Repulsion
        const dx = mouseRef.current.x - this.x;
        const dy = mouseRef.current.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        const interactionRadius = 300;
        if (distance < interactionRadius) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          // The closer the mouse, the stronger the push
          const force = (interactionRadius - distance) / interactionRadius;
          
          // Push away from mouse
          this.speedX -= forceDirectionX * force * 1.5;
          this.speedY -= forceDirectionY * force * 1.5;
        }

        // Return to natural vertical speed slowly
        this.speedX += (0 - this.speedX) * 0.02;
        const targetSpeedY = -1;
        this.speedY += (targetSpeedY - this.speedY) * 0.02;
        
        // Reset when it goes way off screen top
        if (this.y + this.size < 0) {
           this.y = canvas.height + this.size;
           this.x = Math.random() * canvas.width;
           this.speedX = (Math.random() - 0.5) * 1;
           this.speedY = Math.random() * -1.5 - 0.5;
        }
      }
      
      draw() {
        // We use a radial gradient to simulate a glowing fog puff
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        
        // Outer edge is transparent, inner is colored
        // The opacity fluctuates slightly with sine for a "breathing" effect
        const breath = Math.sin(this.angle) * 0.1 + 0.15; // 0.05 to 0.25 opacity
        
        gradient.addColorStop(0, `rgba(${targetRgb.r}, ${targetRgb.g}, ${targetRgb.b}, ${breath})`);
        gradient.addColorStop(1, `rgba(${targetRgb.r}, ${targetRgb.g}, ${targetRgb.b}, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Initialize 50 large particles
    for (let i = 0; i < 50; i++) {
      particles.push(new SmokeParticle());
    }

    const animate = () => {
      // Solid dark background for contrast
      ctx.fillStyle = '#060606'; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Use screen blending mode to make overlapping smoke look luminous and ethereal
      ctx.globalCompositeOperation = 'screen';
      
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      
      ctx.globalCompositeOperation = 'source-over'; // Reset
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeAroma]); // Re-initialize smoke when aroma changes to instantly apply new color

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };
  
  const handleMouseLeave = () => {
    // Send mouse far away so smoke returns to normal
    mouseRef.current = { x: -1000, y: -1000 };
  };

  return (
    <section 
      className="aroma-experience" 
      id="aroma"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <canvas ref={canvasRef} className="aroma-canvas" />
      
      <div className="aroma__content">
        <div className="aroma__header">
          <span className="section-tag">Perfil Olfativo</span>
          <h2>El alma del ritual</h2>
        </div>

        <div className="aroma__layout">
          
          {/* Left: Selector List */}
          <div className="aroma__selector">
            {aromas.map((aroma) => (
              <button 
                key={aroma.id}
                className={`aroma-btn ${activeAroma.id === aroma.id ? 'active' : ''}`}
                onClick={() => setActiveAroma(aroma)}
              >
                <span 
                  className="aroma-btn-circle" 
                  style={{ backgroundColor: aroma.color }}
                ></span>
                {aroma.name}
              </button>
            ))}
          </div>

          {/* Right: Immersive Details */}
          <div className="aroma__details">
            {/* Keys force re-render for CSS animation trigger on change */}
            <h3 key={`title-${activeAroma.id}`}>{activeAroma.name}</h3>
            
            <div className="aroma-meta" key={`meta-${activeAroma.id}`}>
              <div className="meta-box">
                <span className="meta-label">Nota Base</span>
                <span className="meta-value">{activeAroma.base}</span>
              </div>
              <div className="meta-box">
                <span className="meta-label">Estado de Ánimo</span>
                <span className="meta-value" style={{ color: activeAroma.color }}>
                  {activeAroma.mood}
                </span>
              </div>
            </div>
            
            <p key={`desc-${activeAroma.id}`}>{activeAroma.description}</p>
            
            {/* E-Commerce CTA */}
            <div className="aroma__shop" key={`shop-${activeAroma.id}`}>
              <div className="aroma-formats">
                <span>Disponible en:</span>
                <div className="formats-list">
                  <span className="format-tag">Vela</span>
                  <span className="format-tag">Home Spray</span>
                  <span className="format-tag">Difusor</span>
                </div>
              </div>
              <button 
                type="button"
                className="btn-aroma-shop" 
                style={{ backgroundColor: activeAroma.color }}
                onClick={() => onNavigate && onNavigate('shop', null, 'aromas')}
              >
                Comprar Colección <span className="arrow">→</span>
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
