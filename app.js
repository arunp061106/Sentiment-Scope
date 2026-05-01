/* ═══════════════════════════════════════
   SentimentScope · app.js
   DND Data nDreads · 2024
═══════════════════════════════════════ */

'use strict';

// ── Data store ──────────────────────────────────────────────
let RAW_DATA  = [];
let chartInstances = {};

// ── Sentiment categorisation ────────────────────────────────
const POSITIVE_SET = new Set([
  'positive','joy','excitement','happiness','happy','gratitude','grateful',
  'contentment','serenity','hopeful','hope','elation','euphoria','enthusiasm',
  'pride','proud','inspiration','inspired','empowerment','admiration','adoration',
  'love','affection','amusement','playful','compassion','compassionate',
  'free-spirited','confident','determination','accomplishment','fulfillment',
  'satisfaction','zest','harmony','kindness','kind','optimism','blessed',
  'appreciation','confidence','wonderment','overjoyed','joyfullreunion',
  'festivity','celebration','radiance','enchantment','wonder','coziness',
  'rejuvenation','captivation','adventure','thrill','amazement','triumph',
  'heartwarming','friendship','success','romance','resilience','spark',
  'solace','breakthrough','creativity','reflection','whimsy','tranquility',
  'mindfulness','exploration','connection','energy','charm','ecstasy',
  'colorful','imagination','vibrancy','freedom','inspiration','awe',
  'tenderness','calmness','acceptance','marvel','engagement','dazzle',
  'adrenaline','intrigue','dreamer','positivity','reverence',
  'festivejoy','playfuljoy','inflow','immersion','mesmerizing',
  'nature\'s beauty','celestial wonder','creative inspiration','winter magic',
  'thrilling journey','runway creativity','ocean\'s freedom',
  'joy in baking','envisioning history','culinary adventure',
  'culinaryodyssey','artisticburst','joyfullreunion','dreamer'
]);
const NEGATIVE_SET = new Set([
  'negative','sadness','sad','anger','fear','despair','grief','loneliness',
  'frustration','frustated','hate','disgust','boredom','helplessness',
  'jealousy','jealous','bitterness','bitter','resentment','regret',
  'shame','anxiety','intimidation','envy','envious','overwhelmed',
  'indifference','numbness','melancholy','heartbreak','desolation',
  'betrayal','loss','sorrow','isolation','exhaustion','desperation',
  'darkness','heartache','solitude','ruins','suffering','lostlove',
  'disappointment','disappointed','obstacle','miscalculation','pressure',
  'challenge','devastated','emotional storm','embarrassed','bad',
  'negativity','mischievous'
]);

function classifyPolarity(sentiment) {
  const s = (sentiment || '').trim().toLowerCase().replace(/\s+/g,'');
  if (POSITIVE_SET.has(s)) return 'positive';
  if (NEGATIVE_SET.has(s)) return 'negative';
  return 'neutral';
}

// ── Colour helpers ──────────────────────────────────────────
function sentimentColor(sentiment) {
  const p = classifyPolarity(sentiment);
  if (p === 'positive') return '#7fffb2';
  if (p === 'negative') return '#ff6b6b';
  return '#ffd166';
}

const PLATFORM_COLORS = {
  Twitter:   '#74b9ff',
  Instagram: '#a29bfe',
  Facebook:  '#ffd166',
};
const COUNTRY_FLAGS = {
  USA:'🇺🇸', UK:'🇬🇧', Canada:'🇨🇦', Australia:'🇦🇺',
  India:'🇮🇳', Brazil:'🇧🇷', France:'🇫🇷', Japan:'🇯🇵',
  Germany:'🇩🇪', Italy:'🇮🇹',
};
const MONTH_NAMES = ['','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const PLATFORM_ICONS = { Twitter:'🐦', Instagram:'📸', Facebook:'📘' };
const AVATAR_COLORS = ['#7fffb2','#ff6b6b','#ffd166','#74b9ff','#a29bfe','#fd79a8'];

// ── Chart.js global defaults ────────────────────────────────
Chart.defaults.color          = '#6b7585';
Chart.defaults.font.family    = "'DM Mono', monospace";
Chart.defaults.font.size      = 11;
Chart.defaults.plugins.legend.labels.boxWidth = 12;
Chart.defaults.plugins.legend.labels.padding  = 14;

// ── Main entry ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  showLoader();
  loadCSV();
  setupFilters();
  initScrollReveal();
});

