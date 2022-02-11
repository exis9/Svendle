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
	vh.flAvg = (totalVal / gb.stat.numPlayed / 6 * 100).toFixed(1)
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
}
function shakeLine( line:number ){
	sq('#idFrame section').eq(line).removeClass('cShake')
	sq('#idFrame section').eq(line).addClass('cShake')
}
function rotateLine( vh:any, line:number, cb:any ){
	const occur = (s:string, v:string):number=>{
		return s.split(v).length - 1
	}
	const input_letters = sq('#idFrame section').eq(line).find('div').text();
	sq('#idFrame section').eq(line).find('div').each(function(this:any, index:number){
		setTimeout(()=>{
			sq(this).removeClass('cPopIn').removeClass('cRotateX')
			sq(this).addClass('cRotateX')
			const t = sq(this).text().toLowerCase()
			let cName = 'absent';
			if ( gb.curWord.charAt(index) == t )
				cName = 'correct'
			else if ( gb.curWord.includes(t) ){
				const el = sq('#idFrame section').eq(line).find('div').contains( t.toUpperCase() )
				if ( occur( gb.curWord, t ) == 1 && ( el.hasClass('correct') || el.hasClass('present') ) ){
					console.log('skip the 2nd occur!') //!!! NOTE: currentry not supports the 3rd duplicate like eerie
				} else {
					cName = 'present'
				}
			}
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

function vSQProc( vh:any ):void{
	setTheme( bDarkTheme() )	//setting the loaded theme

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
		if ( sq(this).parent().attr('line') != gb.curLine )
			return
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