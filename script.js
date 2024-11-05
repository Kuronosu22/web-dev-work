let currentArticleCount = 0; 
let allArticles = []; 
const apiKey = '9976c07c18ab4f9c86b82366e5a8dd05'; 

async function fetchNews() {
    try {
        const response = await fetch(`https://newsapi.org/v2/everything?q=tech&from=2024-10-05&sortBy=publishedAt&language=pt&apiKey=${apiKey}`);
        
        if (!response.ok) {
            throw new Error('Erro na resposta da API: ' + response.status);
        }

        const data = await response.json();
        console.log(data); 

        if (data.articles && data.articles.length > 0) {
            
            allArticles = data.articles.filter(article => article.urlToImage && article.description);
            currentArticleCount = 0; 
            loadMoreArticles(); 
        } else {
            document.getElementById('newsContainer').innerHTML = '<p>Nenhuma notícia disponível.</p>';
        }
    } catch (error) {
        console.error('Erro ao buscar as notícias:', error);
    }
}

function calculateCardsToLoad() {
    const containerWidth = document.getElementById('newsContainer').clientWidth; 
    const cardWidth = 280; 
    const gap = 20; 
    const cardsPerRow = Math.floor((containerWidth + gap) / (cardWidth + gap)); 

    return Math.min(cardsPerRow * 3, allArticles.length - currentArticleCount);
}

function loadMoreArticles() {
    const newsContainer = document.getElementById('newsContainer');
    const articlesToLoad = calculateCardsToLoad(); 

    if (articlesToLoad <= 0) return; 

    const articlesToShow = allArticles.slice(currentArticleCount, currentArticleCount + articlesToLoad); 

    articlesToShow.forEach(article => {
        const articleCard = document.createElement('article');
        articleCard.classList.add('article-card');

        articleCard.innerHTML = `
            <a href="${article.url}" target="_blank">
                <img src="${article.urlToImage}" alt="${article.title}">
                <h3>${article.title}</h3>
                <p>${article.description}</p>
            </a>
        `;

        newsContainer.appendChild(articleCard);
    });

    currentArticleCount += articlesToLoad; 
}

window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) { 
        loadMoreArticles();
    }
});

document.addEventListener('DOMContentLoaded', fetchNews);