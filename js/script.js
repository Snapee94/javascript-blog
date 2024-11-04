'use strict';

function titleClickHandler(event) {
    event.preventDefault();
    const clickedElement = this;

    const activeLinks = document.querySelectorAll('.titles a.active');
    for (let activeLink of activeLinks) {
        activeLink.classList.remove('active');
    }

    clickedElement.classList.add('active');

    const activeArticles = document.querySelectorAll('.posts .post.active');
    for (let activeArticle of activeArticles) {
        activeArticle.classList.remove('active');
    }

    const articleSelector = clickedElement.getAttribute('href');
    const targetArticle = document.querySelector(articleSelector);

    if (targetArticle) {
        targetArticle.classList.add('active');
    }
}

function generateTitleLinks() {
    const titleList = document.querySelector('.titles');
    titleList.innerHTML = '';

    const articles = document.querySelectorAll('.post');
    for (let article of articles) {
        const articleId = article.getAttribute('id');
        const articleTitle = article.querySelector('.post-title').innerHTML;
        const linkHTML = `<li><a href="#${articleId}"><span>${articleTitle}</span></a></li>`;
        titleList.innerHTML += linkHTML;
    }

    const links = document.querySelectorAll('.titles a');
    for (let link of links) {
        link.addEventListener('click', titleClickHandler);
    }
}

generateTitleLinks();