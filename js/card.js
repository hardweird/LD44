class Card {
	constructor(type) {
		this.type = type;
		this.elem = this.mk_elem();
	}
	mk_elem() {
		let card = document.createElement('div');
		card.classList.add('card');
		
		let div = document.createElement('div');
		let img = document.createElement('img');
		div.classList.add('img');
		img.setAttribute('src', 'img/card_bg.png');
		div.appendChild(img);
		card.appendChild(div);

		div = document.createElement('div');
		img = document.createElement('img');
		div.classList.add('img');
		img.setAttribute('src', `img/card_face_${this.type}.png`);
		div.appendChild(img);
		card.appendChild(div);

		div = document.createElement('div');
		img = document.createElement('img');
		div.classList.add('img');
		img.setAttribute('src', 'img/card_pow.png');
		div.appendChild(img);
		card.appendChild(div);

		div = document.createElement('div');
		img = document.createElement('img');
		div.classList.add('img');
		img.setAttribute('src', 'img/card_hp.png');
		div.appendChild(img);
		card.appendChild(div);

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
	mv(x, y) {
		this.elem.style.left = `${x}px`;
		this.elem.style.top = `${y}px`;
	}
}
