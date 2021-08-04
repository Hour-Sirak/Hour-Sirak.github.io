const randColor = () =>{
	return "#"+Math.random().toString(16).slice(2, 8)
}
let words = ["Google", "Astronomy", "Naruto", "Psychology", "Bek Sloy", "Uwu"]//, "a", "b", "c", "d"]//['안녕하세요!', '소년', '어머니', '바보']
const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const w = canvas.width = 400;
const h = canvas.height = 400;

const renderWheel = ()=>{
	ctx.clearRect(0, 0, w, h)
	let cx = w/2
	let cy = h/2
	let radius = 195
	let anglePerSlice = Math.PI*2 / words.length
	let startAngle = Math.PI*3 / 2 + anglePerSlice / 2//Math.PI*2 - anglePerSlice
	let rev = words.slice().reverse()
		{// {ctx.restore()
		// ctx.save()
		// let endAngle = startAngle + anglePerSlice
		
		// ctx.fillStyle = randColor()
		// ctx.lineWidth = 10
		// ctx.beginPath()
		// ctx.lineTo(cx, cy )
		// ctx.arc(cx, cy, radius, startAngle, endAngle, false)
		// ctx.stroke()
		// ctx.fill()
		// ctx.closePath()
		
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

		// console.log(word)
		// startAngle = endAngle}\
	// ctx.moveTo(100, 0)
	// ctx.lineStyle = 'white'
	// ctx.lineWidth = 10
	// ctx.lineTo(cx, cy)
	// ctx.stroke()
		}
	rev.forEach(word =>{
		ctx.restore()
		ctx.save()
		let endAngle = startAngle + anglePerSlice
		
		ctx.beginPath()
		ctx.fillStyle = randColor()
		ctx.lineWidth = 5
		ctx.strokeStyle = 'white'
		// let pos = ctx.getBoundingClientRect

		ctx.lineTo(cx, cy)
		ctx.arc(cx, cy, radius, startAngle, endAngle, false)
		ctx.lineTo(cx, cy)
		ctx.stroke()
		ctx.fill()
		ctx.closePath()
		
		ctx.beginPath()
		ctx.font = '18px Helvetica'
		ctx.textAlign = 'center'
		ctx.fillStyle = "white"
		let theta = (startAngle + endAngle) / 2
		let tx = cx + Math.cos(theta)*radius/1.9
		let ty = cy + Math.sin(theta)*radius/1.9
		ctx.translate(tx, ty)
		ctx.rotate(theta)
		ctx.fillText(word, 0, 5) // 5 for teh text to center
		ctx.closePath()

		console.log(word)
		startAngle = endAngle
	})
}
window.onload = () =>{
	renderWheel()
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


