let WORDS = []; //, "a", "b", "c", "d"]//['안녕하세요!', '소년', '어머니', '바보']
const wordsKey = "83473644785";
const dictContainer = document.getElementById("dictContainer");

const dictionary1 = document.getElementById("dictionary1");
const englishDict = dictionary1.querySelector("div");
const englishMore = dictionary1.querySelector("h2 i");

const dictionary2 = document.getElementById("dictionary2");
const koreanDict = dictionary2.querySelector("div");
const koreanMore = dictionary2.querySelector("h2 i");

const englishLds = document.getElementById("englishLds");
const koreanLds = document.getElementById("koreanLds");

let globalWord;
let source;

const language = {
    english: "en",
    korean: "ko",
    getTarget(source) {
        return this.english === source ? this.korean : this.english;
    },
    getHtmlDiv(lang) {
        return this.english === lang ? englishDict : koreanDict;
    },
};

const localGet = (key) => JSON.parse(localStorage.getItem(key));
const localSet = (key, value) => {
    try {
        const val = JSON.stringify(value);
        localStorage.setItem(key, val);
    } catch (error) {
        console.log(error);
    }
};
const localUpdate = (key, value) => {
    let item = localGet(key) || {};
    item = { ...item, ...value };
    localSet(key, item);
};
const localObj = (html, lang) => {
    let res = {};
    if (html !== undefined) res.html = html;
    if (lang !== undefined) res.language = lang;
    return res;
};

const htmlObj = (value) => {
    html: value;
};
const languageObj = (value) => {
    language: value;
};
const apiKey = "d2153a53eamsha9fb0ca6180437cp179df3jsn7fb23728306a";

// import {
//     get,
//     set,
//     getMany,
//     setMany,
//     update,
//     del,
//     clear,
//     keys,
//     values,
//     entries,
//     createStore,
// } from "https://cdn.jsdelivr.net/npm/idb-keyval@5/+esm";

// const qs = (obj) => {
//     return new URLSearchParams(obj).toString();
// };

const capitalize = (str) => str[0].toUpperCase() + str.slice(1);

const randColor = () => {
    //return "#" + Math.random().toString(16).slice(2, 8);
    var color = "#";
    for (var i = 0; i < 6; i++) {
        color += Math.floor(Math.random() * 10);
    }
    return color;
};

const showLoading = () => {
    hide(englishDict);
    hide(koreanDict);
    show(englishLds);
    show(koreanLds);
};
const hideLoading = () => {
    hide(englishLds);
    hide(koreanLds);
};

const toggle = (elem, cssClass = "hide", callback = () => {}) => {
    if (elem.classList.contains(cssClass)) {
        elem.classList.remove(cssClass);
    } else {
        elem.classList.add(cssClass);
    }
    callback();
};

const hide = (elem, callback = () => {}) => {
    !elem.classList.contains("hide") && elem.classList.add("hide");
    callback();
};

const show = (elem, callback = () => {}) => {
    elem.classList.contains("hide") && elem.classList.remove("hide");
    callback();
};

const removeClass = (elem, class_) => {
    elem.classList.contains(class_) && elem.classList.remove(class_);
};

const addClass = (elem, class_) => {
    !elem.classList.contains(class_) && elem.classList.add(class_);
};

const expand = (elem) => {};

const meaning = (word, lang = "en") => {
    source = axios.CancelToken.source();
    if (word) {
        const url = `https://api.dictionaryapi.dev/api/v2/entries/${lang}/${word}`;
        return axios
            .get(url, { CancelToken: source.token })
            .then((res) => res.data)
            .catch((error) => error);
    }
};

const translate = (word, source = "en", target = "ko", callback) => {
    const key = word.toLowerCase();
    const item = localGet(key);
    if (item !== null && item.translated) {
        console.log("translated", item);
        callback(item.translated, target);
        return;
    }
    const options = {
        method: "POST",
        url: "https://microsoft-translator-text.p.rapidapi.com/translate",
        params: {
            "api-version": "3.0",
            from: source,
            to: target,
            profanityAction: "NoAction",
        },
        headers: {
            "content-type": "application/json",
            "x-rapidapi-key": apiKey,
            "x-rapidapi-host": "microsoft-translator-text.p.rapidapi.com",
        },
        data: [
            {
                Text: word,
            },
        ],
    };

    axios
        .request(options)
        .then((res) => {
            const translatedWord = res.data[0].translations[0].text.toLowerCase();
            callback(translatedWord, target);
            localUpdate(key, { translated: translatedWord });
            localUpdate(translatedWord, { translated: key });
        })
        .catch((error) => error);
};

