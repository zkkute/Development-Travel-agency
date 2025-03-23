const apiUrl = 'http://localhost:8080/api/bookings';

// Функция для получения всех бронирований
async function fetchBookings() {
    const response = await fetch(apiUrl);
    const bookings = await response.json();
    populateBookingsTable(bookings);
}

// Функция для заполнения таблицы бронирований
function populateBookingsTable(bookings) {
    const tableBody = document.getElementById('bookings-table-body');
    tableBody.innerHTML = '';
    bookings.forEach(booking => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${booking.id}</td>
            <td>${booking.clientId}</td>
            <td>${booking.tourId}</td>
            <td>${booking.bookingDate}</td>
            <td>${booking.participants}</td>
            <td>${booking.status}</td>
            <td>
                <button onclick="editBooking(${booking.id})">Редактировать</button>
                <button onclick="deleteBooking(${booking.id})">Удалить</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Функция для создания нового бронирования
async function createBooking(event) {
    event.preventDefault();
    const form = document.getElementById('create-booking-form');
    const formData = new FormData(form);
    const booking = Object.fromEntries(formData.entries());

    await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(booking)
    });

    form.reset();
    fetchBookings();
}

// Функция для редактирования бронирования
async function editBooking(id) {
    const booking = await fetchBookingById(id);
    const form = document.getElementById('create-booking-form');
    form.innerHTML = `
        <label for="clientId">Клиент ID:</label>
        <input type="number" id="clientId" name="clientId" value="${booking.clientId}" required>

        <label for="tourId">Тур ID:</label>
        <input type="number" id="tourId" name="tourId" value="${booking.tourId}" required>

        <label for="bookingDate">Дата бронирования:</label>
        <input type="date" id="bookingDate" name="bookingDate" value="${booking.bookingDate}" required>

        <label for="participants">Участники:</label>
        <input type="number" id="participants" name="participants" value="${booking.participants}" required>

        <label for="status">Статус:</label>
        <input type="text" id="status" name="status" value="${booking.status}" required>

        <button type="submit">Обновить бронирование</button>
    `;

    form.onsubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const updatedBooking = Object.fromEntries(formData.entries());

        await fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedBooking)
        });

        form.reset();
        fetchBookings();
    };
}

// Функция для удаления бронирования
async function deleteBooking(id) {
    await fetch(`${apiUrl}/${id}`, {
        method: 'DELETE'
    });
    fetchBookings();
}

// Функция для получения брони