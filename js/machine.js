const STATE_IDLE = 0;
const STATE_PLAYER_TURN = 1;
const STATE_SWAPPING = 2;
const STATE_RETREATING = 3;
const STATE_OPP_TURN = 8;

class Machine {
	constructor() {
		this.state = STATE_IDLE;
		this.card_hold = null;
		this.to_swap = -1;
		this.to_retreat = null;
		this.turn_advanced = false;
		this.turn_acted = false;
	}
	start_game() {
		if (this.state !== STATE_IDLE) {
			console.warn(`can't start a game when state is ${this.state}`);
			return;
		}
		this.state = STATE_PLAYER_TURN;
		this._player_turn_start();
	}
	choose_card(card) {
		if (this.state !== STATE_PLAYER_TURN) return;
		if (card.type === CARD_TYPE_CREATURE && this.turn_advanced) {
			console.log('already advanced');
			//this.card_hold = null;
			//return;
		}
		if ((card.type === CARD_TYPE_ACTION || card.type === CARD_TYPE_STADIUM)
			&& this.turn_acted) {
			console.log('already acted');
			//return;
		}

		if (this.card_hold === card) {
			this.card_hold = null;
			this.state = STATE_PLAYER_TURN;
			return;
		}
		if (card.type === CARD_TYPE_CREATURE) {
			// TODO animate shadows
			// TODO move card up a bit
			this.card_hold = card;
		}
		if (card.type === CARD_TYPE_ACTION) {
			if (card.name === 'swap') {
				// TODO animate field
				this.to_swap = -1;
				this.state = STATE_SWAPPING;
				this.card_hold = card;
			} else if (card.name === 'retreat') {
				this.state = STATE_RETREATING;
				this.card_hold = card;
			}
		}
	}
	pick_card(card) {
		if (this.state === STATE_SWAPPING) {
			if (this.to_swap < 0) {
				// TODO visuals
				this.to_swap = cards.player.field.indexOf(card);
				return;
			}
			let idx = cards.player.field.indexOf(card);
			this._swap(idx, card);
		} else if (this.state === STATE_RETREATING) {
			let idx = cards.player.field.indexOf(card);
			cards.player.field[idx] = null;
			cards.player.hand.push(card);
			this.card_hold.despawn();
			card.despawn()
			cards.player.hand = _.without(cards.player.hand, this.card_hold);
			cards.player.pile.push(this.card_hold);
			this._update();
			this.state = STATE_PLAYER_TURN;
			this.acted = true;
			this.card_hold = null;
		}
	}
	choose_shadow(shad) {
		if (this.state === STATE_PLAYER_TURN) {
			if (!this.card_hold) return;
			if (this.card_hold.type !== CARD_TYPE_CREATURE) return;

			this.card_hold.despawn();
			let i = parseInt(shad.dataset.i, 10);
			cards.player.field[i] = this.card_hold;
			cards.player.hand = _.without(cards.player.hand, this.card_hold);
			this.card_hold.spawn(table, 0, 0);
			this.card_hold = null;
			this.turn_advanced = true;
			this._update();
		} else if (this.state === STATE_SWAPPING) {
			if (this.to_swap < 0) {
				// TODO animate
				return;
			}
			let idx = parseInt(shad.dataset.i, 10);
			this._swap(idx, null);
		}
		// TODO play animation when retreating
	}
	_swap(idx, card) {
		cards.player.field[idx] = cards.player.field[this.to_swap];
		cards.player.field[this.to_swap] = card;
		this.to_swap = -1;
		this.card_hold.despawn();
		cards.player.hand = _.without(cards.player.hand, this.card_hold);
		cards.player.pile.push(this.card_hold);
		this._update();
		this.state = STATE_PLAYER_TURN;
		this.acted = true;
		this.card_hold = null;
	}
	_player_turn_start() {
		cards.player.hand.push(cards.player.deck.pop());
		this.turn_advanced = false;
		this.turn_acted = false;
		this._update();
	}
	_update() {
		const h = table.offsetHeight/2;
		const w = table.offsetWidth/2;
		// hand
		let hand = document.getElementById('hand');
		for (let i in cards.player.hand) {
			if (!cards.player.hand[i].spawned) {
				cards.player.hand[i].spawn(hand);
			}
			cards.player.hand[i].mv(i*70, 0);
		}
		// field
		for (let i = 0; i < cards.player.field.length; ++i) {
			const x = w-2*CARD_SPAN + i*CARD_SPAN;
			if (cards.player.field[i]) {
				if (!cards.player.field[i].spawned) {
					cards.player.field[i].spawn(table);
				}
				cards.player.field[i].mv(x, h-50);
			}
			if (cards.opponent.field[i]) {
				if (!cards.opponent.field[i].spawned) {
					cards.opponent.field[i].spawn(table);
				}
				cards.opponent.field[i].mv(x, h-200);
			}
		}
		// decks & piles
		if (cards.player.deck.length > 0) {
			cards.player._deck_back.mv(w+1.5*CARD_SPAN, h+150);
		}
		if (cards.opponent.deck.length > 0) {
			cards.opponent._deck_back.mv(w-3.5*CARD_SPAN, h-300);
		}
		if (cards.player.pile.length > 0) {
			let l = last(cards.player.pile);
			l.elem.classList.add('small');
			if (!l.spawned) l.spawn(table);
			l.mv(w+2.5*CARD_SPAN, h+150);
		}
		if (cards.opponent.pile.length > 0) {
			let l = last(cards.opponent.pile);
			l.elem.classList.add('small');
			if (!l.spawned) l.spawn(table);
			l.mv(w-4.5*CARD_SPAN, h-300);
		}
	}
}
