document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.memory-card');
    const play = document.querySelectorAll('.playBtn');

    let hasFlippedCard = false
    let lockBoard = false
    let firstCard, secondCard
    const score = document.querySelector('#score')
    var cardsMatched = []

    function flipCard() {
        if (lockBoard) return
        if (this === firstCard) return

        this.classList.add('flip')

        if (!hasFlippedCard) {
            hasFlippedCard = true
            firstCard = this

            return
        }

        secondCard = this
        checkForMatch()
    }

    function checkForMatch() {
        let isMatch = firstCard.dataset.id === secondCard.dataset.id

        isMatch ? disableCards() : unflipCards()
    }

    function disableCards() {

        firstCard.removeEventListener('click', flipCard)
        secondCard.removeEventListener('click', flipCard)

        // adiciona borda verde nos cards combinados
        firstCard.classList.add('right')
        secondCard.classList.add('right')
        // remove cartas combinadas
        //console.log([firstCard, secondCard])
        //firstCard.setAttribute('src', "blank")
        //secondCard.setAttribute('src', "blank")

        // Pontuação
        cardsMatched.push(firstCard)
        cardsMatched.push(secondCard)
        score.textContent = cardsMatched.length / 2

        if (cardsMatched.length === 18) { fireWorks() }
        resetBoard()
    }

    function unflipCards() {
        lockBoard = true

        // adiciona borda vermelha nos cards que não combinam
        firstCard.classList.add('wrong')
        secondCard.classList.add('wrong')

        setTimeout(() => {
            firstCard.classList.remove('flip')
            secondCard.classList.remove('flip')

            //remove borda vermelha
            firstCard.classList.remove('wrong')
            secondCard.classList.remove('wrong')
            resetBoard()
        }, 3000)
    }

    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false]
        [firstCard, secondCard] = [null, null]
    }

    (function shuffle() {
        cards.forEach(card => {
            let randomPos = Math.floor(Math.random() * 18)
            card.style.order = randomPos
        })
    })()

    cards.forEach(card => card.addEventListener('click', flipCard))
    play.forEach(card => card.addEventListener('click', refresh))
})

function refresh() { location.reload() }

function fireWorks() {
    // helper functions
    const PI2 = Math.PI * 2;
    const random = (min, max) => (Math.random() * (max - min + 1) + min) | 0;
    const timestamp = (_) => new Date().getTime();

    // container
    class Birthday {
        constructor() {
            this.resize();

            // create a lovely place to store the firework
            this.fireworks = [];
            this.counter = 0;
        }

        resize() {
            parabens.classList.remove('hide');
            game.classList.add('hide');
            this.width = canvas.width = window.innerWidth;
            let center = (this.width / 2) | 0;
            this.spawnA = (center - center / 4) | 0;
            this.spawnB = (center + center / 4) | 0;

            this.height = canvas.height = window.innerHeight;
            this.spawnC = this.height * 0.1;
            this.spawnD = this.height * 0.5;
        }

        onClick(evt) {
            let x = evt.clientX || (evt.touches && evt.touches[0].pageX);
            let y = evt.clientY || (evt.touches && evt.touches[0].pageY);

            let count = random(3, 5);
            for (let i = 0; i < count; i++)
                this.fireworks.push(
                    new Firework(
                        random(this.spawnA, this.spawnB),
                        this.height,
                        x,
                        y,
                        random(0, 260),
                        random(30, 110)
                    )
                );

            this.counter = -1;
        }

        update(delta) {
            ctx.globalCompositeOperation = "hard-light";
            ctx.fillStyle = `rgba(20,20,20,${7 * delta})`;
            ctx.fillRect(0, 0, this.width, this.height);

            ctx.globalCompositeOperation = "lighter";
            for (let firework of this.fireworks) firework.update(delta);

            // if enough time passed... create new new firework
            this.counter += delta * 3; // each second
            if (this.counter >= 1) {
                this.fireworks.push(
                    new Firework(
                        random(this.spawnA, this.spawnB),
                        this.height,
                        random(0, this.width),
                        random(this.spawnC, this.spawnD),
                        random(0, 360),
                        random(30, 110)
                    )
                );
                this.counter = 0;
            }

            // remove the dead fireworks
            if (this.fireworks.length > 1000)
                this.fireworks = this.fireworks.filter((firework) => !firework.dead);
        }
    }

    class Firework {
        constructor(x, y, targetX, targetY, shade, offsprings) {
            this.dead = false;
            this.offsprings = offsprings;

            this.x = x;
            this.y = y;
            this.targetX = targetX;
            this.targetY = targetY;

            this.shade = shade;
            this.history = [];
        }
        update(delta) {
            if (this.dead) return;

            let xDiff = this.targetX - this.x;
            let yDiff = this.targetY - this.y;
            if (Math.abs(xDiff) > 3 || Math.abs(yDiff) > 3) {
                // is still moving
                this.x += xDiff * 2 * delta;
                this.y += yDiff * 2 * delta;

                this.history.push({
                    x: this.x,
                    y: this.y
                });

                if (this.history.length > 20) this.history.shift();
            } else {
                if (this.offsprings && !this.madeChilds) {
                    let babies = this.offsprings / 2;
                    for (let i = 0; i < babies; i++) {
                        let targetX =
                            (this.x + this.offsprings * Math.cos((PI2 * i) / babies)) | 0;
                        let targetY =
                            (this.y + this.offsprings * Math.sin((PI2 * i) / babies)) | 0;

                        birthday.fireworks.push(
                            new Firework(this.x, this.y, targetX, targetY, this.shade, 0)
                        );
                    }
                }
                this.madeChilds = true;
                this.history.shift();
            }

            if (this.history.length === 0) this.dead = true;
            else if (this.offsprings) {
                for (let i = 0; this.history.length > i; i++) {
                    let point = this.history[i];
                    ctx.beginPath();
                    ctx.fillStyle = "hsl(" + this.shade + ",100%," + i + "%)";
                    ctx.arc(point.x, point.y, 1, 0, PI2, false);
                    ctx.fill();
                }
            } else {
                ctx.beginPath();
                ctx.fillStyle = "hsl(" + this.shade + ",100%,50%)";
                ctx.arc(this.x, this.y, 1, 0, PI2, false);
                ctx.fill();
            }
        }
    }

    let canvas = document.getElementById("birthday");
    let parabens = document.getElementById("parabens");
    let game = document.getElementById("game");
    let ctx = canvas.getContext("2d");

    let then = timestamp();

    let birthday = new Birthday();
    window.onresize = () => birthday.resize();
    document.onclick = (evt) => birthday.onClick(evt);
    document.ontouchstart = (evt) => birthday.onClick(evt);
    (function loop() {
        requestAnimationFrame(loop);

        let now = timestamp();
        let delta = now - then;

        then = now;
        birthday.update(delta / 1000);
    })();

}