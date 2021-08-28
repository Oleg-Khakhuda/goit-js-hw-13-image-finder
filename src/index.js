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
  elementBtn: document.querySelector('.btn-load-more'),
  scroll: document.querySelector('#scroll'),
};

const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
    hidden: true,
});

const newsApiService = new NewsApiService();

refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', onFetchLoadMore);
refs.articlesContainer.addEventListener('click', openModal);

function onSearch(e) {
    e.preventDefault();
    newsApiService.query = e.currentTarget.elements.query.value;
    
    if (newsApiService.query === '') {
      return onFetchError();
    }

    clearArticlesContainer();
    newsApiService.resetPage();
    onFetchLoadMore();
    loadMoreBtn.show(); 
}

function onFetchLoadMore() {
  if (newsApiService.query !== '') {
    loadMoreBtn.disable()
    newsApiService.fetchImages().then(hits => {
      appendImagesMarkup(hits);
      loadMoreBtn.enable();
    })
    .catch(error => console.log(error))
  }
}

function appendImagesMarkup(hits) {
  refs.articlesContainer.insertAdjacentHTML('beforeend', imagesTpl(hits));
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
  
// Ненашли PNotify

function onFetchError() {
    alert({
        text: 'Упс, что-то пошло не так и мы ничего не нашли!',
        delay: 3000,
    });
}

// Бесконечный скрол

const observer = new IntersectionObserver(onFetchLoadMore, {
  rootMargin: '150px',
});
observer.observe(refs.scroll);