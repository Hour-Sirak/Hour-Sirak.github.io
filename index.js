const definition = document.getElementById('definition')

const randColor = () =>{
	return "#"+Math.random().toString(16).slice(2, 8)
}

const toggle = (elem) =>{
	if(elem.classList.contains('show')){
		elem.classList.remove('show')
	}else{
		elem.classList.add('show')
	}
}

const meaning = (word) => {
	let url = `https://api.dictionaryapi.dev/api/v2/entries/en_US/${word}`
	return axios.get(url)
		.then(res => res.data[0].meanings[0].definitions[0].definition)
		.catch(error => {
			console.log(error)
		});
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
		this.anglePerSlice = 360 / this.secs.length
	}
	
	get radius(){
		return parseFloat(window.getComputedStyle(this.wheel).width)/2
	}
	
	render(){
		// let cx = w/2
		// let cy = h/2
		let startAngle = 0
		let theta = Math.PI*2 / this.secs.length
		let tangent = this.radius*Math.tan(theta/2) * 2
		let i = 0
		this.secs.forEach(sec=>{
			let color = i % 2 == 0 ? 'black' : 'brown'
			sec.style.width = `${tangent}px`;
			sec.style.backgroundColor = randColor()//'rgba(225, 225, 225, 0.8)'
			
			sec.style.transform = `rotate(${startAngle}deg)`
			// this.p[i].style.transform = `translateY(-16vh) rotate(${-90}deg)`
			startAngle = startAngle - this.anglePerSlice
			i++
		})
		// let startAngle = Math.PI*3 / 2 + this.anglePerSlice / 2
		
	}
}
// let words = ["Google", "Astronomy", "Naruto", "Psychology", "Bek Sloy", "Uwu"]//, "a", "b", "c", "d"]//['안녕하세요!', '소년', '어머니', '바보']

class Slider{
	constructor(){
		this.slider = document.getElementById('slider')
		this.delayValue = document.getElementById('delayValue')
		this.min = slider.min
		this.max = slider.max
		let x = this.left
		this.delayValue.style.left = `calc(${x}% + (${8 - x*0.15}px))`
		const p = this.delayValue.firstElementChild
		p.innerText = this.value + 's'
		this.slider.oninput = () =>{
			x = this.left
			p.innerText = this.value + 's'
			this.delayValue.style.left = `calc(${x}% + (${8 - x*0.15}px))`
		}
	}
	get value(){
		return this.slider.value
	}
	
	get left (){
		return ((this.value - this.min) * 100) / (this.max - this.min) 
		- parseFloat(window.getComputedStyle(this.delayValue).width)/2 + 1
	}
	
}

class WordWrappers{
	constructor(){
		this.container = []
		this.id = 0
		this.wordContainer = document.getElementById('wordContainer')
	}
	
	create(word=''){
		const border = document.createElement('div')
		border.classList.add('border')
		const wordWrapper = document.createElement('div')
		border.appendChild(wordWrapper)
		wordWrapper.classList.add('wordWrapper')
		wordWrapper.innerHTML = `<input type='text' name='word' id='word${this.id}' value='${word}'><span class='delete button'>Delete</span>`
		wordWrapper.lastElementChild.onclick = () => this.delete(wordWrapper)
		const input = wordWrapper.firstElementChild
		input.onfocus = () => {
			const word = input.value
			let html = ''
			let mean = meaning(word)
			wordWrapper.style.transform = 'scale(1.03)'
			html += `<h2>${word}</h2> </br>`  
			mean.then(res =>{
				html += `<p>${res}</p>`  
				definition.innerHTML = html 
			})
			.catch(error => {
				
			})
		}
		input.addEventListener('focusout',
			() =>{
				wordWrapper.style.transform = 'scale(1)'
			}
		)


		this.container.push(wordWrapper)
		this.wordContainer.appendChild(border)
		this.id++
		return wordWrapper
	}

    delete(wordWrapper){
		wordWrapper.remove()
		const i = this.container.indexOf(wordWrapper)
		i > -1 && this.container.splice(i, 1)
	}
}

class Form{
	constructor(wheel){
		this.form = document.querySelector('#toolWindow form')
		console.log( typeof(this.form))
		this.addButton = document.getElementById('addButton')
		this.slider = new Slider
		this.wordWrappers = new WordWrappers()
		wheel.words.forEach(word=>{
			const wordWrapper = this.wordWrappers.create(word)
			// this.form.insertBefore(wordWrapper, this.addButton)
		})
		this.addButton.onclick = () =>{
			this.wordWrappers.create()
		}
	}
	
	
	
}


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

	let option = document.getElementById('option')
	let toolWindow = document.getElementById('toolWindow')
	option.onclick = () => {
		toggle(toolWindow)
	}

	const form = new Form(wheel)

	const cancelButton = document.getElementById('cancel')
	cancelButton.onclick = () => toggle(toolWindow)
	
}