const detect = (word, callback) => {
    const key = word.toLowerCase();
    const item = localGet(key);
    if (item !== null && item.language) {
        console.log("detected", item.language);
        callback(item.language);
        return;
    }
    const options = {
        method: "POST",
        url: "https://microsoft-translator-text.p.rapidapi.com/Detect",
        params: { "api-version": "3.0" },
        headers: {
            "content-type": "application/json",
            "x-rapidapi-key": apiKey,
            "x-rapidapi-host": "microsoft-translator-text.p.rapidapi.com",
        },
        data: [
            {
                Text: word,
            },
        ],
    };

    axios
        .request(options)
        .then((res) => {
            const lang = res.data[0].language;
            callback(lang);
            console.log(localObj(undefined, lang));
            localSet(key, localObj(undefined, lang));
        })
        .catch(console.log);
};

// structured definition in html
const structured = (word, lang = language.english) => {
    const key = word.toLowerCase();
    const item = localGet(key);
    if (item !== null && item.html) {
        console.log("structured");
        language.getHtmlDiv(lang).innerHTML = item.html;
        hideLoading();
        return;
    }
    const formatPhon = (phon) => (phon && `/${phon}/`) || "";
    meaning(word, lang)
        .then((res) => {
            let html = `
        <ul className="wordWrapper">
            ${res
                .map((translated) => {
                    const meanings = translated.meanings;
                    let wordHTML = `<li class="word">${translated.word}</li>
					<li class="phonetic">${formatPhon(translated.phonetic)}</li>
					<li>meaning:</li>
					<ul class="meanings">
						${meanings
                            .map((meaning) => {
                                let meaningHTML = `<li class="partOfSpeech">${
                                    meaning.partOfSpeech || ""
                                }</li>
                                <li>
                                    <ol>
                                        ${meaning.definitions
                                            .map(
                                                (definition) =>
                                                    `<li class="definition">
                                                        <p>${definition.definition}</p>
                                                    </li>`
                                            )
                                            .join("")}
                                    </ol>
                                </li>`;
                                return meaningHTML;
                            })
                            .join("")}
					</ul>
					`;
                    return wordHTML;
                })
                .join("")}
				<li class="origin"></li>
			</ul>`;
            language.getHtmlDiv(lang).innerHTML = html;
            localSet(key, localObj(html, lang));
            hideLoading();
        })
        .catch((error) => {
            language.getHtmlDiv(
                lang
            ).innerHTML = `<h4>Sorry could not find the word: ${word}</h4>`;
            hideLoading();
        });
};

// render the html base on the language specified
const renderDict = (lang = null) => {
    if (source) {
        console.log(source);
        source.cancel();
    }
    if (globalWord) {
        const englishLds = document.getElementById("englishLds");
        const koreanLds = document.getElementById("koreanLds");
        const tran = (htmlDiv) => {
            detect(globalWord, (source) => {
                if (source === lang) {
                    structured(globalWord);
                } else {
                    translate(
                        globalWord,
                        source,
                        language.getTarget(source),
                        structured
                    );
                }
                toggle(htmlDiv, undefined, toggleDictWidth);
            });
        };
        if (lang === null) {
            showLoading();
            detect(globalWord, (source) => {
                const target = language.getTarget(source);

                hide(language.getHtmlDiv(target), toggleDictWidth);
                show(language.getHtmlDiv(source), toggleDictWidth);
                structured(globalWord, source);
            });
        } else if (lang === language.korean) {
            koreanDict.innerHTML = "";
            show(koreanLds);
            tran(koreanDict);
        } else {
            englishDict.innerHTML = "";
            show(englishLds);
            console.log("en more click", globalWord);
            tran(englishDict);
        }
    }
};

const suggest = (word, success, fail = console.log) => {
    if (word) {
        const url = `https://api.datamuse.com/words?sp=${word}*&max=5`;
        axios
            .get(url)
            .then((res) => success(res.data))
            .catch((error) => fail(error));
    }
};

class Wheel {
    constructor(form) {
        this.wheel = document.querySelector("#wheel");
        //document.querySelectorAll('.sec p')
        // for (let i = 0; i < this.secs.length; i++) {
        //     this.words.push(this.secs[i].firstElementChild.innerText);
        // }
        this.delay =
            parseInt(
                window
                    .getComputedStyle(this.wheel)
                    .transitionDuration.replace("s", "")
            ) * 1000;
        this.form = form;
        this.p = document.querySelectorAll(".sec p");
    }

