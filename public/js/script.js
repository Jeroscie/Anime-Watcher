//script.js
let currentPage = 1;
const animeLimit = 14; // Set the limit to 9 anime per page
let currentSlide = 0;
let currentPageNumber = document.getElementById("currentPageNumber"); // Get the element reference
currentPageNumber.textContent = currentPage; // Set the initial current page number
const totalSlides = 4; // Assuming there are 5 recent anime items

document.addEventListener("DOMContentLoaded", function () {
    fetchAnime(currentPage);
    fetchRecentAnime();
    fetchUpcomingAnime();
});

//Search function
document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent default form submission behavior
            const query = searchInput.value.trim();
            if (query !== '') {
                searchAnime(query);
            }
        }
    });
});




function searchAnime(query) {
    // Show loading indicator
    const loader = document.getElementById('loader');
    loader.style.display = 'block';



    const encodedQuery = encodeURIComponent(query);
    fetch(`/api/search?query=${encodedQuery}`)
        .then(response => response.json())
        .then(data => {
            // Hide loading indicator after fetching search results
            loader.style.display = 'none';

            // Redirect to the search results page with the search results
            const searchParams = new URLSearchParams();
            searchParams.append('query', query);
            searchParams.append('results', JSON.stringify(data.results));
            window.location.href = `search.html?${searchParams.toString()}`;
        })
        .catch(error => {
            // Hide loading indicator in case of error
            loader.style.display = 'none';

            console.error('Error fetching search results:', error);
            // Display error alert
            alert('Error fetching search results. Please try again later.');
        });
}


//popular function
function fetchAnime(pageNumber) {
    const loader = document.getElementById('loader');
    loader.style.display = 'block'; // Show loader

    const animeContainer = document.getElementById('anime-container');
    animeContainer.innerHTML = ''; // Clear previous anime items

    // Show loader only for the popular anime section
    loader.style.display = 'block';

    fetch(`/api/popular/${pageNumber}`)
        .then(response => response.json())
        .then(data => {
            let animeCount = 0; // Initialize a counter for the number of anime items added
            data.results.forEach(anime => {
                if (animeCount < animeLimit) { // Check if the limit has been reached
                    const animeItem = document.createElement('div');
                    animeItem.classList.add('anime-item');

                    const title = document.createElement('p');
                    title.textContent = `Name: ${anime.title} \n`;

                    const releaseDate = document.createElement('p'); // Create a new paragraph element for the release date
                    releaseDate.textContent = ` Release Date: ${anime.releaseDate}`; // Set the text content to the release date

                    const image = document.createElement('img');
                    image.src = anime.image;
                    image.alt = anime.title;
                    image.classList.add('anime-image');

                    const link = document.createElement('a');
                    link.href = '#'; // Set href to '#' temporarily
                    link.addEventListener('click', function () {
                        viewEpisodes(anime.title); // Call function to view episodes
                    });

                    link.appendChild(image);

                    animeItem.appendChild(link);
                    animeItem.appendChild(title);
                    animeItem.appendChild(releaseDate); // Append the release date to the anime item
                    animeContainer.appendChild(animeItem);

                    animeCount++; // Increment the counter
                } else {
                    return; // Exit the loop if the limit has been reached
                }
            });

            loader.style.display = 'none'; // Hide loader after fetching and rendering data
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            loader.style.display = 'none'; // Hide loader in case of error
        });

    const animeTitles = document.querySelectorAll('.anime-title');
    animeTitles.forEach(title => {
        title.style.color = '#fff'; // Change color to white
    });

    // Update the current page number after fetching anime data
    currentPageNumber.textContent = currentPage;
}


function fetchRecentAnime() {
    fetch("api/recent/1")
        .then(response => response.json())
        .then(data => {
            const slideContainer = document.getElementById('slide');
            slideContainer.innerHTML = ''; // Clear previous slides

            const animeContainer = document.createElement('div');
            animeContainer.classList.add('anime-container', 'recent-anime-container');

            data.results.forEach(anime => {
                const animeItem = document.createElement('div');
                animeItem.classList.add('anime-item');

                const image = document.createElement('img');
                image.src = anime.image;
                image.alt = anime.title;

                const title = document.createElement('p');
                const episode = anime.episode.replace('Episode ', ''); // Remove "Episode" text
                title.textContent = `${anime.title} - EP:${episode}`; // Include episode information with "EP:"
                title.style.maxWidth = '500px'; // Set a maximum width for the title
                title.style.overflowWrap = 'break-word'; // Allow overflow to break into multiple lines

                animeItem.appendChild(image);
                animeItem.appendChild(title);

                animeItem.addEventListener('click', function () {
                    viewEpisodes(anime.title); // Redirect to episode page when clicked
                });

                animeContainer.appendChild(animeItem);
            });

            slideContainer.appendChild(animeContainer);
        })
        .catch(error => console.error('Error fetching recent anime:', error));
}


