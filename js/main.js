let game;
const WIDTH = 800;
const HEIGHT = 600;

let richText;

function init() {
	game = new PIXI.Application(WIDTH, HEIGHT);
	document.getElementById('wrapper').appendChild(game.view);

	let style = new PIXI.TextStyle({
		fontFamily: 'Arial',
		fontSize: 36,
		fontStyle: 'italic',
		fontWeight: 'bold',
		fill: ['#ffffff', '#00ff99'], // gradient
		stroke: '#4a1850',
		strokeThickness: 5,
		dropShadow: true,
		dropShadowColor: '#000000',
		dropShadowBlur: 4,
		dropShadowAngle: Math.PI / 6,
		dropShadowDistance: 6,
		wordWrap: true,
		wordWrapWidth: 440
	});

	richText = new PIXI.Text('Gimme the game!', style);
	richText.x = 50;
	richText.y = 50;

	game.stage.addChild(richText);
}
