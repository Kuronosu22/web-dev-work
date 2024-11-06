let currentArticleCount = 0; 
let allArticles = []; 
const apiKey = '9976c07c18ab4f9c86b82366e5a8dd05';

async function fetchRecentNews() {
    try {
        const filter = document.getElementById("searchBar").value.toLowerCase()
        const response = await fetch(`https://newsapi.org/v2/everything?q=${filter} OR tech&from=2024-10-05&sortBy=publishedAt&language=pt&apiKey=${apiKey}`);
        
        if (!response.ok) {
            throw new Error('Erro na resposta da API: ' + response.status);
        }

        const data = await response.json();
        console.log(data); 

        if (data.articles && data.articles.length > 0) {
            
            allArticles = data.articles.filter(article => article.urlToImage && article.description && article.title);
            currentArticleCount = 0; 
            loadMoreArticles()

        } else {
            document.getElementById('newsContainer').innerHTML = '<p>Nenhuma notícia disponível.</p>';
        }
    } catch (error) {
        console.error('Erro ao buscar as notícias:', error);
    }
}

function calculateCardsToLoad() {
    const newsContainer = document.getElementById('newsContainer');
    const containerWidth = newsContainer.clientWidth; 
    const cardWidth = 250; 
    const gap = 20; 
    const cardsPerRow = Math.floor(containerWidth / (cardWidth + gap)); 

    
    const effectiveCardsPerRow = Math.max(cardsPerRow, 1);

    console.log(`Largura do container: ${containerWidth}`);
    console.log(`Cartões por linha: ${effectiveCardsPerRow}`);

    return Math.min(effectiveCardsPerRow * 3, allArticles.length - currentArticleCount);
}

function loadMoreArticles() {
    const newsContainer = document.getElementById('newsContainer');
    const articlesToLoad = calculateCardsToLoad(); 

    if (articlesToLoad <= 0) {
        return;
    } 

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

    disableButton()
}

function disableButton(){
    const button = document.getElementById("load-more");

    if (currentArticleCount >= allArticles.length) {
        button.style.opacity = 0.6;
        button.style.cursor = "not-allowed";
        button.disable = true;
    }
}

document.addEventListener('DOMContentLoaded', fetchRecentNews);
