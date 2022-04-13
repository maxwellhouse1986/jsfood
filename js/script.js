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
          wsModal = document.querySelector ('.modal'),
          modalClose = document.querySelector('[data-close]');    
    
    mButs.forEach(but => {
        but.addEventListener('click', event =>{
            openModal();
            // clearInterval(wsTimerOpen);
        });
    });
    function openModal() {
        wsModal.classList.toggle('show');
        document.body.style.overflow = 'hidden';        
    } 

    function closeModal() {
        wsModal.classList.toggle('show');
        document.body.style.overflow = '';
    }

    modalClose.addEventListener('click', closeModal);
    
    wsModal.addEventListener('click', event => {
        if (event.target === wsModal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', event => {
        if (event.code === 'Escape' && wsModal.classList.contains('show')) {
            closeModal();
        }
    });
    // const wsTimerOpen = setTimeout(openModal, 5000);

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
    new ItemMenu(
        "img/tabs/vegy.jpg",
        "vegy",
        'Меню "Фитнес"',
        'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
        9,
        ".menu .container",
        "menu__item",
        "big")
        .addMenu();

    new ItemMenu(
        "img/tabs/elite.jpg",
        "elite",
        'Меню “Премиум”',
        'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
        15,
        ".menu .container")
        .addMenu();

    new ItemMenu(
        "img/tabs/post.jpg",
        "post",
        'Меню "Постное"',
        'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
        11,
        ".menu .container")
        .addMenu();
});