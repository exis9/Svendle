<template>
	<header>
		<h1 id="idGameTitle">Svendle</h1>
		<i id="idHelp" class="cHeadIcon pi pi-question-circle" @click="dialogHelp($event)"></i>
		<i id="idConfig" class="cHeadIcon pi pi-cog" @click="dialogConfig($event)"></i>
		<i id="idStat" class="cHeadIcon pi pi-chart-bar" @click="dialogStat($event)"></i>
	</header>

	<router-view/>
	<Toast position="top-center" />

	<!-- HELP -->
	<Dialog v-model:visible="bModalHelp"
		:closeOnEscape="true"
		:modal="true"
		:dismissableMask="true"
		:show="flip3D()"
	>
		<div style="text-align:center">
			<div style="max-width: 500px; max-height: 1000px; width:calc(100vw - 60px);height:100vh;">
				<h4>HOW TO PLAY</h4>
				<section>
					<div class="instructions">
						<p>Guess the <strong>SVENDLE</strong> in 6 tries.</p>
						<p>Each guess must be a valid 5 letter word. Hit the enter button to submit.</p>
						<p>After each guess, the color of the tiles will change to show how close your guess was to the word.</p>
						<div class="examples">
							<p><strong>Examples</strong></p>
							<div class="example">
							<div class="row">
								<div class="tile flip3D" evaluation="correct">w</div>
								<div class="tile">e</div>
								<div class="tile">a</div>
								<div class="tile">r</div>
								<div class="tile">y</div>
							</div>
							<p>The letter <strong>W</strong> is in the word and in the correct spot.</p>
							</div>
							<div class="example">
							<div class="row">
								<div class="tile">p</div>
								<div class="tile flip3D" evaluation="present">i</div>
								<div class="tile">l</div>
								<div class="tile">l</div>
								<div class="tile">s</div>
							</div>
							<p>The letter <strong>I</strong> is in the word but in the wrong spot.</p>
							</div>
							<div class="example">
							<div class="row">
								<div class="tile">v</div>
								<div class="tile">a</div>
								<div class="tile">g</div>
								<div class="tile flip3D" evaluation="absent">u</div>
								<div class="tile">e</div>
							</div>
							<p>The letter <strong>U</strong> is not in the word in any spot.</p>
							</div>
						</div>
						<p><strong>A new SVENDLE will be available each day!</strong></p>
						<div style="margin-top:20px">
							<a href="https://www.buymeacoffee.com/Exis"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=Exis&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff"></a>
						</div>
					</div>
				</section>
			</div>
		</div>
	</Dialog>
	
	<!-- STAT -->
	<Dialog v-model:visible="bModalStat"
		:closeOnEscape="true"
		:modal="true"
		:dismissableMask="true"
	>
		<div style="text-align:center">
			<h4>STATISTICS</h4>
			<div id="idStatistics">
				<div class="stat-container">
					<div class="statistic">{{stat.numPlayed}}</div>
					<div class="label">Played</div>
				</div>

				<div class="stat-container">
					<div class="statistic">{{(parseFloat(stat.numWin / (stat.numPlayed?stat.numPlayed:1))*100).toFixed(0)}}</div>
					<div class="label">Win %</div>
				</div>

				<div class="stat-container">
					<div class="statistic">{{stat.numStreak}}</div>
					<div class="label">Current Streak</div>
				</div>

				<div class="stat-container">
					<div class="statistic">{{stat.maxStreak}}</div>
					<div class="label">Max Streak</div>
				</div>
			</div>
			<Knob v-model="flAvg" :min="0" :max="100" valueColor="MediumTurquoise" rangeColor="SlateGray" />
			
			<h4>GUESS DISTRIBUTION</h4>

			<section v-if="stat.statPlots" id="idStatPlotContainer">
				<div class="cGraphLine"><span>1</span><div class="cGraph"></div><div class="cGraph"></div><div class="cGraph"></div><div class="cGraph"></div><div class="cGraph"></div><div class="cGraph"></div><div class="cGraph"></div><div class="cGraph"></div><div class="cGraph"></div><div class="cGraph"></div></div>
				<div class="cGraphLine"><span>2</span><div class="cGraph"></div><div class="cGraph"></div><div class="cGraph"></div><div class="cGraph"></div><div class="cGraph"></div><div class="cGraph"></div><div class="cGraph"></div><div class="cGraph"></div><div class="cGraph"></div><div class="cGraph"></div></div>
				<div class="cGraphLine"><span>3</span><div class="cGraph"></div><div class="cGraph"></div><div class="cGraph"></div><div class="cGraph"></div><div class="cGraph"></div><div class="cGraph"></div><div class="cGraph"></div><div class="cGraph"></div><div class="cGraph"></div><div class="cGraph"></div></div>
				<div class="cGraphLine"><span>4</span><div class="cGraph"></div><div class="cGraph"></div><div class="cGraph"></div><div class="cGraph"></div><div class="cGraph"></div><div class="cGraph"></div><div class="cGraph"></div><div class="cGraph"></div><div class="cGraph"></div><div class="cGraph"></div></div>
				<div class="cGraphLine"><span>5</span><div class="cGraph"></div><div class="cGraph"></div><div class="cGraph"></div><div class="cGraph"></div><div class="cGraph"></div><div class="cGraph"></div><div class="cGraph"></div><div class="cGraph"></div><div class="cGraph"></div><div class="cGraph"></div></div>
				<div class="cGraphLine"><span>6</span><div class="cGraph"></div><div class="cGraph"></div><div class="cGraph"></div><div class="cGraph"></div><div class="cGraph"></div><div class="cGraph"></div><div class="cGraph"></div><div class="cGraph"></div><div class="cGraph"></div><div class="cGraph"></div></div>
			</section>
			<section v-else style="margin:20px 0 30px 0;color:#999">
				NO DATA
			</section>
			

			<div v-if="bPlayed" id="idStatNext" style="margin-bottom:20px ">
				<table style="border:none;outline:none;">
					<tr>
						<td style="padding:10px">
							<h4>NEXT SVENDLE</h4>
							<div id="idNextTime"></div>
						</td>
						<td><SplitButton label="Share" icon="pi pi-plus" :model="items" class="mb-2"></SplitButton></td>
					</tr>
				</table>
			</div>

			<a href="https://www.buymeacoffee.com/Exis"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=Exis&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff"></a>
		</div>
	</Dialog>



	<!-- CONFIG -->
	<Dialog v-model:visible="bModalConfig"
		:closeOnEscape="true"
		:modal="true"
		:dismissableMask="true"
	>
		<div style="text-align:center">
			<div style="max-width: 500px; max-height: 1000px; width:calc(100vw - 60px);">
				<h4>SETTINGS</h4>
				<br>
				<div class="cSetting">
					<div class="sL">
						Dark Theme
					</div>
					<div class="sR">
						<InputSwitch v-model="compDark" />
					</div>
				</div>
				<div class="cSetting">
					<div class="sL">
						Feedback
					</div>
					<div class="sR">
						<a href="mailto:exis.space@gmail.com" target=_blank>Email</a> | <a href="https://twitter.com/ExisVR" target=_blank>Twitter</a> | <a href="https://github.com/exis9/" target=_blank>Github</a>
					</div>
				</div>
				<div class="cSetting">
					<div class="sL">
						User Generation
					</div>
					<div class="sR">
						<div style="margin-bottom:12px">
							<InputText type="text" v-model="oAnswer" @change="changeOAnswer" class="p-inputtext-sm" placeholder="Try Original Answer!" maxlength=5 style="text-align:center" />
						</div>
						<a id="idOAnswerLink" href="./" target=_blank>Share This!</a>
					</div>
				</div>
				<div style="margin-top:20px">
					<a href="https://www.buymeacoffee.com/Exis"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=Exis&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff"></a>
				</div>
				<div style="margin-top:20px;color: #aaa;font-size:12px;">
					Developed in 2022 based on <a href="https://www.powerlanguage.co.uk/wordle/" target=_blank style="color:#999">wordle</a>. Version: {{curVer}}
				</div>
			</div>
		</div>
	</Dialog>

	<!--div id="nav">
		<router-link to="/">Home</router-link> |
		<router-link to="/about">About</router-link>
	</div-->
