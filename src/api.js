export async function fetchImages(query, pageNumber = 1) {
  const apiKey = '39441278-dab432af90fd5d2445b56ddfd';
  const perPage = 40;
  const apiUrl = `https://pixabay.com/api/?key=${apiKey}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${pageNumber}&per_page=${perPage}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Wystąpił błąd podczas pobierania obrazków:', error);
    throw error;
  }
}
