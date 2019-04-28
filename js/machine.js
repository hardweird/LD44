const STATE_IDLE = 0;
const STATE_PLAYER_TURN = 1;
const STATE_OPP_TURN = 2;

class Machine {
	constructor() {
		this.state = STATE_IDLE;
		this.card_hold = null;
	}
	start_game() {
		if (this.state !== STATE_IDLE) {
			console.warn(`can't start a game when state is ${this.state}`);
			return;
		}
		this.state = STATE_PLAYER_TURN;
		this._player_turn();
	}
	choose_card(card) {
		if (this.state !== STATE_PLAYER_TURN) return;
		if (!cards.player.hand.includes(card)) {
			console.log('not in hand');
			return
		}
		if (this.card_hold === card) {
			this.card_hold = null;
			return;
		}
		// TODO animate shadows
		// TODO move card up a bit
		this.card_hold = card;
	}
	choose_shadow(shad) {
		if (this.state !== STATE_PLAYER_TURN) return;
		if (!this.card_hold) return;
		this.card_hold.despawn();

		let i = parseInt(shad.dataset.i, 10);
		let [x, y] = pfield_cpos(i);
		cards.player.field[i] = this.card_hold;
		cards.player.hand = _.without(cards.player.hand, this.card_hold);
		this.card_hold.spawn(table, `${x}px`, `${y}px`);
		this.card_hold = null;
	}
	_player_turn() {
		cards.player.hand.push(cards.player.deck.pop());
		this._update();
	}
	_update() {
		let hand = document.getElementById('hand');
		for (let i in cards.player.hand) {
			if (cards.player.hand[i].spawned) {
				cards.player.hand[i].mv(i*70, 0);
			} else {
				cards.player.hand[i].spawn(hand, i*70, 0);
			}
		}
	}
}
