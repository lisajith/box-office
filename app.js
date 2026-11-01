const USD_TO_INR_RATE = 94.9;

// Comprehensive all-time records with verified worldwide gross stats
const ALL_TIME_TOP_GROSSERS = [
  { title: "Avatar", grossINR: "₹24,800 Cr", usdValue: 2923706026 },
  { title: "Avengers: Endgame", grossINR: "₹23,750 Cr", usdValue: 2799439100 },
  {
    title: "Avatar: The Way of Water",
    grossINR: "₹19,700 Cr",
    usdValue: 2320250281,
  },
  { title: "Titanic", grossINR: "₹19,200 Cr", usdValue: 2264743305 },
  {
    title: "Star Wars: Episode VII - The Force Awakens",
    grossINR: "₹17,500 Cr",
    usdValue: 2071310218,
  },
  {
    title: "Avengers: Infinity War",
    grossINR: "₹17,400 Cr",
    usdValue: 2052415039,
  },
  {
    title: "Spider-Man: No Way Home",
    grossINR: "₹16,300 Cr",
    usdValue: 1921847111,
  },
  { title: "Jurassic World", grossINR: "₹14,200 Cr", usdValue: 1671537444 },
  { title: "The Lion King", grossINR: "₹14,100 Cr", usdValue: 1663075401 },
  { title: "The Avengers", grossINR: "₹12,900 Cr", usdValue: 1520538536 },
  { title: "Furious 7", grossINR: "₹12,850 Cr", usdValue: 1515341399 },
  { title: "Top Gun: Maverick", grossINR: "₹12,700 Cr", usdValue: 1495696292 },
  { title: "Frozen II", grossINR: "₹12,300 Cr", usdValue: 1453683476 },
  { title: "Barbie", grossINR: "₹12,250 Cr", usdValue: 1445638421 },
  {
    title: "Demon Slayer: Kimetsu no Yaiba – The Movie: Mugen Train",
    grossINR: "₹4,300 Cr",
    usdValue: 507000000,
  },
  { title: "Spirited Away", grossINR: "₹3,350 Cr", usdValue: 395000000 },
  { title: "Dangal", grossINR: "₹2,024 Cr", usdValue: 243000000 },
  {
    title: "Baahubali 2: The Conclusion",
    grossINR: "₹1,810 Cr",
    usdValue: 218000000,
  },
  { title: "RRR", grossINR: "₹1,387 Cr", usdValue: 166000000 },
  { title: "K.G.F: Chapter 2", grossINR: "₹1,250 Cr", usdValue: 150000000 },
  { title: "Jawan", grossINR: "₹1,148 Cr", usdValue: 138000000 },
  { title: "Pathaan", grossINR: "₹1,050 Cr", usdValue: 126000000 },
  { title: "Kalki 2898 AD", grossINR: "₹1,042 Cr", usdValue: 125000000 },
  { title: "Bajrangi Bhaijaan", grossINR: "₹969 Cr", usdValue: 116000000 },
  { title: "Secret Superstar", grossINR: "₹966 Cr", usdValue: 115000000 },
  { title: "Animal", grossINR: "₹917 Cr", usdValue: 110000000 },
  { title: "2.0", grossINR: "₹800 Cr", usdValue: 96000000 },
  {
    title: "Baahubali: The Beginning",
    grossINR: "₹650 Cr",
    usdValue: 78000000,
  },
  { title: "Leo", grossINR: "₹612 Cr", usdValue: 74000000 },
  { title: "Jailer", grossINR: "₹605 Cr", usdValue: 73000000 },
  {
    title: "Salaar: Part 1 - Ceasefire",
    grossINR: "₹618 Cr",
    usdValue: 74000000,
  },
  { title: "Pushpa: The Rise", grossINR: "₹365 Cr", usdValue: 44000000 },
];

// DOM elements
const apiKeyInput = document.getElementById("apiKeyInput");
const saveKeyBtn = document.getElementById("saveKeyBtn");
const keyStatus = document.getElementById("keyStatus");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const suggestionsBox = document.getElementById("suggestionsBox");
const filterButtons = document.querySelectorAll(".filter-btn");
const movieGrid = document.getElementById("movieGrid");
const movieCount = document.getElementById("movieCount");
const statusIndicator = document.getElementById("statusIndicator");
const loadMoreBtn = document.getElementById("loadMoreBtn");

let OMDB_API_KEY = localStorage.getItem("omdb_api_key") || "";
let debounceTimer = null;

// Pagination state for unlimited scrolling / load more
let currentSearchQuery = "";
let currentPage = 1;
let totalAvailableResults = 0;
let displayedMoviesCount = 0;
let isAllTimeMode = false;

