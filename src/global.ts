class Stat_c {
	public playedWords:string[] = []
	public numPlayed = 1
	public numWin = 1
	public numStreak = 0
	public maxStreak = 0
	public statPlots:any[] = []

	constructor(){
		this.numPlayed = this.lsLoad('numPlayed')
		this.numWin = this.lsLoad('numWin')
		this.numStreak = this.lsLoad('numStreak')
		this.maxStreak = this.lsLoad('maxStreak')

		this.playedWords = this.lsGetJSON('playedWords')

		const ary = localStorage.getItem('statPlots')
		if ( ary )
			this.statPlots = JSON.parse( ary )
		for ( let i=0; i < Global_c.MAX_TRY; i++ )
			if ( !this.statPlots[i] )
				this.statPlots[i] = 0
	}
	lsGetJSON(n:string):string[] {
		const ary = localStorage.getItem(n)
		let r:string[] = []
		if ( ary )
			r = JSON.parse( ary )
		return r
	}
	lsLoadStr(n:string):string {
		const ls = localStorage.getItem(n)
		if ( !ls ) return ''
		return ls
	}
	lsLoad(n:string):number {
		let ls = localStorage.getItem(n)
		if ( !ls )
			ls = '0'
		return parseInt(ls)
	}
}

class Global_c {
	static MAX_TRY = 6
	public curVer = '1.00'
	public siteName: string

	public bGaming = true
	public stat = new Stat_c()
	public wordToday = ''
	public curWord = ''
	public maxTry = Global_c.MAX_TRY
	public maxLetter = 5
	public curIndex = 0
	public curLine = 0
	public letters = [
		['', '', '', '', ''],
		['', '', '', '', ''],
		['', '', '', '', ''],
		['', '', '', '', ''],
		['', '', '', '', ''],
		['', '', '', '', ''],
	]

	constructor(){
		this.siteName = 'サイト名です！'
	}
}
const gb = new Global_c();
export {gb}

// class Global_c {
// 	private _siteName: string;
// 	constructor(){
// 		this._siteName = ''
// 	}
// 	get siteName(){
// 		return this._siteName
// 	}
// 	set siteName(n:string){
// 		this._siteName = n
// 	}
// 	public getSiteName():string {

// 		return this._siteName
// 	}
// }