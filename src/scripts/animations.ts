import { animate, inView } from 'motion';

const EASE: [number, number, number, number] = [0.25, 1, 0.5, 1];

export function initAnimations(): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll<HTMLElement>('[data-hero], .reveal').forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  animateHeroEntrance();
  animateScrollReveals();
  animateStatsCounters();
}

function animateHeroEntrance(): void {
  const items = document.querySelectorAll<HTMLElement>('[data-hero]');
  if (!items.length) return;

  items.forEach((el) => {
    const delay = parseInt(el.dataset.delay ?? '0', 10) / 1000;
    animate(el, { opacity: [0, 1], y: [18, 0] }, { duration: 0.65, delay, easing: EASE });
  });
}

function animateScrollReveals(): void {
  document.querySelectorAll<HTMLElement>('.reveal').forEach((el) => {
    const delay = parseFloat(el.dataset.delay ?? '0') / 1000;
    const from = el.dataset.from;
    const originX = from === 'left' ? -36 : from === 'right' ? 36 : 0;
    const originY = from ? 0 : 28;

    inView(
      el,
      () => {
        animate(
          el,
          { opacity: [0, 1], y: [originY, 0], x: [originX, 0], scale: [0.97, 1] },
          { duration: 0.6, delay, easing: EASE }
        );
      },
      { amount: 0.12 }
    );
  });
}

function animateStatsCounters(): void {
  document.querySelectorAll<HTMLElement>('[data-stat]').forEach((el) => {
    const text = el.textContent?.trim() ?? '';
    const num = parseFloat(text.replace(/[^\d.]/g, ''));
    const suffix = text.replace(/[\d]/g, '');
    if (isNaN(num) || num === 0) return;

    inView(
      el,
      () => {
        animate(0, num, {
          duration: 1.5,
          easing: EASE,
          onUpdate: (v) => {
            el.textContent = Math.round(v) + suffix;
          },
        });
      },
      { amount: 1 }
    );
  });
}