// ── Scroll Reveal ─────────────────────────────────────────────
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
}

function showLoader() {
  const ov = document.createElement('div');
  ov.className = 'loading-overlay';
  ov.id = 'loading-overlay';
  ov.innerHTML = `
    <div class="loader-content">
      <div class="loader-logo">SentimentScope</div>
      <div class="loader-bar-wrap"><div class="loader-bar"></div></div>
      <div class="loader-text">Parsing 732 social posts<span class="loader-dots"></span></div>
    </div>`;
  document.body.prepend(ov);
}
function hideLoader() {
  const ov = document.getElementById('loading-overlay');
  if (ov) { ov.classList.add('hidden'); setTimeout(() => ov.remove(), 700); }
}

// ── CSV Load ─────────────────────────────────────────────────
function loadCSV() {
  Papa.parse('sentimentdataset.csv', {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: ({ data }) => {
      RAW_DATA = data.map(r => ({
        text:      (r.Text || '').trim(),
        sentiment: (r.Sentiment || '').trim(),
        platform:  (r.Platform || '').trim(),
        country:   (r.Country || '').trim(),
        user:      (r.User || '').trim(),
        hashtags:  (r.Hashtags || '').trim(),
        likes:     parseFloat(r.Likes)  || 0,
        retweets:  parseFloat(r.Retweets) || 0,
        month:     String(parseInt(r.Month) || 0),
        hour:      parseInt(r.Hour) || 0,
        year:      parseInt(r.Year) || 2023,
        polarity:  classifyPolarity(r.Sentiment),
      }));
      populateCountryFilter();
      render(RAW_DATA);
      hideLoader();
    },
    error: () => {
      document.getElementById('headline-text').textContent =
        '⚠️ Could not load CSV. Make sure sentimentdataset.csv is in the same folder.';
      hideLoader();
    }
  });
}

// ── Filter setup ─────────────────────────────────────────────
function setupFilters() {
  document.getElementById('platform-filter').addEventListener('click', e => {
    if (!e.target.matches('.filter-btn')) return;
    document.querySelectorAll('#platform-filter .filter-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    render(getFiltered());
  });
  document.getElementById('country-filter').addEventListener('change', () => render(getFiltered()));
  document.getElementById('month-filter').addEventListener('change',   () => render(getFiltered()));
  document.getElementById('reset-filters').addEventListener('click',   resetFilters);

  // Feed search
  document.getElementById('feed-search').addEventListener('input', e => {
    buildFeed(getFiltered(), e.target.value.trim().toLowerCase());
  });
}

function populateCountryFilter() {
  const sel = document.getElementById('country-filter');
  const countries = [...new Set(RAW_DATA.map(r => r.country))].filter(Boolean).sort();
  countries.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c; opt.textContent = (COUNTRY_FLAGS[c] || '') + ' ' + c;
    sel.appendChild(opt);
  });
}

function getFiltered() {
  const plat  = document.querySelector('#platform-filter .filter-btn.active')?.dataset.val || 'All';
  const ctry  = document.getElementById('country-filter').value;
  const month = document.getElementById('month-filter').value;
  return RAW_DATA.filter(r =>
    (plat  === 'All' || r.platform === plat)  &&
    (ctry  === 'All' || r.country  === ctry)  &&
    (month === 'All' || r.month    === month)
  );
}

function resetFilters() {
  document.querySelectorAll('#platform-filter .filter-btn').forEach((b,i) => b.classList.toggle('active', i===0));
  document.getElementById('country-filter').value = 'All';
  document.getElementById('month-filter').value   = 'All';
  document.getElementById('feed-search').value    = '';
  render(RAW_DATA);
}

// ── Master render ────────────────────────────────────────────
function render(data) {
  updateKPIs(data);
  updateHeadline(data);
  buildSentimentBar(data);
  buildPlatformDonut(data);
  buildMoodGauge(data);
  buildTimeline(data);
  buildCountryList(data);
  buildHeatmap(data);
  buildPlatformSentimentBar(data);
  buildFeed(data, document.getElementById('feed-search').value.trim().toLowerCase());
}

