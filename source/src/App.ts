import { sq } from './sq.js'
import { gb } from './global'
import { bDarkTheme, setTheme } from './darkTheme'
import { getWordOfTheDay, allWords } from './Words'

const g_keyStates:boolean[] = []

function updateStat(bWin:boolean, numTry=0){
	const stat = gb.stat
	stat.numPlayed++
	if ( bWin ){
		stat.numWin++
		stat.numStreak++
		gb.stat.statPlots[ numTry ]++
	} else {
		stat.numStreak = 0
	}
	if ( stat.numStreak > stat.maxStreak )
		stat.maxStreak = stat.numStreak
	
	saveStat()
}

function fillStat( vh: any ){
	const max = Math.max( ...gb.stat.statPlots )
	const r = max / 10
	let totalVal = 0
	for (let i=0; i < gb.maxTry; i++ )
	{
		const n = parseInt( gb.stat.statPlots[ i ] )
		let len:number = parseInt( ( n / r ).toFixed(0) )
		if ( !len )
			len = 0
		totalVal += n * (i+1)

		for (let t=0; t < len; t++ )
		{
			sq('#idStatPlotContainer').find('.cGraphLine').eq(i).find('.cGraph').eq(t).addClass('fill')
		}
		if ( len < 1 )
			sq('#idStatPlotContainer').find('.cGraphLine').eq(i).find('.cGraph').eq(0).addClass('null').html('0')

		sq('#idStatPlotContainer').find('.cGraphLine').eq(i).find('.cGraph').eq(len-1).html( n )
		
	}
	vh.flAvg = (100 - totalVal / gb.stat.numPlayed / 6 * 100).toFixed(1)
	if ( isNaN(vh.flAvg) )
		vh.flAvg = 0
}

function saveStat(){
	const stat = gb.stat
	localStorage.setItem('numPlayed', stat.numPlayed as any )
	localStorage.setItem('numWin', stat.numWin as any )
	localStorage.setItem('numStreak', stat.numStreak as any )
	localStorage.setItem('maxStreak', stat.maxStreak as any )
	localStorage.setItem('statPlots', JSON.stringify( stat.statPlots as any ) )
	
	if ( gb.stat.playedWords.length > 10 )
		gb.stat.playedWords.pop()
	
	gb.stat.playedWords.push( gb.wordToday )
	localStorage.setItem('playedWords', JSON.stringify( stat.playedWords as any ) )
}
function shakeLine( line:number ){
	sq('#idFrame section').eq(line).removeClass('cShake')
	sq('#idFrame section').eq(line).addClass('cShake')
}

const checkAnswer = ( ans:string, it:string ):string[] => {
	const count_occur = (s:string, v:string):number=>{//count_occur_in_string
		return s.split(v).length - 1
	}
	const count_occur_in_r = ( r:string[], v:string, it:string, w:string ):number => {
		let n = 0
		for ( let i=0; i < r.length; i++ )
		{
			if ( r[i] == v && it[i] == w )
				n++
		}
		return n
	}
	
	const r:string[] = []
	for ( let i=0; i < ans.length; i++ )
	{
		if ( ans[i] == it[i] )
			r[i] = 'correct'
		else
			r[i] = 'absent'
	}
	for ( let i=0; i < ans.length; i++ )
	{
		const w = it[i], cnt = count_occur_in_r( r, 'correct', ans, w ) + count_occur_in_r( r, 'present', it, w )
		if ( ans[i] != w && count_occur( ans, w ) > cnt )
			r[i] = 'present'
	}
	return r
}

