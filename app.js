let moviesData = [];
let activeIndustry = "All";
let searchTerm = "";

const movieGrid = document.getElementById("movieGrid");
const movieCount = document.getElementById("movieCount");
const topGrosser = document.getElementById("topGrosser");
const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".filter-btn");

// Live Data Fetcher
async function fetchBoxOfficeData() {
  movieGrid.innerHTML = `
    <div style="grid-column: 1/-1; text-align: center; color: #38bdf8; padding: 3rem;">
      <p style="font-size: 1.2rem;">⚡ Syncing real-time global box office data...</p>
    </div>
  `;

  try {
    // Fetches live JSON file (acts as an API endpoint)
    const res = await fetch("./data.json?cache_bypass=" + Date.now());
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    moviesData = await res.json();
    renderMovies();
  } catch (error) {
    console.error("Failed to load records:", error);
    movieGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; color: #ef4444; padding: 2rem;">
        <p>⚠️ Failed to load real-time box office data.</p>
        <small style="color: #94a3b8;">Make sure you are running via a local server (e.g. VS Code Live Server).</small>
      </div>
    `;
  }
}

function renderMovies() {
  const filtered = moviesData.filter((movie) => {
    const matchesIndustry =
      activeIndustry === "All" || movie.industry === activeIndustry;
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      movie.title.toLowerCase().includes(term) ||
      movie.star.toLowerCase().includes(term) ||
      movie.director.toLowerCase().includes(term);

    return matchesIndustry && matchesSearch;
  });

  movieCount.textContent = filtered.length;
  topGrosser.textContent = filtered.length > 0 ? filtered[0].title : "None";

  movieGrid.innerHTML = "";

  if (filtered.length === 0) {
    movieGrid.innerHTML = `
      <p style="grid-column: 1/-1; text-align: center; color: #94a3b8; padding: 2.5rem;">
        No box office records match your filter.
      </p>
    `;
    return;
  }

  filtered.forEach((movie) => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <div>
        <div class="card-header">
          <h2 class="card-title">${movie.title}</h2>
          <span class="industry-pill">${movie.industry}</span>
        </div>
        <div class="card-meta">
          <div><strong>Year:</strong> ${movie.year}</div>
          <div><strong>Cast:</strong> ${movie.star}</div>
          <div><strong>Director:</strong> ${movie.director}</div>
        </div>
      </div>
      <div class="card-footer">
        <div style="display: flex; flex-direction: column;">
          <span class="gross">${movie.grossINR}</span>
          <small style="color: #64748b; font-size: 0.75rem;">Global: ${movie.grossUSD}</small>
        </div>
        <span class="verdict-tag">${movie.verdict}</span>
      </div>
    `;
    movieGrid.appendChild(card);
  });
}

// Event Listeners
searchInput.addEventListener("input", (e) => {
  searchTerm = e.target.value.trim();
  renderMovies();
});

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    activeIndustry = btn.dataset.industry;
    renderMovies();
  });
});

// Initial boot
fetchBoxOfficeData();
