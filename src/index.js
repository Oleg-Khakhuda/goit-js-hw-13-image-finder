import NewsApiService from './js/apiService';
import LoadMoreBtn from './js/components/load-more-btn';
import imagesTpl from './templates/images.hbs';
import * as basicLightbox from 'basiclightbox';
import '../node_modules/basiclightbox/dist/basicLightbox.min.css';
import { alert, error } from '@pnotify/core';
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
refs.articlesContainer.addEventListener('click', openModal);

function onSearch(e) {
    e.preventDefault();
    newsApiService.query = e.currentTarget.elements.query.value;
    
    if (newsApiService.query === '') {
      return onFetchError();
    }
    
    clearImagesContainer();
    newsApiService.resetPage();
    onFetchRender();
}

function onFetchRender() {
    loadMoreBtn.disable()
    newsApiService.fetchImages().then(hits => {
      if (hits.length === 0) {
        loadMoreBtn.hide()
        return errorInput();
      }
      appendImagesMarkup(hits);
      loadMoreBtn.show();
    })
    .catch(error => console.log(error))
  }

function appendImagesMarkup(hits) {
  refs.articlesContainer.insertAdjacentHTML('beforeend', imagesTpl(hits));
}

function clearImagesContainer() {
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
        text: 'Вы ничего не ввели. Введите слово для поиска!',
        delay: 3000,
    });
}

function errorInput() {
    error({
        text: 'Неправельный ввод. Введите чтото нормальное!',
        delay: 3000,
    });
}

// Бесконечный скрол

function onEntry() {
    if (newsApiService.query !== '') {
        newsApiService.fetchImages().then(hits => {
            appendImagesMarkup(hits);
            newsApiService.incrementPage();
        });
    }
};

const observer = new IntersectionObserver(onEntry, {
  rootMargin: '100px',
});
  observer.observe(refs.scroll);