    get radius() {
        return parseFloat(window.getComputedStyle(this.wheel).width) / 2;
    }

    get anglePerSlice() {
        return 360 / this.form.words.length;
    }

    init() {}

    createSec() {
        const sec = document.createElement("div");
        sec.classList.add("sec");
        sec.innerHTML = "<p></p>";
        this.wheel.appendChild(sec);
        return sec;
    }

    render(option) {
        // let cx = w/2
        // let cy = h/2
        this.degree = 1500;
        this.seen = new Set();
        const words = this.form.words;
        this.wheel.style.transform = "rotate(0deg)";
        this.wheel.innerHTML = "";
        if (words.length != 0) {
            this.secs = [];
            for (let i = 0; i < words.length; i++) {
                const word = words[i];
                const sec = this.createSec(word);
                this.secs[i] = sec;
                sec.firstElementChild.innerText = word;
            }
            let startAngle = 0;
            let theta = (Math.PI * 2) / words.length;
            let tangent = this.radius * Math.tan(theta / 2) * 2;
            let i = 0;
            this.secs.forEach((sec) => {
                sec.style.width = `${tangent}px`;
                sec.style.backgroundColor = randColor(); //'rgba(225, 225, 225, 0.8)'
                sec.style.transform = `rotate(${startAngle}deg)`;
                // this.p[i].style.transform = `translateY(-16vh) rotate(${-90}deg)`
                startAngle = startAngle - this.anglePerSlice;
                i++;
            });
            const dots = option.querySelectorAll("div");
            removeClass(option, "blink");
            dots.forEach((dot) => {
                removeClass(dot, "blinkDot");
            });
        } else {
            const dots = option.querySelectorAll("div");
            addClass(option, "blink");
            dots.forEach((dot) => {
                addClass(dot, "blinkDot");
            });
        }
        // let startAngle = Math.PI*3 / 2 + this.anglePerSlice / 2
    }

    spin() {
        let extraTime = 0;
        this.degree += Math.floor((Math.random() + 1) * 1500);

        let offset = this.anglePerSlice / 2;
        const getIndex = () =>
            Math.floor(
                Math.ceil((this.degree + offset) % 360) / this.anglePerSlice
            );
        let index = getIndex();
        while (this.seen.has(index)) {
            this.degree += this.anglePerSlice / 2;
            index = getIndex();
            extraTime += 20;
        }
        this.wheel.style.transform = `rotate(${this.degree}deg)`;
        this.seen.add(index);
        return [this.form.words[index], extraTime, index];
    }
}

class Slider {
    constructor() {
        this.slider = document.getElementById("slider");
        this.delayValue = document.getElementById("delayValue");
        this.min = slider.min;
        this.max = slider.max;
        let x = this.left;
        this.delayValue.style.left = `calc(${x}% + (${8 - x * 0.15}px))`;
        const p = this.delayValue.firstElementChild;
        p.innerText = this.value + "s";
        this.slider.oninput = () => {
            x = this.left;
            p.innerText = this.value + "s";
            this.delayValue.style.left = `calc(${x}% + (${8 - x * 0.15}px))`;
        };
    }
    get value() {
        return this.slider.value;
    }

    get left() {
        return (
            ((this.value - this.min) * 100) / (this.max - this.min) -
            parseFloat(window.getComputedStyle(this.delayValue).width) / 2 +
            1
        );
    }
}

class WordInputWrappers {
    constructor() {
        this.container = [];
        this.id = 0;
        this.wordInputContainer = document.getElementById("wordInputContainer");
        this.wordNum = document.getElementById("wordNum");
    }

    get length() {
        return this.container.filter(
            (wordInputWrapper) => wordInputWrapper.querySelector("input").value
        ).length;
    }

