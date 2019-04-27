const CARD_TYPE_BACK = 0;
const CARD_TYPE_CREATURE = 1;
const CARD_TYPE_ACTION = 2;
const CARD_TYPE_STADIUM = 3;

class Card {
	constructor(type, name) {
		this.type = type;
		this.name = name || '';
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
		} else if (this.type === CARD_TYPE_BACK) {
			add_layer('img/card_back.png');
		} else if (this.type === CARD_TYPE_STADIUM) {
			// TODO replace the placeholder
			add_layer('img/card_bg.png');
		}

		card.addEventListener('pointerenter', (e) => {
			e.target.children[0].children[0].style.boxShadow = '2px 2px 14px white';
		});

		card.addEventListener('pointerleave', (e) => {
			e.target.children[0].children[0].style.boxShadow = '';
		});

		return card;
	}
	spawn(parent, x, y) {
		this.elem.style.left = `${x}px`;
		this.elem.style.top = `${y}px`;
		parent.appendChild(this.elem);
	}
	despawn(x, y) {
		this.elem.parent(removeChild(this.elem));
	}
	mv(x, y) {
		this.elem.style.left = `${x}px`;
		this.elem.style.top = `${y}px`;
	}
}
