/*
Напишите код приложения, интерфейс которого представляет собой 2 input и кнопку submit. В input можно ввести любое число.

При клике на кнопку происходит следующее:

Если оба числа не попадают в диапазон от 100 до 300 или введено не число — выводить ниже текст «одно из чисел вне диапазона от 100 до 300»;
Если числа попадают в диапазон от 100 до 300 — сделать запрос c помощью fetch по URL https://picsum.photos/200/300, где первое число — ширина картинки, второе — высота.
Пример. Если пользователь ввёл 150 и 200, то запрос будет вида https://picsum.photos/150/200.
После получения данных вывести ниже картинку на экран.
*/

const inputblock = document.querySelector('.inputblock');
const inputs = inputblock.querySelectorAll('.inputblock__input');
const submit = inputblock.querySelector('.inputblock__btn');

submit.addEventListener('click', checkInputs);

function checkInputs() {
	const warningDiv = inputblock.querySelector('.inputblock__res');
	const valuesArr = checkValue(inputs);

	if (valuesArr.includes(true)) {
		addErrorToDOM(warningDiv);
		return;
	}

	if (valuesArr.includes(false)) {
		clearAll(warningDiv);
		return useRequest(valuesArr, showResult);
	}
}

function checkValue(inputs) {
	const valuesArr = [];
	let pointError = false;
	inputs.forEach(input => {
		if (input.value == '' || input.value < 100 || input.value > 300) {
			pointError = true;
		} else {
			valuesArr.push(input.value);
		}
	})
	valuesArr.push(pointError);
	return valuesArr;
}

function addErrorToDOM(warningDiv) {
	if (!warningDiv) {
		const errorString = `<div class="inputblock__res">Одно из чисел вне диапазона от 100 до 300.</div>`;
		inputblock.insertAdjacentHTML('beforeend', errorString);
	}
}

function clearAll(warningDiv) {
	inputs.forEach(input => input.value = '');
	if (warningDiv) {
		warningDiv.remove();
	}
}

function useRequest(valuesArr, callback) {
	const url = `https://loremflickr.com/${valuesArr[0]}/${valuesArr[1]}/`;

	return fetch(url)
		.then((response) => {
			// const result = response.json(); не работает. возникает ошибка https://skr.sh/sK3zJTbFxUb?a мне подсказали в чате, что у ресурса стоит cors запрет на парсинг
			// поэтому передаю на прямую ответ, и от туда выдергиваю url
			if (callback) return callback(response);
		})
		.catch(() => console.log('error'));
}

function showResult(result) {
	const imagesHTML = document.querySelector('.images');
	addImagesToDOM(imagesHTML, result);
}

function addImagesToDOM(imagesHTML, result) {
	imagesHTML.innerHTML = '';
	imagesHTML.innerHTML += `<div class="images__item images__item--animate"><div class="images__item-img"><img src="${result.url}" alt="image"></div></div>`;
}