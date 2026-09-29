// Builds a progress file for the Master Website Build Checklist (websitBuildChecklist/website-build-checklist.html).
// The checklist keys each item by stage id + a djb2 hash of its text, so this script reads the
// stage definitions straight from the checklist HTML and computes the same keys.
//
// Run: npm run checklist  ->  writes websitBuildChecklist/airtrace-hvac-checklist.json
// Import it in the checklist page. The project id stays the same, so a new import updates the project.
//
// Status per item: 'done' (verified), 'na' (not relevant to this demo), or left out (open).
// Items are matched by a unique substring of their text; the script fails if a match is missing or ambiguous.

import { readFileSync, writeFileSync } from 'node:fs';

const CHECKLIST = new URL('../../../websitBuildChecklist/website-build-checklist.html', import.meta.url);
const OUT_FILE = new URL('../../../websitBuildChecklist/airtrace-hvac-checklist.json', import.meta.url);

const html = readFileSync(CHECKLIST, 'utf8');
const start = html.indexOf('var STAGES = [');
const end = html.indexOf('];', html.indexOf('id: "post30"'));
const STAGES = new Function(`return ${html.slice(start + 'var STAGES = '.length, end + 1)};`)();

const hash = (str) => {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) >>> 0;
  return h.toString(36);
};

const DONE = 'done';
const NA = 'na';

