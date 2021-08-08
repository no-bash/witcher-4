
let Application			= PIXI.Application,
	Container			= PIXI.Container,
	loader				= PIXI.loader,
	resources			= PIXI.loader.resources,
	Graphics			= PIXI.Graphics,
	TextureCache		= PIXI.utils.TextureCache,
	Sprite				= PIXI.Sprite,
	Text				= PIXI.Text,
	TextStyle			= PIXI.TextStyle;
	Ticker 				= PIXI.ticker;


let app = new PIXI.Application({
  width: document.documentElement.clientWidth, 
  height: document.documentElement.clientHeight,                       
  antialiasing: true, 
  backgroundAlpha: 0.1, 
  resolution: 1
});


app.view.style.position = "absolute";
app.view.style.width = window.innerWidth + "px";
app.view.style.height = window.innerHeight + "px";
app.view.style.display = "block";



document.body.appendChild( app.view );
// Переменные 
let state, roundedRail, scoreBar, value = 0, score, target, gameScene, 
	id, bg, elements, final, train, timer = 10, targetClick = true;

let keys = {};
let signs = [];
let signsSpeed = 5;

// Ассеты
loader
	.add("assets/background.json")
	.add("assets/witcher.json")
	.add("assets/signs.json")
	.add("assets/assets.json")
	.add("assets/final.json")
	.add("assets/elements.json")
	.add("assets/train.json")
	.add("assets/railRoad.json")
	.add("assets/finger.json")
	.load( setup );

function setup() {
	
	// Ассеты отрисовка
	witcherSprite = resources["assets/witcher.json"].textures;
	signsSprite = resources["assets/signs.json"].textures;
	
	id = resources["assets/assets.json"].textures;
	final = resources["assets/final.json"].textures;
	elements = resources["assets/elements.json"].textures;
	train = resources["assets/train.json"].textures;
	finger = resources["assets/finger.json"].textures;
	railRoad = resources["assets/railRoad.json"].textures;
	forest = resources["assets/background.json"].textures;

	gameScene = new Container();
	app.stage.addChild( gameScene );

	bg = new Sprite( forest["forest.png"] );
	bg.anchor.set(0, 0);
	
	
	gameScene.addChild( bg );
	




	let witcher = new Sprite( witcherSprite["witcher.png"] );
	witcher.scale.set(0.3)
	witcher.position.set(0, 300)
	witcher.interactive = true;
	gameScene.addChild( witcher );






	

	window.addEventListener('keydown', keysDown);
	window.addEventListener('keyup', keysUp);

	app.ticker.add(gameLoop);

	function keysDown(e){
		console.log(e.keyCode);
		keys[e.keyCode] = true;
	}


	function keysUp(e){
		console.log(e.keyCode);
		keys[e.keyCode] = false;
	}


	
	function gameLoop(){
		//arrow right
		if(keys['39']){

			witcher.x +=5;
		}
		//arrow left
		if(keys['37']){
			witcher.anchor.x = 1;     /* 0 = top, 0.5 = center, 1 = bottom */
			witcher.scale.x *= -1;    /* flip vertically */
			witcher.x -=5;
		}
		//spacebar
		if(keys['32']){
			jump();
		}
		//signs
		if(keys['49']){
			signIgni()
			

		}
	}



	app.ticker.add(signLoop);

	function signLoop(delta){
		updateSigns(delta);
	}



	function updateSigns(delta){
		for (let i = 0; i < signs.length; i++){
			signs[i].position.x -= signs[i].speed;
			if(signs[i].position.x <  0){
				signs[i].dead = true;

			}
		}

		for (let i = 0; i < signs.length; i++){
			console.log(signs);
			if(signs[i].dead){
				gameScene.removeChild(signs[i])
				signs.splice(i, 1)

			}
		}
		
	}



	function signIgni(e){
		console.log('IGNI!');

		let igni = createIgni();
		signs.push(igni);

	}

	function createIgni(){
		let igni = new Sprite( signsSprite["igni.png"] );
		// igni.anchor.set(0.5)
		igni.position.set(witcher.x , witcher.y)
		igni.speed = signsSpeed;
		igni.scale.set(0.1)
		
		gameScene.addChild( igni );

		return igni;
	}




	let jumping = false;

	let 
	axis = 'y',
	direction = -1,
	gravity = 1;
	power = 12,
	jumpAt = witcher[axis];


	function jump(){
	
		if (jumping) return
		jumping  = true;

		let time = 0;

		function tick(deltaMs){
			let jumpHeight = (-gravity / 2) * Math.pow(time, 2) + power * time;
		
			if(jumpHeight < 0 ){
				jumping = false;
				Ticker.shared.remove(tick);
				witcher[axis] = jumpAt;
				return
			}

			witcher[axis] = jumpAt + (jumpHeight * direction);
			time += deltaMs;	
		}
		Ticker.shared.add(tick)
	}





}




