const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    },
    params: {
        'api_key': APIKEY
    }
})

const movieListPreview = async () => {
    trendingMoviesPreviewList.innerHTML = null
    const response = await fetch (`https://api.themoviedb.org/3/trending/movie/day?api_key=${APIKEY}`);
    const data = await response.json();
    const movies = data.results;
    console.log({data, movies});

    movies.forEach(movie => {
        const print = `
            <div class="movie-container">
                <img
                    src="https://image.tmdb.org/t/p/w300/${movie.poster_path}"
                    class="movie-img"
                    alt="${movie.title}"
                 />
            </div>
        `
        trendingMoviesPreviewList.innerHTML += print
    });
}

const categoryListPreview = async () => {
    categoriesPreviewList.innerHTML = null
    const {data} = await api ('genre/movie/list');
    const categories = data.genres;
    console.log({data, categories}); 

    categories.forEach(category => {
        const print = `
            <div class="category-container">
            <h3 id="id${category.id}" class="category-title">${category.name}</h3>
            </div>
        `
        
        categoriesPreviewList.innerHTML += print
    }); 
}

const trendMovies = async () => {
    genericSection.innerHTML = null
    const response = await fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${APIKEY}`);
    const data = await response.json();
    const movies = data.results;
    console.log('trends', movies)
    movies.forEach(movie => {
        const print = `
        <div class="movie-container">
            <img
                src="https://image.tmdb.org/t/p/w300/${movie.poster_path}"
                class="movie-img"
                alt="${movie.title}"
            />
        </div>
        `
        genericSectionClass.innerHTML += print
    })
}