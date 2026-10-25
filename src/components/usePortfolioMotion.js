import { useEffect } from 'react';

export default function usePortfolioMotion() {
  useEffect(() => {
    if (!window.IntersectionObserver || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        entry.target.classList.add('portfolio-arriving');
      });
    }, { threshold: .12 });
    const nodes = document.querySelectorAll('.portfolio-body h2, .about-copy > p, .tech-stack-group, .work-choice, .work-preview-media, .contact-intro, .contact-email');
    nodes.forEach(node => observer.observe(node));
    return () => { observer.disconnect(); nodes.forEach(node => node.classList.remove('portfolio-arriving')); };
  }, []);
}