// ── KPIs ─────────────────────────────────────────────────────
function updateKPIs(data) {
  document.getElementById('total-posts').textContent = data.length.toLocaleString() + ' Posts';

  const positivePct = data.length
    ? Math.round(data.filter(r => r.polarity === 'positive').length / data.length * 100)
    : 0;
  animateValue('#kpi-positive .kpi-val', positivePct, v => v + '%');

  const avgLikes = data.length ? (data.reduce((s,r) => s + r.likes, 0) / data.length).toFixed(1) : '0';
  document.querySelector('#kpi-avg-likes .kpi-val').textContent = avgLikes;

  const countries = new Set(data.map(r => r.country).filter(Boolean)).size;
  animateValue('#kpi-countries .kpi-val', countries, v => v);

  const hourMap = {};
  data.forEach(r => { hourMap[r.hour] = (hourMap[r.hour] || 0) + 1; });
  const peakHour = Object.entries(hourMap).sort((a,b) => b[1]-a[1])[0];
  document.querySelector('#kpi-peak-hour .kpi-val').textContent = peakHour
    ? (peakHour[0] > 11 ? (peakHour[0]-12||12) + ' PM' : (peakHour[0]||12) + ' AM')
    : '—';
}

function animateValue(selector, target, fmt, dur=800) {
  const el = document.querySelector(selector);
  if (!el) return;
  const start = performance.now();
  const from  = parseFloat(el.textContent) || 0;
  (function tick(now) {
    const p = Math.min((now - start) / dur, 1);
    const v = Math.round(from + (target - from) * easeOut(p));
    el.textContent = fmt(v);
    if (p < 1) requestAnimationFrame(tick);
  })(start);
}
function easeOut(t) { return 1 - Math.pow(1-t, 3); }

// ── Headline ─────────────────────────────────────────────────
function updateHeadline(data) {
  if (!data.length) {
    document.getElementById('headline-text').textContent = 'No data matches the current filters.';
    return;
  }
  const pos  = data.filter(r => r.polarity === 'positive').length;
  const neg  = data.filter(r => r.polarity === 'negative').length;
  const pct  = Math.round(pos / data.length * 100);
  const topS = topN(data.map(r => r.sentiment), 1)[0];
  const topP = topN(data.map(r => r.platform), 1)[0];
  const topC = topN(data.map(r => r.country).filter(Boolean), 1)[0];
  document.getElementById('headline-text').textContent =
    `${pct}% of ${data.length} posts are positive — "${topS}" is the dominant emotion, `
    + `mostly from ${topP} users in ${topC}. Negativity at ${Math.round(neg/data.length*100)}%.`;
}

// ── Chart: Sentiment Bar ─────────────────────────────────────
function buildSentimentBar(data) {
  const counts = {};
  data.forEach(r => { counts[r.sentiment] = (counts[r.sentiment]||0)+1; });
  const sorted = Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,10);
  const labels = sorted.map(([k])=>k);
  const values = sorted.map(([,v])=>v);
  const colors = labels.map(sentimentColor);

  destroyChart('sentimentBar');
  chartInstances.sentimentBar = new Chart(
    document.getElementById('sentimentBar'), {
      type: 'bar',
      data: { labels, datasets: [{ data: values, backgroundColor: colors, borderRadius: 6, borderSkipped: false }] },
      options: {
        indexAxis: 'y',
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: tooltipStyle() },
        scales: {
          x: { grid: { color:'#23272f' }, ticks: { color:'#6b7585' } },
          y: { grid: { display: false }, ticks: { color:'#e8ecf0', font: { size: 11 } } },
        },
        animation: { duration: 700, easing: 'easeOutQuart' },
      }
    }
  );
}

// ── Chart: Platform Donut ────────────────────────────────────
function buildPlatformDonut(data) {
  const counts = { Twitter: 0, Instagram: 0, Facebook: 0 };
  data.forEach(r => { if (counts[r.platform] !== undefined) counts[r.platform]++; });
  const labels = Object.keys(counts);
  const values = Object.values(counts);
  const colors = labels.map(l => PLATFORM_COLORS[l] || '#6b7585');

  destroyChart('platformDonut');
  chartInstances.platformDonut = new Chart(
    document.getElementById('platformDonut'), {
      type: 'doughnut',
      data: { labels, datasets: [{ data: values, backgroundColor: colors, borderWidth: 2, borderColor: '#111318', hoverOffset: 8 }] },
      options: {
        responsive: true, maintainAspectRatio: false,
        cutout: '68%',
        plugins: {
          legend: { position: 'bottom', labels: { color: '#e8ecf0', padding: 16, font: { size: 11 } } },
          tooltip: tooltipStyle(),
        },
        animation: { duration: 700 },
      }
    }
  );
}

