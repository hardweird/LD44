const CARD_SPAN = 130;

let cards = {
	player: null,
	opponent: null,
	stadium: null
};

let table;

function init() {
	table = document.getElementById('table');

	cards.player = new Set();
	cards.opponent = new Set();

	cards.player.desk = [
		new Card('fish'),
		new Card('shrimp'),
		new Card('shark'),
		new Card('prawn')
	];
	cards.opponent.desk = [
		new Card('fish'),
		new Card('prawn'),
		new Card('shark'),
		new Card('fish')
	];

	/* spawn some cards for testing purposes */
	const h = window.innerHeight/2;
	for (let i in cards.player.desk) {
		const x = (window.innerWidth/2)-2*CARD_SPAN + i*CARD_SPAN;
		cards.player.desk[i].spawn(table, x, h-200);
		cards.opponent.desk[i].spawn(table, x, h-50);
	}

	window.addEventListener('resize', (e) => {
		//const h = window.innerHeight/2;
		for (let i in cards.player.desk) {
			const x = (window.innerWidth/2)-2*CARD_SPAN + i*CARD_SPAN;
			cards.player.desk[i].spawn(table, x, h-200);
			cards.opponent.desk[i].spawn(table, x, h-50);
		}
	});
}
