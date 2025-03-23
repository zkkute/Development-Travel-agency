// Функция для валидации формы
function validateForm(event) {
    const destinationInput = document.getElementById('destination');
    const checkInInput = document.getElementById('check-in');
    const checkOutInput = document.getElementById('check-out');
    const guestsInput = document.getElementById('guests');
    let valid = true;
    let messages = [];

    // Проверка поля назначения
    if (destinationInput.value.trim() === '') {
        valid = false;
        messages.push('Пожалуйста, укажите место назначения.');
        destinationInput.classList.add('error');
    } else {
        destinationInput.classList.remove('error');
    }

    // Проверка даты заезда
    if (checkInInput.value === '') {
        valid = false;
        messages.push('Пожалуйста, укажите дату заезда.');
        checkInInput.classList.add('error');
    } else {
        checkInInput.classList.remove('error');
    }

    // Проверка даты отъезда
    if (checkOutInput.value === '') {
        valid = false;
        messages.push('Пожалуйста, укажите дату отъезда.');
        checkOutInput.classList.add('error');
    } else if (checkOutInput.value <= checkInInput.value) {
        valid = false;
        messages.push('Дата отъезда должна быть позже даты заезда.');
        checkOutInput.classList.add('error');
    } else {
        checkOutInput.classList.remove('error');
    }

    // Проверка количества гостей
    if (guestsInput.value === '0') {
        valid = false;
        messages.push('Пожалуйста, укажите количество гостей.');
        guestsInput.classList.add('error');
    } else {
        guestsInput.classList.remove('error');
    }

    // Если форма валидна, проверяем существующие бронирования
    if (valid) {
        event.preventDefault(); // Предотвращаем стандартное поведение формы
        const bookingData = {
            destination: destinationInput.value,
            checkIn: checkInInput.value,
            checkOut: checkOutInput.value,
            guests: guestsInput.value
        };

        // Отправка данных на сервер для проверки существующих бронирований
        fetch('/check-availability', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookingData)
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text); });
            }
            return response.json();
        })
        .then(data => {
            // Если доступно, перенаправляем на страницу бронирования
            const searchUrl = `search.html?destination=${encodeURIComponent(destinationInput.value)}&checkIn=${checkInInput.value}&checkOut=${checkOutInput.value}&guests=${guestsInput.value}`;
            window.location.href = searchUrl; // Перенаправляем на страницу поиска
        })
        .catch(error => {
            alert(error.message); // Показываем сообщение об ошибке
        });
    } else {
        // Если форма невалидна, предотвратите её отправку и покажите сообщения об ошибках
        event.preventDefault();
        alert(messages.join('\n'));
    }
}

// Добавление в понравившиеся
app.post('/add-to-favorites', async (req, res) => {
    const { userId, type } = req.body; // Предполагается, что userId передается с клиентской стороны

    try {
        // Найти пользователя по ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('Пользователь не найден.');
        }

        // Проверка, не добавлено ли уже
        if (user.favorites.includes(type)) {
            return res.status(400).send('Этот объект уже в понравившихся.');
        }

        // Добавление в массив "понравившиеся"
        user.favorites.push(type);
        await user.save();

        res.send('Объект добавлен в понравившиеся.');
    } catch (error) {
        console.error('Ошибка при добавлении в понравившиеся:', error);
        res.status(500).send('Ошибка сервера. Пожалуйста, попробуйте позже.');
    }
});