function rotateLine( vh:any, line:number, cb:any ){
	const input_letters = sq('#idFrame section').eq(line).text().toLowerCase();
	const letter_states = checkAnswer( gb.curWord, input_letters )

	sq('#idFrame section').eq(line).find('div').each(function(this:any, index:number){
		setTimeout(()=>{
			sq(this).removeClass('cPopIn').removeClass('cRotateX')
			sq(this).addClass('cRotateX')
			const cName = letter_states[ index ]

			setTimeout(()=>{
				sq(this).addClass(cName)
				if ( index >= gb.maxLetter-1 )
				{
					setTimeout(()=>{//color keyboard
						colorize()
					}, 200)
					//end game
					if ( cb )
					{
						vh.bPlayed = true
						countdownStart()
						setTimeout(cb, 700)
					}
				}
			}, 200)
		}, 400*index)
	})
}
function countdownStart(){
	/*setTimeout(()=>{
		sq('#idStatNext').show()
	}, 3900)*/
	setInterval(()=>{
		const now = new Date();
		const night = new Date(
			now.getFullYear(),
			now.getMonth(),
			now.getDate() + 1, // the next day, ...
			0, 0, 0 // ...at 00:00:00 hours
		);
		const msTillMidnight = night.getTime() - now.getTime();
		const t = new Date( msTillMidnight ).toISOString().substring(11,19)
		sq('#idNextTime').html(t)
	}, 1000)
}
function colorize(){
	sq('#idFrame section').eq(gb.curLine-1).find('div').each(function(this:any, index:number){
		const k = sq(this).text().toLowerCase(), 
			kClass = sq('#keyboard button[data-key="'+k+'"]').attr('class'), 
			wClass = sq(this).attr('class');
		let cName = 'absent';
		if ( wClass )
		{
			if ( wClass.includes('correct') ){
				cName = 'correct'
			} else if ( wClass.includes('present') ){
				cName = 'present'
			}
		}
		if ( kClass )
		{
			if ( kClass.includes('correct') )
				return
			if ( kClass.includes('present') && cName != 'correct')
				return
			if ( kClass.includes('absent') && cName == 'absent')
				return
		}
		sq('#keyboard button[data-key="'+k+'"]').removeClass('correct').removeClass('present').removeClass('absent').addClass(cName)
	})
}
function insert( k:string ){
	sq('#idFrame section').eq(gb.curLine).find('div').eq(gb.curIndex).html(k).removeClass('cPopIn')
	sq('#idFrame section').eq(gb.curLine).find('div').eq(gb.curIndex).addClass('cPopIn')
	if ( gb.curIndex < gb.maxLetter )
		gb.curIndex++
	
	if ( gb.curIndex >= gb.maxLetter )
		sq('#keyboard button[data-key="enter"]').addClass('cLetsEnter')
}
function back(){
	if ( 0 < gb.curIndex )
		gb.curIndex--
	sq('#idFrame section').eq(gb.curLine).find('div').eq(gb.curIndex).html('').removeClass('cPopIn')
	sq('#keyboard button[data-key="enter"]').removeClass('cLetsEnter')
}
function enter( vh:any ):void{
	const word = gb.curWord
	let v = ''
	sq('#keyboard button[data-key="enter"]').removeClass('cLetsEnter')
	sq('#idFrame section').eq(gb.curLine).find('div').each(function(this:any){
		v += sq(this).text()
	})
	v = v.toLowerCase()
	if ( v.length >= gb.maxLetter )
	{
		if ( word == v ){
			const cb = ()=>{
				vh.toast(msg, '', 3000)//win
				updateStat( true, gb.curLine )
				setTimeout(()=>{
					sq('#idStat').trigger('click')
				}, 3000)
			}
			rotateLine( vh, gb.curLine, cb )
			let msg = 'Genius!'
			switch (gb.curLine){
				case 1: msg = 'Amazing!'; break
				case 2: msg = 'Great!'; break
				case 3: msg = 'Cool!'; break
				case 4: msg = 'Nice!'; break
				case 5: msg = 'Good!'; break
			}
		} else {
			if ( !allWords.includes(v) )
			{
				vh.toast('Not in word list')
				shakeLine( gb.curLine )
				gb.bGaming = true
				return
			}
			gb.curLine++
			gb.curIndex = 0
			let cb = null
			if ( gb.curLine >= gb.maxTry ){
				cb = ()=>{
					vh.toast(gb.curWord, '', 999999)//lose
					updateStat( false )
					setTimeout(()=>{
						sq('#idStat').trigger('click')
					}, 3000)
				}
			} else {
				gb.bGaming = true
			}
			rotateLine( vh, gb.curLine-1, cb )
		}
	} else {
		shakeLine( gb.curLine )
		vh.toast('Not enough letters')
		gb.bGaming = true
	}
	console.log('comp: '+v)
}

