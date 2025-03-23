const apiUrl = 'http://localhost:8080/api/clients';

// Функция для получения всех клиентов
async function fetchClients() {
    const response = await fetch(apiUrl);
    const clients = await response.json();
    populateClientsTable(clients);
}

// Функция для заполнения таблицы клиентов
function populateClientsTable(clients) {
    const tableBody = document.getElementById('clients-table-body');
    tableBody.innerHTML = '';
    clients.forEach(client => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${client.id}</td>
            <td>${client.name}</td>
            <td>${client.email}</td>
            <td>${client.passportData}</td>
            <td>${client.history}</td>
            <td>
                <button onclick="editClient(${client.id})">Редактировать</button>
                <button onclick="deleteClient(${client.id})">Удалить</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Функция для создания нового клиента
async function createClient(event) {
    event.preventDefault();
    const form = document.getElementById('create-client-form');
    const formData = new FormData(form);
    const client = Object.fromEntries(formData.entries());

    await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(client)
    });

    form.reset();
    fetchClients();
}

// Функция для редактирования клиента
async function editClient(id) {
    const client = await fetchClientById(id);
    const form = document.getElementById('create-client-form');
    form.innerHTML = `
        <label for="name">Имя:</label>
        <input type="text" id="name" name="name" value="${client.name}" required>

        <label for="email">Email:</label>
        <input type="email" id="email" name="email" value="${client.email}" required>

        <label for="passportData">Паспортные данные:</label>
        <input type="text" id="passportData" name="passportData" value="${client.passportData}">

        <label for="history">История:</label>
        <input type="text" id="history" name="history" value="${client.history}">

        <button type="submit">Обновить клиента</button>
    `;

    form.onsubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const updatedClient = Object.fromEntries(formData.entries());

        await fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedClient)
        });

        form.reset();
        fetchClients();
    };
}

// Функция для удаления клиента
async function deleteClient(id) {
    await fetch(`${apiUrl}/${id}`, {
        method: 'DELETE'
    });
    fetchClients();
}

// Функция для получения клиента по ID
async function fetchClientById(id) {
    const response = await fetch(`${apiUrl}/${id}`);
    return await response.json();
}

// Инициализация: загрузка всех клиентов при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    fetchClients();
    document.getElementById('create-client-form').onsubmit = createClient;
});