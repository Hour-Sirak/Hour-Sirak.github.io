const randColor = () =>{
	return "#"+Math.random().toString(16).slice(2, 8)
}

class Wheel{
	constructor(){
		this.wheel = document.querySelector('.wheel')
		this.secs = document.querySelectorAll('.sec')
		this.words = []//document.querySelectorAll('.sec p')
		for(let i = 0; i < this.secs.length; i++){
			this.words.push(this.secs[i].firstElementChild.innerText)
		}
		console.log(this.secs, this.words)
		this.anglePerSlice = this.diameter / this.words.length
	}

	get diameter(){
		return parseFloat(window.getComputedStyle(this.wheel).width)
	}

	render(){
		// let cx = w/2
		// let cy = h/2
		let startAngle = Math.PI*3 / 2 + anglePerSlice / 2
		// let rev = words.slice().reverse()
		rev.forEach(word =>{
	
			let endAngle = startAngle + anglePerSlice
			ctx.arc(cx, cy, radius, startAngle, endAngle, false)
			
			// ctx.beginPath()
			// ctx.font = '18px Helvetica'
			// ctx.textAlign = 'center'
			// ctx.fillStyle = "white"
			// let theta = (startAngle + endAngle) / 2
			// let tx = cx + Math.cos(theta)*radius/1.9
			// let ty = cy + Math.sin(theta)*radius/1.9
			// ctx.translate(tx, ty)
			// ctx.rotate(theta)
			// ctx.fillText(word, 0, 5) // 5 for teh text to center
			// ctx.closePath()
			startAngle = endAngle
		})
	}
}
// let words = ["Google", "Astronomy", "Naruto", "Psychology", "Bek Sloy", "Uwu"]//, "a", "b", "c", "d"]//['안녕하세요!', '소년', '어머니', '바보']

window.onload = () =>{
	const wheel = new Wheel()
	let spin = document.getElementById('spin')
	let degree = 1500
	let id;
	spin.onclick = () => {
		let delay = parseInt(window.getComputedStyle(canvas).transitionDuration.replace('s', ''))*1000
		console.log(delay*1000)
		clearTimeout(id)
		degree += Math.floor((Math.random() + 1) * 1500)

		canvas.style.transform = `rotate(${degree}deg)`
		let anglePerSliceDeg = 360 / words.length
		let offset = anglePerSliceDeg / 2
		let index = Math.floor( Math.ceil((degree + offset) % 360) / anglePerSliceDeg )
		console.log(degree, anglePerSliceDeg, index, words[index])
		id = setTimeout(()=>{
			let synth = window.speechSynthesis
			let voices = synth.getVoices()
			for(var i = 0; i < voices.length; i++) {
				var option = voices[i].name + ' (' + voices[i].lang + ')';
				console.log(option)
			}
			let msg = new SpeechSynthesisUtterance(words[index])
			msg.lang = 'ko-KR'
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


