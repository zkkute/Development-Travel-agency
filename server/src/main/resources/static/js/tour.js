const apiUrl = 'http://localhost:8080/api/tours';

// Функция для получения всех туров
async function fetchTours() {
    const response = await fetch(apiUrl);
    const tours = await response.json();
    populateToursTable(tours);
}

// Функция для заполнения таблицы туров
function populateToursTable(tours) {
    const tableBody = document.getElementById('tours-table-body');
    tableBody.innerHTML = '';
    tours.forEach(tour => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${tour.id}</td>
            <td>${tour.name}</td>
            <td>${tour.description}</td>
            <td>${tour.startDate}</td>
            <td>${tour.endDate}</td>
            <td>${tour.route}</td>
            <td>${tour.hotel}</td>
            <td>${tour.transport}</td>
            <td>${tour.guide}</td>
            <td>${tour.available}</td>
            <td>
                <button onclick="editTour(${tour.id})">Редактировать</button>
                <button onclick="deleteTour(${tour.id})">Удалить</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Функция для создания нового тура
async function createTour(event) {
    event.preventDefault();
    const form = document.getElementById('create-tour-form');
    const formData = new FormData(form);
    const tour = Object.fromEntries(formData.entries());
    tour.available = formData.get('available') === 'on';

    await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(tour)
    });

    form.reset();
    fetchTours();
}

// Функция для редактирования тура
async function editTour(id) {
    const tour = await fetchTourById(id);
    const form = document.getElementById('create-tour-form');
    form.innerHTML = `
        <label for="name">Название:</label>
        <input type="text" id="name" name="name" value="${tour.name}" required>

        <label for="description">Описание:</label>
        <input type="text" id="description" name="description" value="${tour.description}">

        <label for="startDate">Дата начала:</label>
        <input type="date" id="startDate" name="startDate" value="${tour.startDate}" required>

        <label for="endDate">Дата окончания:</label>
        <input type="date" id="endDate" name="endDate" value="${tour.endDate}" required>

        <label for="route">Маршрут:</label>
        <input type="text" id="route" name="route" value="${tour.route}">

        <label for="hotel">Отель:</label>
        <input type="text" id="hotel" name="hotel" value="${tour.hotel}">

        <label for="transport">Транспорт:</label>
        <input type="text" id="transport" name="transport" value="${tour.transport}">

        <label for="guide">Гид:</label>
        <input type="text" id="guide" name="guide" value="${tour.guide}">

        <label for="available">Доступность:</label>
        <input type="checkbox" id="available" name="available" ${tour.available ? 'checked' : ''}>

        <button type="submit">Обновить тур</button>
    `;

    form.onsubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const updatedTour = Object.fromEntries(formData.entries());
        updatedTour.available = formData.get('available') === 'on';

        await fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedTour)
        });

        form.reset();
        fetchTours();
    };
}

// Функция для удаления тура
async function deleteTour(id) {
    await fetch(`${apiUrl}/${id}`, {
        method: 'DELETE'
    });
    fetchTours();
}

// Функция для получения тура по ID
async function fetchTourById(id) {
    const response = await fetch(`${apiUrl}/${id}`);
    return await response.json();
}

// Инициализация: загрузка всех туров при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    fetchTours();
    document.getElementById('create-tour-form').onsubmit = createTour;
});