</template>

<style lang="scss">
	@use "./App.scss";

	h4 {
		margin: 0 0 10px 0;
	}

	.p-toast {
		width: 220px;

		.p-toast-message-content {
			padding: 10px 0!important;
		}
		.p-toast-message {
			background: #333;
			color: #fff;
			text-align: center;
		}
	}
	
	.p-inputswitch-checked .p-inputswitch-slider {
		background-color: rgb(106,170,100)!important;
	}

	.p-dialog-header {
		display: block;
		text-align: right;
		padding: 10px 10px 0 0!important;

		.p-dialog-header-icons {
			display: inline-block;
		}
	}

	/* STAT */
	#idStatistics {
		display: flex;
		padding-bottom: 10px;
		
		.stat-container {
			flex: 1;
		}
		.statistic {
			font-size: 36px;
			font-weight: 400;
			display: flex;
			align-items: center;
			justify-content: center;
			text-align: center;
			letter-spacing: 0.05em;
			font-variant-numeric: proportional-nums;
		}
		.label {
			font-size: 12px;
			display: flex;
			align-items: center;
			justify-content: center;
			text-align: center;
		}
	}

	/* CONFIG */
	.cSetting {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 16px 0;
		border-bottom: 1px solid #ccc;
		
		.sL {
			font-size: 18px;
		}
	}

	/* HELP */
	.instructions {
		text-align: left;
		font-size: 14px;
		color: #1a1a1b;
	}

	.examples {
		border-bottom: 1px solid #d3d6da;
		border-top: 1px solid #d3d6da;
	}

	.example {
		margin-top: 24px;
		margin-bottom: 24px;
	}


	:host([page]) section {
		padding: 16px;
		padding-top: 0px;
	}

	.flip3D {
		perspective: 1000px; /* Remove this if you don't want the 3D effect */
		transition: transform 0.8s;
		transform-style: preserve-3d;
		backface-visibility: visible;
		transform: rotateX(-90deg);
	}

	.flip3DActive {
		transform: rotateX(0deg);
	}

	.tile {
		margin-right: 3px;
		width: 40px;
		height: 40px;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		font-weight: bold;
		vertical-align: middle;
		box-sizing: border-box;
		color: #000;
		text-transform: uppercase;
		user-select: none;
		font-size: 1em;
		line-height: 1em;
		border: 2px solid #aaa;

		&[evaluation] {
			color: #fff;
		}

		&[evaluation="correct"] {
			background-color: rgb(106,170,100);
			border: 2px solid rgb(106,170,100);
		}

		&[evaluation="present"] {
			background-color: rgb(201, 180, 88);
			border: 2px solid rgb(201, 180, 88);
		}

		&[evaluation="absent"] {
			background-color: #787C7E;
			border: 2px solid #787C7E;
		}
	}
	
