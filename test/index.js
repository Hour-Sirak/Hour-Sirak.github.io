const randColor = () =>{
	return "#"+Math.random().toString(16).slice(2, 8)
}

class Wheel{
	constructor(){
		this.wheel = document.querySelector('.container')
		this.secs = document.querySelectorAll('.button')
		this.words = []//document.querySelectorAll('.sec p')
		for(let i = 0; i < this.secs.length; i++){
			// this.words.push(this.secs[i].firstElementChild.innerText)
		}
		console.log(this.secs, this.words)
		this.anglePerSlice = 360 / this.secs.length
	}
	
	get radius(){
		return parseFloat(window.getComputedStyle(this.wheel).width)/2
	}
	
	render(){
		let startAngle = 0
		let theta = Math.PI*2 / this.secs.length
		let tangent = this.radius*Math.tan(theta/2) * 2
		let i = 0
		this.secs.forEach(sec=>{

			sec.style.width = `${tangent}px`
			sec.style.backgroundColor = randColor()
		
			sec.style.transform = `rotate(${startAngle}deg)`
			// this.p[i].style.transform = `translateY(-16vh) rotate(${-90}deg)`
			startAngle = startAngle - this.anglePerSlice
			i++
		})
	}
}
// let words = ["Google", "Astronomy", "Naruto", "Psychology", "Bek Sloy", "Uwu"]//, "a", "b", "c", "d"]//['안녕하세요!', '소년', '어머니', '바보']

window.onload = () =>{
	const wheel = new Wheel()
	wheel.render()
	let spin = document.getElementById('spin')
	let degree = 1500
	let id;
	// spin.onclick = () => {
	// 	let delay = parseInt(window.getComputedStyle(canvas).transitionDuration.replace('s', ''))*1000
	// 	console.log(delay*1000)
	// 	clearTimeout(id)
	// 	degree += Math.floor((Math.random() + 1) * 1500)

	// 	canvas.style.transform = `rotate(${degree}deg)`
	// 	let anglePerSliceDeg = 360 / words.length
	// 	let offset = anglePerSliceDeg / 2
	// 	let index = Math.floor( Math.ceil((degree + offset) % 360) / anglePerSliceDeg )
	// 	console.log(degree, anglePerSliceDeg, index, words[index])
	// 	id = setTimeout(()=>{
	// 		let synth = window.speechSynthesis
	// 		let voices = synth.getVoices()
	// 		for(var i = 0; i < voices.length; i++) {
	// 			var option = voices[i].name + ' (' + voices[i].lang + ')';
	// 			console.log(option)
	// 		}
	// 		let msg = new SpeechSynthesisUtterance(words[index])
	// 		msg.lang = 'ko-KR'
	// 		speechSynthesis.speak(msg)
	// 		// msg.voice = voices[]
	// 	}, delay)
	// }
	
	// let addText = document.getElementById('addText')
	// addText.onkeyup = e =>{
	// 	let word = addText.value
	// 	if(e.key === 'Enter'){
	// 		let msg = new SpeechSynthesisUtterance(word)
	// 		speechSynthesis.speak(msg)
	// 		addText.value = ''
	// 		words.push(word)
	// 		renderWheel()

	// 	}
	// }
}


