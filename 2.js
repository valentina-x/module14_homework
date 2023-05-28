const jsonString = `
{
 "list": [
  {
   "name": "Petr",
   "age": "20",
   "prof": "mechanic"
  },
  {
   "name": "Vova",
   "age": "60",
   "prof": "pilot"
  }
 ]
}
`;

const data = JSON.parse(jsonString);

console.log('list', createObj(data));

function createObj(data) {
	const list = {};
	for (let key of Object.keys(data)) {
		for (let child in data[key]) {
			// console.log(child + " -> " + data[key][child])
			list[child] = data[key][child];
		}
	}
	return list;
}