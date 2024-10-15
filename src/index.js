document.addEventListener("DOMContentLoaded", () => {
    function displayFilmDets(film) {
        document.getElementById('title').textContent = film.title;
        document.getElementById('runtime').textContent = `${film.runtime} minutes`;
        document.getElementById('showtime').textContent = film.showtime;
        document.getElementById('film-info').textContent = film.description;
        document.getElementById('poster').src = film.poster;
        document.getElementById('ticket-num').textContent = film.capacity - film.tickets_sold;

        const buyTicketButton = document.getElementById('buy-ticket');
        if (film.capacity - film.tickets_sold === 0) {
            buyTicketButton.textContent = 'Sold Out';
            buyTicketButton.disabled = true;
        } else {
            buyTicketButton.textContent = 'Buy Ticket';
            buyTicketButton.disabled = false;
        }

        buyTicketButton.onclick = () => buyTicket(film);
    }

    fetch('http://localhost:3000/films')
        .then(response => response.json())
        .then(films => displayFilmList(films));

    function displayFilmList(films) {
        const filmsList = document.getElementById('films');
        filmsList.innerHTML = '';

        films.forEach(film => {
            const li = document.createElement('li');
            li.classList.add('film', 'item');

            const filmTitle = document.createElement('span');
            filmTitle.textContent = film.title;

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.classList.add('ui', 'red', 'mini', 'button');
            deleteBtn.style.marginLeft = '10px';
            deleteBtn.onclick = () => deleteFilm(film.id, li);

            li.appendChild(filmTitle);
            li.appendChild(deleteBtn);

            if (film.capacity - film.tickets_sold === 0) {
                li.classList.add('sold-out');
            }

            li.onclick = () => displayFilmDets(film);
            filmsList.appendChild(li);
        });
    }

    fetch('http://localhost:3000/films/1')
        .then(response => response.json())
        .then(film => displayFilmDets(film));


    function buyTicket(film) {
        if (film.tickets_sold < film.capacity) {
            fetch(`http://localhost:3000/films/${film.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tickets_sold: film.tickets_sold + 1 })
            })
                .then(response => response.json())
                .then(updatedFilm => {
                    displayFilmDets(updatedFilm);
                    updateFilmList(updatedFilm);
                });
        }
    }

    function updateFilmList(film) {
        const filmsList = document.getElementById('films').children;
        for (let item of filmsList) {
            if (item.textContent.includes(film.title)) {
                if (film.capacity - film.tickets_sold === 0) {
                    item.classList.add('sold-out');
                }
            }
        }
    }

    function deleteFilm(filmId, listItem) {
        fetch(`http://localhost:3000/films/${filmId}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (response.ok) {
                    listItem.remove();
                } else {
                    alert("Error: Unable to delete the movie.");
                }
            });
    }
});
