"use strict";

document.addEventListener('DOMContentLoaded', () => {
    // Tabs
    const tabs = document.querySelectorAll('.tabheader__item'),
          tabsContent = document.querySelectorAll('.tabcontent'),
          tabsParent = document.querySelector('.tabheader__items');
    
    function hideContent() {
        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });
    }

    function showContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');

        tabs[i].classList.add('tabheader__item_active');
        
    }
    hideContent();
    showContent();

    tabsParent.addEventListener('click', event => {
        const target = event.target;
        if (target && target.classList.contains('tabheader__item')){
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideContent();
                    showContent(i);
                }
            });
        }
    });
    
    // Timer
    const deadLine = '2022-04-28';

    function getTimeRemaining(endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date()),
              days = Math.floor(t / (1000 * 60 * 60 * 24)),
              hours = Math.floor((t / (1000 * 60 * 60)) % 24),
              minutes = Math.floor((t / (1000 * 60 )) % 60),
              seconds = Math.floor((t / 1000) % 60);

        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };    
    }

    function addZero(number) {
        if (number >= 0 && number < 10) {
            return `0${number}`;
        } else {
            return number;
        }

    }
    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
              days = timer.querySelector('#days'),
              hours = timer.querySelector('#hours'),
              minutes = timer.querySelector('#minutes'),
              seconds = timer.querySelector('#seconds'),
              timeInterval = setInterval(updateClock, 1000);
        
        updateClock();

        function updateClock() {
            const t = getTimeRemaining(endtime);
            days.innerHTML = addZero(t.days);
            hours.innerHTML = addZero(t.hours);
            minutes.innerHTML = addZero(t.minutes);
            seconds.innerHTML = addZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }   
     }
     setClock('.timer', deadLine);
    //  Modal

    const mButs = document.querySelectorAll('[data-modal]'),
          wsModal = document.querySelector ('.modal');
    
    mButs.forEach(but => {
        but.addEventListener('click', event =>{
            openModal();
            // clearInterval(wsTimerOpen);
        });
    });
    function openModal() {
        wsModal.classList.add('show');
        wsModal.classList.remove('hide');
        document.body.style.overflow = 'hidden';        
    } 

    function closeModal() {
        wsModal.classList.add('hide');
        wsModal.classList.add('show');
        document.body.style.overflow = '';
    }

    
    wsModal.addEventListener('click', event => {
        if (event.target === wsModal || event.target.getAttribute('data-close') == '') {
            closeModal();
        }
    });

    document.addEventListener('keydown', event => {
        if (event.code === 'Escape' && wsModal.classList.contains('show')) {
            closeModal();
        }
    });
    const wsTimerOpen = setTimeout(openModal, 50000);

    function openModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >=
            document.documentElement.scrollHeight) {
                openModal();
                window.removeEventListener('scroll', openModalByScroll);
             }
    } 

    window.addEventListener('scroll', openModalByScroll);

    //Classes in work
    class ItemMenu {
        constructor(src, alt, subtitle, descr, price, parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.subtitle = subtitle;
            this.descr = descr;
            this.price = price;
            this.classes = classes;
            this.nbu = 27;
            this.parent = document.querySelector(parentSelector);
            this.convert();
        }

        convert() {
            this.price = +this.price * this.nbu;
        }
        
        addMenu(){
            const div = document.createElement('div');
            if (this.classes.length === 0) {
                this.classes = 'menu__item';
                div.classList.add(this.classes);
            } else {
                this.classes.forEach(className => div.classList.add(className));
            }
            div.innerHTML =`
            <img src=${this.src} alt=${this.alt}>
            <h3 class="menu__item-subtitle">${this.subtitle}</h3>
            <div class="menu__item-descr">${this.descr}</div>
            <div class="menu__item-divider"></div>
            <div class="menu__item-price">
                <div class="menu__item-cost">Цена:</div>
                <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
            </div>
            `;
            this.parent.append(div);
        }
    }

    const getResource = async (url) => {
        const res = await fetch(url); 
        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }
        return await res.json();
    };
    
    getResource('http://localhost:3000/menu')
        .then(data => {
            data.forEach(({img, altimg, title, descr, price}) => {
                new ItemMenu(img, altimg, title, descr, price, ".menu .container").addMenu();
            });
        });
    //     getResource('http://localhost:3000/menu')
    //     .then(data => createCard(data));


    // function createCard(data){
    //         data.forEach(({img, altimg, title, descr, price}) => {

    //             const div = document.createElement('div');
    //             div.classList.add('menu__item');


    //             div.innerHTML =`
    //             <img src=${img} alt=${altimg}>
    //             <h3 class="menu__item-subtitle">${title}</h3>
    //             <div class="menu__item-descr">${descr}</div>
    //             <div class="menu__item-divider"></div>
    //             <div class="menu__item-price">
    //                 <div class="menu__item-cost">Цена:</div>
    //                 <div class="menu__item-total"><span>${price}</span> грн/день</div>
    //             </div>
    //             `;
    //         document.querySelector('.menu .container').append(div);
    

    //         });
    // }
    //Forms
        const forms = document.querySelectorAll('form');

        const message ={
            loading: 'img/form/spinner.svg',
            success: 'Спасибо! Скоро с вами свяжемся',
            failure: 'Что-то пошло не так...'
        };

        forms.forEach(item => {
            bindPostData(item);
        }); 

        const postData = async (url, data) => {
            const res = await fetch(url, {
                method: "POST",
                body: data,
                headers: {'Content-type': 'application/json'}
            }); 
            return await res.json();
        };

        function bindPostData(form) {
            form.addEventListener('submit', e => {
                e.preventDefault();

                const statusMessage = document.createElement('img');
                statusMessage.src = message.loading;
                statusMessage.style.cssText = `
                    display: block;
                    margin: 0 auto;
                `;
                form.insertAdjacentElement('afterend', statusMessage);
                // form.append(statusMessage);

                const formData = new FormData(form);

                const json = JSON.stringify(Object.fromEntries(formData.entries()));

                // const object = {};
                // formData.forEach((value, key) => {
                    // object[key] = value;
                // });

                postData('http://localhost:3000/requests', json)
                  .then(data => {
                    console.log(data);
                    showThanksModal(message.success);
                    statusMessage.remove();
                }).catch(() => {
                    showThanksModal(message.failure);
                }).finally(() => {
                    form.reset();
                });
                
            });
        }
        function showThanksModal(message) {
            const prevModalDialog = document.querySelector('.modal__dialog');
            prevModalDialog.classList.add('hide');
            openModal();

            const thanksModal = document.createElement('div');
            thanksModal.classList.add('modal__dialog');
            thanksModal.innerHTML = `
                <div class="modal__content">
                    <div class="modal__close" data-close>×</div>
                    <div class="modal__title">${message}</div>
                </div>
            `;
            document.querySelector('.modal').append(thanksModal);
            setTimeout(() =>{
                thanksModal.remove();
                prevModalDialog.classList.add('show');
                prevModalDialog.classList.remove('hide');
                closeModal();
            }, 4000); 
        }

});