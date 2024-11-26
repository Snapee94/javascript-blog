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

function generateTitleLinks(author = '', tag = '') {
    const titleList = document.querySelector('.titles');
    titleList.innerHTML = '';

    const articles = document.querySelectorAll('.post');

    for (let article of articles) {
        const articleId = article.getAttribute('id');
        const articleTitle = article.querySelector('.post-title').innerHTML;

        const articleTags = article.getAttribute('data-tags').split(' ');
        const articleAuthor = article.getAttribute('data-author');

        if ((author === '' || articleAuthor === author) && (tag === '' || articleTags.includes(tag))) {
            const linkHTML = `<li><a href="#${articleId}"><span>${articleTitle}</span></a></li>`;
            titleList.innerHTML += linkHTML;
            article.classList.add('active');
        } else {
            article.classList.remove('active');
        }
    }
}

function generateTags() {
    const optArticleTagsSelector = '.post-tags .list';

    const articles = document.querySelectorAll('.post');

    for (let article of articles) {
        const tagList = article.querySelector(optArticleTagsSelector);
        let html = '';

        const articleTags = article.getAttribute('data-tags');

        const articleTagsArray = articleTags.split(' ');

        for (let tag of articleTagsArray) {
            html += `<li><a href="#tag-${tag}">${tag}</a></li>`;
        }

        tagList.innerHTML = html;
    }
}

function tagClickHandler(event) {
    event.preventDefault();

    const clickedElement = this;

    const href = clickedElement.getAttribute('href');
    const tag = href.replace('#tag-', '');

    const activeTags = document.querySelectorAll('.post-tags a.active');
    for (let activeTag of activeTags) {
        activeTag.classList.remove('active');
    }

    const selectedTags = document.querySelectorAll(`a[href="${href}"]`);
    for (let selectedTag of selectedTags) {
        selectedTag.classList.add('active');
    }

    generateTitleLinks('', tag);
}

function authorClickHandler(event) {
    event.preventDefault();

    const clickedElement = this;

    const href = clickedElement.getAttribute('href');
    const author = href.replace('#author-', '');

    const activeAuthors = document.querySelectorAll('.post-author a.active');
    for (let activeAuthor of activeAuthors) {
        activeAuthor.classList.remove('active');
    }

    const selectedAuthors = document.querySelectorAll(`a[href="${href}"]`);
    for (let selectedAuthor of selectedAuthors) {
        selectedAuthor.classList.add('active');
    }

    generateTitleLinks(author);
}

function addClickListenersToTags() {
    const tagLinks = document.querySelectorAll('.post-tags a');

    for (let tagLink of tagLinks) {
        tagLink.addEventListener('click', tagClickHandler);
    }
}

function addClickListenersToAuthors() {
    const authorLinks = document.querySelectorAll('.post-author a');

    for (let authorLink of authorLinks) {
        authorLink.addEventListener('click', authorClickHandler);
    }
}

function generateAuthors() {
    const articles = document.querySelectorAll('.post');

    for (let article of articles) {
        const postAuthor = article.querySelector('.post-author');
        const authorName = postAuthor.innerText.trim();

        article.setAttribute('data-author', authorName);

        postAuthor.innerHTML = `<a href="#author-${authorName}">${authorName}</a>`;
    }
}

generateTitleLinks();
generateTags();
generateAuthors();
addClickListenersToTags();
addClickListenersToAuthors();
