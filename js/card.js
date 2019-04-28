const CARD_TYPE_BACK = 0;
const CARD_TYPE_CREATURE = 1;
const CARD_TYPE_ACTION = 2;
const CARD_TYPE_STADIUM = 3;

class Card {
	constructor(type, name) {
		this.type = type;
		this.name = name || '';
		this.elem = this.mk_elem();
		this.spawned = false;
		this.hp = 0;
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
			// TODO text layer for hp and pow
		} else if (this.type === CARD_TYPE_BACK) {
			add_layer('img/card_back.png');
		} else if (this.type === CARD_TYPE_ACTION) {
			add_layer('img/card_action_bg.png');
			add_layer(`img/card_action_${this.name}.png`);
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
}
