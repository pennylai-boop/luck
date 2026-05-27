import confetti from "canvas-confetti";

export function fireCelebration(): void {
  const duration = 2500;
  const end = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.65 },
      colors: ["#C8102E", "#C9A227", "#F5F0E6", "#ffffff"],
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.65 },
      colors: ["#C8102E", "#C9A227", "#F5F0E6", "#ffffff"],
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };

  confetti({
    particleCount: 120,
    spread: 100,
    origin: { y: 0.6 },
    colors: ["#C8102E", "#C9A227", "#F5F0E6"],
  });
  frame();
}
