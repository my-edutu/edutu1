// Confetti animation utility for celebration moments
// Inspired by canvas-confetti but lightweight

interface ConfettiOptions {
  particleCount?: number;
  angle?: number;
  spread?: number;
  startVelocity?: number;
  decay?: number;
  gravity?: number;
  drift?: number;
  colors?: string[];
  shapes?: ('circle' | 'square')[];
  scalar?: number;
  zIndex?: number;
  disableForReducedMotion?: boolean;
  origin?: { x: number; y: number };
}

interface Particle {
  x: number;
  y: number;
  velocity: { x: number; y: number };
  color: string;
  shape: 'circle' | 'square';
  size: number;
  rotation: number;
  rotationVelocity: number;
  opacity: number;
  decay: number;
}

const defaultColors = [
  '#14B8A6', // Teal (brand)
  '#F97316', // Coral (accent)
  '#10B981', // Green (success)
  '#F59E0B', // Amber (warning)
  '#06B6D4', // Cyan (info)
];

export function confetti(options: ConfettiOptions = {}): void {
  const {
    particleCount = 50,
    angle = 90,
    spread = 45,
    startVelocity = 45,
    decay = 0.9,
    gravity = 1,
    drift = 0,
    colors = defaultColors,
    shapes = ['circle', 'square'],
    scalar = 1,
    zIndex = 100,
    disableForReducedMotion = true,
    origin = { x: 0.5, y: 0.5 },
  } = options;

  // Check for reduced motion preference
  if (disableForReducedMotion && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  // Create canvas
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = String(zIndex);
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Set canvas size
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Create particles
  const particles: Particle[] = [];
  const angleInRadians = (angle * Math.PI) / 180;
  const spreadInRadians = (spread * Math.PI) / 180;

  for (let i = 0; i < particleCount; i++) {
    const particleAngle =
      angleInRadians + (Math.random() - 0.5) * spreadInRadians;
    const velocity = startVelocity * (0.5 + Math.random() * 0.5);

    particles.push({
      x: canvas.width * origin.x,
      y: canvas.height * origin.y,
      velocity: {
        x: Math.cos(particleAngle) * velocity,
        y: Math.sin(particleAngle) * velocity,
      },
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      size: (Math.random() * 8 + 4) * scalar,
      rotation: Math.random() * 360,
      rotationVelocity: (Math.random() - 0.5) * 10,
      opacity: 1,
      decay,
    });
  }

  // Animation loop
  function animate() {
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let activeParticles = 0;

    particles.forEach((particle) => {
      if (particle.opacity <= 0) return;

      activeParticles++;

      // Update position
      particle.x += particle.velocity.x;
      particle.y += particle.velocity.y;

      // Apply gravity
      particle.velocity.y += gravity;

      // Apply drift
      particle.velocity.x += drift;

      // Apply decay
      particle.velocity.x *= particle.decay;
      particle.velocity.y *= particle.decay;

      // Update rotation
      particle.rotation += particle.rotationVelocity;

      // Fade out
      particle.opacity -= 0.01;

      // Draw particle
      ctx.save();
      ctx.translate(particle.x, particle.y);
      ctx.rotate((particle.rotation * Math.PI) / 180);
      ctx.globalAlpha = particle.opacity;

      ctx.fillStyle = particle.color;

      if (particle.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, particle.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(
          -particle.size / 2,
          -particle.size / 2,
          particle.size,
          particle.size
        );
      }

      ctx.restore();
    });

    if (activeParticles > 0) {
      requestAnimationFrame(animate);
    } else {
      // Clean up
      document.body.removeChild(canvas);
    }
  }

  animate();
}

// Preset confetti patterns
export const confettiPresets = {
  // Celebration burst from center
  celebration: () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x: 0.5, y: 0.5 },
    });
  },

  // Goal completed - confetti from bottom
  goalCompleted: () => {
    confetti({
      particleCount: 80,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 1 },
      startVelocity: 55,
    });
    confetti({
      particleCount: 80,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 1 },
      startVelocity: 55,
    });
  },

  // Achievement unlocked - burst from top
  achievement: () => {
    confetti({
      particleCount: 60,
      spread: 100,
      origin: { x: 0.5, y: 0 },
      startVelocity: 30,
    });
  },

  // Streak milestone - side cannons
  streakMilestone: () => {
    const end = Date.now() + 1000;

    const frame = () => {
      confetti({
        particleCount: 7,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: ['#F97316', '#EA580C', '#C2410C'], // Accent colors for streak
      });
      confetti({
        particleCount: 7,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: ['#F97316', '#EA580C', '#C2410C'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  },

  // Application submitted
  applicationSubmitted: () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { x: 0.5, y: 0.6 },
      colors: ['#14B8A6', '#0D9488', '#0F766E'], // Brand colors
    });
  },
};

export default confetti;
