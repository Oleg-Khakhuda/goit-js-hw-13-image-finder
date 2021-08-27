import NewsApiService from './js/apiService';
import LoadMoreBtn from './js/components/load-more-btn';
import imagesTpl from './templates/images.hbs';
import * as basicLightbox from 'basiclightbox';
import '../node_modules/basiclightbox/dist/basicLightbox.min.css';
import { alert } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import './sass/main.scss';

const refs = {
  searchForm: document.querySelector('.search-form'),
  articlesContainer: document.querySelector('.gallery'),
  element: document.querySelector('.btn-load-more'),
};

const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
    hidden: true,
  
});

const newsApiService = new NewsApiService();

refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', fetchImages);
refs.articlesContainer.addEventListener('click', openModal);
refs.element.addEventListener('click', onLoadMore)

function onSearch(e) {
    e.preventDefault();
    newsApiService.query = e.currentTarget.elements.query.value;
    
    if (newsApiService.query === '') {
      return onFetchError();
    }

    fetchImages();
    clearArticlesContainer();
    newsApiService.resetPage();
    loadMoreBtn.show();
    
  
}

function fetchImages() {
  loadMoreBtn.disable()
  newsApiService.fetchImages().then(hits => {
    appendArticlesMarkup(hits);
    loadMoreBtn.enable();
  })
    .catch(error => console.log(error))
}

function onLoadMore() {
  onScroll();
}

function appendArticlesMarkup(images) {
  refs.articlesContainer.insertAdjacentHTML('beforeend', imagesTpl(images));
}

function clearArticlesContainer() {
  refs.articlesContainer.innerHTML = '';
}

function openModal(event) {
    if (!event.target.classList.contains('image')) {
        return
    }
    const instance = basicLightbox.create(
            `<img src="${event.target.dataset.src}">`,
    );
        instance.show();
}

function onScroll() {
  setTimeout(() => {
    refs.element.scrollIntoView({
      block: 'start',
      behavior: 'smooth',
    });
  }, 250);
}

// Ненашли PNotify

function onFetchError() {
    alert({
        text: 'Упс, что-то пошло не так и мы ничего не нашли!',
        delay: 3000,
    });
}



