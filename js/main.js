const CARD_SPAN = 130;

let cards = {
	player: null,
	opponent: null,
	stadium: null
};
let shads = {
	player: [],
	opponent: []
};
let table;
let preview;

function fill_decks() {
	let pd = [], od = [];
	for (let i = 0; i < FREQ_FISH; ++i) {
		pd.push(new Card(CARD_TYPE_CREATURE, 'fish'));
		od.push(new Card(CARD_TYPE_CREATURE, 'fish'));
	}
	for (let i = 0; i < FREQ_SHRIMP; ++i) {
		pd.push(new Card(CARD_TYPE_CREATURE, 'shrimp'));
		od.push(new Card(CARD_TYPE_CREATURE, 'shrimp'));
	}
	for (let i = 0; i < FREQ_PRAWN; ++i) {
		pd.push(new Card(CARD_TYPE_CREATURE, 'prawn'));
		od.push(new Card(CARD_TYPE_CREATURE, 'prawn'));
	}
	for (let i = 0; i < FREQ_CRAB; ++i) {
		pd.push(new Card(CARD_TYPE_CREATURE, 'crab'));
		od.push(new Card(CARD_TYPE_CREATURE, 'crab'));
	}
	for (let i = 0; i < FREQ_SHARK; ++i) {
		pd.push(new Card(CARD_TYPE_CREATURE, 'shark'));
		od.push(new Card(CARD_TYPE_CREATURE, 'shark'));
	}
	for (let i = 0; i < FREQ_NARWHAL; ++i) {
		pd.push(new Card(CARD_TYPE_CREATURE, 'narwhal'));
		od.push(new Card(CARD_TYPE_CREATURE, 'narwhal'));
	}
	// TODO actions and stadium
	cards.player.deck = _.shuffle(pd);
	cards.opponent.deck = _.shuffle(od);
}

function deal() {
	for (let i = 0; i < HAND_SIZE; ++i)	{
		cards.player.hand.push(cards.player.deck.pop());
		cards.opponent.hand.push(cards.opponent.deck.pop());
	}
}

function pfield_cpos(i) {
	const w = table.offsetWidth/2;
	const h = table.offsetHeight/2;
	return [w-2*CARD_SPAN + i*CARD_SPAN, h-50];
}

function init() {
	table = document.getElementById('table');

	cards.player = new Set();
	cards.opponent = new Set();
	preview = new Preview(document.getElementById('preview'));
	machine = new Machine();

	fill_decks();
	deal();

	machine.start_game();

	/* spawn some cards for testing purposes */
	/*{
		// TODO rotate cards in hand
		let hand = cards.player.hand;
		let div = document.getElementById('hand');
		for (let i in hand) {
			hand[i].spawn(div, i*70, 0);
		}
	}*/
	const h = table.offsetHeight/2;
	const w = table.offsetWidth/2;
	for (let i in cards.player.field) {
		const [x, y] = pfield_cpos(i);
		shads.player.push(shadow(table, x, y, i, (shad) => {
			machine.choose_shadow(shad);
		}));
		shads.opponent.push(shadow(table, x, h-200));
		//cards.player.field[i].spawn(table, x, h-200);
		//cards.opponent.field[i].spawn(table, x, h-50);
		
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
	//cards.stadium.spawn(table, w-3.5*CARD_SPAN, h-125);

	/* should move all the things on resize */
	window.addEventListener('resize', (e) => {
		const h = table.offsetHeight/2;
		const w = table.offsetWidth/2;
		for (let i in shads.player) {
			const x = w-2*CARD_SPAN + i*CARD_SPAN;
			shads.player[i].style.left = `${x}px`;
			shads.player[i].style.top = `${h-50}px`;
			shads.opponent[i].style.left = `${x}px`;
			shads.opponent[i].style.top = `${h-200}px`;
			if (cards.player.field[i]) {
				cards.player.field[i].mv(x, h-50);
			}
			if (cards.opponent.field[i]) {
				cards.opponent.field[i].mv(x, h-200);
			}
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
		//cards.stadium.mv(w-3.5*CARD_SPAN, h-125);
	});
}
