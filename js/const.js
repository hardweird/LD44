const FREQ_FISH = 9;
const FREQ_PRAWN = 7;
const FREQ_SHRIMP = 7;
const FREQ_CRAB = 7;
const FREQ_SHARK = 5;
const FREQ_NARWHAL = 2;

const FREQ_SWAP = 10;
const FREQ_RETREAT = 7;
const FREQ_STADIUM = 2;

const HAND_SIZE = 4;

const HEALTH = {
	'fish': 4,
	'shrimp': 5,
	'prawn': 5,
	'crab': 7,
	'shark': 6,
	'narwhal': 7
};

const POW = {
	'fish': 1,
	'shrimp': 2,
	'prawn': 2,
	'crab': 2,
	'shark': 3,
	'narwhal': 4
};

const STRAT_A = [
	[0, 'narwhal', 'c'],
	[0, 'crab', 'c'],
	[1, 'crab', 'e'],
	[1, 'fish', 'c'],
	[1, 'prawn', 'c'],
	[1, 'shrimp', 'c'],
	[2, 'prawn', 'shrimp'],
	[2, 'shrimp', 'prawn'],
	[2, 'narwhal', 'e'],
	[3, 'shark', 'e'],
	[3, 'fish', 'e'],
	[3, 'shrimp', 'e'],
	[3, 'prawn', 'e'],
	[4, 'narwhal', 'shark'],
	[4, 'crab', 'g'],
];
/*
const STRAT_B = [
	[0, 'crab', 'c', 'g'],
	[0, 'fish', 'g', 'c']
];*/
