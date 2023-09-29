/* const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    },
    params: {
        'api_key': APIKEY
    }
}) */

const checkLikedMovie = () => {
    const item = JSON.parse(localStorage.getItem('liked_movie'));
    let movies;
    if (item) {
        movies = item;
    } else {
        movies = {}
    }
    return movies
}

const likedMovie = (movie) => {
    const likedMovie = checkLikedMovie();
    if (likedMovie[movie.id]) {
        likedMovie[movie.id] = undefined
    } else {
        likedMovie[movie.id] = movie
    }
    localStorage.setItem('liked_movie', JSON.stringify(likedMovie))
}

const lazyLoader = new IntersectionObserver ((entries) => { 
    entries.forEach(element => {
        if (element.isIntersecting) {
            const url = element.target.getAttribute('data-img')
            element.target.setAttribute('src', url)  
        }
    })
})

const movieListPreview = async () => {
    const response = await fetch (`https://api.themoviedb.org/3/trending/movie/day?api_key=${APIKEY}`);
    const data = await response.json();
    const movies = data.results;
    console.log({data, movies});
    trendingMoviesPreviewList.innerHTML = null
    
    createMovies(movies, trendingMoviesPreviewList)
}

const categoryListPreview = async () => {
    const response = await fetch (`https://api.themoviedb.org/3/genre/movie/list?api_key=${APIKEY}`);
    const data = await response.json();
    const categories = data.genres;
    console.log({data, categories}); 
    categoriesPreviewList.innerHTML = null;
    categories.forEach(category => {
        categoriesPreviewList.innerHTML += printCategory(category.id, category.name);
    }); 
    const categoryContainer = document.querySelectorAll('.category-container').forEach(element => {
        element.addEventListener('click', (e) => {
            const categoryInfo = categoriesIteration(categories, e.target.innerHTML);
            location.hash = `#category=${categoryInfo.id}-${categoryInfo.name}`;
        })
    })
}   

const trendMovies = async () => {  
    genericSection.innerHTML = null
    const response = await fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${APIKEY}`);
    const data = await response.json();
    const movies = data.results;
    console.log('trends', movies)
    maxPage = data.total_pages
    createMovies(movies, genericSection)
}

const paginedTrendMovies = async () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
    const isNotMaxPage = page < maxPage;
    if (scrollIsBottom && isNotMaxPage) {
        page++
        const response = await fetch(`https://api.themoviedb.org/3/trending/movie/day?page=${page}&api_key=${APIKEY}`);
        const data = await response.json();
        const movies = data.results;
        console.log('pagined',movies)
        createMovies(movies, genericSection)
    }
}

    
const getMovieByGenres = async (id) => {
    genericSection.innerHTML = null 
    const response = await fetch(`https://api.themoviedb.org/3/discover/movie?with_genres=${id}&api_key=${APIKEY}`);
    const data = await response.json();
    const movies = data.results;
    maxPage = data.total_pages
    console.log(data.total_pages)
    console.log('trends', movies)
    createMovies(movies, genericSection)
}

const paginedGenreshMovies = (id) => {
    return async function () {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 50);
        const isNotMaxPage = page < maxPage;
        if (scrollIsBottom && isNotMaxPage) {
            page++
            const response = await fetch(`https://api.themoviedb.org/3/discover/movie?with_genres=${id}&page=${page}&api_key=${APIKEY}`);
            const data = await response.json();
            const movies = data.results;
            console.log('pagined',movies)
            createMovies(movies, genericSection)
        }
    }
}

const searchMovie = async (name) => {
    genericSection.innerHTML = null
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${name}&api_key=${APIKEY}`)
    const data = await response.json();
    const movies = data.results
    maxPage = data.total_pages
    console.log(data.total_pages)
    console.log('toSearch' ,movies);
    createMovies(movies, genericSection)
 } 

 const paginedSearchMovies = (name) => {
    return async function () {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
        const isNotMaxPage = page < maxPage;
        if (scrollIsBottom && isNotMaxPage) {
            page++
            const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${name}&page=${page}&api_key=${APIKEY}`);
            const data = await response.json();
            const movies = data.results;
            console.log('pagined',movies)
            createMovies(movies, genericSection)
        }
    }
}

 const printCategory = (id, name) => {
    const print = `
            <div class="category-container">
            <h3 id="id${id}" class="category-title Boton">${name}</h3>
            </div>
        `
        return print
 }

