const OMDB_KEY = '5daa34a1';
const OPENSUBTITLES_KEY = 'HYmbEWABAylmAeYqczaW2AZjOXCZYOGw';

const HERO_SERIES = [
  {id:'tt11198330',title:'House of the Dragon',year:'2022',rating:'8.5',plot:'The story of the Targaryen civil war that took place about 200 years before the events of Game of Thrones.'},
  {id:'tt9813792',title:'From',year:'2022',rating:'7.8',plot:'Unravel the mystery of a city in middle U.S.A. that imprisons everyone who enters.'},
  {id:'tt13443470',title:'Wednesday',year:'2022',rating:'8.1',plot:'Follows Wednesday Addams years as a student at Nevermore Academy.'},
  {id:'tt10919420',title:'Squid Game',year:'2021',rating:'8.0',plot:'Hundreds of cash-strapped players accept a strange invitation to compete in children\'s games.'},
  {id:'tt4574334',title:'Stranger Things',year:'2016',rating:'8.7',plot:'When a young boy vanishes, a small town uncovers a mystery involving secret experiments.'},
  {id:'tt0903747',title:'Breaking Bad',year:'2008',rating:'9.5',plot:'A chemistry teacher diagnosed with cancer turns to making meth to secure his family\'s future.'}
];

const CATEGORIES = {
  trending: ['tt11198330','tt9813792','tt13443470','tt10919420','tt4574334','tt0903747','tt8111088','tt3032476','tt0386676','tt0944947','tt0108778','tt2560140'],
  hollywood: ['tt0111161','tt1375666','tt0816692','tt0468569','tt0137523','tt0109830','tt0120737','tt0167260','tt4154796','tt7286456','tt15398776','tt9362722'],
  kdrama: ['tt15266542','tt14689414','tt13370348','tt11280740','tt10262630','tt13443470','tt11198330','tt1190634','tt10850932','tt11212276'],
  bollywood: ['tt8178634','tt15327088','tt12735488','tt1187043','tt12844910','tt10648342','tt0451850','tt0816442','tt0066763','tt0347304'],
  sinhala: ['tt2386490','tt0111161','tt1375666','tt0816692','tt0468569','tt0137523']
};

let currentHeroSlide = 0;
let heroInterval;

