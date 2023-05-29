/*
Написать код приложения, интерфейс которого состоит из двух input и кнопки. В input можно ввести любое число.

Заголовок первого input — «номер страницы».
Заголовок второго input — «лимит».
Заголовок кнопки — «запрос».
При клике на кнопку происходит следующее:

Если число в первом input не попадает в диапазон от 1 до 10 или не является числом — выводить ниже текст «Номер страницы вне диапазона от 1 до 10»;
Если число во втором input не попадает в диапазон от 1 до 10 или не является числом — выводить ниже текст «Лимит вне диапазона от 1 до 10»;
Если и первый, и второй input не в диапазонах или не являются числами — выводить ниже текст «Номер страницы и лимит вне диапазона от 1 до 10»;
Если числа попадают в диапазон от 1 до 10 — сделать запрос по URL https://picsum.photos/v2/list?page=1&limit=10, где GET-параметр page — это число из первого input, а GET-параметр limit — это введённое число второго input.
Пример. Если пользователь ввёл 5 и 7, то запрос будет вида https://picsum.photos/v2/list?page=5&limit=7.
После получения данных вывести список картинок на экран.

Если пользователь перезагрузил страницу, то ему должны показываться картинки из последнего успешно выполненного запроса (использовать localStorage).
*/

const form = document.querySelector('#form');

const inputblock = document.querySelector('.inputblock');
const inputs = inputblock.querySelectorAll('.inputblock__input');
const submit = inputblock.querySelector('.inputblock__btn');

submit.addEventListener('click', getImages);

const stringStorage = localStorage.getItem('data');

if (stringStorage) {
	const arrStorage = stringStorage.split(',');
	useStorage(arrStorage);
}

async function useStorage(arrStorage) {
	const resRequest = await useRequest(arrStorage);
	// localStorage.clear();
	return showResult(resRequest);
}

async function getImages(event) {
	event.preventDefault();
	const arr = await checkInputs();
	const resRequest = await useRequest(arr);
	showResult(resRequest);
}

async function checkInputs() {
	const warningDiv = inputblock.querySelector('.inputblock__res');
	const data = new FormData(form);
	const arr = [];
	const valMin = 1;
	const valMax = 10;
	for (let [name, value] of data) {
		let text = '';
		if (value == '' || value < valMin || value > valMax) {
			if (name == 'number_page') text = 'Номер страницы';
			if (name == 'limit_pages') text = 'Лимит';
			if ((data.get('number_page') == '' || data.get('number_page') < valMin || data.get('number_page') > valMax) &&
				(data.get('limit_pages') == '' || data.get('limit_pages') < valMin || data.get('limit_pages') > valMax))
				text = 'Номер страницы и лимит';
			addErrorToDOM(warningDiv, text);
			return arr;
		} else {
			arr.push(data.get(name));
			if (arr.length > 1) {
				clearAll(warningDiv);
				return arr;
			}
		}
	}
}

function addErrorToDOM(warningDiv, text) {
	const errorString = `<div class="inputblock__res">${text} вне диапазона от 1 до 10.</div>`;
	if (warningDiv) warningDiv.remove();
	inputblock.insertAdjacentHTML('beforeend', errorString);
	return;
}

function clearAll(warningDiv) {
	inputs.forEach(input => input.value = '');
	if (warningDiv) warningDiv.remove();
}

async function useRequest(arr) {
	const url = `https://jsonplaceholder.typicode.com/photos?_start=${arr[0]}&_limit=${arr[1]}`;

	if (arr.length > 0) {
		localStorage.setItem('data', arr);
	}

	return await fetch(url)
		.then((response) => {
			return response.json();
		})
		.then(json => json)
		.catch(() => console.log('error'));
}

async function showResult(result) {
	const imagesHTML = document.querySelector('.images');
	addImagesToDOM(imagesHTML, result);
}

async function addImagesToDOM(imagesHTML, result) {
	imagesHTML.innerHTML = '';
	result.forEach(item => {
		imagesHTML.innerHTML += `<div class="images__item images__item--animate" data-id="${item.id}"><div class="images__item-img"><img src="${item.url}" alt="image"></div><span>${item.title}</span></div>`;
	})
}