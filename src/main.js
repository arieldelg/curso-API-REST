/* const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    },
    params: {
        'api_key': APIKEY
    }
}) */

let botones = []
let movieIMG = []


const movieListPreview = async () => {
    trendingMoviesPreviewList.innerHTML = null
    const response = await fetch (`https://api.themoviedb.org/3/trending/movie/day?api_key=${APIKEY}`);
    const data = await response.json();
    const movies = data.results;
    console.log({data, movies});
    movies.forEach(movie => {
        trendingMoviesPreviewList.innerHTML += printMovies(movie.title, movie.poster_path)
        const movieContainer = document.querySelectorAll('.movie-container').forEach(element => {
            element.addEventListener('click', (e) => {
            const movieInfo = moviesIteration(movies, e.target.alt)
            location.hash = `#movie=${movieInfo.id}-${movieInfo.name}` 
            })
        })
    });
}

const categoryListPreview = async () => {
    categoriesPreviewList.innerHTML = null;
    const response = await fetch (`https://api.themoviedb.org/3/genre/movie/list?api_key=${APIKEY}`);
    const data = await response.json();
    const categories = data.genres;
    console.log({data, categories}); 
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
    movies.forEach(movie => {
        genericSectionClass.innerHTML += printMovies(movie.title, movie.poster_path)
    })
    const movieContainer = document.querySelectorAll('.movie-container').forEach(element => {
        element.addEventListener('click', (e) => {
            const movieInfo = moviesIteration(movies, e.target.alt)
            location.hash = `#movie=${movieInfo.id}-${movieInfo.name}`
        })
    })
}

const getMovieByGenres = async (id) => {
    genericSection.innerHTML = null 
    const response = await fetch(`https://api.themoviedb.org/3/discover/movie?with_genres=${id}&api_key=${APIKEY}`);
    const data = await response.json();
    const movies = data.results;
    console.log('trends', movies)
    movies.forEach(movie => {
        genericSectionClass.innerHTML += printMovies(movie.title, movie.poster_path);
    })
    const movieContainer = document.querySelectorAll('.movie-container').forEach(element => {
        element.addEventListener('click', (e) => {
            const movieInfo = moviesIteration(movies, e.target.alt);
            location.hash = `#movie=${movieInfo.id}-${movieInfo.name}` 
        })
    })
} 

const searchMovie = async (name) => {
    
    genericSectionClass.innerHTML = null
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${name}&api_key=${APIKEY}`)
    const data = await response.json();
    const movies = data.results
    console.log('toSearch' ,movies);
     
    movies.forEach(movie => {
        genericSectionClass.innerHTML += printMovies(movie.title, movie.poster_path)
        
    }) 
   const movieContainer = document.querySelectorAll('.movie-container').forEach(element => {
    element.addEventListener('click', (e) => {
        console.log(e)
        const movieInfo = moviesIteration(movies, e.target.alt);
            location.hash = `#movie=${movieInfo.id}-${movieInfo.name}` 
    })
   })
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
                src="https://image.tmdb.org/t/p/w300${path}"
                class="movie-img movieRelated"
                alt="${title}"
            />
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