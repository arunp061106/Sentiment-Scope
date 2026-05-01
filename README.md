# 🖤 SentimentScope
### Social Media Emotion Intelligence Dashboard
**DND Data Arena: 24-Hour Dashboard Sprint · 2024**

[![Live Dashboard](https://img.shields.io/badge/🚀%20Live%20Dashboard-View%20Now-7fffb2?style=for-the-badge)](https://arunp061106.github.io/Sentiment-Scope/)
![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)

---

> **🔗 Live Dashboard → [https://arunp061106.github.io/Sentiment-Scope/](https://arunp061106.github.io/Sentiment-Scope/)**

---

## 📌 Event Context

**Event:** DND Data Arena — 24-Hour Dashboard Sprint
**Organizer:** DND Data nDreads
**Format:** Individual participation · Clarity-first build arena for data thinkers
**Focus:** Thinking through data · Structuring analysis · Extracting insights · Communicating clearly

> *"Clarity over complexity. Insight over noise. Execution over theory."*

---

## 📂 Dataset

| Property | Details |
|---|---|
| **Dataset Name** | Social Media Sentiments Analysis Dataset |
| **Total Records** | 732 social media posts |
| **Platforms Covered** | Twitter, Instagram, Facebook |
| **Countries** | USA, UK, Canada, Australia, India, Brazil, France, Japan, Germany, Italy + more |
| **Date Range** | January 2023 – October 2023 |
| **Key Columns** | `Text`, `Sentiment`, `Platform`, `Country`, `User`, `Hashtags`, `Likes`, `Retweets`, `Month`, `Hour`, `Year` |
| **Sentiment Labels** | 150+ unique emotion labels (Joy, Grief, Excitement, Hate, Gratitude…) |
| **Format** | CSV (analysis-ready; minor polarity mapping applied) |

---

## ❓ Problem Statement

Social media generates billions of emotional signals every day — but raw data alone tells no story.

**The challenge:** Analyze 732 real social media posts across platforms and countries to answer:

- What emotions dominate social media conversations in 2023?
- Which platforms carry the most positive vs. negative sentiment?
- When and where are people most emotionally expressive online?
- What patterns emerge across months, hours, and geographies?
- Can a single dashboard communicate the full emotional story in under 10 seconds?

**The goal:** Build a clarity-first dashboard that transforms raw sentiment data into a story any judge can read instantly — no explanation needed.

---

## 🛠️ Tools Used

| Tool | Purpose |
|---|---|
| **HTML5** | Page structure and semantic layout |
| **CSS3** | Dark theme styling, animations, responsive grid |
| **Vanilla JavaScript (ES2020)** | Data processing, filter logic, chart orchestration |
| **[Chart.js 4.4.1](https://www.chartjs.org/)** | All interactive charts (Bar, Donut, Line, Gauge) |
| **[PapaParse 5.4.1](https://www.papaparse.com/)** | In-browser CSV parsing — no backend needed |
| **[Google Fonts](https://fonts.google.com/)** | Syne (headings) · DM Mono (data labels) · DM Sans (body) |
| **GitHub Pages** | Free live hosting and public deployment |

> **No npm. No frameworks. No backend. No build tools.**
> Everything runs entirely in the browser — zero installation required for judges.

---

## 📊 Dashboard Overview

**Live URL:** [https://arunp061106.github.io/Sentiment-Scope/](https://arunp061106.github.io/Sentiment-Scope/)

### Dashboard Sections

| Section | What It Shows |
|---|---|
| **KPI Strip (Header)** | Total posts · % Positive Mood · Avg Likes · Countries · Peak Hour |
| **Auto Story Headline** | One sentence narrating the full data story — updates with every filter |
| **Sentiment Bar Chart** | Top 10 emotions ranked by volume (colour-coded by polarity) |
| **Platform Donut** | Twitter vs Instagram vs Facebook post volume split |
| **Mood Index Gauge** | Semicircle showing Positive / Neutral / Negative ratio at a glance |
| **Monthly Timeline** | Jan–Oct 2023 posting trend (line chart with area fill) |
| **Country Rankings** | Top countries with flag icons and relative progress bars |
| **24-Hour Heatmap** | 24-cell grid showing which hours have the highest post volume |
| **Platform × Sentiment** | Stacked bar comparing emotional tone across all 3 platforms |
| **Live Post Feed** | 60 searchable post cards with real text, user, likes, and retweets |

### Interactive Filters
- **Platform** — Twitter / Instagram / Facebook / All
- **Country** — Dropdown of all countries in the dataset
- **Month** — January through October
- Every chart, KPI, headline, and feed card **updates live** when filters change

---

## 💡 Key Insights

1. **67% of posts carry positive sentiment** — Joy, Excitement, and Contentment are the top three emotions across all platforms in 2023

2. **Instagram is the most emotionally expressive platform** — highest volume (258 posts) and the strongest positive sentiment ratio of the three platforms

3. **2:00 PM is the global social media peak** — the heatmap reveals a sharp spike in posting activity at 2 PM across all countries and platforms

4. **The USA leads in volume (188 posts)** but the UK and Canada closely follow, suggesting English-speaking markets dominate the dataset

5. **Negative sentiment is narrow and concentrated** — Hate, Despair, and Grief together account for less than 12% of all posts; most negativity is mild (Sadness, Loneliness)

6. **February has the highest monthly volume** — likely driven by Valentine's Day emotional content and early-year social media momentum

7. **Twitter carries slightly more negative sentiment than Instagram or Facebook** — suggesting Twitter's conversational format surfaces more conflict-driven content

---

## 📁 Repository Structure

```
Sentiment-Scope/
│
├── index.html              ← Main dashboard layout & HTML structure
├── style.css               ← All styling, dark theme, animations, responsive grid
├── app.js                  ← Data loading, chart logic, filters, feed, KPIs
├── sentimentdataset.csv    ← Dataset: 732 social media posts
└── README.md               ← This file
```

> ⚠️ All 4 core files must remain in the same directory for the dashboard to function correctly.

---

## 🚀 How to Run Locally

### Option 1 — VS Code Live Server (Recommended)
1. Open the folder in VS Code
2. Install the **Live Server** extension by Ritwick Dey
3. Right-click `index.html` → **"Open with Live Server"**
4. Dashboard opens at `http://127.0.0.1:5500`

### Option 2 — Python
```bash
python -m http.server 8080
# Then open http://localhost:8080
```

> ❌ Do not open `index.html` by double-clicking — the CSV requires a local server due to browser CORS policy.

---

## 🧠 Methodology

### Sentiment Polarity Mapping
The dataset contains 150+ unique emotion labels. Each was mapped into one of three polarities to power the Mood Gauge and Platform × Sentiment chart:

```
Positive → Joy, Excitement, Happiness, Gratitude, Hope, Love, Pride,
            Contentment, Elation, Euphoria, Enthusiasm, Inspiration...

Negative → Hate, Despair, Grief, Anger, Fear, Sadness, Frustration,
            Loneliness, Jealousy, Bitterness, Shame, Anxiety...

Neutral  → Curiosity, Reflection, Nostalgia, Surprise, Indifference...
```

Classification is implemented in `app.js` using JavaScript `Set` lookups — no external NLP library required.

### Auto Headline Logic
The dashboard generates a plain-English summary on every filter change:
```
"67% of 732 posts are positive — Joy is the dominant emotion,
mostly from Instagram users in USA. Negativity at 21%."
```
This ensures any judge reading the dashboard understands the full story instantly — without studying individual charts.

---

## 📋 Submission Checklist

- [x] GitHub repository (public) — [github.com/arunp061106/Sentiment-Scope](https://github.com/arunp061106/Sentiment-Scope)
- [x] Live dashboard link — [https://arunp061106.github.io/Sentiment-Scope/](https://arunp061106.github.io/Sentiment-Scope/)
- [x] README with dataset, problem statement, tools, overview, and insights
- [x] Clean repository structure with all working files included
- [ ] Presentation (PDF/PPT — max 6 slides) ← upload before deadline

---

## 📊 Evaluation Alignment

| Criteria | Weight | How This Submission Addresses It |
|---|---|---|
| Problem Understanding | 20% | Clear problem statement with 5 guiding questions driving the entire analysis |
| Dashboard Clarity | 25% | Auto headline + 10-second story rule; every chart has one clear purpose |
| Insight Quality | 25% | 7 data-backed insights with specific numbers and pattern explanations |
| Design Simplicity | 15% | Dark editorial theme; consistent colour language (green=positive, red=negative, amber=neutral) |
| GitHub Organization | 15% | Clean 5-file structure; detailed README; public repo; live GitHub Pages deployment |

---

## 👤 Participant

**Name:** Arun karthick  P
**GitHub:** [@arunp061106](https://github.com/arunp061106)
**Event:** DND Data Arena — 24-Hour Dashboard Sprint
**Submission Type:** Individual · Original Work

---

## 📜 Declaration

- This is original, individual work completed within the 24-hour sprint window
- All tools and libraries used are fully disclosed above
- No collaboration with other participants
- Dataset selected: Social Media Sentiments Analysis Dataset
- All submission links are publicly accessible

---

*SentimentScope v1.0 · Built in 24 hours · DND Data nDreads 2024 · MIT License*

---

> *"Every person in this Arena chose to show up and do the work. That matters."*
> — The DND Data nDreads Team 🖤