if (OMDB_API_KEY) {
  apiKeyInput.value = OMDB_API_KEY;
  keyStatus.textContent = "✅ Active API key loaded from storage.";
  keyStatus.style.color = "#34d399";
}

// Convert USD to INR Crores
function convertUSDToINR(usdStr) {
  if (!usdStr || usdStr === "N/A") return null;
  const numericVal = parseFloat(usdStr.replace(/[^0-9.-]+/g, ""));
  if (isNaN(numericVal) || numericVal <= 0) return null;

  const inrTotal = numericVal * USD_TO_INR_RATE;
  const inrCrore = (inrTotal / 10000000).toFixed(1);
  return `₹${Number(inrCrore).toLocaleString("en-IN")} Cr`;
}

// API Functions
async function fetchMovieByTitle(title) {
  const url = `https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${OMDB_API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.Response === "False") throw new Error(data.Error);
  return data;
}

async function searchMoviesByKeyword(query, page = 1) {
  const url = `https://www.omdbapi.com/?s=${encodeURIComponent(query)}&page=${page}&apikey=${OMDB_API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  return data;
}

// Render Movie Card
function createCardElement(movie) {
  const card = document.createElement("article");
  card.className = "card";

  const hasPoster = movie.Poster && movie.Poster !== "N/A";
  const imdb =
    movie.imdbRating && movie.imdbRating !== "N/A"
      ? `★ ${movie.imdbRating}`
      : "N/A";
  const convertedINR =
    movie.customINR ||
    convertUSDToINR(movie.BoxOffice) ||
    "Box Office Recorded";
  const originalUSD =
    movie.BoxOffice && movie.BoxOffice !== "N/A"
      ? `USD: ${movie.BoxOffice}`
      : movie.customUSD || "Worldwide Release";

  card.innerHTML = `
    <div class="poster-wrapper">
      ${
        hasPoster
          ? `<img class="poster-img" src="${movie.Poster}" alt="${movie.Title} poster" loading="lazy" />`
          : `<div class="poster-fallback">Poster Not Available</div>`
      }
    </div>
    <div class="card-content">
      <div>
        <h2 class="card-title">${movie.Title}</h2>
        <div class="card-meta">
          <div><strong>Year:</strong> ${movie.Year} | <strong>Rated:</strong> ${movie.Rated || "U/A"}</div>
          <div><strong>Genre:</strong> ${movie.Genre || "Cinema"}</div>
          <div><strong>Director:</strong> ${movie.Director || "N/A"}</div>
          <div><strong>Stars:</strong> ${movie.Actors || "N/A"}</div>
        </div>
      </div>
      <div class="card-footer">
        <div class="box-office">
          <span class="val">${convertedINR}</span>
          <span class="lbl">${originalUSD}</span>
        </div>
        <span class="imdb-badge">${imdb}</span>
      </div>
    </div>
  `;
  return card;
}

// Load All-Time High Records
async function loadAllTimeGrossers() {
  if (!OMDB_API_KEY) {
    promptForApiKey();
    return;
  }

  isAllTimeMode = true;
  loadMoreBtn.style.display = "none";
  movieGrid.innerHTML = "";
  displayedMoviesCount = 0;

  statusIndicator.textContent = "⚡ Loading all-time blockbuster collection...";
  statusIndicator.style.color = "#38bdf8";

  const promises = ALL_TIME_TOP_GROSSERS.map(async (item) => {
    try {
      const liveData = await fetchMovieByTitle(item.title);
      return {
        ...liveData,
        customINR: item.grossINR,
        customUSD: `$${(item.usdValue / 1000000).toFixed(0)}M+ Worldwide`,
      };
    } catch {
      return null;
    }
  });

  const records = (await Promise.all(promises)).filter(Boolean);
  records.forEach((movie) => {
    movieGrid.appendChild(createCardElement(movie));
  });

  displayedMoviesCount = records.length;
  movieCount.textContent = displayedMoviesCount;
  statusIndicator.textContent = "All-Time Records Loaded";
  statusIndicator.style.color = "#34d399";
}

