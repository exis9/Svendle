import { sq } from './sq.js'
import { gb } from './global'

// @ts-ignore
import * as THREE from 'three';
// @ts-ignore
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

let mixer: THREE.AnimationMixer
const clock = new THREE.Clock();
const scene = new THREE.Scene();
let camera = new THREE.Camera();
const renderer = new THREE.WebGLRenderer({ alpha: true });
let animation:any;
let animations:any[];

function loadModel( svenMsg:string ){
	const loader = new GLTFLoader();
	loader.load('SvenM.glb', function ( gltf:any ) {
		const mesh = gltf.scene
        mixer = new THREE.AnimationMixer( mesh )
        scene.add( mesh )

		animations = (gltf as any).animations
		let animIdx = 0
		if ( svenMsg.includes('SAD') )
			animIdx = 2
        animation = mixer.clipAction( animations[animIdx] )
		sq('#idSvenContainer').hide().fadeIn(800)
		const bOnlyOnce = true
		if ( bOnlyOnce )
		{
			animation.setLoop( THREE.LoopOnce );
			animation.clampWhenFinished = true;
			animation.enable = true;
			mixer.addEventListener( 'finished', function(){
				if ( !sq('#idSvenMSG').html() )
				{
					sq('#idSvenMSG').remove()
					sq('#idSvenContainer').append(`<div id="idSvenMSG"><span class="font">Sven says...</span><br>"${svenMsg}"</div>`)
					sq('#idSvenMSG').hide().fadeIn(400)
					
					if ( gb.curLine <= 2 )
					{
						setTimeout(()=>{
							sq('.pyro').fadeIn(200)//firework
						}, 800)
					}
					// erase sven for dictionary
					sq('#idSvenContainer').on('click', ()=>{
						animation.stop()
						animation = mixer.clipAction( animations[1] )
						animation.setLoop( THREE.LoopOnce );
						animation.clampWhenFinished = true;
						animation.enable = true;
						animation.play().reset();
						setTimeout(()=>{
							sq('#idSvenContainer').fadeOut(800)
						}, 3800)
					})
				}
			});
		}
		animation.play().reset();

		// // Play a specific animation
		// const clips = mesh.animations;
		// const clip = THREE.AnimationClip.findByName( clips, 'JUMP2' );
		// const action = mixer.clipAction( clip );
		// action.play();
	} );
}

function addLights(){
	const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
	scene.add( directionalLight );

	const spotLight = new THREE.SpotLight( 0xff9999 );
	spotLight.position.set( 10, 10, 10 );
	scene.add( spotLight );


	const spotLight2 = new THREE.SpotLight( 0xffffff );
	spotLight2.position.set( 0, 0, 10 );
	scene.add( spotLight2 );
	//const spotLightHelper = new THREE.SpotLightHelper( spotLight2 );
	//scene.add( spotLightHelper );
}

function setWindow(){
	sq('#idSvenContainer').show()
	const w = sq('#idSvenContainer').width(), h = sq('#idSvenContainer').height()
	camera = new THREE.PerspectiveCamera( 75, w / h, 0.1, 1000 );
	camera.position.set(0, 2, 8 )
	//camera.lookAt(4,4,0)
	renderer.setSize( w, h );
}

function threeProc( vh:any, svenMsg:string ):void{
	sq('#idSvenContainer').html( renderer.domElement );
	sq(window).off('resize').on('resize', ()=>{
		setWindow()
	})
	
	setWindow()
	addLights()
	loadModel( svenMsg )

	// Update the mixer on each frame
	function update () {
		if (mixer && mixer.update )
			mixer.update( clock.getDelta() );
	}

	function animate() {
		update()
		requestAnimationFrame( animate );
		renderer.render( scene, camera );
	}
	animate();
}

export {threeProc}