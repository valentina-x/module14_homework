/*
Напишите код приложения, интерфейс которого представляет собой input и кнопку.
В input можно ввести любое число. При клике на кнопку происходит следующее:

Если число не попадает в диапазон от 1 до 10 — выводить ниже текст «число вне диапазона от 1 до 10».
Если число попадает в диапазон от 1 до 10 — сделать запрос c помощью XHR по URL https://picsum.photos/v2/list?limit=10, где get-параметр limit — это введённое число.

Пример. Если пользователь ввёл 5, то запрос будет вида: https://picsum.photos/v2/list?limit=5.
После получения данных вывести ниже картинки на экран.
*/

const inputblock = document.querySelector('.inputblock');
const input = inputblock.querySelector('.inputblock__input');
const submit = inputblock.querySelector('.inputblock__btn');

submit.addEventListener('click', checkInput);

function checkInput() {
	const value = input.value;
	const warningDiv = inputblock.querySelector('.inputblock__res');

	if (value == '' || value < 1 || value > 10) {
		addErrorToDOM(warningDiv);
	} else {
		clearAll(warningDiv);
		return useRequest(value, showResult);
	}
}

function addErrorToDOM(warningDiv) {
	if (!warningDiv) {
		const errorString = `<div class="inputblock__res">Число вне диапазона.</div>`;
		inputblock.insertAdjacentHTML('beforeend', errorString);
	}
}

function clearAll(warningDiv) {
	input.value = '';
	if (warningDiv) {
		warningDiv.remove();
	}
}

function useRequest(num, callback) {
	const xhr = new XMLHttpRequest();
	const url = 'https://jsonplaceholder.typicode.com/photos?_start=0&_limit=' + num;

	xhr.open('GET', url, true);

	xhr.onload = function () {
		if (xhr.status != 200) {
			console.log('Статус ответа', xhr.status);
		} else {
			const result = JSON.parse(xhr.response);
			if (callback) callback(result)
		}
	}

	xhr.onerror = function () {
		console.log('Ошибка! Статус ответа', xhr.status)
	}

	xhr.send();
}

function showResult(result) {
	const imagesHTML = document.querySelector('.images');
	addImagesToDOM(imagesHTML, result);
}

function addImagesToDOM(imagesHTML, result) {
	imagesHTML.innerHTML = '';
	result.forEach(item => {
		imagesHTML.innerHTML += `<div class="images__item images__item--animate" data-id="${item.id}"><div class="images__item-img"><img src="${item.url}" alt="image"></div><span>${item.title}</span></div>`;
	})
}