// Search and Paginate (Infinite / Multi-Page)
async function performQuerySearch(query, page = 1, append = false) {
  if (!OMDB_API_KEY) {
    promptForApiKey();
    return;
  }

  isAllTimeMode = false;
  currentSearchQuery = query;
  currentPage = page;

  statusIndicator.textContent = `⚡ Loading page ${page} for "${query}"...`;
  statusIndicator.style.color = "#38bdf8";

  if (!append) {
    movieGrid.innerHTML = "";
    displayedMoviesCount = 0;
  }

  try {
    const data = await searchMoviesByKeyword(query, page);

    if (data.Response === "False") {
      if (!append) {
        movieGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: #94a3b8; padding: 3rem;">No movies found for "${query}".</div>`;
      }
      loadMoreBtn.style.display = "none";
      statusIndicator.textContent = "End of results";
      statusIndicator.style.color = "#94a3b8";
      return;
    }

    totalAvailableResults = parseInt(data.totalResults, 10);

    // Fetch full details (Posters, Box Office, IMDb, Actors) for each card
    const detailPromises = data.Search.map((item) =>
      fetchMovieByTitle(item.Title).catch(() => null),
    );

    const detailedMovies = (await Promise.all(detailPromises)).filter(Boolean);

    detailedMovies.forEach((movie) => {
      movieGrid.appendChild(createCardElement(movie));
    });

    displayedMoviesCount += detailedMovies.length;
    movieCount.textContent = `${displayedMoviesCount} of ${totalAvailableResults}`;

    // Show "Load More" button if more pages exist in database
    if (displayedMoviesCount < totalAvailableResults) {
      loadMoreBtn.style.display = "block";
      loadMoreBtn.textContent = `Load More Movies (${displayedMoviesCount}/${totalAvailableResults}) ↓`;
    } else {
      loadMoreBtn.style.display = "none";
    }

    statusIndicator.textContent = `Live Synced (${displayedMoviesCount} loaded)`;
    statusIndicator.style.color = "#34d399";
  } catch (err) {
    console.error(err);
    statusIndicator.textContent = "Error loading movies";
    statusIndicator.style.color = "#f87171";
  }
}

// Load More Click Handler
loadMoreBtn.addEventListener("click", () => {
  if (!isAllTimeMode && currentSearchQuery) {
    performQuerySearch(currentSearchQuery, currentPage + 1, true);
  }
});

// Live Suggestions Dropdown (2-3+ characters)
searchInput.addEventListener("input", (e) => {
  const query = e.target.value.trim();
  clearTimeout(debounceTimer);

  if (query.length < 2) {
    suggestionsBox.innerHTML = "";
    suggestionsBox.style.display = "none";
    return;
  }

  debounceTimer = setTimeout(async () => {
    if (!OMDB_API_KEY) return;

    const data = await searchMoviesByKeyword(query, 1);
    if (!data.Search || data.Search.length === 0) {
      suggestionsBox.innerHTML = `<li style="color: #94a3b8; cursor: default;">No matching titles found</li>`;
      suggestionsBox.style.display = "block";
      return;
    }

    suggestionsBox.innerHTML = "";
    data.Search.slice(0, 7).forEach((item) => {
      const li = document.createElement("li");
      const posterSrc =
        item.Poster && item.Poster !== "N/A"
          ? item.Poster
          : "https://via.placeholder.com/36x50?text=?";

      li.innerHTML = `
        <img src="${posterSrc}" alt="thumb" />
        <div>
          <div class="title">${item.Title}</div>
          <div class="meta">${item.Year} • ${item.Type.toUpperCase()}</div>
        </div>
      `;

      li.addEventListener("click", () => {
        searchInput.value = item.Title;
        suggestionsBox.style.display = "none";
        performQuerySearch(item.Title, 1, false);
      });

      suggestionsBox.appendChild(li);
    });

    suggestionsBox.style.display = "block";
  }, 250);
});

// Hide dropdown when clicking outside
document.addEventListener("click", (e) => {
  if (!searchInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
    suggestionsBox.style.display = "none";
  }
});

// Manual Search Execution
function executeSearch() {
  const query = searchInput.value.trim();
  if (!query) return;
  suggestionsBox.style.display = "none";

  filterButtons.forEach((b) => b.classList.remove("active"));
  performQuerySearch(query, 1, false);
}

searchBtn.addEventListener("click", executeSearch);
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") executeSearch();
});

// Filter Tabs Execution
filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const tabType = btn.dataset.type;
    if (tabType === "all-time") {
      loadAllTimeGrossers();
    } else {
      const queryVal = btn.dataset.value;
      performQuerySearch(queryVal, 1, false);
    }
  });
});

// API Key Storage
saveKeyBtn.addEventListener("click", () => {
  const key = apiKeyInput.value.trim();
  if (!key) return alert("Please enter your 8-character key.");
  localStorage.setItem("omdb_api_key", key);
  OMDB_API_KEY = key;
  keyStatus.textContent = "✅ Key saved successfully!";
  keyStatus.style.color = "#34d399";
  loadAllTimeGrossers();
});

function promptForApiKey() {
  movieGrid.innerHTML = `
    <div style="grid-column: 1/-1; text-align: center; color: #f87171; padding: 3rem;">
      <h3>🔑 API Key Required</h3>
      <p style="color: #94a3b8; margin-top: 0.5rem;">
        Paste your activated 8-character OMDb key above to fetch real-time records.
      </p>
    </div>
  `;
}

// Initial Boot
if (OMDB_API_KEY) {
  loadAllTimeGrossers();
} else {
  promptForApiKey();
}
