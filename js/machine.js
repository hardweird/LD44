const STATE_IDLE = 0;
const STATE_PLAYER_TURN = 1;
const STATE_SWAPPING = 2;
const STATE_RETREATING = 3;
const STATE_FIGHT = 4;
const STATE_OPP_TURN = 5;

const PT = 0;
const OT = 1;

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

		indicators.player.forEach((e) => { e.classList.remove('hidden') });
		indicators.opponent.forEach((e) => { e.classList.remove('hidden') });
		document.getElementById('pass').classList.remove('hidden');
		table.classList.remove('empty');
		document.getElementById('start').classList.add('hidden');
		document.getElementById('bob-img').classList.remove('hidden');

		this.state = STATE_PLAYER_TURN;
		this._player_turn_start();
	}
	_game_over(win) {
		this.state = STATE_IDLE;
		document.getElementById('pass').classList.add('hidden');
		table.classList.add('empty');

		if (win) document.getElementById('win').classList.remove('hidden');
		else document.getElementById('lose').classList.remove('hidden');
	}
	choose_card(card) {
		if (this.card_hold === card) {
			this._unhold();
			this.state = STATE_PLAYER_TURN;
			return;
		}
		if (this.state !== STATE_PLAYER_TURN) return;
		if (card.type === CARD_TYPE_CREATURE && this.turn_advanced) {
			console.log('already advanced');
			this.card_hold = null;
			return;
		}
		if ((card.type === CARD_TYPE_ACTION || card.type === CARD_TYPE_STADIUM)
			&& this.turn_acted) {
			console.log('already acted');
			return;
		}

		if (card.type === CARD_TYPE_CREATURE) {
			animator.id_creatures();
			this._hold(card);
		}
		if (card.type === CARD_TYPE_ACTION) {
			if (card.name === 'swap') {
				animator.id_swap_fst();
				this.to_swap = -1;
				this.state = STATE_SWAPPING;
				this._hold(card);
			} else if (card.name === 'retreat') {
				animator.id_retreat();
				this.state = STATE_RETREATING;
				this._hold(card);
			}
		}
	}
	pick_card(card) {
		if (this.state === STATE_SWAPPING) {
			if (this.to_swap < 0) {
				animator.id_swap_snd();
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
			this._unhold();
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
			this._unhold();
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
	pass(event) {
		if (this.state !== STATE_PLAYER_TURN) {
			console.log(`won't pass in state ${this.state}`);
			return;
		}
		this.state = STATE_FIGHT;
		this._fight(PT);
	}
	_player_turn_start() {
		cards.player.hand.push(cards.player.deck.pop());
		this.turn_advanced = false;
		this.turn_acted = false;
		this._update();
	}
	_fight(t) {
		let ord = t === PT ? ['player', 'opponent'] : ['opponent', 'player'];
		let delay = 0;
		let that = this;

		for (let o = 0; o < ord.length; ++o) {
			let atkr = ord[o];
			let dfnr = ord[o === 0 ? 1 : 0];
			let log = [];

			for (let i = 0; i < cards[atkr].field.length; ++i) {
				if (!cards[atkr].field[i]) continue;

				let offender = cards[atkr].field[i];
				if (offender.name === 'crab') {
					let def_i = [i-1, i+1];
					for (let d = 0; d < def_i.length; ++d) {
						if (!cards[dfnr].field[def_i[d]]) continue;
						//defenders[d].hp -= POW[offender.name];
						log.push(this._log(i, def_i[d], offender.pow));
					}
				} else {
					let defender = cards[dfnr].field[i];
					if (!defender) {
						//hp[dfnr] -= POW[offender.name]
						log.push(this._log(i, -1, offender.pow));
					} else {
						//defender.hp -= POW[offender.name];
						log.push(this._log(i, i, offender.pow));
						if (offender.name === 'narwhal') {
							//hp[dfnr] -= POW[offender.name]/2 | 0;
							log.push(this._log(i, -1, offender.pow/2 | 0));
						} else if (offender.name === 'shrimp' && defender.name === 'prawn'
							|| offender.name === 'prawn' && defender.name === 'shrimp') {
							//defender.hp -= POW[offender.name];
							log.push(this._log(i, i, offender.pow));
						}
					}
				}
			}
			//console.log(this._log_optimize(log));
			let opt_log = this._log_optimize(log);
			// TODO animate log
			delay += animator.fight(atkr, dfnr, opt_log);
			// apply damage
			setTimeout(() => {
				//console.log(`fight, ${atkr}, delay: ${delay}`);
				for (let i = 0; i < opt_log.length; ++i) {
					if (opt_log[i].d === -1) {
						hp[dfnr] -= opt_log[i].p;
					} else {
						cards[dfnr].field[opt_log[i].d].hp -= opt_log[i].p;
					}
				}
				// clean up
				for (let i = 0; i < cards[dfnr].field.length; ++i) {
					let card = cards[dfnr].field[i];
					if (!card) continue;
					if (card.hp <= 0) {
						// TODO animation
						card.despawn();
						cards[dfnr].field[i] = null;
						cards[dfnr].pile.push(card);
					}
				}
				that._update();
			}, delay);
		}

		setTimeout(() => {
			if (hp.player <= 0) this._game_over(false);
			if (hp.opponent <= 0) this._game_over(true);
			if (t === PT) {
				that.state = STATE_OPP_TURN;
				that._opponent_turn_start();
			} else {
				that.state = STATE_PLAYER_TURN;
				that._player_turn_start();
			}
		}, delay);
	}
	_log(attacker, defender, pow) {
		return {a: attacker, d: defender, p: pow};
	}
	_log_optimize(log) {
		let m = {};
		let res = [];
		for (let i = 0; i < log.length; ++i) {
			m[log[i].d] = m[log[i].d] ? m[log[i].d] + log[i].p : log[i].p;
		}
		for (let i in m) {
			res.push(this._log(0, parseInt(i, 10), m[i]));
		}
		return res;
	}
	_opponent_turn_start() {
		// draw a card
		cards.opponent.hand.push(cards.opponent.deck.pop());
		// advance some creatures
		let creatures = cards.opponent.hand.filter((c) => c.type === CARD_TYPE_CREATURE);
		let delay = 0;
		let that = this;

		let cs = [];
		let gs = [];
		let busy = [];
		let field = cards.player.field;
		for (let i = 0; i < field.length; ++i) {
			if (field[i]) { cs.push(i); }
			if (field[i-1] && field[i+1] && !field[i]) { gs.push(i); }
			if (cards.opponent.field[i]) { busy.push(i); }
		}
		console.log(cs);
		console.log(gs);

		let strat = [];
		for (let i = 0; i < STRAT_A.length; ++i) {
			let [_p, cn, opt] = STRAT_A[i];
			let card, fd = creatures.filter(c => c.name === cn);
			if (fd.length === 0) continue; else card = fd[0];
			if (opt === 'c' && cs.length > 0) {
				strat.push([_p, opt, card]);
				continue;
			}
			else if (opt === 'e' && cs.length < field.length) {
				strat.push([_p, opt, card]);
				continue;
			}
			else if (opt === 'g' && gs.length > 0) {
				strat.push([_p, opt, card]);
				continue;
			}
			else if (field.filter(c => c && c.name === opt).length > 0) {
				strat.push([_p, opt, card]);
			}
		}
		console.log(strat);

		if (strat.length !== 0) {
			let ss = _.sortBy(strat, a => a[0]);
			let pr, opt, card, pos;
			while (ss.length > 0) {
				[pr, opt, card] = ss.pop();
				if (opt === 'c') pos = _.sample(_.difference(cs, busy));
				else if (opt === 'e') pos = _.sample(_.difference([0,1,2,3], cs, busy));
				else if (opt === 'g') pos = _.sample(_.difference(gs, busy));
				else {
					//let os = creatures.filter(c => c.name === opt);
					let os = _.find(cs, e => cards.player.field[e].name === opt);
					pos = _.sample(_.difference(os, busy));
				}
				if (pos !== undefined) break;
			}
			console.log(pos);
			setTimeout(() => {
				cards.opponent.field[pos] = card;
				cards.opponent.hand = _.without(cards.opponent.hand, card);
				that._update();
			}, delay);
			delay += 500;
		}

		setTimeout(() => {
			that.state = STATE_FIGHT;
			that._fight(OT);
		}, delay);
	}
	_update() {
		const h = table.offsetHeight/2;
		const w = table.offsetWidth/2;
		// hand
		let hand = document.getElementById('hand');
		for (let i = 0; i < cards.player.hand.length; ++i) {
			if (!cards.player.hand[i].spawned) {
				cards.player.hand[i].spawn(hand);
			}
			cards.player.hand[i].mv(i*70,
				(cards.player.hand[i].elem.classList.contains('hold'))
				? -13 : 0);
			cards.player.hand[i].update_stats();
		}
		// field
		for (let i = 0; i < cards.player.field.length; ++i) {
			const x = w-2*CARD_SPAN + i*CARD_SPAN;
			if (cards.player.field[i]) {
				if (!cards.player.field[i].spawned) {
					cards.player.field[i].spawn(table);
				}
				cards.player.field[i].mv(x, h-50);
				cards.player.field[i].update_stats();
			}
			if (cards.opponent.field[i]) {
				if (!cards.opponent.field[i].spawned) {
					cards.opponent.field[i].spawn(table);
				}
				cards.opponent.field[i].mv(x, h-200);
				cards.opponent.field[i].update_stats();
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
		// health points
		hp_shell.player.innerText = `${hp.player}`;
		hp_shell.opponent.innerText = `${hp.opponent}`;
		// turn
		if (this.state === STATE_OPP_TURN) {
			indicators.opponent.forEach((e) => { e.classList.add('current') });
			indicators.player.forEach((e) => { e.classList.remove('current') });
		} else if (this.state === STATE_FIGHT) {
			indicators.opponent.forEach((e) => { e.classList.add('current') });
			indicators.player.forEach((e) => { e.classList.add('current') });
		} else {
			indicators.player.forEach((e) => { e.classList.add('current') });
			indicators.opponent.forEach((e) => { e.classList.remove('current') });
		}
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
		this._unhold();
	}
	_hold(card) {
		if (this.card_hold) this._unhold();
		this.card_hold = card;
		//this.card_hold.elem.style.top = '-16px';
		this.card_hold.elem.classList.add('hold');
		this._update();
	}
	_unhold() {
		animator.clear_shadows();
		animator.clear_field();
		this.card_hold.elem.classList.remove('hold');
		this.card_hold = null;
		this._update();
	}
}
