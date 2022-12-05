import { Notify } from 'notiflix/build/notiflix-notify-aio';

export default fetchObj => {
  const notifyParams = {};
  switch (fetchObj.status) {
    case 200:
      if (fetchObj.data.hits.length) {
        if (fetchObj.config.params.page !== 1) return true;
        notifyParams.key = 'success';
        notifyParams.message = `Hooray! We found ${fetchObj.data.totalHits} images`;
      } else {
        notifyParams.key = 'failure';
        notifyParams.message =
          'Sorry, there are no images matching your search query. Please try again.';
      }
      break;

    case 400:
      if (fetchObj.data === '[ERROR 400] "page" is out of valid range.') {
        notifyParams.key = 'failure';
        notifyParams.message =
          "We're sorry, but you've reached the end of search results.";
      }
      break;

    default:
      notifyParams.key = 'failure';
      notifyParams.message = fetchObj.data;
      break;
  }
  Notify[notifyParams.key](notifyParams.message);
  return notifyParams.key === 'success';
};