const statuses = {
  scope: [
    ['היקף העבודה (Scope) הוגדר', DONE],
    ["רשימת עמודים ופיצ'רים ראשונית אושרה", DONE],
    ['תקציב ואבני דרך', NA],
    ['תהליך בקשות שינוי', NA],
    ['איש קשר מקבל החלטות', DONE],
    ['רשימת חומרים נדרשים נמסרה', NA],
    ['תאריך יעד למסירת חומרים', NA],
    ['סוכם עם הלקוח שעיכוב', NA],
    ['זכויות שימוש בתמונות', DONE],
    ['סוכם שחשבונות הדומיין', NA],
  ],
  client: [
    ['שם העסק והתחום הוגדרו', DONE],
    ['קהל יעד הוגדר', DONE],
    ['שירותים/מוצרים מרכזיים הוגדרו', DONE],
    ['מטרת האתר הוגדרה', DONE],
    ['אזורי פעילות הוגדרו', DONE],
    ['שפות האתר הוגדרו', DONE],
    ['דומיין ואתר קיים נבדקו', DONE],
    ['הוגדר אם זה אתר חדש', DONE],
    ['חובות רגולטוריות זוהו', DONE],
    ['Google Business Profile נבדק', DONE],
  ],
  research: [
    ['שירותים/מוצרים מרכזיים מופו', DONE],
    ['שאלות נפוצות והתנגדויות', DONE],
  ],
  arch: [
    ['Homepage מוגדרת', DONE],
    ['עמוד לכל שירות/מוצר משמעותי', DONE],
    ['About ו-Contact הוגדרו', DONE],
    ['Blog/Knowledge Center', NA],
    ['Landing pages מוצדקות', NA],
    ['עמודי פרטיות, תנאי שימוש, נגישות', DONE],
    ['הוחלט על מבנה URL עקבי', DONE],
    ['URL לכל עמוד הוגדר', DONE],
    ['Primary topic ו-Intent לכל עמוד', DONE],
    ['מבנה שפות ו-hreflang', NA],
    ['Internal linking ראשוני תוכנן', DONE],
    ['CTA לכל עמוד מרכזי הוגדר', DONE],
    ['רשימת העמודים הוזנה לטבלת', DONE],
    ['פרטי העסק (שם, טלפון, מייל, כתובת, שעות) מרוכזים', DONE],
  ],
  build: [
    ['העיצוב כולל נגישות מובנית', DONE],
    ['CMS, תבנית ותוספים הותקנו', DONE],
    ['הותקנו רק תוספים הכרחיים', DONE],
    ['שפת הדף (lang)', DONE],
    ['טקסט מעורב עברית/אנגלית', DONE],
    ['פונטים עבריים נבחרו', DONE],
    ['פריסה רספונסיבית נבנתה', DONE],
    ['הקוד מנוהל בגרסאות (Git)', DONE],
  ],
  content: [
    ['המידע החשוב מופיע מוקדם', DONE],
    ['FAQ נוסף רק כשיש ערך', DONE],
    ['כל עמוד שירות/מוצר מציין במפורש', DONE],
    ['לכל התמונות והתכנים יש זכויות שימוש', DONE],
    ['תאריך פרסום/עדכון מוצג', DONE],
    ['עמודי ערים או אזורים', DONE],
  ],
  onpage: [
    ['Title ייחודי', DONE],
    ['Meta description ייחודי', DONE],
    ['H1 ברור', DONE],
    ['H2/H3 בהיררכיה', DONE],
    ['URL נקי', DONE],
    ['Alt מתאים לתמונות', DONE],
    ['Internal links קיימים', DONE],
    ['Anchor text ברור', DONE],
    ['Canonical מוגדר', DONE],
    ['Open Graph ותמונת שיתוף', DONE],
    ['Schema מתאים נבחר', DONE],
    ['Organization/LocalBusiness', DONE],
    ['Schema תואם למידע', DONE],
  ],
  tech: [
    // Open until the site is live on Cloudflare: HTTPS redirect, real 404 status, SSL renewal
    ['robots.txt הוגדר', DONE],
    ['Cache ו-CDN הוגדרו', DONE],
    ['XML sitemap נוצר', DONE],
    ['אין Broken links', DONE],
    ['אין עמודים לא רצויים לאינדוקס', DONE],
    ['hreflang הוגדר', NA],
    ['תמונות בפורמט WebP/AVIF', DONE],
    ['פונטים: נטענים רק המשקלים', DONE],
    ['CSS/JS נבדקו', DONE],
    ['Lazy loading לתמונות', DONE],
    ['Favicon קיים', DONE],
    ['אין עמודים יתומים', DONE],
    ['סט אייקונים מלא', DONE],
    ['פונטים מתארחים מקומית', DONE],
  ],
  a11y: [
    ['מצב Focus נראה בבירור', DONE],
    ['ניגודיות צבעים לפי WCAG AA', DONE],
    ['תמונות דקורטיביות מוגדרות עם Alt ריק', DONE],
    ['לכל שדה בטופס יש תווית', DONE],
    ['לקישורים ולכפתורים יש טקסט מובן', DONE],
    ['בדיקה אוטומטית (Lighthouse / axe)', DONE],
    ['הנגישות לא נשענת על תוסף', DONE],
  ],
  security: [
    ['CMS, תבנית ותוספים מעודכנים', NA],
    ['תוספים ותבניות שלא בשימוש הוסרו', NA],
    ['אימות דו-שלבי (2FA)', NA],
    ['סיסמאות חזקות וייחודיות', NA],
    ['ניסיונות התחברות מוגבלים', NA],
    ['הגנה מספאם בטפסים', DONE],
    ['כותרות אבטחה הוגדרו', DONE],
  ],
  legal: [
    ['מדיניות הפרטיות תואמת את המידע שהאתר אוסף', DONE],
    ['הטפסים אוספים רק מידע נחוץ', DONE],
    ['הסכמה לדיוור בתיבה נפרדת', NA],
    ['באנר עוגיות ו-Consent Mode', DONE],
    ['מחיר המוצג לצרכן הוא המחיר הכולל', DONE],
  ],
  conversion: [
    ['מטרת האתר ברורה מיד', DONE],
    ['CTA ברור', DONE],
    ['הודעת הצלחה נבדקה', DONE],
    ['פרמטרי UTM ומקור הפנייה', DONE],
    ['כשל בשליחת טופס מוצג למשתמש', DONE],
    ['דף תודה בכתובת נפרדת', DONE],
    ['סקריפטים של מדידה ופרסום נטענים רק אחרי הסכמת', DONE],
  ],
  google: [
    ['Sitemap מוכן לשליחה', DONE],
    ['Google Business Profile מעודכן', NA],
    ['מידע העסק עקבי וברור', DONE],
    ['שירותים/מוצרים מוגדרים מפורשות', DONE],
    ['אין מידע סותר בין עמודים', DONE],
    ['הוחלט אילו סורקי AI לאפשר', DONE],
  ],
};

// ---------------------------------------------------------------------------
// Stage tracking and notes
// ---------------------------------------------------------------------------

const track = {
  scope: 'in-progress', client: 'in-progress', research: 'in-progress', arch: 'in-progress',
  build: 'in-progress', content: 'in-progress', onpage: 'in-progress', tech: 'in-progress',
  a11y: 'in-progress', security: 'in-progress', legal: 'in-progress', conversion: 'in-progress',
  google: 'in-progress', gate: 'not-started', automation: 'not-started', handover: 'not-started',
  post72: 'not-started', post14: 'not-started', post30: 'not-started',
};