</style>


<script lang="ts">
	import { defineComponent } from 'vue';
	import 'primevue/resources/primevue.min.css';
	import 'primevue/resources/themes/saga-blue/theme.css';
	import 'primeicons/primeicons.css';
	import Button from 'primevue/button';
	import Dialog from 'primevue/dialog';
	import Knob from 'primevue/knob';
	import InputSwitch from 'primevue/inputswitch';
	import Toast from 'primevue/toast';
	import InputText from 'primevue/inputtext';
	import SplitButton from 'primevue/splitbutton';
	
	import { gb } from "@/global";
	import { getWordOfTheDay } from "./Words"
	import { sq, vSQProc, bDarkTheme, setTheme } from './App'
	//gb.siteName = '33333'

	export default defineComponent({
		name: 'App',
		data(){
			return {
				curVer: gb.curVer,
				test: gb.siteName,
				bModalHelp: false, bModalStat: false, bModalConfig: false,
				bChkDarkMode: bDarkTheme(),
				flAvg: 0,
				oAnswer: '',
				bPlayed: false,
				stat: gb.stat,
				items: [
					{
						label: 'Twitter',
						icon: 'pi pi-twitter',
						command: () => {
							window.location.href = 'https://twitter.com/intent/tweet?hashtags=Svendle&url=' + location.href
						}
					},
					{
						label: 'Facebook',
						icon: 'pi pi-facebook',
						command: () => {
							window.location.href = 'https://www.facebook.com/share.php?u=' + location.href
						}
					},
					{
						label: 'Copy Link',
						icon: 'pi pi-copy',
						command: () => {
							this.toast('Copied the link! Please share it! :D');
						}
					},
					{
						label: 'Follow me',
						icon: 'pi pi-user-plus',
						command: () => {
							window.location.href = 'https://twitter.com/ExisVR'
						}
					}
				]
			}
		},
		computed: {
			compDark: {
				get():boolean {
					return this.bChkDarkMode
				},
				set(v){
					this.bChkDarkMode = v
					setTheme(v)
				}
			},
		},
		components: {
			//Button, 
			Knob,
			Dialog,
			InputSwitch,
			Toast,
			InputText,
			SplitButton,
		},
		provide: {
			user: 'John'
		},
		methods: {
			dialogConfig(){
				this.bModalConfig = true
			},
			dialogHelp(){
				this.bModalHelp = true
			},
			dialogStat(){
				this.bModalStat = true
			},
			handleClick(){
				console.log('aa')
			},
			flip3D(){
				setTimeout(() => {
					sq('.flip3D').addClass('flip3DActive')
				}, 50);
			},
			changeOAnswer(){
				const q = btoa( this.oAnswer.trim().toLowerCase() )
				sq('#idOAnswerLink').attr('href', `./?q=${q}`)
			},
			toast(s:string, tp='error', life=1500){
				this.$toast.add({severity:'', summary:'', detail:s, life: life});
			},
		},
		mounted(){//sQuery can be used here!
			vSQProc(this)
			gb.wordToday = getWordOfTheDay(this)
			gb.curWord = gb.wordToday
			console.log( 'getWordOfTheDay', gb.wordToday )
		}
	});

</script>
