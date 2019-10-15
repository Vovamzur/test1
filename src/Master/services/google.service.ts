import Serpwow from 'google-search-results-serpwow';

const serpWow = new Serpwow('BD3DCCCC5A8F46169BE9B2B7E9DE4B10');

export const getGoogleResultCount = async (query: string) => {
  try {
    const params = { q: query };
    const result = await serpWow.json(params);
    const count = result.search_information.total_results;

    return count;
  } catch (err) {
    throw err;
  }
};
