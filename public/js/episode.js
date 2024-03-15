document.addEventListener("DOMContentLoaded", function() {
    const params = new URLSearchParams(window.location.search);
    const animeName = params.get('anime');

    if (animeName) {
        fetchEpisodes(animeName);
    } else {
        console.error('Anime name not provided.');
    }

    const searchForm = document.getElementById('search-form');

    searchForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission behavior

        const searchInput = document.getElementById('search-input');
        const query = searchInput.value.trim(); // Get the search query from the input field

        if (query) {
            // Update the form action URL with the search query
            searchForm.action = `/search.html?query=${encodeURIComponent(query)}`;

            // Submit the form
            searchForm.submit();
        } else {
            console.error('Search query is empty.');
        }
    });
});

function fetchEpisodes(animeName) {
    fetch(`/api/anime/${animeName}`)
        .then(response => response.json())
        .then(data => {
            console.log('Anime API Response:', data);

            const episodeContainer = document.getElementById('episode-container');
            episodeContainer.innerHTML = '';

            const animeImage = document.createElement('img');
            animeImage.src = data.results.image;
            animeImage.alt = data.results.name;
            animeImage.classList.add('anime-image');
            episodeContainer.appendChild(animeImage);

            const animeTitle = document.createElement('h2');
            animeTitle.textContent = data.results.name;
            episodeContainer.appendChild(animeTitle);

            // Add plot summary
            const plotSummary = document.createElement('p');
            const maxLength = 2000; // Maximum number of characters for plot summary
            plotSummary.textContent = `Plot Summary: ${truncateText(data.results.plot_summary, maxLength)}`;
            plotSummary.style.color = 'white'; // Set the text color to white
            plotSummary.style.marginBottom = '20px';
            episodeContainer.appendChild(plotSummary);

            // Add genre
            const genre = document.createElement('p');
            genre.textContent = `Genre: ${data.results.genre}`;
            genre.style.color = 'white'; // Set the text color to white
            episodeContainer.appendChild(genre);

            // Add release date
            const releaseDate = document.createElement('p');
            releaseDate.textContent = `Release Date: ${data.results.released}`;
            releaseDate.style.color = 'white'; // Set the text color to white
            episodeContainer.appendChild(releaseDate);

            // Add type
            const type = document.createElement('p');
            type.textContent = `Type: ${data.results.type}`;
            type.style.color = 'white'; // Set the text color to white
            episodeContainer.appendChild(type);

            // Add status
            const status = document.createElement('p');
            status.textContent = `Status: ${data.results.status}`;
            status.style.color = 'white'; // Set the text color to white
            episodeContainer.appendChild(status);

            // Add source
            const source = document.createElement('p');
            source.textContent = `Source: ${data.results.source}`;
            source.style.color = 'white'; // Set the text color to white
            source.style.marginBottom = '15px';
            episodeContainer.appendChild(source);

            const episodesList = document.createElement('ul');
            data.results.episodes.forEach(episode => {
                const episodeItem = document.createElement('li');
                const episodeLink = document.createElement('a');
                episodeLink.textContent = `Episode ${episode[0]}`;
                episodeLink.href = `/embedded/embedded_video.html?title=${encodeURIComponent(data.results.name)}&episode=${encodeURIComponent(episode[1])}`; // Pass episode title instead of anime name
                episodeItem.appendChild(episodeLink);
                episodesList.appendChild(episodeItem);
            });
            episodeContainer.appendChild(episodesList);
        })
        .catch(error => console.error('Error fetching episodes:', error));
}

function truncateText(text, maxLength) {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
    }
    return text;
}
