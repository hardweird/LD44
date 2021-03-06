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
let hp = { player: 48, opponent: 48 };
let hp_shell = {player: null, opponent: null};
let table;
let preview;
let animator;
let indicators = { player: null, opponent: null };

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
	for (let i = 0; i < FREQ_SWAP; ++i) {
		pd.push(new Card(CARD_TYPE_ACTION, 'swap'));
		od.push(new Card(CARD_TYPE_ACTION, 'swap'));
	}
	for (let i = 0; i < FREQ_RETREAT; ++i) {
		pd.push(new Card(CARD_TYPE_ACTION, 'retreat'));
		od.push(new Card(CARD_TYPE_ACTION, 'retreat'));
	}
	/*for (let i = 0; i < FREQ_STADIUM; ++i) {
		pd.push(new Card(CARD_TYPE_STADIUM, 'fish'));
		pd.push(new Card(CARD_TYPE_STADIUM, 'shrimp'));
		pd.push(new Card(CARD_TYPE_STADIUM, 'prawn'));
		pd.push(new Card(CARD_TYPE_STADIUM, 'shark'));
		pd.push(new Card(CARD_TYPE_STADIUM, 'crab'));
		pd.push(new Card(CARD_TYPE_STADIUM, 'narwhal'));
		od.push(new Card(CARD_TYPE_STADIUM, 'fish'));
		od.push(new Card(CARD_TYPE_STADIUM, 'shrimp'));
		od.push(new Card(CARD_TYPE_STADIUM, 'prawn'));
		od.push(new Card(CARD_TYPE_STADIUM, 'shark'));
		od.push(new Card(CARD_TYPE_STADIUM, 'crab'));
		od.push(new Card(CARD_TYPE_STADIUM, 'narwhal'));
	}*/
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

function track_card(card) {
	let idx = cards.player.deck.indexOf(card);
	if (idx >= 0) console.log(`player deck: ${idx}`);
	idx = cards.player.hand.indexOf(card);
	if (idx >= 0) console.log(`player hand: ${idx}`);
	idx = cards.player.field.indexOf(card);
	if (idx >= 0) console.log(`player field: ${idx}`);
	idx = cards.player.pile.indexOf(card);
	if (idx >= 0) console.log(`player pile: ${idx}`);

	idx = cards.opponent.deck.indexOf(card);
	if (idx >= 0) console.log(`opponent deck: ${idx}`);
	idx = cards.opponent.hand.indexOf(card);
	if (idx >= 0) console.log(`opponent hand: ${idx}`);
	idx = cards.opponent.field.indexOf(card);
	if (idx >= 0) console.log(`opponent field: ${idx}`);
	idx = cards.opponent.pile.indexOf(card);
	if (idx >= 0) console.log(`opponent pile: ${idx}`);
}

function init() {
	table = document.getElementById('table');
	hp_shell.player = document.getElementById('p1-shell');
	hp_shell.opponent = document.getElementById('p2-shell');
	indicators.player = document.querySelectorAll('#p1-shell, #you');
	indicators.opponent = document.querySelectorAll('#p2-shell, #bob');

	cards.player = new Set();
	cards.opponent = new Set();
	preview = new Preview(document.getElementById('preview'));
	machine = new Machine();
	animator = new Animator();

	fill_decks();
	deal();

	const h = table.offsetHeight/2;
	const w = table.offsetWidth/2;
	for (let i = 0; i < cards.player.field.length; ++i) {
		const [x, y] = pfield_cpos(i);
		shads.player.push(shadow(table, x, y, i, (shad) => {
			machine.choose_shadow(shad);
		}));
		shads.opponent.push(shadow(table, x, h-200, i));
		document.querySelectorAll(`.drop[data-card="${i}"]`).forEach((e) => {
			e.style.left = `${x+20}px`;
		});
	}
	document.querySelectorAll('.drop[data-side="0"]').forEach((e) => { e.style.top = `${h}px`; });
	document.querySelectorAll('.drop[data-side="1"]').forEach((e) => { e.style.top = `${h-110}px`; });
	if (cards.player.deck.length > 0) {
		cards.player._deck_back.spawn(table, w+1.5*CARD_SPAN, h+150);
	}
	if (cards.opponent.deck.length > 0) {
		cards.opponent._deck_back.spawn(table, w-3.5*CARD_SPAN, h-300);
	}
	//cards.stadium.spawn(table, w-3.5*CARD_SPAN, h-125);
	
	document.getElementById('pass').addEventListener('click', (e) => {
		machine.pass();
	});

	document.querySelectorAll('.drop').forEach((e) => {
		let cb = (e) => { e.target.classList.remove('ascend'); };
		e.addEventListener('webkitAnimationEnd', cb);
		e.addEventListener('animationend', cb);
	});

	let to;
	let bob = document.getElementById('bob-img');
	bob.addEventListener('mouseover', (e) => {
		to = setTimeout(() => {
			table.classList.add('move');
		}, 200);
	});
	bob.addEventListener('mouseout', (e) => {
		clearTimeout(to);
		table.classList.remove('move');
	});

	document.getElementById('start-btn').addEventListener('click', (e) => {
		machine.start_game();
	});

	/* should move all the things on resize */
	window.addEventListener('resize', (e) => {
		if (machine.state === STATE_IDLE) return;
		const h = table.offsetHeight/2;
		const w = table.offsetWidth/2;
		for (let i = 0; i < shads.player.length; ++i) {
			const x = w-2*CARD_SPAN + i*CARD_SPAN;
			shads.player[i].style.left = `${x}px`;
			shads.player[i].style.top = `${h-50}px`;
			shads.opponent[i].style.left = `${x}px`;
			shads.opponent[i].style.top = `${h-200}px`;
			document.querySelectorAll(`.drop[data-card="${i}"]`).forEach((e) => {
				e.style.left = `${x+20}px`;
			});
		}
		document.querySelectorAll('.drop[data-side="0"]').forEach((e) => { e.style.top = `${h}px`; });
		document.querySelectorAll('.drop[data-side="1"]').forEach((e) => { e.style.top = `${h-110}px`; });
		machine._update();
		//cards.stadium.mv(w-3.5*CARD_SPAN, h-125);
	});


	//machine.start_game();
}