async function fetchOMDb(imdbID) {
  try {
    const res = await fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${OMDB_KEY}&plot=full`);
    if (!res.ok) throw new Error('Network error');
    const data = await res.json();
    return data.Response === 'True'? data : null;
  } catch(e) {
    console.error('OMDb Error:', e);
    return null;
  }
}

async function buildHeroSlider() {
  const slider = document.getElementById('heroSlider');
  if (!slider) return;

  try {
    const slides = await Promise.all(HERO_SERIES.map(id => fetchOMDb(id.id)));
    const validSlides = slides.filter(s => s);

    if (validSlides.length === 0) {
      slider.innerHTML = '<div class="error-msg"><div class="error-title">Failed to load</div>Check your API key</div>';
      return;
    }

    slider.innerHTML = validSlides.map((movie, idx) => `
      <div class="hero-slide ${idx === 0? 'active' : ''}">
        <img src="${movie.Poster!== 'N/A'? movie.Poster : ''}" class="hero-bg" alt="${movie.Title}" onerror="this.style.display='none'">
        <div class="hero-gradient"></div>
        <div class="hero-content">
          <div class="hero-badge">TRENDING NOW</div>
          <h1 class="hero-title">${movie.Title}</h1>
          <div class="hero-meta">
            <span>${movie.Year}</span>
            <span class="lang-dot"></span>
            <span>${movie.Runtime}</span>
            <span class="lang-dot"></span>
            <span>${movie.Rated}</span>
            <span class="lang-dot"></span>
            <span class="hero-rating">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              ${movie.imdbRating}/10
            </span>
          </div>
          <p class="hero-plot">${movie.Plot}</p>
          <div class="hero-btns">
            <button class="btn-hero btn-play" onclick="showMovieDetail('${movie.imdbID}')">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              Play
            </button>
            <button class="btn-hero btn-info" onclick="showMovieDetail('${movie.imdbID}')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              More Info
            </button>
          </div>
        </div>
      </div>
    `).join('') + `
      <div class="hero-dots">
        ${validSlides.map((_, idx) => `<div class="hero-dot ${idx === 0? 'active' : ''}" onclick="goToSlide(${idx})"></div>`).join('')}
      </div>
    `;

    startHeroSlider();
  } catch(e) {
    slider.innerHTML = '<div class="error-msg"><div class="error-title">Error</div>'+e.message+'</div>';
  }
}

function startHeroSlider() {
  if (heroInterval) clearInterval(heroInterval);
  heroInterval = setInterval(() => {
    currentHeroSlide = (currentHeroSlide + 1) % HERO_SERIES.length;
    showSlide(currentHeroSlide);
  }, 5000);
}

function showSlide(index) {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  slides.forEach((s, i) => s.classList.toggle('active', i === index));
  dots.forEach((d, i) => d.classList.toggle('active', i === index));
  currentHeroSlide = index;
}

function goToSlide(index) {
  showSlide(index);
  startHeroSlider();
}

async function loadCategory(category, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '<div style="padding:40px 16px;text-align:center;width:100%"><div class="spinner"></div>Loading...</div>';

  try {
    const ids = CATEGORIES[category] || [];
    const movies = await Promise.all(ids.map(id => fetchOMDb(id)));

    container.innerHTML = movies.filter(m => m).map(movie => `
      <div class="hcard" onclick="showMovieDetail('${movie.imdbID}')">
        <div class="hcard-poster">
          <img src="${movie.Poster!== 'N/A'? movie.Poster : ''}" alt="${movie.Title}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
          <div class="hcard-poster-fallback" style="display:none">🎬</div>
          <div class="hcard-rating">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            ${movie.imdbRating}
          </div>
        </div>
        <div class="hcard-title">${movie.Title}</div>
        <div class="hcard-year">${movie.Year}</div>
      </div>
    `).join('');
  } catch(e) {
    container.innerHTML = '<div class="error-msg">Failed to load</div>';
  }
}

function filterCategory(cat, el) {
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('on'));
  el.classList.add('on');
  if (cat === 'all') window.scrollTo({top: 0, behavior: 'smooth'});
}

async function handleSearch(val){
  const res=document.getElementById('searchResults');
  if(!val.trim()){
    res.innerHTML='<div style="padding:40px 16px;text-align:center;color:var(--t3);font-size:14px">Search for movies or TV series</div>';
    return;
  }

  res.innerHTML='<div style="padding:40px 16px;text-align:center;color:var(--t2)"><div class="spinner"></div>Searching...</div>';

  try {
    const omdbRes = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(val)}&apikey=${OMDB_KEY}`);
    const omdbData = await omdbRes.json();

    if(omdbData.Response === 'True' && omdbData.Search){
      res.innerHTML = omdbData.Search.slice(0,10).map(m => `
        <div class="sr-item" onclick="showMovieDetail('${m.imdbID}')">
          <div class="sr-icon">
            <img src="${m.Poster!== 'N/A'? m.Poster : ''}" alt="" onerror="this.style.display='none'">
          </div>
          <div class="sr-text">
            <div class="sr-title">${m.Title}</div>
            <div class="sr-sub">${m.Year} · ${m.Type}</div>
          </div>
          <div class="sr-go"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg></div>
        </div>
      `).join('');
    } else {
      res.innerHTML='<div style="padding:40px 16px;text-align:center;color:var(--t3);font-size:14px">No results found</div>';
    }
  } catch(e) {
    res.innerHTML='<div style="padding:40px 16px;text-align:center;color:var(--red);font-size:14px">Error: '+e.message+'</div>';
  }
}

