let news = [];
let menus = document.querySelectorAll(".menus button");
menus.forEach((menu) =>
  menu.addEventListener("click", (event) => getNewsByTopic(event))
);

let searchButton = document.getElementById("search-button");
let url;

const getNews = async() => {
  let header = new Headers({
    "x-api-key": "fc397d67c3c14da2b18c58fea9081b47",
  });

  let response = await fetch(url, { headers: header }); //ajax, http, fetch
  let data = await response.json();
  news = data.articles;

  render();
}

const getLatestNews = async () => {
  url = new URL(
    `https://newsapi.org/v2/top-headlines?country=us&apiKey=fc397d67c3c14da2b18c58fea9081b47&pageSize=10`
  );
  getNews()
};

const getNewsByTopic = async (event) => {
  let topic = event.target.textContent.toLowerCase();
  url = new URL(
    `https://newsapi.org/v2/top-headlines?country=us&apiKey=fc397d67c3c14da2b18c58fea9081b47&pageSize=10&category=${topic}`
  );
  getNews()
};

const getNewsByKeyword = async() => {
  let keyword = document.getElementById("search-input").value;
  url = new URL(
    `https://newsapi.org/v2/everything?q=${keyword}&apiKey=fc397d67c3c14da2b18c58fea9081b47&pageSize=10`
  );
  getNews()
};

const render = () => {
  let newsHTML = ``;
  let now = moment();
  newsHTML = news; // news는 array
  newsHTML = news
    .map((item) => {
      // item은 news에 있는 각각의 아이템
      return `<div class="row news">
        <div class="col-lg-4">
            <img class="news-img-size" src="${
              item.urlToImage ||
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU"
            }"/>
        </div>
        <div class="col-lg-8">
            <h2>${item.title}</h2>
            <p>
                ${item.description || "내용 없음"}
            </p>
            <div>
                ${item.author || "no source"} , ${now.diff(
        moment(item.publishedAt),
        "hours"
      )} hours ago
            </div>
        </div>
    </div>`;
    })
    .join("");

  document.getElementById("news-board").innerHTML = newsHTML;
};

searchButton.addEventListener("click", getNewsByKeyword);
getLatestNews();
