//所有電影資料 (Index API)：https://webdev.alphacamp.io/api/movies
//特定電影資料 (Show API)：https://webdev.alphacamp.io/api/movies/1
const BASE_URL = "https://webdev.alphacamp.io/";
const INDEX_URL = BASE_URL + "api/movies/";
const POSTER_URL = BASE_URL + "/posters/";

const movies = [];
let searchMovies = [];

const dataPanel = document.querySelector("#data-panel");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const movies_per_page = 12;
const pagination = document.querySelector(".pagination");
let pageRightNow = 1;

const listButton = document.querySelector(".list-button");
const cardButton = document.querySelector(".card-button");
let listOrCard = localStorage.getItem("list_or_card") || "card";

////串接API
axios
  .get(INDEX_URL)
  .then((response) => {
    movies.push(...response.data.results);
    if (listOrCard === "card") {
      renderMovieData(getMoviesByPage(1));
    } else {
      renderMovieData_listVersion(getMoviesByPage(1));
    }
    renderPaginator(movies.length);
  })
  .catch((err) => console.error(err));

////渲染成Card Version
cardButton.addEventListener("click", function cardButtonOnClick(event) {
  renderMovieData(getMoviesByPage(pageRightNow));
  listOrCard = "card";
  localStorage.setItem("list_or_card", listOrCard);

  //修改button屬性 顯示為被點擊的狀態
  event.target.classList.add("alt-btn-click");
  event.target.nextElementSibling.classList.remove("alt-btn-click");
});

////渲染成List Version
listButton.addEventListener("click", function listButtonOnClick(event) {
  renderMovieData_listVersion(getMoviesByPage(pageRightNow));
  listOrCard = "list";
  localStorage.setItem("list_or_card", listOrCard);

  //修改button屬性 顯示為被點擊的狀態
  event.target.classList.add("alt-btn-click");
  event.target.previousElementSibling.classList.remove("alt-btn-click");
});

////點擊more或收藏
dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-movie")) {
    showMovieModal(Number(event.target.dataset.id));
  } else if (event.target.matches(".btn-add-favorite")) {
    addToFavoaite(Number(event.target.dataset.id));
  }
});

////點擊paginator來選擇去哪個page
pagination.addEventListener("click", function paginatorOnClick(event) {
  if (event.target.tagName !== "A") return;
  pageRightNow = event.target.dataset.page;
  if (listOrCard === "card") {
    renderMovieData(getMoviesByPage(pageRightNow));
  } else if (listOrCard === "list") {
    renderMovieData_listVersion(getMoviesByPage(pageRightNow));
  }
  //頁數按鈕顯示功能
  event.target.parentElement.classList.toggle("active");
  const allPageButtons = Object.values(pagination.children);
  const inactivePage = allPageButtons.filter(
    (inactivePage) => inactivePage.dataset.page !== pageRightNow
  );
  inactivePage.forEach((page) => page.classList.remove("active"));
});

////搜尋電影名稱並重新渲染
searchForm.addEventListener("submit", function onSearchFormSubmitted(event) {
  event.preventDefault();
  const keyword = searchInput.value.trim().toLowerCase();
  if (keyword.length === 0) {
    alert("Please input some words!");
  } else {
    pageRightNow = 1;
    searchMovies = movies.filter((movie) =>
      movie.title.toLowerCase().includes(keyword)
    );
    if (searchMovies.length === 0) {
      alert(`找不到名稱含有${keyword}的電影，請換關鍵字後重新搜尋。`);
    } else {
      renderPaginator(searchMovies.length);
      if (listOrCard === "card") {
        renderMovieData(getMoviesByPage(pageRightNow));
      } else {
        renderMovieData_listVersion(getMoviesByPage(pageRightNow));
      }
    }
  }
});

////函式
function renderPaginator(amount) {
  let paginatorHTML = "";
  for (
    let page = 1;
    page <= Math.ceil(Number(amount / movies_per_page));
    ++page
  ) {
    paginatorHTML += `<li class="page-item" data-page="${page}"><a class="page-link " href="#" data-page="${page}">${page}</a></li>`;
  }
  pagination.innerHTML = paginatorHTML;
}

function getMoviesByPage(page) {
  const data =
    searchMovies.length && searchMovies.length !== 0 ? searchMovies : movies;
  console.log(data);
  const startIndex = (page - 1) * movies_per_page;
  return data.slice(startIndex, startIndex + movies_per_page);
}

function addToFavoaite(id) {
  const list = JSON.parse(localStorage.getItem("favoriteMovies", id)) || [];
  const movie = movies.find((movie) => movie.id === id);
  if (list.some((movie) => id === movie.id)) {
    return alert("這部電影已經加入收藏中。");
  }
  list.push(movie);
  localStorage.setItem("favoriteMovies", JSON.stringify(list));
}

function showMovieModal(id) {
  const modalTitle = document.querySelector(".modal-title");
  const modalDate = document.querySelector(".modal-date");
  const modalDescription = document.querySelector(".modal-description");
  const modalImage = document.querySelector(".modal-image");
  modalTitle.innerText = "";
  modalDate.innerText = "";
  modalDescription.innerText = "";
  modalImage.src = "";
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
                <button class="btn btn-info btn-add-favorite" data-id="${
                  item.id
                }">+</button>
              </div>
            </div>
          </div>
        </div>`;
  });
  dataPanel.innerHTML = rawHtml;
}
function renderMovieData_listVersion(data) {
  let rawHtml = `<ul class="data-list">`;
  data.forEach((item) => {
    rawHtml += ` <li class="data-in-list" data-id=${item.id}>${item.title}
    <div class="functional-buttons">
    <button class="btn btn-primary btn-show-movie"
                  data-id=${item.id}
                  data-bs-toggle="modal"
                  data-bs-target="#movie-modal"
                >
                  more
                </button>
                <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button></div></li>`;
  });
  rawHtml += `</ul>`;
  dataPanel.innerHTML = rawHtml;
}
