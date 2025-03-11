addListeners();

let heartBeatingAnimation;

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().addFadeIn(5000).play(block);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().addMove(1000, {x: 100, y: 10}).play(block);
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().addScale(1000, 1.25).play(block);
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            showAndHide(block, 6000, 1.25);
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            moveAndHide(block, 1000, {x: 100, y: 20});
        });

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            heartBeatingAnimation = heartBeating(block, 500, 1.4);
        });

    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            if (heartBeatingAnimation){
                heartBeatingAnimation.stop()
                heartBeatingAnimation = null;
            }
        });

    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            resetMoveAndScale(block);
            resetFadeOut(block);
        });
}

/**
 * Блок плавно появляется из прозрачного.
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 */
function fadeIn(element, duration) {
    element.style.transitionDuration =  `${duration}ms`;
    element.classList.remove('hide');
    element.classList.add('show');
}

/**
 * Блок плавно становиться прозрачным.
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 */
function fadeOut(element, duration) {
    element.style.transitionDuration =  `${duration}ms`;
    element.classList.remove('show');
    element.classList.add('hide');
}

/**
 * Функция, передвигающая элемент
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 * @param translation — объект с полями x и y, обозначающими смещение блока
 */
function move(element, duration, translation) {
    element.style.transitionDuration = `${duration}ms`;
    element.style.transform = getTransform(translation, null);
}

/**
 * Функция, увеличивающая/уменьшающая элемент
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
 */
function scale(element, duration, ratio) {
    element.style.transitionDuration =  `${duration}ms`;
    element.style.transform = getTransform(null, ratio);
}

function getTransform(translation, ratio) {
    const result = [];
    if (translation) {
        result.push(`translate(${translation.x}px,${translation.y}px)`);
    }
    if (ratio) {
        result.push(`scale(${ratio})`);
    }
    return result.join(' ');
}

function moveAndHide(element, duration, translation){
    animaster()
        .addMove(duration * 0.4, translation)
        .addFadeOut(duration * 0.6)
        .play(element);
}

function showAndHide(element, duration){
    animaster()
        .addFadeIn(duration / 3)
        .addDelay(duration / 3)
        .addFadeOut(duration / 3)
        .play(element);
}

function heartBeating(element, duration, ratio) {
    let scaleUp = true;
    let intervalId;

    function animateScale() {
        if (scaleUp) {
            scale(element, duration, ratio);
        } else {
            scale(element, duration, 1);
        }
        scaleUp = !scaleUp;
    }

    intervalId = setInterval(animateScale, duration);

    return {
        stop() {
            clearInterval(intervalId);
        }
    };
}

function restFadeIn(element){
function resetFadeIn(element){
    element.style.transitionDuration = null;
    element.classList.remove('show');
    element.classList.add('hide');
}

function resetFadeOut(element){
    element.style.transitionDuration = null;
    element.classList.remove('hide');
    element.classList.add('show');
}

function resetMoveAndScale(element){
    element.style.transitionDuration = null;
    element.style.transform = getTransform(null, null);
}

function addMove(duration, translation){
    this._steps.push({
        operation: 'move',
        duration: duration,
        params: translation
    });

    return this;
}

function addScale(duration, ratio){
    this._steps.push({
        operation: 'scale',
        duration: duration,
        params: ratio
    });

    return this;
}

function addFadeIn(duration){
    this._steps.push({
        operation: 'fadeIn',
        duration: duration
    });

    return this;
}

function addFadeOut(duration){
    this._steps.push({
        operation: 'fadeOut',
        duration: duration
    });

    return this;
}

function addDelay(duration){
    setTimeout(() => {}, duration);
    return this;
}

function play(element){
    this._steps.forEach(step => {
        switch (step.operation) {
            case 'move':
                move(element, step.duration, step.params);
                break;
            case 'scale':
                scale(element, step.duration, step.params);
                break;
            case 'fadeIn':
                fadeIn(element, step.duration);
                break;
            case 'showAndHide':
                showAndHide(element, step.duration);
                break;
            case 'moveAndHide':
                moveAndHide(element, step.duration, step.params);
                break;
            default:
                console.error(`Unknown operation: ${step.operation}`);
        }
    });
    // Очищаем массив шагов после выполнения
    this._steps = [];
}

function animaster(){
    return{
        move(element, duration, translation) {
            move(element, duration, translation);
            return this;
        },
        scale(element, duration, ratio) {
            scale(element, duration, ratio);
            return this;
        },
        fadeIn(element, duration) {
            fadeIn(element, duration);
            return this;
        },
        fadeOut(element, duration) {
            fadeOut(element, duration);
            return this;
        },
        showAndHide,
        moveAndHide,
        addMove,
        addScale,
        addFadeIn,
        addFadeOut,
        addDelay,
        play,
        _steps: [],
        heartBeating
    }
}