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
        
    });
    const movieContainer = document.querySelectorAll('movie-container').forEach(element => {
        element.addEventListener('click', (e) => {
            console.log(e)
        })
    })
    console.log('09/20/23',movieIMG);
    movies.forEach(movie => {
        
        movieDetail(movie.id, movie.title, movie.overview, movie.vote_average, movie.genre_ids, movie.poster_path)
    })
}

const categoryListPreview = async () => {
    categoriesPreviewList.innerHTML = null
    const response = await fetch (`https://api.themoviedb.org/3/genre/movie/list?api_key=${APIKEY}`);
    const data = await response.json()
    const categories = data.genres;
    console.log({data, categories}); 

    categories.forEach(category => {
       
        categoriesPreviewList.innerHTML += printCategory(category.id, category.name)
        botones = document.querySelectorAll('.Boton') 
    }); 

    categories.forEach(category => {
        botones.forEach(element => {
            element.addEventListener('click', (e) => {
                if(`id${category.id}` === e.srcElement.id) {
                location.hash = `#category=${category.id}-${category.name}`
                console.log(category);
                headerCategoryTitle.innerHTML = category.name
                getMovieByGenres(category.id)
                }
            })
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
        movieIMG = document.querySelectorAll('.movie-img')
    })
    headerCategoryTitle.innerHTML = 'Tendencias'
    movies.forEach(movie => {
        movieDetail(movie.id, movie.title, movie.overview, movie.vote_average, movie.genre_ids, movie.poster_path)
    })
}

const getMovieByGenres = async (id) => {
   
    genericSection.innerHTML = null 
    const response = await fetch(`https://api.themoviedb.org/3/discover/movie?with_genres=${id}&api_key=${APIKEY}`);
    const data = await response.json();
    const movies = data.results;
    console.log('trends', movies)

    movies.forEach(movie => {
        genericSectionClass.innerHTML += printMovies(movie.title, movie.poster_path)
        movieIMG = document.querySelectorAll('.movie-img')
    })
    movies.forEach(movie => {
        movieDetail(movie.id, movie.title, movie.overview, movie.vote_average, movie.genre_ids, movie.poster_path)
    })
}

const searchMovie = async () => {
    
    genericSectionClass.innerHTML = null
    
    const toSearch = searchFormInput.value.trimEnd();
    if (searchFormInput.value === '') {
        trendMovies()
    }
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${toSearch}&api_key=${APIKEY}`)
    const data = await response.json();
    const movies = data.results
    console.log('toSearch' ,movies);
    movies.forEach(movie => {
        genericSectionClass.innerHTML += printMovies(movie.title, movie.poster_path)
        movieIMG = document.querySelectorAll('.movie-img')
    })
    movies.forEach(movie => {
        console.log(movie);
        movieDetail(movie.id, movie.title, movie.overview, movie.vote_average, movie.genre_ids, movie.poster_path)
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
            src="https://image.tmdb.org/t/p/w300/${path}"
            class="movie-img movieRelated"
            alt="${title}"
        />
    </div>
    `
    return print
}

const movieDetail = async (id, title, movieDescriptor, score, arrayGenre, path) => {
    const response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${APIKEY}`);
    const data = await response.json()
    const categories = data.genres
    
    relatedMoviesContainer.innerHTML = null
    movieIMG.forEach(element => {
        element.addEventListener('click', (e) => {
           
            
            
            if (e.target.alt === title) {
            
            console.log(arrayGenre);
            location.hash = `#movie=${id}-${title}`
            movieDetailCategoriesList.innerHTML = null
            movieDetailDescription.innerHTML = movieDescriptor
            movieDetailTitle.innerHTML = title
            movieDetailScore.innerHTML = Math.floor(score)
            printRelatedMovies(e.target.alt, arrayGenre)
            arrayGenre.forEach(category => {
            const movieIMGURL = `https://image.tmdb.org/t/p/w500/${path}`   
            headerSection.style.background = `url(${movieIMGURL})`
            console.log(movieIMGURL)
                categories.forEach(cat => {
                    if (cat.id === category) {
                        movieDetailCategoriesList.innerHTML += printCategory(category, cat.name)
                        
                    }
                    
                })    
            }) 
             
            } 
            
        })
        
   })
   

}

const printRelatedMovies = async (nameMovie, arrayGenre) => {
    const random = Math.floor(Math.random() * arrayGenre.length -1)
    
   const response2 = await fetch(`https://api.themoviedb.org/3/discover/movie?with_genres=${arrayGenre[random]}&api_key=${APIKEY}`);
    const data2 = await response2.json();
    const movies = data2.results;
    console.log('09/20/23, print', movies);
    movies.forEach(movie => {
        
        if(nameMovie !== movie.title) {
        relatedMoviesContainer.innerHTML += printMovies(movie.title, movie.poster_path)
        
        }  
        
    })
    movies.forEach(movie => {
        const movieContainer = document.querySelectorAll('.movie-container').forEach( movietoSelect => {
            movietoSelect.addEventListener('click', (e) => {

                console.log(e.target.alt)
                console.log('desesperacion', movie);
                if (e.target.alt === movie.title) {
                    movieDetailCategoriesList.innerHTML = null
                    location.hash = `#movie=${movie.id}-${movie.title}`
                    movieDetailCategoriesList.innerHTML = null
                    movieDetailDescription.innerHTML = movie.overview
                    movieDetailTitle.innerHTML = movie.title
                    movieDetailScore.innerHTML = Math.floor(movie.vote_average)
                    
                    movieDetailCategoriesList.innerHTML += printCategory(movie.id, movie.title)

                }
            })
        })
    })
    
}
