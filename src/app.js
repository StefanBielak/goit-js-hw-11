import SimpleLightbox from 'simplelightbox';
import { fetchImages } from './api';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
let page = 1;
let lightbox;
window.addEventListener('DOMContentLoaded', () => {
  const emptyCard = document.querySelector('.photo-card');
  if (emptyCard) {
    emptyCard.remove();
  }
})
searchForm.addEventListener('submit', async e => {
  e.preventDefault();
  page = 1;
  const searchQuery = e.target.searchQuery.value;
  await performImageSearch(searchQuery);
});

loadMoreBtn.addEventListener('click', async () => {
  page++;
  const searchQuery = searchForm.searchQuery.value;
  await performImageSearch(searchQuery, page);
});
function createImageCard(image) {
  const card = document.createElement('div');
  card.classList.add('photo-card');

  const imgLink = document.createElement('a');
  imgLink.href = image.largeImageURL;

  const img = document.createElement('img');
  img.src = image.webformatURL;
  img.alt = image.tags;
  img.loading = 'lazy';

  const info = document.createElement('div');
  info.classList.add('info');

  const likes = document.createElement('p');
  likes.classList.add('info-item');
  likes.innerHTML = `<b>Likes:</b> ${image.likes}`;

  const views = document.createElement('p');
  views.classList.add('info-item');
  views.innerHTML = `<b>Views:</b> ${image.views}`;

  const comments = document.createElement('p');
  comments.classList.add('info-item');
  comments.innerHTML = `<b>Comments:</b> ${image.comments}`;

  const downloads = document.createElement('p');
  downloads.classList.add('info-item');
  downloads.innerHTML = `<b>Downloads:</b> ${image.downloads}`;

  info.appendChild(likes);
  info.appendChild(views);
  info.appendChild(comments);
  info.appendChild(downloads);

  imgLink.appendChild(img);
  card.appendChild(imgLink);
  card.appendChild(info);

  return card;
}

function displayImages(images) {
  images.forEach(image => {
    const card = createImageCard(image);
    gallery.appendChild(card);
  });
}

async function searchImages(query, pageNumber) {
  try {
    const apiKey = '39441278-dab432af90fd5d2445b56ddfd';
    const response = await fetch(
      `https://pixabay.com/api/?key=${apiKey}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${pageNumber}&per_page=${perPage}`
    );

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    if (data.hits.length === 0) {
      displayNoResults();
    } else {
      displayImages(data.hits);
      if (page === 1) {
        loadMoreBtn.style.display = 'block';
      }
    }

    if (data.totalHits <= page * perPage) {
      loadMoreBtn.style.display = 'none';
      displayEndOfResults();
    }
  } catch (error) {
    console.error('Error:', error);
    displayError();
  }
}

function displayNoResults() {
  clearGallery();
  loadMoreBtn.style.display = 'none';
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function displayEndOfResults() {
  Notiflix.Notify.info(
    "We're sorry, but you've reached the end of search results."
  );
}

function displayError() {
  Notiflix.Notify.failure(
    'An error occurred while fetching images. Please try again later.'
  );
}
gallery.addEventListener('click', function (e) {
  if (e.target.tagName === 'IMG') {
    const modalImage = document.getElementById('modalImage');
    const modalInfo = document.getElementById('modalInfo');
    const imageCard = e.target.parentElement;
    const image = {
      url: e.target.src,
      alt: e.target.alt,
      likes: imageCard.querySelector('.info-item.likes').textContent,
      views: imageCard.querySelector('.info-item.views').textContent,
      comments: imageCard.querySelector('.info-item.comments').textContent,
      downloads: imageCard.querySelector('.info-item.downloads').textContent,
    };

    displayImageInModal(image);
    openModal();
  }
});
async function performImageSearch(query, pageNumber = 1) {
  try {
    const data = await fetchImages(query, pageNumber);

    if (pageNumber === 1) {
      gallery.innerHTML = '';
    }

    if (data.hits.length === 0) {
      alert('Przepraszamy, nie znaleziono obrazków pasujących do zapytania.');
    } else {
      data.hits.forEach(image => {
        const card = createImageCard(image);
        gallery.appendChild(card);
      });

      if (!lightbox) {
        lightbox = new SimpleLightbox('.gallery a', {
        });
      } else {
        lightbox.refresh();
      }
      const modalElement = document.querySelector('.sl-wrapper');
      modalElement.addEventListener('click', event => {
        if (event.target === modalElement) {
          lightbox.close();
        }
      });
      loadMoreBtn.style.display = 'block';
      if (pageNumber * data.hitsPerPage >= data.totalHits) {
        loadMoreBtn.style.display = 'none';
        alert('Przepraszamy, osiągnąłeś koniec wyników wyszukiwania.');
      }
    }
  } catch (error) {
    console.error('Wystąpił błąd podczas pobierania obrazków:', error);
    alert(
      'Wystąpił błąd podczas pobierania obrazków. Spróbuj ponownie później.'
    );
  }
}
