document.getElementById('btnSearch').addEventListener('click', searchDestination);
document.getElementById('btnReset').addEventListener('click', () => {
  document.getElementById('destinationInput').value = '';
  document.getElementById('result').innerHTML = '';
});

function searchDestination() {
  const input = document.getElementById('destinationInput').value.toLowerCase();
  const resultContainer = document.getElementById('result');
  resultContainer.innerHTML = ''; // clear previous results

  fetch('travel_recommendation_api.json')
    .then(response => response.json())
    .then(data => {
      let matches = [];

      // Check if the input is the keyword 'temple'
      if (input === 'temple' || input.includes('temple')) {
        matches = data.temples;
      }

      // Check if the input is the keyword 'beach'
      else if (input === 'beach' || input.includes('beach')) {
        matches = data.beaches;
      }

      // Check if the input is the keyword 'city'
      else if (input === 'city' || input.includes('city')) {
        data.countries.forEach(country => {
          country.cities.forEach(city => {
            matches.push(city);
          });
        });
      }

      // Otherwise, try to find cities, temples, or beaches that include the keyword
      else {
        // Search in cities
        data.countries.forEach(country => {
          country.cities.forEach(city => {
            if (city.name.toLowerCase().includes(input)) {
              matches.push(city);
            }
          });
        });

        // Search in temples
        data.temples.forEach(temple => {
          if (temple.name.toLowerCase().includes(input)) {
            matches.push(temple);
          }
        });

        // Search in beaches
        data.beaches.forEach(beach => {
          if (beach.name.toLowerCase().includes(input)) {
            matches.push(beach);
          }
        });
      }

      // Show results
      if (matches.length >= 2) {
        matches.slice(0, 2).forEach(item => {
          const div = document.createElement('div');
          div.innerHTML = `
            <h3>${item.name}</h3>
            <img src="${item.imageUrl}" alt="${item.name}">
            <p>${item.description}</p>
          `;
          resultContainer.appendChild(div);
        });
      } else if (matches.length === 1) {
        const item = matches[0];
        const div = document.createElement('div');
        div.innerHTML = `
          <h3>${item.name}</h3>
          <img src="${item.imageUrl}" alt="${item.name}">
          <p>${item.description}</p>
        `;
        resultContainer.appendChild(div);
      } else {
        resultContainer.innerHTML = `<p>No results found. Try keywords like "temple", "beach", or "city".</p>`;
      }
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      resultContainer.innerHTML = `<p>Error loading recommendations. Please try again later.</p>`;
    });
}
