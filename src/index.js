import NewsApiService from './js/apiService';
import LoadMoreBtn from './js/components/load-more-btn';
import articlesTpl from './templates/articles.hbs';
import * as basicLightbox from 'basiclightbox';
import 'basiclightbox/dist/basicLightbox.min.css';
import { alert } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';

import './sass/main.scss';

const refs = {
  searchForm: document.querySelector('.search-form'),
    articlesContainer: document.querySelector('.gallery'),
    element: document.getElementById('.btn-load-more'),
};

const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
    hidden: true,
  
});

const newsApiService = new NewsApiService();


refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', fetchArticles);
refs.articlesContainer.addEventListener('click', openModal);

function onSearch(e) {
  e.preventDefault();

  newsApiService.query = e.currentTarget.elements.query.value;

  if (newsApiService.query === '') {
    return onFetchError();
  }

  loadMoreBtn.show();
    newsApiService.resetPage();
  clearArticlesContainer();
    fetchArticles();
    
}

function fetchArticles() {
  loadMoreBtn.disable();
    newsApiService.fetchArticles().then(articles => {
        appendArticlesMarkup(articles);
        loadMoreBtn.enable();
        scrollToRenderedMarkup()
    })
    .catch(error => console.log(error))
}

function appendArticlesMarkup(articles) {
  refs.articlesContainer.insertAdjacentHTML('beforeend', articlesTpl(articles));
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

function scrollToRenderedMarkup() {
  setTimeout(() => {
    loadMoreBtn.refs.button.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
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



