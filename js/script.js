'use strict';

const templates = {
    articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
    tagArticleLink: Handlebars.compile(document.querySelector('#template-tag-article-link').innerHTML),
    authorArticleLink: Handlebars.compile(document.querySelector('#template-author-article-link').innerHTML),
    tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
    authorCloudLink: Handlebars.compile(document.querySelector('#template-author-cloud-link').innerHTML)
};

const select = {
    all: {
        articles: '.post',
        titles: '.post-title',
        linksTo: {
            tags: 'a[href^="#tag-"]',
            authors: 'a[href^="#author-"]',
        },
    },
    article: {
        tags: '.post-tags .list',
        author: '.post-author',
    },
    listOf: {
        titles: '.titles',
        tags: '.tags.list',
        authors: '.authors.list',
    },
};

const opts = {
    tagSizes: {
        count: 5,
        classPrefix: 'tag-size-',
    },
};


const calculateTagParams = (tags) => {
    const params = {
        min: 9999,
        max: 0
    };
    params.min = Math.min(...Object.values(tags));
    params.max = Math.max(...Object.values(tags));
    return params;
};

const calculateTagClass = (count, params) => {
    const diffCountMin = count - params.min;
    const diffMaxMin = params.max - params.min;
    const proportion = diffCountMin / diffMaxMin;
    const classNumber = Math.floor(proportion * (opts.tagSizes.count - 1) + 1);
    return opts.tagSizes.classPrefix + classNumber;
};


const generateTags = () => {
    const articles = document.querySelectorAll(select.all.articles);
    let allTags = {};


    for (let article of articles) {
        const tagsList = article.querySelector(select.article.tags);
        let html = '';
        const tags = article.getAttribute('data-tags').split(' ');
        tags.forEach(tag => {
            const tagArticleHTMLData = {
                tag: tag
            };
            const tagHTML = templates.tagArticleLink(tagArticleHTMLData);
            html = html + tagHTML;
            if (!{}.hasOwnProperty.call(allTags, tag)) {
                allTags[tag] = 1;
            } else {
                allTags[tag]++;
            }
        });

        tagsList.innerHTML = html;
    }

    const tagsParams = calculateTagParams(allTags);
    const allTagsHTMLData = {
        tags: []
    };
    for (let tag in allTags) {
        allTagsHTMLData.tags.push({
            tag: tag,
            count: allTags[tag],
            className: calculateTagClass(allTags[tag], tagsParams)
        });
    }

    const tagList = document.querySelector(select.listOf.tags);
    tagList.innerHTML = templates.tagCloudLink(allTagsHTMLData);
};
generateTags();

const tagClickHandler = (event) => {
    event.preventDefault();
    const clickedElement = event.target;

    const href = clickedElement.getAttribute('href');
    const tag = href.replace('#tag-', '');

    const activeTagLinks = document.querySelectorAll(select.all.linksTo.tags + '.active');
    for (let activeTagLink of activeTagLinks) {
        activeTagLink.classList.remove('active');
    }

    const currentTagLinks = document.querySelectorAll('a[href="' + href + '"]');
    for (let currentTagLink of currentTagLinks) {
        currentTagLink.classList.add('active');
    }

    generateTitleLinks('[data-tags~="' + tag + '"]');
};

const addClickListenersToTags = () => {
    const tagLinks = document.querySelectorAll(select.all.linksTo.tags);
    tagLinks.forEach(link => {
        link.addEventListener('click', tagClickHandler);
    });
};
addClickListenersToTags();

const titleClickHandler = (event) => {
    event.preventDefault();
    const clickedElement = event.currentTarget;

    const activeLinks = document.querySelectorAll(select.listOf.titles + ' a.active');
    for (let activeLink of activeLinks) {
        activeLink.classList.remove('active');
    }

    clickedElement.classList.add('active');

    const activeArticles = document.querySelectorAll(select.all.articles + '.active');
    for (let activeArticle of activeArticles) {
        activeArticle.classList.remove('active');
    }

    const currentTitleId = clickedElement.getAttribute('href');
    const currentArticle = document.querySelector(currentTitleId);


    currentArticle.classList.add('active');
};

const generateTitleLinks = (customSelector = '') => {

    const titleList = document.querySelector(select.listOf.titles);
    titleList.innerHTML = '';

    const articles = document.querySelectorAll(select.all.articles + customSelector);
    let titleListHTML = '';
    for (let article of articles) {
        const articleId = article.getAttribute('id');
        const articleTitle = article.querySelector(select.all.titles).innerHTML;
        const articleLinkHTMLData = {
            id: articleId,
            title: articleTitle
        };
        const articleLinkHTML = templates.articleLink(articleLinkHTMLData);
        titleListHTML = titleListHTML + articleLinkHTML;
    }
    titleList.innerHTML = titleListHTML;

    const links = document.querySelectorAll(select.listOf.titles + ' a');
    for (let link of links) {
        link.addEventListener('click', titleClickHandler);
    }
};
generateTitleLinks();


const generateAuthors = () => {
    const articles = document.querySelectorAll(select.all.articles);
    const allAuthors = {};

    for (let article of articles) {
        const author = article.getAttribute('data-author');
        const authorArticle = article.querySelector(select.article.author);
        const authorArticleHTMLData = {
            author: author,
            sanitizedAuthor: author.replace(/\s+/g, '-')
        };
        const authorArticleHTML = templates.authorArticleLink(authorArticleHTMLData);
        authorArticle.innerHTML = authorArticleHTML;
        if (!{}.hasOwnProperty.call(allAuthors, author)) {
            allAuthors[author] = 1;
        } else {
            allAuthors[author]++;
        }
    }

    const allAuthorsHTMLData = {
        authors: []
    };
    for (let author in allAuthors) {
        allAuthorsHTMLData.authors.push({
            author: author,
            sanitizedAuthor: author.replace(/\s+/g, '-'),
            count: allAuthors[author]
        });
    }

    const authorList = document.querySelector(select.listOf.authors);
    authorList.innerHTML = templates.authorCloudLink(allAuthorsHTMLData);
};
generateAuthors();

const authorClickHandler = (event) => {
    event.preventDefault();
    const clickedElement = event.target;

    const href = clickedElement.getAttribute('href');
    const author = href.replace('#author-', '').replace(/-/g, ' ');

    const activeAuthorLinks = document.querySelectorAll(select.all.linksTo.authors + '.active');
    for (let activeAuthorLink of activeAuthorLinks) {
        activeAuthorLink.classList.remove('active');
    }
    const currentAuthorLinks = document.querySelectorAll('a[href="' + href + '"]');
    for (let currentAuthorLink of currentAuthorLinks) {
        currentAuthorLink.classList.add('active');
    }
    generateTitleLinks(`[data-author="${author}"]`);
};

const addClickListenersToAuthors = () => {
    const authorLinks = document.querySelectorAll(select.all.linksTo.authors);
    authorLinks.forEach(link => {
        link.addEventListener('click', authorClickHandler);
    });
};

addClickListenersToAuthors();