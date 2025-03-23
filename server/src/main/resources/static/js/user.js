// User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    favorites: [{ type: String }] // Массив для хранения понравившихся объектов
});

const User = mongoose.model('User ', userSchema);
module.exports = User;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /.+\@.+\..+/ // Регулярное выражение для проверки формата email
    },
    password: {
        type: String,
        required: true,
    }
    favorites:{
        type: String,
    }
});

module.exports = mongoose.model('User', userSchema);
// Предполагается, что userId доступен глобально после входа пользователя
let userId = 'someUser  Id'; // Замените на реальный ID пользователя

// Функция для добавления в "понравившиеся"
function addToFavorites(type) {
    // Проверка, что пользователь авторизован
    if (!userId) {
        alert('Пожалуйста, войдите в систему, чтобы добавлять в понравившиеся.');
        return;
    }

    fetch('/add-to-favorites', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: userId, type: type })
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => { throw new Error(text); });
        }
        return response.text();
    })
    .then(message => {
        alert(message); // Показываем сообщение об успешном добавлении
    })
    .catch(error => {
        alert('Ошибка: ' + error.message);
    });
}

