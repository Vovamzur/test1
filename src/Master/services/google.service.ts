import google from 'google';

export const getCountOfSearchedByQuery = (query: string): number => {
  google(query, (err: any, res: any) => {
    if (err) {
      console.error(err);
    }

    return res.links.length;
  });
  return 0;
}