// ── Chart: Mood Gauge ────────────────────────────────────────
function buildMoodGauge(data) {
  const pos = data.filter(r => r.polarity === 'positive').length;
  const neg = data.filter(r => r.polarity === 'negative').length;
  const neu = data.length - pos - neg;
  const pct = data.length ? Math.round(pos / data.length * 100) : 0;
  document.getElementById('gauge-pct').textContent = pct + '%';

  destroyChart('moodGauge');
  chartInstances.moodGauge = new Chart(
    document.getElementById('moodGauge'), {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [pos, neg, neu],
          backgroundColor: ['#7fffb2','#ff6b6b','#ffd166'],
          borderWidth: 2, borderColor: '#111318', hoverOffset: 6,
        }],
        labels: ['Positive','Negative','Neutral'],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        rotation: -90, circumference: 180, cutout: '72%',
        plugins: { legend: { display: false }, tooltip: tooltipStyle() },
        animation: { duration: 700 },
      }
    }
  );
}

// ── Chart: Timeline ──────────────────────────────────────────
function buildTimeline(data) {
  const monthMap = {};
  for (let m = 1; m <= 12; m++) monthMap[String(m)] = 0;
  data.forEach(r => { if (monthMap[r.month] !== undefined) monthMap[r.month]++; });
  const labels = Object.keys(monthMap).map(m => MONTH_NAMES[m]);
  const values = Object.values(monthMap);

  destroyChart('timelineChart');
  chartInstances.timelineChart = new Chart(
    document.getElementById('timelineChart'), {
      type: 'line',
      data: {
        labels,
        datasets: [{
          data: values,
          borderColor: '#7fffb2',
          backgroundColor: 'rgba(127,255,178,.08)',
          pointBackgroundColor: '#7fffb2',
          pointRadius: 4, pointHoverRadius: 7,
          tension: 0.4, fill: true, borderWidth: 2,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: tooltipStyle() },
        scales: {
          x: { grid: { color:'#23272f' }, ticks: { color:'#6b7585' } },
          y: { grid: { color:'#23272f' }, ticks: { color:'#6b7585' } },
        },
        animation: { duration: 700, easing: 'easeOutQuart' },
      }
    }
  );
}

// ── Country List ─────────────────────────────────────────────
function buildCountryList(data) {
  const counts = {};
  data.forEach(r => { if (r.country) counts[r.country] = (counts[r.country]||0)+1; });
  const sorted = Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,8);
  const max = sorted[0]?.[1] || 1;
  const container = document.getElementById('country-list');
  container.innerHTML = sorted.map(([c,n]) => `
    <div class="country-row">
      <span class="country-flag">${COUNTRY_FLAGS[c]||'🌐'}</span>
      <span class="country-name">${c}</span>
      <div class="country-bar-wrap">
        <div class="country-bar" style="width:${Math.round(n/max*100)}%"></div>
      </div>
      <span class="country-count">${n}</span>
    </div>`).join('');
}

// ── Heatmap ──────────────────────────────────────────────────
function buildHeatmap(data) {
  const hourMap = {};
  for (let h = 0; h < 24; h++) hourMap[h] = 0;
  data.forEach(r => { if (hourMap[r.hour] !== undefined) hourMap[r.hour]++; });
  const max = Math.max(...Object.values(hourMap)) || 1;
  const wrap = document.getElementById('heatmap-wrap');
  wrap.innerHTML = '';
  for (let h = 0; h < 24; h++) {
    const v = hourMap[h];
    const intensity = Math.round((v / max) * 255);
    const cell = document.createElement('div');
    cell.className = 'heat-cell';
    cell.title = `${h}:00 — ${v} posts`;
    cell.style.background = `rgba(127,255,178,${(v/max*0.85).toFixed(2)})`;
    cell.innerHTML = `<span class="heat-cell-label">${h}h</span>`;
    wrap.appendChild(cell);
  }
}

