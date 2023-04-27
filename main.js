let news = [];
let page = 1;
let total_pages = 0;
let menus = document.querySelectorAll(".menus button");
menus.forEach((menu) =>
  menu.addEventListener("click", (event) => getNewsByTopic(event))
);

let searchButton = document.getElementById("search-button");
let url;

const getNews = async () => {
  try {
    let header = new Headers({
      "x-api-key": "fc397d67c3c14da2b18c58fea9081b47",
    });
    url.searchParams.set('page', page)
    console.log(url)
    let response = await fetch(url, { headers: header }); //ajax, http, fetch
    let data = await response.json();
    if(response.status == 200){
      news = data.articles;
      total_pages = data.totalResults
      console.log(data)
      render();
      pagenation();
    }else{
      throw new Error(data.message)
    }
    
  } catch (error) {
    console.log(error.message);
    errorRender(error.message)
  }
};

const getLatestNews = async () => {
  url = new URL(
    `https://newsapi.org/v2/top-headlines?country=us&apiKey=fc397d67c3c14da2b18c58fea9081b47&pageSize=10`
  );
  getNews();
};

const getNewsByTopic = async (event) => {
  let topic = event.target.textContent.toLowerCase();
  url = new URL(
    `https://newsapi.org/v2/top-headlines?country=us&apiKey=fc397d67c3c14da2b18c58fea9081b47&pageSize=10&category=${topic}`
  );
  getNews();
};

const getNewsByKeyword = async () => {
  let keyword = document.getElementById("search-input").value;
  url = new URL(
    `https://newsapi.org/v2/everything?q=${keyword}&apiKey=fc397d67c3c14da2b18c58fea9081b47&pageSize=10`
  );
  getNews();
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

const errorRender = (message) => {
  let errorHTML = `<div class="alert alert-danger text-center" role="alert">
  ${message}
</div>`
  document.getElementById("news-board").innerHTML = errorHTML;
}

const pagenation = () =>{
  let pagenationHTML =''
  let pageGroup = Math.ceil(page/5)
  let last = pageGroup*5
  let first = last -4
  pagenationHTML = `<li class="page-item">
  <a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(${page-1})">
    <span aria-hidden="true">&lt;</span>
  </a>
</li>`
  for(let i=first; i<=last; i++){
    pagenationHTML += `<li class="page-item ${page==i ? "active" : " "}"><a class="page-link" href="#" onclick="moveToPage(${i})">${i}</a></li>`
  
  }

  pagenationHTML += `<li class="page-item">
  <a class="page-link" href="#" aria-label="Next"onclick="moveToPage(${page+1})">
    <span aria-hidden="true">&gt;</span>
  </a>
</li>`
  document.querySelector(".pagination").innerHTML = pagenationHTML;
}

const moveToPage = (pageNum) => {
  page = pageNum
  getNews()
}

searchButton.addEventListener("click", getNewsByKeyword);
getLatestNews();