const notes = {
  scope: 'אתר דמו לתיק עבודות, חבילת "אתר מורחב" (עמוד לכל שירות ולכל עיר, גלריה, מחשבון). תקציב, חוזה, חומרים ובעלות לקוח סומנו לא רלוונטי. פתוח: הערכת שעות וגישת Cloudflare.',
  client: 'טכנאי מיזוג אוויר יחיד, השרון (נתניה, הרצליה, רעננה, כפר סבא, הוד השרון), עברית בלבד. כל הפרטים בדיוניים: שם העסק והבעלים, טלפון דמה 052-000-0000, תעודה 0000-00. שעות: א-ה 07-21, ו 07-14, מוצ"ש בקיץ לתקלות. אין Google Business Profile (דמו).',
  research: 'שירותים, תקלות נפוצות ושאלות לקוח מופו. לא בוצע מחקר מילות מפתח או מתחרים: מילת המפתח לכל עמוד רשומה בשדה keyword בקונפיג.',
  arch: '28 עמודים: בית, אודות, מרכז שירותים + 8 עמודי שירות, מרכז אזורים + 5 עמודי עיר, מחשבון כ"ס, בוחר תקלות, גלריה, המלצות, מחירון, FAQ, צור קשר, תודה, פרטיות, נגישות, 404. כל הנתונים המשתנים ב-src/config/site.config.ts.',
  build: 'Astro 7 סטטי, ללא CMS, ב-GitHub (tzisig/airtrace-hvac). פונטים Karantina ו-IBM Plex Sans Hebrew (OFL) מתארחים מקומית. עיצוב: אפור קרח, גרפיט וליים, מד תרמוסטט ולוחית נתונים של מזגן. פיצ\x27רים: מחשבון כ"ס כמד, בוחר תקלות עם הודעת וואטסאפ מוכנה, סטטוס פתוח/סגור חי, מתג לפני/אחרי, סינון גלריה, תזכורת שנתית ביומן (ics), מפת אזורים. תמונות סטוק מ-Pexels (CREDITS.md).',
  content: 'כל התוכן דמו ומסומן בפוטר. תוכן ייחודי לכל עיר (אוויר מלוח בנתניה, מערכות R22 בהרצליה פיתוח, רעש ברעננה, צנרת מהגג בכפר סבא, עליות גג בהוד השרון). פתוח: הגהה אנושית ואימות מקדמי המחשבון מול טכנאי.',
  onpage: 'נבדק אוטומטית (npm run audit): title ו-description ייחודיים, H1 אחד, canonical, JSON-LD תקין (HVACBusiness, Service, FAQPage, HowTo, Review, BreadcrumbList, Person, ItemList).',
  tech: 'Lighthouse נייד (12 עמודים): ביצועים 94-100, נגישות 100, Best Practices 100, SEO 66-69 בגלל noindex מכוון במצב דמו. LCP 1.4-2.5 שניות, CLS 0 (פונט התצוגה נטען עם font-display: block ו-preload). 0 קישורים שבורים ו-0 יתומים, ללא גלילה אופקית ב-390 ו-1440 פיקסלים. פתוח עד העלייה ל-Cloudflare: HTTPS, 404 אמיתי, כותרות על האתר החי.',
  a11y: 'Skip link, Focus נראה, reduced-motion, מחשבון עם aria-live, מתגי לפני/אחרי ובוחר תקלות עם aria-pressed, מפה עם חלופה טקסטואלית. פתוח: קורא מסך וזום 200%.',
  security: 'אתר סטטי ללא ממשק ניהול. Honeypot בטופס, public/_headers עם HSTS ו-nosniff. SSL מנוהל ב-Cloudflare.',
  legal: 'פרטיות ונגישות מבוססים על הקונפיג. מחירים כוללים מע"מ. פתוח: בדיקה משפטית.',
  conversion: 'טופס במצב דמו (form.destinations ריק): ולידציה, UTM, הודעת כשל ודף תודה. אירועים: generate_lead, phone_click, whatsapp_click. תוצאת המחשבון והתקלה נשלחות בוואטסאפ עם טקסט מוכן.',
  google: 'robots.txt מאפשר GPTBot, PerplexityBot ו-Google-Extended. sitemap-index.xml נוצר אוטומטית. במצב דמו כל העמודים noindex.',
};

