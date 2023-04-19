
const base_URL_1 = 'https://api.themoviedb.org/4/list/1?page=1&api_key='
const base_URL_2 ='https://api.themoviedb.org/3/trending/movie/week?api_key='
const API_key = '93250fa0b0d6c6b62faf215456b1be93'
const IMG_URL ='https://image.tmdb.org/t/p/w500/'
const GENRE_URL = 'https://api.themoviedb.org/3/genre/movie/list?api_key='
const main = document.getElementById('main')

let prevDesc = null;
let prevIcon = null;

class myClass{
    cardDisp(results,genres){
        const main =document.getElementById('main')
        main.innerHTML = ''
        results.forEach(movie => {
            let release_date = new Date(movie.release_date) 
            let card = document.createElement('div')
            card.classList.add('card')
            card.innerHTML = 
            `
            <img src="${IMG_URL}${movie.poster_path}">
            <div class="desc" id="movie_details${movie.id}">
                <h1>${movie.title}<span>(${release_date.getFullYear()})</span></h1>
                <div class="dropdown_icon">
                <i id="drop_icon${movie.id}" class="fa fa-caret-up fa-2x" aria-hidden="true"  onclick="Obj.movie_description(${movie.id},event)" id="dropUp_icon">
                </i>
            
                </div>
                <h3 class="rate">Ratings:<span id="rate_${movie.id}">${movie.vote_average}</span></h3>
                <h3 class="genre"> Genre:<span id="genre_${movie.id}">  </span></h3>
                <h3 id="overview">Plot:<span>${movie.overview}</span></h3>

            </div>
            `
            main.appendChild(card)
            
            let rate = document.getElementById(`rate_${movie.id}`)
            if (rate) {
                if (movie.vote_average >= 7) {
                    rate.style.color = 'orange'
                }else {
                    rate.style.color = 'red'
                }
            }

        });
        let genereArr = genres.genres
            results.forEach(movie => {
                let movie_genre = [];
                for(let i = 0; i<movie.genre_ids.length; i++){
                    genereArr.forEach(element => {
                        if(element.id == movie.genre_ids[i]){
                            movie_genre.push(element.name)
                        }
                    });
                }
                document.getElementById(`genre_${movie.id}`).innerHTML = movie_genre.join(", ")
            });
    }

    movie_description(movieId,_event){
        let desc = document.getElementById(`movie_details${movieId}`)
        let drop_icon =document.getElementById(`drop_icon${movieId}`)
        let DescListner = function(){
            desc.style.transform = 'translateY(-100%)'
            desc.style.transition ='transform 0.5s ease-in'
            desc.style.background = 'rgb(0, 0, 0, 0.7)'
            drop_icon.classList.remove('fa-caret-up')
            drop_icon.classList.add('fa-caret-down')
            drop_icon.addEventListener('mouseover', () =>{
                drop_icon.style.cursor = 'pointer'
            })
        }
        let prevDescListner = function(){
            prevDesc.style.transform = 'translateY(0%)'
            prevDesc.style.transition ='transform 0.5s ease-in'
            drop_icon.classList.remove('fa-caret-down')
            drop_icon.classList.add('fa-caret-up')        
        }
        
        if(prevDesc == null){
            DescListner()
            prevDesc = desc
        }else if(prevDesc !==null && prevDesc !== desc){
            DescListner()
            prevDescListner()
            prevDesc = desc
        }
        else if(prevDesc !==null && prevDesc == desc){
            prevDescListner()
            prevDesc = null;
            desc = null;
        }
    }

    search_movie(results, genres){
        let search_query = document.getElementById('search_bar').value.trim().toLowerCase();
        let search_result = [];

        results.forEach(movie => {
        if (new RegExp(search_query).test(movie.title.toLowerCase())) {
                search_result.push(movie);
            }
        });
        if(search_result.length > 0) {
            Obj.cardDisp(search_result,genres);
        } else {
            Obj.cardDisp(results,genres);
        }
    }


}


let Obj = new myClass;
let storedData_1 = JSON.parse(localStorage.getItem("JSon_Data_1"));
let storedData_2 = JSON.parse(localStorage.getItem("JSon_Data_2"));
let storedGenre = JSON.parse(localStorage.getItem("Genre_Data"));
let storedData = []
if(!storedData_1 && !storedData_2 && !storedGenre){
    fetch(base_URL_1 + API_key).then(response => response.json()).then(data =>{
    let StrObject = JSON.stringify(data);
    localStorage.setItem('JSon_Data_1', StrObject);
    let storedData_1 = JSON.parse(localStorage.getItem("JSon_Data"))
    storedData.push(storedData_1.results);})

    fetch(base_URL_2 + API_key).then(response => response.json()).then(data =>{
    let StrObject = JSON.stringify(data);
    localStorage.setItem('JSon_Data_2', StrObject);
    let storedData_2 = JSON.parse(localStorage.getItem("JSon_Data_2"))
    storedData.push(storedData_2.results)})

    fetch(GENRE_URL + API_key + '&language=en-US').then(response => response.json()).then(data => {
    let StrObject = JSON.stringify(data);
    localStorage.setItem('Genre_Data', StrObject);
    storedGenre = JSON.parse(localStorage.getItem("Genre_Data"));
    });

    class_handler(storedData, storedGenre)
} else {
    storedData = storedData_1.results.concat(storedData_2.results)
    class_handler(storedData, storedGenre);
}

function class_handler(results, genres) {
  Obj.cardDisp(results, genres);
  document.getElementById('search_icon').addEventListener('click',function() {
      Obj.search_movie(results, genres);
  });
  document.querySelector('form').addEventListener('submit',(e)=> {
    e.preventDefault();
    Obj.search_movie(results, genres);
});
}