function guideHelp( vh:any ){
	if ( !localStorage.getItem('numWin') )
	{
		sq('#idHelp').trg('click')
	}
	const bAlreadyDaily = gb.stat.playedWords.includes( getWordOfTheDay() )
	// already played
	if ( location.search.includes('?r') && !bAlreadyDaily ){
		location.href = './'
	} else if ( gb.stat.playedWords.includes( getWordOfTheDay(vh) ) ){
		if ( bAlreadyDaily ){
			if ( location.search.includes('?q') ){
				vh.confirm(
					`You've played this word already!<br>
					Do you wanna play the <b class="cWordComb cRandomComb">Random Word</b> instead?`, ()=>{
					location.href = './?r'
				}, null, 'pi pi-check-square')
			} else {
				vh.confirm(
					`You've played the <b class="cWordComb">Today's Word</b> already!<br>
					Do you wanna play the <b class="cWordComb cRandomComb">Random Word</b> instead?`, ()=>{
					location.href = './?r'
				}, null, 'pi pi-check-square')
			}
		} else {
			vh.confirm('Do you wanna play the <b class="cWordComb">Today\'s Word!</b>', ()=>{
				location.href = './'
			}, null, 'pi pi-check-square')
		}
		console.log(gb.stat.playedWords)
	}
}

function vSQProc( vh:any ):void{
	setTheme( bDarkTheme() )	//setting the loaded theme

	guideHelp( vh )

	setTimeout(()=>{
		sq('#idGameKeyboard button[data-key]').on('click', function( this:any ){
			let k = sq(this).attr('data-key')
			if ( !k )
				k = 'backspace'
			
			document.getElementsByTagName('body')[0].dispatchEvent(new KeyboardEvent('keydown', {'key': k}));
			g_keyStates[k] = false
			return false
		})
	}, 500)

	sq('#idStat').on('click', function(){
		setTimeout(()=>{
			fillStat( vh )
		}, 500)
	})

	sq('div').on('click', function(this:any){//re-edit
		const line = parseInt( sq(this).parent().attr('line') )
		if ( isNaN(line) || (line != gb.curLine || !gb.bGaming) )
		{
			if ( !isNaN(line) && (line < gb.curLine || !gb.bGaming) )
			{
				const w = sq(this).parent().text()
				if ( w.length == gb.maxLetter )
					window.open( 'https://www.google.com/search?tbm=isch&q=' + encodeURIComponent(w + ' meaning') )
			}
			return
		}
		const len = sq(this).index()
		gb.curIndex = len
		sq('*').removeClass('reedit')
		sq(this).addClass('reedit')
	})

	// key
	sq('body').on('keydown', function( e:any ){
		let k = e.key.toLowerCase()
		if ( g_keyStates[k] || !gb.bGaming )
			return
		
		sq('*').removeClass('reedit')
		g_keyStates[k] = true
		switch ( k ){
			case 'enter': case '↵':
				gb.bGaming = false
				k = 'enter'
				enter( vh )
				break
			case 'backspace': case '←':
				k = 'backspace'
				back()
				break
			default:
				if ( k.length == 1 && k.toLowerCase() != k.toUpperCase() )
					insert(k)
				break
		}
		const el = sq('#keyboard [data-key="'+k+'"]')
		el.trg('click').addClass('active')
		setTimeout(()=>{
			el.removeClass('active')
		}, 200)
	}).on('keyup', function(e:any){
		const k = e.key.toLowerCase()
		g_keyStates[k] = false
	})
}

export {sq, vSQProc, bDarkTheme, setTheme}