const CARD_TYPE_BACK = 0;
const CARD_TYPE_CREATURE = 1;
const CARD_TYPE_ACTION = 2;
const CARD_TYPE_STADIUM = 3;

class Card {
	constructor(type, name) {
		this.type = type;
		this.name = name || '';
		this.label_pow = null;
		this.label_hp = null;
		this.spawned = false;
		this.hp = 0;
		this.elem = this.mk_elem();
	}
	mk_elem() {
		let card = document.createElement('div');
		card.classList.add('card');

		let div, img;
		const add_layer = (src) => {
			div = document.createElement('div');
			img = document.createElement('img');
			div.classList.add('img');
			img.setAttribute('src', src);
			div.appendChild(img);
			card.appendChild(div);
		};

		if (this.type === CARD_TYPE_CREATURE) {
			add_layer('img/card_bg.png');
			add_layer(`img/card_face_${this.name}.png`);
			add_layer('img/card_pow.png');
			add_layer('img/card_hp.png');
			this.hp = HEALTH[this.name];

			div = document.createElement('div');
			let label_pow = document.createElement('span');
			label_pow.classList.add('pow');
			label_pow.innerText = `${POW[this.name]}`;
			div.appendChild(label_pow);
			card.appendChild(div);
			this.label_pow = label_pow;

			div = document.createElement('div');
			let label_hp = document.createElement('span');
			label_hp.classList.add('hp');
			label_hp.innerText = `${this.hp}`;
			div.appendChild(label_hp);
			card.appendChild(div);
			this.label_hp = label_hp;

			div = document.createElement('div');
			let span = document.createElement('span');
			span.classList.add('card-head');
			span.innerText = `${this.name}`;
			div.appendChild(span);
			card.appendChild(div);
		} else if (this.type === CARD_TYPE_BACK) {
			add_layer('img/card_back.png');
		} else if (this.type === CARD_TYPE_ACTION) {
			add_layer('img/card_action_bg.png');
			add_layer(`img/card_action_${this.name}.png`);

			div = document.createElement('div');
			let span = document.createElement('span');
			span.classList.add('card-head', 'dark');
			span.innerText = `${this.name}`;
			div.appendChild(span);
			card.appendChild(div);
		} else if (this.type === CARD_TYPE_STADIUM) {
			add_layer('img/card_action_bg.png');
			add_layer(`img/card_stad_${this.name}.png`);
		}

		card.addEventListener('pointerenter', (e) => {
			e.target.children[0].children[0].style.boxShadow = '2px 2px 14px white';
			preview.show(this);
		});

		card.addEventListener('pointerleave', (e) => {
			e.target.children[0].children[0].style.boxShadow = '';
			preview.hide();
		});

		card.addEventListener('click', (e) => {
			if (cards.player.hand.includes(this)) {
				machine.choose_card(this);
			} else if (cards.player.field.includes(this)) {
				machine.pick_card(this);
			}
		});

		return card;
	}
	spawn(parent, x, y, down) {
		parent.appendChild(this.elem);
		this.spawned = true;
	}
	despawn() {
		this.elem.parentElement.removeChild(this.elem);
		this.spawned = false;
	}
	mv(x, y, down) {
		this.elem.style.left = `${x}px`;
		if (down) {
			this.elem.style.bottom = `${y}px`;
		} else {
			this.elem.style.top = `${y}px`;
		}
	}
	update_stats() {
		if (!this.label_hp) return;
		this.label_hp.innerText = `${this.hp}`;
	}
}
