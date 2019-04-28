class Preview {
	constructor(card) {
		this.layers = {};
		let div, img;
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
		add_layer('hp');
		add_layer('pow');
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
			this.sl('hp');
			this.sl('pow');
		} else if (card.type === CARD_TYPE_ACTION) {
			this.sl('action_bg');
			this.sl(`action_${card.name}`);
		}
	}
}