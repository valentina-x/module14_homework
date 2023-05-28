/*
 * Вам дана заготовка и результат, который вы должны получить. 
 * Ваша задача — написать код, который будет преобразовывать XML в JS-объект и выводить его в консоль.
 */

const xmlString = `<list>
  <student>
    <name lang="en">
      <first>Ivan</first>
      <second>Ivanov</second>
    </name>
    <age>35</age>
    <prof>teacher</prof>
  </student>
  <student>
    <name lang="ru">
      <first>Петр</first>
      <second>Петров</second>
    </name>
    <age>58</age>
    <prof>driver</prof>
  </student>
</list>`;

const exParse = new DOMParser();

const newXML = exParse.parseFromString(xmlString, "text/xml");

const parentNode = newXML.firstChild; // общий родитель

console.log('list', createObjectFromXML(parentNode));

function createObjectFromXML(parentNode) {

	// потомки верхнего уровня
	const parentNodeChildren = parentNode.children;
	const list = {};

	for (let x = 0; x < parentNodeChildren.length; x++) {

		const childNodeChildren = parentNodeChildren[x].children;

		list[x] = {};

		for (let i = 0; i < childNodeChildren.length; i++) {

			let key = childNodeChildren[i].tagName;
			let value = childNodeChildren[i].textContent;

			list[x][key] = checkNumber(value, modifyString);

			// добавление атрибутов в объект
			if (childNodeChildren[i].hasAttributes()) {
				let keyAttributes = childNodeChildren[i].attributes;
				addAttributeContentToObject(keyAttributes);
			}

			function addAttributeContentToObject(keyAttributes) {
				for (let j = 0; j < keyAttributes.length; j++) {
					list[x][keyAttributes[j].name] = keyAttributes[j].value;
				}
			}

			function modifyString(value) {
				let valueRes = '';
				if (value.includes('  ') || value.includes('\n')) {
					let nameChildren = childNodeChildren[i].children;
					for (let l = 0; l < nameChildren.length; l++) {
						valueRes += nameChildren[l].textContent + ' ';
					}
				} else {
					valueRes = value;
				}
				valueRes = valueRes.trim();
				return valueRes;
			}

			function checkNumber(value, func) {
				let string = modifyString(value);
				return !isNaN(value) ? Number(value) : func(value);
			}

		}
	}

	return list;
}