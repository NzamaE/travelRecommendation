// Hook both buttons
document.getElementById('btnSearch').addEventListener('click', searchDestination);
document.getElementById('btnReset').addEventListener('click', clearResults);

// Search logic remains unchanged
function searchDestination() {
  const input = document.getElementById('destinationInput').value.toLowerCase();
  const resultContainer = document.getElementById('result');
  resultContainer.innerHTML = '';

  fetch('travel_recommendation_api.json')
    .then(response => response.json())
    .then(data => {
      let matches = [];

      // Match logic for temple, beach, city, etc.
      if (input === 'temple' || input.includes('temple')) {
        matches = data.temples;
      } else if (input === 'beach' || input.includes('beach')) {
        matches = data.beaches;
      } else if (input === 'city' || input.includes('city')) {
        data.countries.forEach(country => {
          country.cities.forEach(city => matches.push(city));
        });
      } else {
        data.countries.forEach(country => {
          country.cities.forEach(city => {
            if (city.name.toLowerCase().includes(input)) matches.push(city);
          });
        });

        data.temples.forEach(temple => {
          if (temple.name.toLowerCase().includes(input)) matches.push(temple);
        });

        data.beaches.forEach(beach => {
          if (beach.name.toLowerCase().includes(input)) matches.push(beach);
        });
      }

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
      console.error('Error:', error);
      resultContainer.innerHTML = `<p>Error loading recommendations.</p>`;
    });
}

// ✅ Clear logic
function clearResults() {
  document.getElementById('destinationInput').value = '';
  document.getElementById('result').innerHTML = '';
}
