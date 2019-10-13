const axios = require('axios');

(async () => {
  const query = 'KPI';

  const url = `https://www.google.com/search?q=${query}&rlz=1C1GGRV_enUA782UA783&oq=${query}&aqs=chrome..69i57j0l4j69i60.1088j0j7&sourceid=chrome&ie=UTF-8`;
  const result = await axios.get(url);

  console.log(result);
})();
