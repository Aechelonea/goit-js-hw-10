export function fetchCountries(name) {
  return new Promise((resolve, reject) => {
    fetch(
      `https://restcountries.com/v3.1/name/${name}?fields=flags,population,capital,languages,name`
    )
      .then(response => {
        if (!response.ok) {
          throw new Error(response.status);
        }
        return response.json();
      })
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        reject(error);
      });
  });
}