    create(word = "") {
        const div = document.createElement("div");
        const border = document.createElement("div");
        border.classList.add("border");
        const wordInputWrapper = document.createElement("div");
        wordInputWrapper.classList.add("wordInputWrapper");
        wordInputWrapper.innerHTML = `<input type='text' name='word' id='word${this.id}' value='${word}'> <button type='button' class='delete button'><i class="fas fa-times"></i></button>`;
        wordInputWrapper.lastElementChild.addEventListener("click", () =>
            this.delete(div, wordInputWrapper)
        );
        const input = wordInputWrapper.firstElementChild;
        const suggestionWrapper = document.createElement("ul");
        suggestionWrapper.classList.add("suggestionWrapper");

        div.appendChild(border);
        div.appendChild(wordInputWrapper);
        div.appendChild(suggestionWrapper);
        this.wordInputContainer.appendChild(div);

        input.onfocus = () => {
            const word = input.value;
            wordInputWrapper.style.margin = "2px";
            border.style.clipPath = "inset(0 0 0 0)";
            globalWord = word;

            renderDict();
            if (suggestionWrapper.innerHTML === "") {
                this.fillSuggest(suggestionWrapper, word, input);
            }
            show(suggestionWrapper);
        };

        input.addEventListener("focusout", () => {
            const word = input.value;
            input.value = word.trim();
            wordInputWrapper.style.transform = "scale(1)";
            wordInputWrapper.style.margin = "0px";
            border.style.clipPath = "inset(0 100% 0 0)";
            setTimeout(() => hide(suggestionWrapper), 300);
            if (globalWord != word) {
                globalWord = word;
                renderDict();
            }
        });

        input.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                input.blur();
                this.wordNum.innerText = `${this.length}/${this.container.length}`;
            }
        });

        input.oninput = () => {
            this.fillSuggest(suggestionWrapper, input.value, input);
        };

        this.container.push(wordInputWrapper);
        this.id++;
        // update the number of words
        this.wordNum.innerText = `${this.length}/${this.container.length}`;

        return wordInputWrapper;
    }

    delete(parent, wordInputWrapper) {
        parent.remove();
        const i = this.container.indexOf(wordInputWrapper);
        i > -1 && this.container.splice(i, 1);
        // update the number of words
        this.wordNum.innerText = `${this.length}/${this.container.length}`;
    }

    fillSuggest(suggestionWrapper, word, input) {
        suggestionWrapper.innerHTML = "";
        suggest(word, (res) => {
            res.forEach((obj) => {
                suggestionWrapper.appendChild(
                    this.suggestItem(capitalize(obj.word), input)
                );
            });
        });
    }

    suggestItem(word, input) {
        const li = document.createElement("li");
        li.innerText = word;
        li.addEventListener("click", () => {
            input.value = li.innerText;
        });
        return li;
    }

    // save to localStorage
    get words() {
        let res = [];
        this.container.forEach((wordInputWrapper) => {
            const word = wordInputWrapper.querySelector("input").value;
            word !== "" && res.push(word);
        });
        localSet(wordsKey, res);
        return res;
    }

    clear() {
        this.container = [];
        this.wordInputContainer.innerHTML = "";
    }

    save() {}
}

class Form {
    constructor() {
        this.form = document.querySelector("#toolWindow form");
        this.addButton = document.getElementById("addButton");
        this.slider = new Slider();
        this.wordInputWrappers = new WordInputWrappers();

        this.init();

        this.addButton.addEventListener("click", () => {
            this.wordInputWrappers.create();
        });
        const wordInputContainer = this.wordInputWrappers.wordInputContainer;
        const resizeObserver = new ResizeObserver((entries) => {
            this.form.scrollTo({
                top: this.form.scrollHeight,
                behavior: "smooth",
            });
            // this.form.scrollIntoView(true)
            console.log(this.form.scrollHeight);
        });

        // resizeObserver.observe(wordInputContainer);
    }
    get words() {
        return this.wordInputWrappers.words;
    }

    get delay() {
        return this.slider.value * 1000;
    }

    init() {
        this.wordInputWrappers.clear();
        let words = localGet(wordsKey);
        globalWord = words[0] || "";
        words.forEach((word) => {
            console.log(word);
            const wordInputWrapper = this.wordInputWrappers.create(word);
            // this.form.insertBefore(wordInputWrapper, this.addButton)
        });
        hide(englishDict);
        hide(koreanDict);
    }
}

const timer = (n, delayPerN, processing, done = () => {}) => {
    const status = document.querySelector("#status");
    let i = n;
    let id;
    id = setInterval(() => {
        if (i == -1) {
            done(status);
            clearInterval(id);
        } else {
            processing(status, i);
        }
        i--;
    }, delayPerN);
    return id;
};

