import { sq } from './sq.js'

function bDarkTheme():boolean {
	let theme = "light";    //default to light
	//local storage is used to override OS theme settings
	if(localStorage.getItem("theme")){
		if(localStorage.getItem("theme") == "dark")
			theme = "dark"
	} else if(!window.matchMedia) {
		//matchMedia method not supported
		return false
	} else if(window.matchMedia("(prefers-color-scheme: dark)").matches) {
		//OS theme setting detected as dark
		theme = "dark"
	}
	return theme == 'dark'
}
function setTheme(bDark:boolean){
	let t = 'light'
	if ( bDark )
		t = 'dark'
	
	if ( bDark ){
		sq('html').removeClass('lightMode').addClass('darkMode')
		localStorage.setItem('theme', 'dark')
	} else {
		sq('html').removeClass('darkMode').addClass('lightMode')
		localStorage.setItem('theme', 'light')
	}	
	//document.documentElement.setAttribute('data-theme', t)
}

export { bDarkTheme, setTheme }