// ===== SUBTITLE LOADER - CORS Fixed =====
async function loadSubtitles(imdbID, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '<div class="subtitle-loading"><div class="spinner" style="width:24px;height:24px"></div><span>Loading subtitles...</span></div>';

  try {
    const proxyUrl = 'https://corsproxy.io/?';
    const apiUrl = `https://api.opensubtitles.com/api/v1/subtitles?imdb_id=${imdbID.replace('tt','')}&languages=si,en,ta,hi`;

    const res = await fetch(proxyUrl + encodeURIComponent(apiUrl), {
      headers: {
        'Api-Key': OPENSUBTITLES_KEY,
        'User-Agent': 'CinemaxElite v1.0'
      }
    });

    if (!res.ok) throw new Error('API request failed');

    const data = await res.json();

    if (!data.data || data.data.length === 0) {
      container.innerHTML = `
        <div class="subtitle-empty">
          No subtitles found in database<br>
          <span style="font-size:11px;color:var(--t3);margin-top:8px;display:block;">
            Try contacting me for manual upload
          </span>
        </div>
        <div class="subtitle-note">Free plan: 100 downloads/day (Under Development mode)</div>`;
      return;
    }

    const subsByLang = {};
    data.data.forEach(item => {
      const lang = item.attributes.language;
      if (!subsByLang) subsByLang = [];
      subsByLang.push(item);
    });

    const langNames = {
      'si': '🇱🇰 Sinhala',
      'en': '🇬🇧 English',
      'ta': '🇮🇳 Tamil',
      'hi': '🇮🇳 Hindi'
    };

    container.innerHTML = Object.keys(subsByLang).map(lang => {
      const langName = langNames || lang.toUpperCase();
      const files = subsByLang.slice(0, 5);

      return `
        <div class="subtitle-lang-group">
          <div class="subtitle-lang-title">${langName} (${files.length})</div>
          <div class="subtitle-grid">
            ${files.map(file => {
                            const fileId = file.attributes.files[0].file_id;
              const releaseName = file.attributes.release || file.attributes.movie_name || 'Download';
              const downloads = file.attributes.download_count || 0;
              return `
                <button class="subtitle-btn" onclick="downloadSubtitle(${fileId}, '${releaseName.replace(/'/g, "\\'")}')">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  <div style="text-align:left;flex:1;min-width:0;">
                    <div style="font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${releaseName}</div>
                    <div style="font-size:10px;color:var(--t3);margin-top:2px;">${downloads} downloads</div>
                  </div>
                </button>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }).join('') + '<div class="subtitle-note">Free plan: 100 downloads/day (Under Development mode). Click to download.srt file.</div>';

  } catch(e) {
    console.error('Subtitle Error:', e);
    container.innerHTML = `
      <div class="subtitle-empty">
        Error loading subtitles<br>
        <span style="font-size:11px;color:var(--t3);margin-top:8px;display:block;">
          ${e.message}. Try again or contact me.
        </span>
      </div>`;
  }
}

// ===== DOWNLOAD SUBTITLE - CORS Fixed =====
async function downloadSubtitle(fileId, filename) {
  try {
    const proxyUrl = 'https://corsproxy.io/?';
    const apiUrl = `https://api.opensubtitles.com/api/v1/download`;

    const res = await fetch(proxyUrl + encodeURIComponent(apiUrl), {
      method: 'POST',
      headers: {
        'Api-Key': OPENSUBTITLES_KEY,
        'Content-Type': 'application/json',
        'User-Agent': 'CinemaxElite v1.0'
      },
      body: JSON.stringify({
        file_id: fileId
      })
    });

    if (!res.ok) {
      if (res.status === 402) {
        alert('Download limit reached! Free plan: 100/day\nContact me on WhatsApp for help.');
      } else {
        alert('Download failed. Please try again or contact me.');
      }
      return;
    }

    const data = await res.json();

    // Download the file
    const link = document.createElement('a');
    link.href = data.link;
    link.download = filename.replace(/[^a-z0-9]/gi, '_') + '.srt';
    link.click();

  } catch(e) {
    console.error('Download Error:', e);
    alert('Download failed. Contact me on WhatsApp for help.');
  }
}

// ===== Show Movie Detail =====
async function showMovieDetail(imdbID) {
  closeSearch();
  const homePage = document.getElementById('page-home');
  const detailPage = document.getElementById('page-detail');

  homePage.style.display = 'none';
  detailPage.style.display = 'block';
  detailPage.innerHTML = '<div style="padding:100px 16px;text-align:center"><div class="spinner"></div>Loading...</div>';
  window.scrollTo(0,0);

  const data = await fetchOMDb(imdbID);
  if(!data) {
    detailPage.innerHTML = '<div style="padding:100px 16px;text-align:center;color:var(--red)">Movie not found</div>';
    return;
  }

  const poster = data.Poster!== 'N/A'? data.Poster : '';
  const genres = data.Genre? data.Genre.split(', ') : [];

  detailPage.innerHTML = `
    <button class="back-btn" onclick="goHome()">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></
