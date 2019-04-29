class Preview {
	constructor(card) {
		this.layers = {};
		let div, img, span;
		const add_layer = (src) => {
			div = document.createElement('div');
			img = document.createElement('img');
			div.classList.add('img');
			img.setAttribute('src', `img/card_${src}.png`);
			div.style.display = 'none';
			div.appendChild(img);
			card.appendChild(div);
			this.layers[src] = div;
		};
		add_layer('bg');
		img.style.boxShadow = '2px 2px 14px white';
		add_layer('action_bg');
		img.style.boxShadow = '2px 2px 14px white';
		add_layer('action_swap');
		add_layer('action_retreat');
		add_layer('face_narwhal');
		add_layer('face_crab');
		add_layer('face_prawn');
		add_layer('face_shark');
		add_layer('face_shrimp');
		add_layer('face_fish');

		// TODO add text layer
		// card header
		div = document.createElement('div');
		span = document.createElement('span');
		span.classList.add('card-head');
		span.innerText = 'haw-haw!';
		div.style.display = 'none';
		div.appendChild(span);
		card.appendChild(div);
		this.header = span;
		this.layers.header = div;

		div = document.createElement('div');
		div.classList.add('desc');
		div.style.display = 'none';
		card.appendChild(div);
		this.desc = div;
		this.layers.desc = div;

		add_layer('hp');
		add_layer('pow');

		// pow & hp
		div = document.createElement('div');
		span = document.createElement('span');
		span.classList.add('pow');
		div.style.display = 'none';
		div.appendChild(span);
		card.appendChild(div);
		this.pow = span;
		this.layers.pow_text = div;

		div = document.createElement('div');
		span = document.createElement('span');
		span.classList.add('hp');
		div.style.display = 'none';
		div.appendChild(span);
		card.appendChild(div);
		this.hp = span;
		this.layers.hp_text = div;

		this.elem = card;
	}
	sl(n) { this.layers[n].style.display = 'block'; }
	hide() {
		for (let i in this.layers) {
			this.layers[i].style.display = 'none';
		}
	}
	show(card) {
		this.hide();
		if (card.type === CARD_TYPE_CREATURE) {
			this.sl('bg');
			this.sl(`face_${card.name}`);
			// TODO show text layer
			this.sl('header');
			this.header.innerText = `${card.name}`;
			this.header.classList.remove('dark');
			this.sl('desc');
			this.desc.innerText = this.describe(card.name);
			this.sl('pow_text');
			this.pow.innerText = `${POW[card.name]}`;
			this.sl('hp_text');
			this.hp.innerText = `${card.hp}`;
			this.sl('hp');
			this.sl('pow');
		} else if (card.type === CARD_TYPE_ACTION) {
			this.sl('action_bg');
			this.sl(`action_${card.name}`);
			// TODO show text layer
			this.sl('desc');
			this.desc.innerText = this.describe(card.name);
			this.sl('header');
			this.header.innerText = `${card.name}`;
			this.header.classList.add('dark');
		}
	}
	describe(name) {
		switch (name) {
			case 'fish': return 'Yummie!';
			case 'shrimp': return 'Kicks prawns twice.';
			case 'prawn': return 'Smacks shrimps twice.';
			case 'crab': return 'Bites diagonals.';
			case 'shark': return 'An overgrown fish.';
			case 'narwhal': return 'Underwater unicorn. Reaches through.';
			case 'swap': return 'Swap or relocate your creatures.';
			case 'retreat': return "Return your creature. Doesn't affect HP.";
			default: return "Did the theme suck? You bet your ass!";
		}
	}
}