const pages = [
  [
    'דף הבית',
    '/'
  ],
  [
    'אודות עומרי',
    '/about/'
  ],
  [
    'שירותים (ריכוז)',
    '/services/'
  ],
  [
    'התקנת מזגנים',
    '/services/installation/'
  ],
  [
    'תיקון מזגנים',
    '/services/repair/'
  ],
  [
    'ניקוי וחיטוי מזגנים',
    '/services/cleaning/'
  ],
  [
    'מיני מרכזי ומזגן מרכזי',
    '/services/ducted-systems/'
  ],
  [
    'מילוי גז ואיתור נזילות',
    '/services/refrigerant/'
  ],
  [
    'פירוק, העתקה והרכבה',
    '/services/relocation/'
  ],
  [
    'שליטה חכמה ו-Wi-Fi',
    '/services/smart-control/'
  ],
  [
    'חוזה שירות שנתי',
    '/services/maintenance-plan/'
  ],
  [
    'אזורי שירות (ריכוז)',
    '/areas/'
  ],
  [
    'טכנאי מזגנים בנתניה',
    '/areas/netanya/'
  ],
  [
    'טכנאי מזגנים בהרצליה',
    '/areas/herzliya/'
  ],
  [
    'טכנאי מזגנים ברעננה',
    '/areas/raanana/'
  ],
  [
    'טכנאי מזגנים בכפר סבא',
    '/areas/kfar-saba/'
  ],
  [
    'טכנאי מזגנים בהוד השרון',
    '/areas/hod-hasharon/'
  ],
  [
    'מחשבון כ"ס',
    '/calculator/'
  ],
  [
    'המזגן לא עובד? (בוחר תקלות)',
    '/troubleshooting/'
  ],
  [
    'עבודות לפני/אחרי',
    '/gallery/'
  ],
  [
    'המלצות לקוחות',
    '/reviews/'
  ],
  [
    'מחירון וחוזי שירות',
    '/prices/'
  ],
  [
    'שאלות נפוצות',
    '/faq/'
  ],
  [
    'צור קשר',
    '/contact/'
  ],
  [
    'דף תודה',
    '/thank-you/'
  ],
  [
    'מדיניות פרטיות',
    '/privacy/'
  ],
  [
    'הצהרת נגישות',
    '/accessibility/'
  ],
  [
    'עמוד 404',
    '/404'
  ]
].map(([name, url]) => ({ name, url, content: true, design: true, seo: true, approval: false }));

// ---------------------------------------------------------------------------
// Build the file
// ---------------------------------------------------------------------------

const items = {};
const errors = [];
for (const [stageId, list] of Object.entries(statuses)) {
  const stage = STAGES.find((s) => s.id === stageId);
  if (!stage) { errors.push(`unknown stage ${stageId}`); continue; }
  const texts = stage.items.map((it) => (typeof it === 'string' ? it : it.t));
  for (const [needle, status] of list) {
    const hits = texts.filter((t) => t.includes(needle));
    if (hits.length !== 1) { errors.push(`${stageId}: "${needle}" matched ${hits.length} items`); continue; }
    items[`${stageId}.${hash(hits[0])}`] = status;
  }
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);
const data = {
  client: 'דמו לתיק עבודות: איירטרייס, טכנאי מיזוג אוויר (השרון)',
  siteName: 'איירטרייס מיזוג אוויר',
  domain: 'airtrace-hvac.pages.dev (דמו, ללא דומיין פרטי)',
  owner: 'ציון',
  profile: 'corporate',
  projectKind: 'new',
  env: 'https://airtrace-hvac.pages.dev (Cloudflare Pages, noindex במצב דמו)',
  platform: 'Astro 7, אתר סטטי, ללא CMS. כל הנתונים המשתנים ב-src/config/site.config.ts',
  languages: 'עברית (RTL)',
  projectStatus: 'in-progress',
  docVersion: '3.0',
  startDate: '2026-09-28',
  updatedDate: today,
  // Demo project: dates are illustrative
  dueDate: '2026-10-05',
  materialsDate: '',
};
for (const [stage, status] of Object.entries(track)) data[`track.${stage}.status`] = status;
for (const [stage, note] of Object.entries(notes)) data[`stageNotes.${stage}`] = note;

const out = {
  format: 'websiteBuildChecklist',
  version: 3,
  projects: [{
    id: 'p-airtrace-hvac',
    name: data.siteName,
    state: { version: 3, savedAt: new Date().toISOString(), data, items, waiting: {}, pages },
  }],
};
writeFileSync(OUT_FILE, JSON.stringify(out, null, 2));

const counts = Object.values(items).reduce((a, s) => ((a[s] = (a[s] || 0) + 1), a), {});
console.log(`checklist written: ${counts.done || 0} done, ${counts.na || 0} n/a, ${pages.length} pages`);
