const apiUrl = 'http://localhost:8080/api/pricing';

// Функция для расчета цены тура
async function calculateTourPrice(event) {
    event.preventDefault();
    const form = document.getElementById('calculate-tour-price-form');
    const formData = new FormData(form);
    const request = {
        tour: { id: formData.get('tourId') },
        participants: parseInt(formData.get('participants')),
        seasonalDiscount: formData.get('seasonalDiscount') === 'on'
    };

    const response = await fetch(`${apiUrl}/calculate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
    });

    const price = await response.json();
    document.getElementById('result-tour-price').innerText = `Рассчитанная цена: ${price}`;
}

// Функция для применения скидки
async function applyDiscount(event) {
    event.preventDefault();
    const form = document.getElementById('apply-discount-form');
    const formData = new FormData(form);
    const request = {
        price: parseFloat(formData.get('price')),
        discountPercentage: parseFloat(formData.get('discountPercentage'))
    };

    const response = await fetch(`${apiUrl}/applyDiscount`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
    });

    const discountedPrice = await response.json();
    document.getElementById('result-discount').innerText = `Цена после скидки: ${discountedPrice}`;
}

// Инициализация: добавление обработчиков событий
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('calculate-tour-price-form').onsubmit = calculateTourPrice;
    document.getElementById('apply-discount-form').onsubmit = applyDiscount;
});