const initialWait = (delay, callback) => {
    const dotdot = () => {
        timer(2, 1000 / 3 - 50, (status) => (status.innerText += "."));
    };

    return timer(
        delay,
        1000,
        (status, i) => {
            status.innerText = `Starting in ${i}`;
            dotdot();
        },
        (status) => {
            callback();
            status.innerText = "";
        }
    );
};

window.addEventListener("load", () => {
    // set("userId", 200).then(console.log).catch(console.warn);
    const container = document.querySelector(".container");
    let option = document.getElementById("option");
    const form = new Form();
    const wheel = new Wheel(form);
    let start = document.getElementById("start");
    let status = document.getElementById("status");

    let started;
    let spinId;
    let waitId;

    const init = () => {
        started = false;
        wheel.render(option);
        status.innerText = "";
        // start.style.color = "black";
        // start.querySelector('::after').style.color = "blue";
        // toggle(start, "glow")
    };

    init();

    const handleOptionClick = () => {
        show(toolWindow);
        form.init();

        if (started) {
            spinId && clearTimeout(spinId);
            waitId && clearTimeout(waitId);
            setTimeout(() => init(), 1000);
        }
    };
    const test = document.querySelector(".test");
    test.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        test.innerText += 1;
    });
    test.addEventListener("touchstart", (e) => {
        e.stopPropagation();
        e.preventDefault();
        test.innerText += 2;
    });

    option.addEventListener("touchstart", () => {
        // document.querySelector(".test").innerText = "touch";
        handleOptionClick();
    });
    option.addEventListener("click", () => {
        // document.querySelector(".test").innerText = "clicked";
        handleOptionClick();
    });

    const spin = () => {
        if (wheel.form.words.length != wheel.seen.size) {
            let [word, extraTime, i] = wheel.spin();
            let start = Date.now();
            detect(word, (lang) => {
                let end = Date.now() - start;
                spinId = setTimeout(() => {
                    let synth = window.speechSynthesis;
                    // let voices = synth.getVoices();
                    // for (var i = 0; i < voices.length; i++) {
                    //     var option = voices[i].name + " (" + voices[i].lang + ")";
                    //     console.log(option);
                    // }
                    let msg = new SpeechSynthesisUtterance(word);
                    msg.lang = lang;
                    speechSynthesis.speak(msg);
                    // setTimeout(() => spin(), form.delay);
                    timer(
                        form.delay / 1000,
                        1000,
                        (status, i) => (status.innerText = i),
                        () => {
                            console.log(wheel.secs[i]);
                            removeClass(
                                wheel.secs[i].querySelector("p"),
                                "blur"
                            );
                            spin();
                        }
                    );

                    // msg.voice = voices[]
                }, wheel.delay - end + extraTime);
            });
        } else {
            started = false;
            setTimeout(() => init(), 1000);
            removeClass(start.querySelector(".inner"), "startClick");
        }
    };

    start.addEventListener("click", () => {
        if (!started) {
            started = true;
            waitId = initialWait(form.delay / 1000, () => spin());
            addClass(start.querySelector(".inner"), "startClick");
            wheel.secs.forEach((sec) =>
                addClass(sec.querySelector("p"), "blur")
            );
        }
    });

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
    let toolWindow = document.getElementById("toolWindow");

    const cancelButton = document.getElementById("cancel");
    cancelButton.addEventListener("click", () => {
        toggle(toolWindow);
    });
    const doneButton = document.getElementById("done");
    doneButton.addEventListener("click", () => {
        console.log(form.wordInputWrappers.length);
        if (form.wordInputWrappers.length < 3) {
            console.log("too little");
        } else {
            init();
            hide(toolWindow);
        }
    });

    englishMore.addEventListener("click", () => {
        renderDict(language.english);
    });

    koreanMore.addEventListener("click", () => {
        renderDict(language.korean);
    });
});

const toggleDictWidth = () => {
    if (
        !englishDict.classList.contains("hide") &&
        !koreanDict.classList.contains("hide")
    ) {
        dictContainer.classList.add("relative");
        dictionary1.classList.add("absolute");
        dictionary1.classList.add("halfHeight");
        dictionary2.classList.add("absolute");
        dictionary2.classList.add("toMiddle");
        // englishDict.classList.add(equalWidth)
    } else {
        dictContainer.classList.remove("relative");
        dictionary1.classList.remove("absolute");
        dictionary1.classList.remove("halfHeight");
        dictionary2.classList.remove("absolute");
        dictionary2.classList.remove("toMiddle");
    }
};