const printMovies = (title, path) => {
    const print = `
        <div class="movie-container">
            <img
                data-img="https://image.tmdb.org/t/p/w300${path}"
                class="movie-img"
                alt="${title}"
            />
            <button class="movie-btn"></button>
        </div>
        `
    return print
}

const movieDetail = async (id) => {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${APIKEY}`);
    const data = await response.json();
    const movieDetails = data;
    relatedMoviesContainer.innerHTML = null;
    movieDetailCategoriesList.innerHTML = null;
    movieDetailDescription.innerHTML = movieDetails.overview;
    movieDetailTitle.innerHTML = movieDetails.title;   
    movieDetailScore.innerHTML = Math.floor(movieDetails.vote_average)       
    const movieIMGURL = `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`   
    headerSection.style.background = `url(${movieIMGURL})`      
    movieDetails.genres.forEach(genre => {
        movieDetailCategoriesList.innerHTML += printCategory(genre.id, genre.name)
    })  
    printRelatedMovies(movieDetails.id)     
}

const printRelatedMovies = async (id) => {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${APIKEY}`);
    const data = await response.json();
    const movieRecomendation = data.results
    if(movieRecomendation.length === 0) {
        return relatedMoviesContainer.innerHTML = `We don't have enough data`
    }
    movieRecomendation.forEach(movie => {
        relatedMoviesContainer.innerHTML += printMovies(movie.title, movie.poster_path) 
    })
    const movieContainer = document.querySelectorAll('.movie-container').forEach(element => {
        element.addEventListener('click', (e) => {
            const movieInfo = moviesIteration(movieRecomendation, e.target.alt)
            location.hash = `#movie=${movieInfo.id}-${movieInfo.name}`
        })
    })
    const movieImg = document.querySelectorAll('.movie-img').forEach(element => {
        lazyLoader.observe(element)
        element.addEventListener('error', () => {
            element.setAttribute('src', 'https://thumbs.dreamstime.com/b/icono-del-error-16125237.jpg')
        })
    })
}

const moviesIteration = (arrayMovies, title) => {
    let id;
    let name;
    arrayMovies.forEach(movie => {
        if (movie.title === title) {
            id = movie.id
            name = movie.title
        }
    })
    return {id, name}
}

const movieCompleteIteration = (arrayMovies, title) => {
    let movies
    arrayMovies.forEach(movie => {
        if (movie.title === title) {
            movies = movie
        }
    })
    return movies
}


const categoriesIteration = (arrayCategorie, category) => {
    let id;
    let name;
    arrayCategorie.forEach(element => {
        if(element.name === category) {
            id = element.id;
            name = element.name;
        }
    })
    return {id, name};
}


const createMovies = (array, section) => {
    section.innerHTML
    array.forEach(movie => {
        section.innerHTML += printMovies(movie.title, movie.poster_path)
        const movieButton = document.querySelectorAll('.movie-btn').forEach((element) => {
            const arrayID = Object.values(checkLikedMovie())
            arrayID.find(find => {
                if(element.offsetParent !== null){
                    if(find.title === element.offsetParent.children[0].alt) {
                        element.classList.add('movie-btn--liked')
                    } 
                }
                
            })
            element.addEventListener('click', (e) => {
                console.log(e)
                element.classList.toggle('movie-btn--liked');
                const movieLikedInfo = movieCompleteIteration(array, e.target.parentElement.children[0].alt);
                likedMovie(movieLikedInfo); 
            })
        })
    })
    const movieImg = document.querySelectorAll('.movie-img').forEach(element => {
        lazyLoader.observe(element)
        element.addEventListener('error', () => {
            element.setAttribute('src', 'https://thumbs.dreamstime.com/b/icono-del-error-16125237.jpg')
        })
        element.addEventListener('click', (e) => {
            const movieInfo = moviesIteration(array, e.target.alt)
            location.hash = `#movie=${movieInfo.id}-${movieInfo.name}`
        })
    })
    
    


}

const sectionLikedMovieList = () => {
    likedMovieList.innerHTML = null
    const likedList = checkLikedMovie()
    const movieArrays = Object.values(likedList);
    console.log(movieArrays)
    
    createMovies(movieArrays, likedMovieList) 

    
}
