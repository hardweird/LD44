class Set {
	constructor() {
		this.field = [null, null, null, null];
		this.hand = [];
		this.deck = [];
		this.pile = [];
		this._deck_back = new Card(CARD_TYPE_BACK);
		this._deck_back.elem.classList.add('small');
	}
	deck_push(card) {
		this.deck.push(card);
	}
	pile_push(card) {
		card.elem.classList.add('small', 'pile');
		this.pile.push(card);
	}
	deck_pop() {
		return this.deck.pop();
	}
	pile_pop() {
		card.elem.classList.remove('small', 'pile');
		return this.pile.pop();
	}
}
