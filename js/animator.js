class Animator {
	constructor() {
		this.creatures_pulsed = false;
		this.swap_pulsed = false;
		this.retreat_pulsed = false;
	}
	id_creatures() {
		if (!this.creatures_pulsed) {
			this.pulse_shadows();
			this.creatures_pulsed = true;
		}
		this.id_shadows();
	}
	id_swap_fst() {
		if (!this.swap_pulsed) {
			this.pulse_field();
		}
		this.id_field();
	}
	id_swap_snd() {
		if (!this.swap_pulsed) {
			this.pulse_field(true);
			this.pulse_shadows();
			this.swap_pulsed = true;
		}
		this.id_field();
		this.id_shadows();
	}
	id_retreat() {
		if (!this.retreat_pulsed) {
			this.pulse_field();
			this.retreat_pulsed = true;
		}
		this.id_field();
	}

	pulse_shadows() {
		for (let i in shads.player) {
			let idx = parseInt(shads.player[i].dataset.i, 10);
			if (cards.player.field[idx]) continue;
			shads.player[i].classList.add('pulse');
		}
	}
	id_shadows() {
		for (let i in shads.player) {
			let idx = parseInt(shads.player[i].dataset.i, 10);
			if (cards.player.field[idx]) continue;
			shads.player[i].classList.add('id');
		}
	}
	pulse_field(again) {
		let field = cards.player.field;
		for (let i in field) {
			if (!field[i]) continue;
			field[i].elem.classList.add(again ? 'pulse-again' : 'pulse');
		}
	}
	id_field() {
		let field = cards.player.field;
		for (let i in field) {
			if (!field[i]) continue;
			field[i].elem.classList.add('id');
		}
	}

	clear_shadows() {
		for (let i in shads.player) {
			shads.player[i].classList.remove('pulse', 'id');
		}
	}
	clear_field() {
		let field = cards.player.field;
		for (let i in field) {
			if (!field[i]) continue;
			field[i].elem.classList.remove('pulse', 'pulse-again', 'id');
		}
	}

	fight(log) {
		//for (let i = 0; i < log.length; ++i) {
		//}
	}
}