// ── Platform × Sentiment stacked bar ─────────────────────────
function buildPlatformSentimentBar(data) {
  const platforms = ['Twitter','Instagram','Facebook'];
  const polarities = ['positive','neutral','negative'];
  const counts = {};
  platforms.forEach(p => { counts[p] = { positive:0, neutral:0, negative:0 }; });
  data.forEach(r => {
    if (counts[r.platform]) counts[r.platform][r.polarity]++;
  });
  const COLORS = { positive:'#7fffb2', neutral:'#ffd166', negative:'#ff6b6b' };

  destroyChart('platformSentimentBar');
  chartInstances.platformSentimentBar = new Chart(
    document.getElementById('platformSentimentBar'), {
      type: 'bar',
      data: {
        labels: platforms,
        datasets: polarities.map(pol => ({
          label: pol.charAt(0).toUpperCase() + pol.slice(1),
          data: platforms.map(p => counts[p][pol]),
          backgroundColor: COLORS[pol],
          borderRadius: 4, borderSkipped: false,
        }))
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { position:'bottom', labels: { color:'#e8ecf0', font:{size:10} } },
          tooltip: tooltipStyle(),
        },
        scales: {
          x: { stacked: true, grid: { display: false }, ticks: { color:'#e8ecf0' } },
          y: { stacked: true, grid: { color:'#23272f' }, ticks: { color:'#6b7585' } },
        },
        animation: { duration: 700 },
      }
    }
  );
}

// ── Feed ─────────────────────────────────────────────────────
function buildFeed(data, search='') {
  let filtered = search
    ? data.filter(r =>
        r.text.toLowerCase().includes(search) ||
        r.user.toLowerCase().includes(search) ||
        r.sentiment.toLowerCase().includes(search)
      )
    : data;
  const display = filtered.slice(0, 60);
  document.getElementById('feed-count').textContent = filtered.length.toLocaleString() + ' posts';

  const grid = document.getElementById('feed-grid');
  grid.innerHTML = display.map((r, i) => {
    const col  = AVATAR_COLORS[i % AVATAR_COLORS.length];
    const initials = r.user.slice(0,2).toUpperCase() || 'U?';
    const chip = getSentimentChip(r.sentiment, r.polarity);
    const icon = PLATFORM_ICONS[r.platform] || '💬';
    return `
      <div class="feed-card">
        <div class="feed-top">
          <div class="feed-avatar" style="background:${col}22;color:${col}">${initials}</div>
          <div>
            <div class="feed-user">${escHtml(r.user)}</div>
            <div class="feed-platform">${icon} ${escHtml(r.platform)}</div>
          </div>
        </div>
        <p class="feed-text">${escHtml(r.text)}</p>
        <div class="feed-bottom">
          <span class="sentiment-chip" style="${chip.style}">${chip.label}</span>
          <div class="feed-stats">
            <span>❤️ ${r.likes}</span>
            <span>🔁 ${r.retweets}</span>
          </div>
        </div>
      </div>`;
  }).join('');
}

function getSentimentChip(sentiment, polarity) {
  const colors = {
    positive: { bg: 'rgba(127,255,178,.15)', border: 'rgba(127,255,178,.4)', text: '#7fffb2' },
    negative: { bg: 'rgba(255,107,107,.15)', border: 'rgba(255,107,107,.4)', text: '#ff6b6b' },
    neutral:  { bg: 'rgba(255,209,102,.15)', border: 'rgba(255,209,102,.4)', text: '#ffd166' },
  };
  const c = colors[polarity] || colors.neutral;
  return {
    label: sentiment,
    style: `background:${c.bg};border:1px solid ${c.border};color:${c.text}`
  };
}

// ── Utilities ─────────────────────────────────────────────────
function topN(arr, n) {
  const counts = {};
  arr.forEach(v => { if (v) counts[v] = (counts[v]||0)+1; });
  return Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,n).map(([k])=>k);
}
function destroyChart(id) {
  if (chartInstances[id]) { chartInstances[id].destroy(); delete chartInstances[id]; }
}
function escHtml(str) {
  return (str||'').replace(/[&<>"']/g, c =>
    ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])
  );
}
function tooltipStyle() {
  return {
    callbacks: {},
    backgroundColor: '#181b22',
    borderColor: '#23272f',
    borderWidth: 1,
    titleColor: '#e8ecf0',
    bodyColor: '#6b7585',
    padding: 10,
    cornerRadius: 8,
  };
}
