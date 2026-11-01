const moviesData = [
  {
    title: "Baahubali 2: The Conclusion",
    industry: "Tollywood",
    year: 2017,
    star: "Prabhas",
    director: "S. S. Rajamouli",
    grossINR: "1,810 Cr",
    verdict: "All Time Blockbuster",
  },
  {
    title: "RRR",
    industry: "Tollywood",
    year: 2022,
    star: "Jr NTR, Ram Charan",
    director: "S. S. Rajamouli",
    grossINR: "1,387 Cr",
    verdict: "Global Blockbuster",
  },
  {
    title: "Avatar",
    industry: "Hollywood",
    year: 2009,
    star: "Sam Worthington",
    director: "James Cameron",
    grossINR: "24,000+ Cr ($2.92B)",
    verdict: "All Time Worldwide #1",
  },
  {
    title: "Avengers: Endgame",
    industry: "Hollywood",
    year: 2019,
    star: "Robert Downey Jr",
    director: "Russo Brothers",
    grossINR: "23,000+ Cr ($2.79B)",
    verdict: "Historic Mega Hit",
  },
  {
    title: "Dangal",
    industry: "Bollywood",
    year: 2016,
    star: "Aamir Khan",
    director: "Nitesh Tiwari",
    grossINR: "2,024 Cr",
    verdict: "Historic Blockbuster",
  },
  {
    title: "Jawan",
    industry: "Bollywood",
    year: 2023,
    star: "Shah Rukh Khan",
    director: "Atlee",
    grossINR: "1,148 Cr",
    verdict: "All Time Blockbuster",
  },
  {
    title: "K.G.F: Chapter 2",
    industry: "Sandalwood",
    year: 2022,
    star: "Yash",
    director: "Prashanth Neel",
    grossINR: "1,250 Cr",
    verdict: "Industry Hit",
  },
  {
    title: "Kantara",
    industry: "Sandalwood",
    year: 2022,
    star: "Rishab Shetty",
    director: "Rishab Shetty",
    grossINR: "450 Cr",
    verdict: "Historic Blockbuster",
  },
  {
    title: "Jailer",
    industry: "Kollywood",
    year: 2023,
    star: "Rajinikanth",
    director: "Nelson Dilipkumar",
    grossINR: "605 Cr",
    verdict: "Mega Blockbuster",
  },
  {
    title: "Leo",
    industry: "Kollywood",
    year: 2023,
    star: "Thalapathy Vijay",
    director: "Lokesh Kanagaraj",
    grossINR: "612 Cr",
    verdict: "Blockbuster",
  },
  {
    title: "Demon Slayer: Mugen Train",
    industry: "Anime",
    year: 2020,
    star: "Natsuki Hanae (Voice)",
    director: "Haruo Sotozaki",
    grossINR: "4,150+ Cr ($507M)",
    verdict: "Highest Anime Grosser",
  },
];

let activeIndustry = "All";
let searchTerm = "";

const movieGrid = document.getElementById("movieGrid");
const movieCount = document.getElementById("movieCount");
const topGrosser = document.getElementById("topGrosser");
const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".filter-btn");

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
    movieGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #94a3b8; padding: 2rem;">No box office records match your filter.</p>`;
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
        <span class="gross">${movie.grossINR}</span>
        <span class="verdict-tag">${movie.verdict}</span>
      </div>
    `;
    movieGrid.appendChild(card);
  });
}

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

renderMovies();
