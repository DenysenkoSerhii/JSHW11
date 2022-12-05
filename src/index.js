import markup from './js/markup';
import Gallery from './js/GalleryPixabay';
import notifySender from './js/notifySender';
import 'lazysizes';
import SimpleLightbox from 'simplelightbox';
import infiniteScroll from './js/infiniteScroll';
import throttle from 'lodash.throttle';
import './css/styles.css';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchFormEl = document.getElementById('search-form');
const inputEl = searchFormEl.searchQuery;
const galleryEl = document.querySelector('section.gallery > .container');
const headerEl = document.querySelector('.header');

const sLightbox = new SimpleLightbox(
  'section.gallery > .container > .photo-card > div',
  {
    sourceAttr: 'largeImageURL',
    alertError: false,
    history: false,
    animationSpeed: 300,
  }
);

const clearGalleryContainer = () => {
  galleryEl.innerHTML = '';
};

const connectSimpleLightbox = () => {
  return new SimpleLightbox(
    'section.gallery > .container > .photo-card > div',
    {
      sourceAttr: 'largeImageURL',
      alertError: false,
      history: false,
      animationSpeed: 300,
    }
  );
};

const uploadPicturesToGallery = async () => {
  document.body.style.cursor = 'wait';
  const response = await gallery.getPicturePage();
  document.body.style.cursor = 'auto';

  if (notifySender(response)) {
    galleryEl.insertAdjacentHTML('beforeEnd', markup(response.data.hits));
    sLightbox.refresh();
  }
};

const onSubmit = async e => {
  e.preventDefault();

  gallery.query = inputEl.value.replace(' ', '+').trim();
  gallery.resetPage();
  clearGalleryContainer();
  uploadPicturesToGallery();
};

const onScroll = () => {
  infiniteScroll(galleryEl, uploadPicturesToGallery);
};

document.body.style.paddingTop = getComputedStyle(headerEl).height;
const gallery = new Gallery();
const simpleLightbox = {};
inputEl.focus();
searchFormEl.addEventListener('submit', onSubmit);
document.addEventListener('scroll', throttle(onScroll, 300));