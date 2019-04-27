const WIDTH = 800;
const HEIGHT = 600;

let game;
let camera;
let loader;
/* a container cards will be placed in */
let field;

let cardsGroup;

function init() {
	game = new PIXI.Application(WIDTH, HEIGHT, {antialias: true});
	document.getElementById('wrapper').appendChild(game.view);
	game.stage = new PIXI.display.Stage();

	loader = game.loader;

	/* init camera */
	camera = new PIXI.projection.Camera3d();
	camera.position.set(game.screen.width / 2, game.screen.height / 2);
	camera.setPlanes(350, 30, 10000);
	camera.euler.x = Math.PI / 12;
	game.stage.addChild(camera);

	/* init the field */
	field = new PIXI.projection.Container3d();
	field.position3d.y = -50;
	// MAKE CARDS LARGER:
	field.scale3d.set(1.5);
	camera.addChild(field);

	/* groups */
	cardsGroup = new PIXI.display.Group(2, function(item) {
		item.zOrder = item.getDepth();
		item.parent.checkFace();
	});

	loader.add('charizard', 'img/charizard.png');
	loader.add('back', 'img/back.png');
	loader.add('table', 'img/table.png');
	loader.add('black', 'img/black.png');
	loader.load(onAssetsLoaded);
	
	// blur for shadow. Do not use it in production, bake shadow into the texture!
	blurFilter = new PIXI.filters.BlurFilter();
	blurFilter.blur = 0.2;

	game.ticker.add(function(deltaTime) {
		for (var i = 0; i < field.children.length; i++) {
			field.children[i].update(deltaTime / 60.0);
		}

		// We are gonna sort and show correct side of card,
		// so we need updateTransform BEFORE the sorting will be called.
		// otherwise this part will be tardy by one frame
		camera.updateTransform();
	});
}

const FIELD_DISTANCE = 50;
function dealHand() {
	field.removeChildren();
	for (let i = 0; i < 4; i++) {
		let card = new CardSprite();
		let foe_card = new CardSprite();
		let x =  66 * (i - 2);

		card.position3d.x = x;
		card.position3d.y = FIELD_DISTANCE;
		card.update(0);
		card.interactive = true;
		card.on('mouseup', onClick);
		card.on('touchend', onClick);
		field.addChild(card);

		foe_card.position3d.x = x;
		foe_card.position3d.y = -FIELD_DISTANCE;
		foe_card.update(0);
		foe_card.interactive = true;
		foe_card.on('mouseup', onClick);
		foe_card.on('touchend', onClick);
		field.addChild(foe_card);
	}
}

function onClick(event) {
	//let target = event.target;
}

function onAssetsLoaded() {
    // background must be UNDER camera, it doesnt have z-index or any other bullshit for camera
    game.stage.addChildAt(new PIXI.Sprite(loader.resources.table.texture), 0);
    dealHand();
    // start animating
    game.start();
}
