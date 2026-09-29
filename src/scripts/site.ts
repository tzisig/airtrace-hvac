// Site-wide behavior: header state, mobile menu, live status chip, consent, analytics events.


// ---------- Header ----------
const header = document.querySelector<HTMLElement>('[data-header]');
const onScroll = () => header?.classList.toggle('is-scrolled', window.scrollY > 24);
requestAnimationFrame(onScroll);
window.addEventListener('scroll', onScroll, { passive: true });

// ---------- Mobile menu ----------
const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
const mobileNav = document.querySelector<HTMLElement>('[data-mobile-nav]');
const setMenu = (open: boolean) => {
  if (!toggle || !mobileNav) return;
  toggle.setAttribute('aria-expanded', String(open));
  mobileNav.hidden = !open;
  document.body.style.overflow = open ? 'hidden' : '';
  header?.classList.toggle('is-scrolled', open || window.scrollY > 24);
  toggle.querySelector('.visually-hidden')!.textContent = open ? 'סגירת תפריט' : 'תפריט';
  if (open) mobileNav.querySelector<HTMLElement>('a')?.focus();
};
toggle?.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    toggle.focus();
  }
});

// ---------- Live status chip (Israel time, from contact.weekly in the config) ----------
type Day = { day: number; open: string; close: string };
const chip = document.querySelector<HTMLElement>('[data-status-chip]');
if (chip) {
  const weekly: Day[] = JSON.parse(chip.dataset.weekly || '[]');
  const season: number[] = JSON.parse(chip.dataset.season || '[]');
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Jerusalem', weekday: 'short', hour: '2-digit', minute: '2-digit', month: 'numeric', hourCycle: 'h23' })
      .formatToParts(new Date()).map((p) => [p.type, p.value]),
  );
  const dayIndex = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(parts.weekday);
  const now = `${parts.hour}:${parts.minute}`;
  const today = weekly.find((d) => d.day === dayIndex);
  const open = !!today && now >= today.open && now < today.close;
  const hot = season.includes(Number(parts.month));
  const text = chip.querySelector('[data-status-text]')!;
  if (open) text.textContent = hot && now < '13:00' ? 'פתוחים, מגיעים עוד היום' : `פתוחים עד ${today!.close}`;
  else {
    const next = [1, 2, 3, 4, 5, 6, 7].map((i) => weekly.find((d) => d.day === (dayIndex + i) % 7)).find(Boolean);
    const later = today && now < today.open ? today : next;
    text.textContent = later ? `סגור עכשיו, נפתחים ב-${later.open}` : 'סגור עכשיו';
  }
  chip.dataset.open = String(open);
  chip.hidden = false;
}

// ---------- Consent + analytics ----------
declare global {
  interface Window { dataLayer: unknown[]; gtag?: (...args: unknown[]) => void; }
}
const CONSENT_KEY = 'consent.v1';
const consentBox = document.querySelector<HTMLElement>('[data-consent]');
const ga4 = consentBox?.dataset.ga4 || '';

const readConsent = () => { try { return localStorage.getItem(CONSENT_KEY); } catch { return null; } };
const writeConsent = (v: string) => { try { localStorage.setItem(CONSENT_KEY, v); } catch { /* storage blocked */ } };

const loadAnalytics = () => {
  if (!ga4 || window.gtag) return;
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${ga4}`;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', ga4);
};

const consent = readConsent();
if (consent === 'all') loadAnalytics();
else if (!consent && consentBox) consentBox.hidden = false;

document.querySelector('[data-consent-accept]')?.addEventListener('click', () => {
  writeConsent('all'); if (consentBox) consentBox.hidden = true; loadAnalytics();
});
document.querySelector('[data-consent-reject]')?.addEventListener('click', () => {
  writeConsent('essential'); if (consentBox) consentBox.hidden = true;
});
document.querySelector('[data-cookie-settings]')?.addEventListener('click', () => {
  if (consentBox) { consentBox.hidden = false; consentBox.querySelector<HTMLElement>('button')?.focus(); }
});

// Key events: phone and WhatsApp clicks
export const track = (name: string, params: Record<string, unknown> = {}) => {
  window.gtag?.('event', name, params);
};
document.addEventListener('click', (e) => {
  const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a');
  if (!a) return;
  if (a.href.startsWith('tel:')) track('phone_click', { link_url: a.href });
  else if (a.href.includes('wa.me/')) track('whatsapp_click', { link_url: a.href });
});
