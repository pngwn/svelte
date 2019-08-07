import send from '@polka/send';
import get_recipes from './_recipes.js';

let json;

export function get(req, res) {
	if (!json || process.env.NODE_ENV !== 'production') {
		json = get_recipes();
		console.log(json)
	}
	console.log('hi', json)
	send(res, 200, json);
}
