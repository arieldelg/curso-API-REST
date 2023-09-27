let page = 1
let infiniteScroll;
let maxPage;

searchFormBtn.addEventListener('click', () => {
    location.hash = '#search=' + searchFormInput.value;
    
});

arrowBtn.addEventListener('click', () => {
    if (location.hash === `#search=${searchFormInput.value}`) {
        return location.hash = '#home'
    } else {
        history.back()
    }
        
});

trendingBtn.addEventListener('click', () => {
    location.hash = '#trends';
})


const navigator = () => {
    if (infiniteScroll) {
        window.removeEventListener('scroll', infiniteScroll, {passive: false})
        infiniteScroll = undefined
    }
    if(location.hash.startsWith('#trends')) {
        trendsPage();
    } else if (location.hash.startsWith('#search=')) {
        searchPage();
    } else if (location.hash.startsWith('#movie=')) {
        moviePage();
    } else if (location.hash.startsWith('#category=')) {
        categoryPage();
    } else {
        homePage();
    }
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0; 

    if (infiniteScroll) {
        window.addEventListener('scroll', infiniteScroll, {passive: false})
    }
}

const trendsPage = () => {
    console.log('TRENDS!!');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');
    liked.classList.add('inactive')
  
    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');
    headerCategoryTitle.innerHTML = 'Tendencias'
    trendMovies()
    infiniteScroll = paginedTrendMovies
}

const searchPage = () => {
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');
    liked.classList.add('inactive')
  
    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');
    const [search, name] = location.hash.split('=')
    searchMovie(name)
    infiniteScroll = paginedSearchMovies(name);
}

const moviePage = () => {
    headerSection.classList.add('header-container--long');
    // headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.add('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.add('inactive');
    liked.classList.add('inactive')
  
    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.remove('inactive');
    const [movie, idName] = location.hash.split('=')
    const [id, name] = idName.split('-')
    movieDetail(id, name)
}

const categoryPage = () => {
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');
    liked.classList.add('inactive')

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');
    const [category, idName] = location.hash.split('=');
    const [id, name] = idName.split('-');
    headerCategoryTitle.innerHTML = name
    getMovieByGenres(id) 
    infiniteScroll = paginedGenreshMovies(id)
}

const homePage = () => {
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';

    arrowBtn.classList.add('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.remove('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');
    liked.classList.remove('inactive')

    trendingPreviewSection.classList.remove('inactive');
    categoriesPreviewSection.classList.remove('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.add('inactive');
    
    movieListPreview();
    categoryListPreview();
}

window.addEventListener('DOMContentLoaded', navigator, false)
window.addEventListener('hashchange', navigator, false)
window.addEventListener('scroll', infiniteScroll, false)

