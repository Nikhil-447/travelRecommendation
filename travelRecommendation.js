let travelData = [];

/**
 * Fetch travel data from the JSON file and store it in the global variable `travelData`.
 */
async function fetchTravelData() {
  try {
    const response = await fetch("travel_recommendation_api.json");
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    travelData = await response.json();
  } catch (error) {
    console.error("Error fetching travel data:", error);
  }
}

/**
 * Display recommendations in the container.
 * @param {Array} recommendations - Array of recommendation objects to display.
 */
function displayRecommendations(recommendations) {
  const recommendationsContainer = document.getElementById(
    "recommendations-container"
  );

  // Clear previous results
  recommendationsContainer.innerHTML = "";

  if (recommendations.length === 0) {
    // Show "No results" message if no recommendations are found
    recommendationsContainer.innerHTML = `<p class="no-results">No recommendations found.</p>`;
    recommendationsContainer.style.display = "flex";
    return;
  }

  // Generate and append recommendation cards
  recommendations.forEach((item) => {
    const recommendationHTML = `
      <div class="city-card">
        <img src="${item.imageUrl}" alt="${item.name}" />
        <h3>${item.name}</h3>
        <p>${item.description}</p>
      </div>
    `;
    recommendationsContainer.innerHTML += recommendationHTML;
  });

  recommendationsContainer.style.display = "flex";
}

/**
 * Search for recommendations based on user input.
 */
function performSearch() {
  const searchInput = document
    .getElementById("search-input")
    .value.toLowerCase()
    .trim();
  const recommendationsContainer = document.getElementById(
    "recommendations-container"
  );

  if (!searchInput) {
    // If the input is empty, clear results and show an alert
    recommendationsContainer.style.display = "none";
    recommendationsContainer.innerHTML = "";
    alert("Please enter a keyword to search.");
    return;
  }

  // Search logic
  const allRecommendations = [];

  // Search within each category and collect results
  ["countries", "beaches", "temples"].forEach((category) => {
    const items = travelData[category] || [];
    const matches = items.flatMap((item) => {
      if (category === "countries") {
        // Search in cities for countries
        return item.cities.filter(
          (city) =>
            city.name.toLowerCase().includes(searchInput) ||
            city.description.toLowerCase().includes(searchInput)
        );
      } else {
        // Search directly in other categories (e.g., beaches, temples)
        return item.name.toLowerCase().includes(searchInput) ||
          item.description.toLowerCase().includes(searchInput)
          ? [item]
          : [];
      }
    });
    allRecommendations.push(...matches);
  });

  // Display the search results
  displayRecommendations(allRecommendations);
}

/**
 * Reset the search input and clear the recommendations container.
 */
function resetSearch() {
  const searchInput = document.getElementById("search-input");
  const recommendationsContainer = document.getElementById(
    "recommendations-container"
  );

  searchInput.value = ""; // Clear the input field
  recommendationsContainer.style.display = "none"; // Hide recommendations
  recommendationsContainer.innerHTML = ""; // Clear any displayed results
}

// Event listener for the Search button
document.getElementById("search-btn").addEventListener("click", performSearch);

// Event listener for the Reset button
document.getElementById("reset-btn").addEventListener("click", resetSearch);

// Fetch travel data when the page loads
fetchTravelData();

//https://travel-bloom-sigma.vercel.app/contact.html
