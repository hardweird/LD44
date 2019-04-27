const CARD_ROTATION = 5;

function CardSprite() {
	PIXI.projection.Container3d.call(this);
	let res = loader.resources;

	this.inner = new PIXI.projection.Container3d();
	// either they have back, either face
	this.inner.parentGroup = cardsGroup;

	this.addChild(this.inner);

	// construct "inner" from back and face
	this.face = new PIXI.projection.Container3d();
	//this.inner.addChild(this.back);
	this.inner.addChild(this.face);
	this.code = 0;
	this.showCode = -1;
	this.inner.euler.y = Math.PI;
	this.scale3d.set(0.2);

	// construct "face" from four sprites
	this.createFace();
}

CardSprite.prototype = Object.create(PIXI.projection.Container3d.prototype);

CardSprite.prototype.createFace = function() {
	let face = this.face;
	face.removeChildren();
	let res = loader.resources;
	let sprite = new PIXI.projection.Sprite3d(res.charizard.texture);
	//let sprite2 = new PIXI.projection.Sprite3d(PIXI.Texture.EMPTY);
	//let sprite3 = new PIXI.projection.Sprite3d(PIXI.Texture.EMPTY);
	//let sprite4 = new PIXI.projection.Sprite3d(PIXI.Texture.EMPTY);
	//sprite2.y = -120;
	//sprite2.x = -80;
	//sprite3.y = 70;
	//sprite3.x = 40;
	//sprite4.y = -70;
	//sprite4.x = -100;

	sprite.anchor.set(0.5);
	//sprite2.anchor.set(0.5);
	//sprite3.anchor.set(0.5);
	face.addChild(sprite);
	//face.addChild(sprite2);
	//face.addChild(sprite3);
	//face.addChild(sprite4);

	//this.updateFace();
};

CardSprite.prototype.update = function(dt) {
};
