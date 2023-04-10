const BASE_URL = "https://webdev.alphacamp.io/";
const INDEX_URL = BASE_URL + "api/movies/";
const POSTER_URL = BASE_URL + "/posters/";
const movies = JSON.parse(localStorage.favoriteMovies);
const dataPanel = document.querySelector("#data-panel");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
//串接檔API
// axios
//   .get(INDEX_URL)
//   .then((response) => {
//     movies.push(...response.data.results);
//     renderMovieData(movies);
//   })
//   .catch((err) => console.error(err));
//點擊more或收藏
dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-movie")) {
    showMovieModal(Number(event.target.dataset.id));
  } else if (event.target.matches(".btn-remove-favorite")) {
    removeFromFavorite(Number(event.target.dataset.id));
    renderMovieData(movies);
  }
});

renderMovieData(movies);
//搜尋電影名稱並重新渲染
// searchForm.addEventListener("submit", function onSearchFormSubmitted(event) {
//   event.preventDefault();
//   const keyword = searchInput.value.trim().toLowerCase();
//   if (keyword.length === 0) {
//     alert("Please input some words!");
//   }
//   const searchMovies = movies.filter((movie) =>
//     movie.title.toLowerCase().includes(keyword)
//   );
//   if (searchMovies.length === 0) {
//     alert(`找不到名稱含有${keyword}的電影，請換關鍵字後重新搜尋。`);
//   } else {
//     renderMovieData(searchMovies);
//   }
// });

function removeFromFavorite(id) {
  const movieIndex = movies.findIndex((movie) => movie.id === id);
  movies.splice(movieIndex, 1);
  localStorage.setItem("favoriteMovies", JSON.stringify(movies));
}

function showMovieModal(id) {
  const modalTitle = document.querySelector(".modal-title");
  const modalDate = document.querySelector(".modal-date");
  const modalDescription = document.querySelector(".modal-description");
  const modalImage = document.querySelector(".modal-image");

  axios
    .get(INDEX_URL + id)
    .then((responses) => {
      const response = responses.data.results;
      modalTitle.innerText = response.title;
      modalDate.innerText = response.release_date;
      modalDescription.innerText = response.description;
      modalImage.src = POSTER_URL + response.image;
    })
    .catch((err) => {
      console.error(err);
    });
}
function renderMovieData(data) {
  let rawHtml = "";
  data.forEach((item) => {
    rawHtml += `<div class="col-sm-3">
          <div class="mb-2">
            <div class="card" style="width: 18rem">
              <img
                src=${POSTER_URL + item.image}
                class="card-img-top"
                alt="Movie Poster"
              />
              <div class="card-body">
                <h5 class="card-title">${item.title}</h5>
              </div>
              <div class="card-footer">
                <button
                  class="btn btn-primary btn-show-movie"
                  data-id=${item.id}
                  data-bs-toggle="modal"
                  data-bs-target="#movie-modal"
                >
                  more
                </button>
                <button class="btn btn-danger btn-remove-favorite" data-id="${
                  item.id
                }">X</button>
              </div>
            </div>
          </div>
        </div>`;
  });
  dataPanel.innerHTML = rawHtml;
}
