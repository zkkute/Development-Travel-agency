const API_BASE_URL = "http://localhost:8080/api";

// Получение списка туров
async function fetchTours() {
    try {
        const response = await fetch(`${API_BASE_URL}/tours`);
        if (!response.ok) throw new Error("Failed to fetch tours");
        const tours = await response.json();
        renderTours(tours);
    } catch (error) {
        console.error("Error fetching tours:", error);
    }
}

// Получение списка клиентов
async function fetchClients() {
    try {
        const response = await fetch(`${API_BASE_URL}/clients`);
        if (!response.ok) throw new Error("Failed to fetch clients");
        const clients = await response.json();
        renderClients(clients);
    } catch (error) {
        console.error("Error fetching clients:", error);
    }
}

// Рендеринг списка туров
function renderTours(tours) {
    const container = document.getElementById("tours-list");
    container.innerHTML = ""; // Очищаем контейнер
    tours.forEach((tour) => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <h3>${tour.destination}</h3>
            <p>Price: $${tour.price}</p>
            <p>Duration: ${tour.durationDays} days</p>
            <p>${tour.description}</p>
        `;
        container.appendChild(card);
    });
}

// Рендеринг списка клиентов
function renderClients(clients) {
    const container = document.getElementById("clients-list");
    container.innerHTML = ""; // Очищаем контейнер
    clients.forEach((client) => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <h3>${client.name}</h3>
            <p>Email: ${client.email}</p>
            <p>Phone: ${client.phoneNumber}</p>
        `;
        container.appendChild(card);
    });
}

// Загрузка данных при старте
document.addEventListener("DOMContentLoaded", () => {
    fetchTours();
    fetchClients();
});

async function addClient(client) {
    try {
        const response = await fetch(`${API_BASE_URL}/clients`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(client),
        });
        if (response.ok) {
            alert('Client added successfully!');
            fetchClients();
        } else {
            alert('Failed to add client');
        }
    } catch (error) {
        console.error(error);
    }
}

document.getElementById('add-client-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const client = {
        name: e.target.name.value,
        email: e.target.email.value,
        phoneNumber: e.target.phone.value,
    };
    addClient(client);
});
