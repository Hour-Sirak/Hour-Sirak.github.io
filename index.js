const randColor = () =>{
	return "#"+Math.random().toString(16).slice(2, 8)
}

class Wheel{
	constructor(){
		this.wheel = document.querySelector('#wheel')
		this.secs = document.querySelectorAll('.sec')
		this.words = []//document.querySelectorAll('.sec p')
		for(let i = 0; i < this.secs.length; i++){
			this.words.push(this.secs[i].firstElementChild.innerText)
		}
		this.p = document.querySelectorAll('.sec p')
		console.log(this.secs, this.words)
		this.anglePerSlice = 360 / this.words.length
	}
	
	get radius(){
		return parseFloat(window.getComputedStyle(this.wheel).width)/2
	}
	
	render(){
		// let cx = w/2
		// let cy = h/2
		let startAngle = 0
		let theta = Math.PI*2 / this.words.length
		let tangent = this.radius*Math.tan(theta/2)
		let i = 0
		this.secs.forEach(sec=>{
			sec.style.borderWidth = `calc(25vh + 1.9px) ${tangent}px 0px`;
			sec.style.borderColor = randColor() + ' transparent'
		
			sec.style.transform = `rotate(${startAngle}deg)`
			this.p[i].style.transform = `translateY(-16vh) rotate(${-90}deg)`
			startAngle = startAngle - this.anglePerSlice
			i++
		})
		// let startAngle = Math.PI*3 / 2 + this.anglePerSlice / 2
		// let rev = this.words.slice().reverse()
	}
}
// let words = ["Google", "Astronomy", "Naruto", "Psychology", "Bek Sloy", "Uwu"]//, "a", "b", "c", "d"]//['안녕하세요!', '소년', '어머니', '바보']

window.onload = () =>{
	const wheel = new Wheel()
	wheel.render()
	let spin = document.getElementById('spin')
	let degree = 1500
	let id;
	spin.onclick = () => {
		let delay = parseInt(window.getComputedStyle(wheel.wheel).transitionDuration.replace('s', ''))*1000
		clearTimeout(id)
		degree += Math.floor((Math.random() + 1) * 1500)

		wheel.wheel.style.transform = `rotate(${degree}deg)`

		let offset = wheel.anglePerSlice / 2
		let index = Math.floor( Math.ceil((degree + offset) % 360) / wheel.anglePerSlice )
		id = setTimeout(()=>{
			let synth = window.speechSynthesis
			let voices = synth.getVoices()
			for(var i = 0; i < voices.length; i++) {
				var option = voices[i].name + ' (' + voices[i].lang + ')';
				console.log(option)
			}
			let msg = new SpeechSynthesisUtterance(wheel.words[index])
			msg.lang = 'en'
			speechSynthesis.speak(msg)
			// msg.voice = voices[]
		}, delay)
	}
	
	let addText = document.getElementById('addText')
	addText.onkeyup = e =>{
		let word = addText.value
		if(e.key === 'Enter'){
			let msg = new SpeechSynthesisUtterance(word)
			speechSynthesis.speak(msg)
			addText.value = ''
			words.push(word)
			renderWheel()

		}
	}
}


