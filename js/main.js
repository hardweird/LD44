const CARD_SPAN = 130;

let cards = {
	player: null,
	opponent: null,
	stadium: null
};
let table;
let preview;

function init() {
	table = document.getElementById('table');

	cards.player = new Set();
	cards.opponent = new Set();
	preview = new Preview(document.getElementById('preview'));

	/* testing positions */
	cards.player.field = [
		new Card(CARD_TYPE_CREATURE, 'fish'),
		new Card(CARD_TYPE_CREATURE, 'shrimp'),
		new Card(CARD_TYPE_CREATURE, 'shark'),
		new Card(CARD_TYPE_CREATURE, 'prawn')
	];
	cards.opponent.field = [
		new Card(CARD_TYPE_CREATURE, 'fish'),
		new Card(CARD_TYPE_CREATURE, 'prawn'),
		new Card(CARD_TYPE_CREATURE, 'shark'),
		new Card(CARD_TYPE_CREATURE, 'fish')
	];
	cards.player.deck_push(new Card(CARD_TYPE_CREATURE, 'prawn'));
	cards.opponent.deck_push(new Card(CARD_TYPE_CREATURE, 'shrimp'));
	cards.player.pile_push(new Card(CARD_TYPE_CREATURE, 'crab'));
	cards.opponent.pile_push(new Card(CARD_TYPE_CREATURE, 'fish'));
	cards.stadium = new Card(CARD_TYPE_STADIUM);
	cards.player.hand = [
		new Card(CARD_TYPE_CREATURE, 'crab'),
		new Card(CARD_TYPE_CREATURE, 'crab'),
		new Card(CARD_TYPE_CREATURE, 'crab'),
		new Card(CARD_TYPE_CREATURE, 'crab'),
		new Card(CARD_TYPE_CREATURE, 'crab'),
	];
	//preview.show(CARD_TYPE_CREATURE, 'narwhal');

	/* spawn some cards for testing purposes */
	{
		// TODO rotate hand's cards
		let hand = cards.player.hand;
		let div = document.getElementById('hand');
		for (let i in hand) {
			hand[i].spawn(div, i*70, 0);
		}
	}
	const h = table.offsetHeight/2;
	const w = table.offsetWidth/2;
	for (let i in cards.player.field) {
		const x = w-2*CARD_SPAN + i*CARD_SPAN;
		cards.player.field[i].spawn(table, x, h-200);
		cards.opponent.field[i].spawn(table, x, h-50);
	}
	if (cards.player.deck.length > 0) {
		cards.player._deck_back.spawn(table, w+1.5*CARD_SPAN, h+150);
	}
	if (cards.opponent.deck.length > 0) {
		cards.opponent._deck_back.spawn(table, w-3.5*CARD_SPAN, h-300);
	}
	if (cards.player.pile.length > 0) {
		last(cards.player.pile).spawn(table, w+2.5*CARD_SPAN, h+150);
	}
	if (cards.opponent.pile.length > 0) {
		last(cards.opponent.pile).spawn(table, w-4.5*CARD_SPAN, h-300);
	}
	cards.stadium.spawn(table, w-3.5*CARD_SPAN, h-125);

	/* should move all the things on resize */
	window.addEventListener('resize', (e) => {
		const h = table.offsetHeight/2;
		const w = table.offsetWidth/2;
		for (let i in cards.player.field) {
			const x = w-2*CARD_SPAN + i*CARD_SPAN;
			cards.player.field[i].mv(x, h-200);
			cards.opponent.field[i].mv(x, h-50);
		}
		if (cards.player.deck.length > 0) {
			cards.player._deck_back.mv(w+1.5*CARD_SPAN, h+150);
		}
		if (cards.opponent.deck.length > 0) {
			cards.opponent._deck_back.mv(w-3.5*CARD_SPAN, h-300);
		}
		if (cards.player.pile.length > 0) {
			last(cards.player.pile).mv(w+2.5*CARD_SPAN, h+150);
		}
		if (cards.opponent.pile.length > 0) {
			last(cards.opponent.pile).mv(w-4.5*CARD_SPAN, h-300);
		}
		cards.stadium.mv(w-3.5*CARD_SPAN, h-125);
	});
}
