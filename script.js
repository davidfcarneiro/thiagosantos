const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});

const floatingBar = document.getElementById("floating-whatsapp");
const ctaButtons = [...document.querySelectorAll(".js-whatsapp-cta")];
const currentYear = document.getElementById("current-year");

if (currentYear) {
  currentYear.textContent = String(new Date().getFullYear());
}

let hasVisibleCta = false;
let isNearFooter = false;
let ticking = false;

const isElementVisibleInViewport = (element) => {
  const rect = element.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  const viewportWidth = window.innerWidth || document.documentElement.clientWidth;

  if (rect.width <= 0 || rect.height <= 0) return false;
  if (rect.right <= 0 || rect.left >= viewportWidth) return false;

  const topBoundary = 24;
  const bottomBoundary = viewportHeight - 24;
  const visibleTop = Math.max(rect.top, topBoundary);
  const visibleBottom = Math.min(rect.bottom, bottomBoundary);
  const visibleHeight = visibleBottom - visibleTop;

  return visibleHeight >= Math.min(48, rect.height * 0.45);
};

const recomputeVisibility = () => {
  hasVisibleCta = ctaButtons.some(isElementVisibleInViewport);
  updateFloatingBar();
};

const updateFloatingBar = () => {
  if (!floatingBar) return;

  const hasScrolled = window.scrollY > 24;
  const shouldShow = hasScrolled && !hasVisibleCta && !isNearFooter;

  floatingBar.classList.toggle("is-visible", shouldShow);
  floatingBar.setAttribute("aria-hidden", shouldShow ? "false" : "true");
};

const footerObserver = new IntersectionObserver(
  (entries) => {
    isNearFooter = entries.some((entry) => entry.isIntersecting);
    recomputeVisibility();
  },
  {
    threshold: 0.02,
  }
);

const footer = document.querySelector(".footer");
if (footer) {
  footerObserver.observe(footer);
}

const requestVisibilityUpdate = () => {
  if (ticking) return;

  ticking = true;
  window.requestAnimationFrame(() => {
    recomputeVisibility();
    ticking = false;
  });
};

window.addEventListener("scroll", requestVisibilityUpdate, { passive: true });
window.addEventListener("resize", requestVisibilityUpdate);

recomputeVisibility();
