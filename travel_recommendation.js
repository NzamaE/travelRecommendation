document.getElementById('btnSearch').addEventListener('click', searchDestination);
document.getElementById('btnReset').addEventListener('click', () => {
  document.getElementById('destinationInput').value = '';
  document.getElementById('result').innerHTML = '';
});

function searchDestination() {
  const input = document.getElementById('destinationInput').value.toLowerCase();
  const resultContainer = document.getElementById('result');
  resultContainer.innerHTML = ''; // Clear previous results

  fetch('travel_recommendation_api.json')
    .then(response => response.json())
    .then(data => {
      let matches = [];

      // Match cities
      data.countries.forEach(country => {
        country.cities.forEach(city => {
          if (input === 'city' || city.name.toLowerCase().includes(input)) {
            matches.push({
              name: city.name,
              imageUrl: city.imageUrl,
              description: city.description
            });
          }
        });
      });

      // Match temples
      data.temples.forEach(temple => {
        if (input === 'temple' || temple.name.toLowerCase().includes(input)) {
          matches.push({
            name: temple.name,
            imageUrl: temple.imageUrl,
            description: temple.description
          });
        }
      });

      // Match beaches
      data.beaches.forEach(beach => {
        if (input === 'beach' || beach.name.toLowerCase().includes(input)) {
          matches.push({
            name: beach.name,
            imageUrl: beach.imageUrl,
            description: beach.description
          });
        }
      });

      if (matches.length >= 2) {
        // Show at least two
        matches.slice(0, 2).forEach(match => {
          const div = document.createElement('div');
          div.innerHTML = `
            <h3>${match.name}</h3>
            <img src="${match.imageUrl}" alt="${match.name}">
            <p>${match.description}</p>
          `;
          resultContainer.appendChild(div);
        });
      } else {
        resultContainer.innerHTML = `<p>No sufficient results found. Please try a different keyword like "beach", "temple", or "city".</p>`;
      }
    })
    .catch(error => {
      console.error('Error:', error);
      resultContainer.innerHTML = `<p>Error loading recommendations. Please try again later.</p>`;
    });
}
