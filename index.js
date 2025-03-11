addListeners();

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            animaster().fadeIn(document.getElementById('fadeInBlock'), 5000);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            animaster().fadeOut(document.getElementById('fadeOutBlock'), 5000);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            animaster().move(document.getElementById('moveBlock'), 1000, {x: 100, y: 10});
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            animaster().scale(document.getElementById('scaleBlock'), 1000, 1.25);
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            animaster().moveAndHide(document.getElementById('moveAndHideBlock'), 5000);
        });

    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().resetFadeOut(block).resetMoveAndScale(block);
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            animaster().showAndHide(document.getElementById('showAndHideBlock'), 3000);
        });

    let heartBeatingAnimation;
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            heartBeatingAnimation = animaster().heartBeating(document.getElementById('heartBeatingBlock'));
        });

    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            if (heartBeatingAnimation) {
                heartBeatingAnimation.stop();
            }
        });

    document.getElementById('moveChainPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().addMove(1000, {x: 100, y: 10}).play(block);
        });

    document.getElementById('scaleChainPlay')
        .addEventListener('click', function () {
            animaster().addScale(1000, 1.25).play(document.getElementById('scaleBlock'));
        });

    document.getElementById('fadeInChainPlay')
        .addEventListener('click', function () {
            animaster().addFadeIn(5000).play(document.getElementById('fadeInBlock'));
        });

    document.getElementById('fadeOutChainPlay')
        .addEventListener('click', function () {
            animaster().addFadeOut(5000).play(document.getElementById('fadeOutBlock'));
        });
}

function animaster() {
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

    function resetFadeIn(element) {
        element.style.transitionDuration = null;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    function resetFadeOut(element) {
        element.style.transitionDuration = null;
        element.classList.remove('hide');
        element.classList.add('show');

        return this;
    }

    function resetMoveAndScale(element) {
        element.style.transitionDuration = null;
        element.style.transform = null;
    }

    return {
        _steps: [],
        addMove(duration, translation) {
            this._steps.push({
                type: 'move',
                duration,
                translation
            });
            return this;
        },
        addScale(duration, ratio) {
            this._steps.push({
                type: 'scale',
                duration,
                ratio
            });
            return this;
        },
        addFadeIn(duration) {
            this._steps.push({
                type: 'fadeIn',
                duration
            });
            return this;
        },
        addFadeOut(duration) {
            this._steps.push({
                type: 'fadeOut',
                duration
            });
            return this;
        },
        addDelay(duration) {
            this._steps.push({
                type: 'delay',
                duration
            });
            return this;
        },
        play(element, cycled = false) {
            let isStopped = false;
            const initialTransform = element.style.transform;
            const initialTransition = element.style.transitionDuration;
            const wasHidden = element.classList.contains('hide');

            const executeSteps = () => {
                if (isStopped){
                    return;
                }
                let delay = 0;
                this._steps.forEach(step => {
                    setTimeout(() => {
                        if (isStopped){
                            return;
                        }
                        switch (step.type) {
                            case 'move':
                                this.move(element, step.duration, step.translation);
                                break;
                            case 'scale':
                                this.scale(element, step.duration, step.ratio);
                                break;
                            case 'fadeIn':
                                this.fadeIn(element, step.duration);
                                break;
                            case 'fadeOut':
                                this.fadeOut(element, step.duration);
                                break;
                            case 'delay':
                                break;
                        }
                    }, delay);
                    delay += step.duration;
                });
                if (cycled && !isStopped) {
                    setTimeout(executeSteps, delay);
                }
            };
            executeSteps();
            return {
                stop: () => {
                    isStopped = true;
                    resetMoveAndScale(element);
                },
                reset: () => {
                    element.style.transform = initialTransform;
                    element.style.transitionDuration = initialTransition;

                    if (wasHidden) {
                        resetFadeIn(element);
                    } else {
                        resetFadeOut(element);
                    }
                }
            };
        },

        fadeIn(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },

        fadeOut(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        },

        move(element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        },

        scale(element, duration, ratio) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },

        moveAndHide(element, duration) {
            const moveDuration = (2 / 5) * duration;
            const fadeDuration = (3 / 5) * duration;

            this.addMove(moveDuration, {x: 100, y: 20})
                .addFadeOut(fadeDuration)
                .play(element);
        },

        showAndHide(element, duration) {
            const stepDuration = duration / 3;

            this.addFadeIn(stepDuration)
                .addDelay(stepDuration)
                .addFadeOut(stepDuration)
                .play(element);
        },

        heartBeating(element) {
            return this.addScale(500, 1.4)
                .addScale(500, 1)
                .addDelay(500)
                .play(element, true);
        },

        buildHandler() {
            return function () {
                animaster()._steps = this._steps;
                animaster().play(this);
            }.bind(this);
        },

        resetFadeIn,
        resetFadeOut,
        resetMoveAndScale
    };
}