function showSlide(slideIndex) {
    const slideContainer = document.getElementById('slide');
    slideContainer.style.transform = `translateX(-${slideIndex * 100}%)`;
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
}

function previousSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    showSlide(currentSlide);
}

function nextPage() {
    currentPage++;
    fetchAnime(currentPage);
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        fetchAnime(currentPage);
    } 
}

function viewEpisodes(animeName) {
    // Encode anime name to handle special characters
    const encodedAnimeName = encodeURIComponent(animeName);
    window.location.href = `episode/episode.html?anime=${encodedAnimeName}`; // Redirect to episode page
}

const menuBtn = document.querySelector(".menu-icon span");
const searchBtn = document.querySelector(".search-icon");
const cancelBtn = document.querySelector(".cancel-icon");
const items = document.querySelector(".nav-items");
const form = document.querySelector("form");
const body = document.body; // Reference to the body element


menuBtn.onclick = () => {
  items.classList.add("active");
  menuBtn.classList.add("hide");
  searchBtn.classList.add("hide");
  cancelBtn.classList.add("show");
  body.classList.add("nav-active"); // Add class to body to prevent scrolling
}

cancelBtn.onclick = () => {
  items.classList.remove("active");
  menuBtn.classList.remove("hide");
  searchBtn.classList.remove("hide");
  cancelBtn.classList.remove("show");
  form.classList.remove("active");
  cancelBtn.style.color = "#ff3d00";
  body.classList.remove("nav-active"); // Remove class from body to enable scrolling
}

searchBtn.onclick = () => {
  form.classList.add("active");
  searchBtn.classList.add("hide");
  cancelBtn.classList.add("show");
  body.classList.add("nav-active"); // Add class to body to prevent scrolling
}

function fetchUpcomingAnime() {
    const upcomingContainer = document.getElementById('upcoming-anime-container'); // Get the upcoming anime container

    let currentPage = 1; // Declare and initialize the currentPage variable

    function fetchData(page) {
        fetch(`/api/upcoming/${page}`)
            .then(response => response.json())
            .then(data => {
                data.results.forEach(anime => {
                    const upcomingItem = document.createElement('div');
                    upcomingItem.classList.add('upcoming-anime-item'); // Use the class for upcoming anime items

                    const image = document.createElement('img');
                    image.src = anime.media.coverImage.extraLarge; // Use extra-large-sized cover image
                    image.alt = anime.media.title.userPreferred;

                    const title = document.createElement('p');
                    title.textContent = anime.media.title.userPreferred.length > 30 ? anime.media.title.userPreferred.slice(0, 30) + '...' : anime.media.title.userPreferred; // Limit the title length to 30 characters
                    title.style.display = 'flex'; // Set display to flex
                    title.style.alignItems = 'center'; // Align items vertically

                    const airingDate = document.createElement('p');
                    airingDate.textContent = `Date: ${new Date(anime.airingAt * 1000).toLocaleDateString()}`; // Convert UNIX timestamp to human-readable date

                    const genres = document.createElement('p');
                    // Check if genres array is not empty before accessing the first element
                    genres.textContent = anime.media.genres.length > 0 ? `Genre: ${anime.media.genres[0]}` : 'Genre: Not specified';

                    upcomingItem.appendChild(image);
                    upcomingItem.appendChild(title);
                    upcomingItem.appendChild(airingDate);
                    upcomingItem.appendChild(genres); // Append genre to the upcoming anime item

                    upcomingContainer.appendChild(upcomingItem); // Append upcoming anime item to the container
                });
            })
            .catch(error => console.error('Error fetching upcoming anime:', error));
    }

    // Fetch data for the initial page
    fetchData(currentPage);

    // Add event listener for scroll events
    upcomingContainer.addEventListener('scroll', () => {
        if (upcomingContainer.scrollLeft + upcomingContainer.clientWidth >= upcomingContainer.scrollWidth) {
            // If scrolled to the end, load data for the next page
            currentPage++;
            fetchData(currentPage);
        }
    });
}

// Call fetchUpcomingAnime to initialize the infinite scrolling
fetchUpcomingAnime();
