// ======================== cards main ==============================


// targetEl - элемент в который будут вставлены карточки
// content - объект с данными из бд
function ProductCardMain(targetEl, content) {

    this.targetEl = $(targetEl).get(0);
    this.names = [];
    this.href = [];
    this.path = [];
    for (var key in content) {
        this.href.push(key);
        this.path.push('/images/' + key.slice(1, -2) + '/cover.jpg');
        this.names.push(content[key]);
    }
}

ProductCardMain.prototype.createCard = function() {

    for (var i = 0; i < this.names.length; i++) {
        var card = document.createElement('div'),
            imageWrap = document.createElement('div'),
            image = document.createElement('img'),
            link = document.createElement('a'),
            nameDiv = document.createElement('div');

        link.appendChild(image);
        imageWrap.appendChild(link);
        card.appendChild(imageWrap).className = 'card-image';
        nameDiv.innerHTML = this.names[i];
        card.appendChild(nameDiv).className = 'card-name';


        this.targetEl.appendChild(card).className = 'card';
    }
    return this;
};

ProductCardMain.prototype.addContent = function() {

    var images = $('.' + this.targetEl.className + ' img').toArray(),
        links = $('.' + this.targetEl.className + ' a').toArray();


    for (var i = 0; i < images.length; i++) {
        images[i].src = this.path[i];
        links[i].href = this.href[i];
    }
    return this;
}


// ============================= cards catalog =============================



function ProductCard(content, catalogName) {

    this.targetEl = $('.catalog').get(0);
    this.names = [];
    this.path = [];
    this.href = [];
    this.price = [];
    this.avail = [];

    for (var key in content) {
        this.path.push('/images/' + catalogName.substr(1) + '/' + key + '.jpg');
        this.href.push(key);
        this.names.push(content[key][0]);
        this.price.push(content[key][1]);
        this.avail.push(content[key][2]);
    }
}
ProductCard.prototype = Object.create(ProductCardMain.prototype);
ProductCard.prototype.constructor = ProductCard;


ProductCard.prototype.addElements = function() {

    $('.card').each(function() {
        var price = document.createElement('div'),
            avail = document.createElement('div'),

            button = document.createElement('button');


        button.innerHTML = 'В КОРЗИНУ';

        this.appendChild(price).className = 'card-price';
        this.appendChild(avail).className = 'card-avail';
        this.appendChild(button).className = 'add-to-cart';

    })
    return this;
}

ProductCard.prototype.addContent = function() {

    var images = $('.card-image img').toArray(),
        links = $('.card-image a').toArray(),
        names = $('.card-name').toArray(),
        price = $('.card-price').toArray(),
        avail = $('.card-avail').toArray();


    for (var i = 0; i < this.names.length; i++) {
        images[i].src = this.path[i];
        links[i].href = this.href[i];
        names[i].innerHTML = this.names[i];
        price[i].innerHTML = this.price[i];
        if (+this.avail[i]) {
            avail[i].innerHTML = 'в наличии';
        } else {
            avail[i].innerHTML = 'нет в наличии';
        }
    }
    return this;
};








// ================================= VIEW ==================================

var view = {

    showPage: function(page) {

        $('.content').html(page);
    },

    mainList: function(list) {

        for (var key in list) {
            $('.sbm').append('<li><a href=' + key + '>' + list[key] + '</a></li>');

        }

    },

    setMainCatalog: function(list) {

        var listMisc = {};
        $('.menu a:gt(0)').not('a:last').each(function() {
            listMisc[this.hash] = this.text;
        })


        function createCatalog(elem, obj) {
            new ProductCardMain(elem, obj)
                .createCard()
                .addContent();
        }
        createCatalog('.main-catalog', list);
        createCatalog('.main-catalog-misc', listMisc);


    },

    setCatalog: function(content, catalogName) {

        $('.content').html('<div class ="page"><div class = "catalog"></div></div>');

        new ProductCard(content, catalogName)
            .createCard()
            .addElements()
            .addContent();

    },

    showSubmenu: function() {
        $('.submenu').toggleClass('submenu-active');
        $('.sbm').toggleClass('sbm-active');
    },

    hideSubmenu: function() {
        $('.submenu').removeClass('submenu-active');
        $('.sbm').removeClass('sbm-active');
    },

    scrollToCatalog: function() {
        var value = $('.main-catalog').offset().top;
        $('body,html').animate({ scrollTop: value - 50 }, 1000);
    },

    resetFeedbackForm: function() {

        $(':input', '#feedback-form').val('');
    },

    // currentItem -  продукт добавленный в корзину в текущий момент со страницы,
    // если не передан - проверка локального хранилища на наличие сохраненных товаров,
    // если сохраненные  есть - проверка на наличие этих товаров в корзине и добавление
    renderCart: function(currentItem) {

        $('.shopping-list>span').remove();
        $('.counter').html(controller.count);
        $('.popup-buttons').css({ 'display': 'flex' });

        if (currentItem) {
            createItemPlate(currentItem);
        } else {
            for (key in localStorage) {
                if (localStorage.hasOwnProperty(key)) {

                    var item = JSON.parse(localStorage.getItem(key));
                    var flag = true;

                    if ($('.item-name')) {
                        $('.item-name').each(function() {

                            if (this.href == item.link) {
                                flag = false;
                            }
                        })
                        if (flag) {
                            createItemPlate(item);
                        }
                    } else {
                        createItemPlate(item);
                    }
                }
            }
        }

        this.setTotalPrice();
        controller.cartHandler();

        function createItemPlate(item) {
            var itemPlate = document.createElement('div'),
                image = document.createElement('img'),
                name = document.createElement('a'),
                amount = document.createElement('input'),
                priceConst = document.createElement('div'),
                price = document.createElement('div');

            itemPlate.className = 'item-plate';
            image.src = item.img;
            name.href = item.link;
            name.innerHTML = item.name;
            amount.type = 'number';
            amount.min = '1';
            amount.value = item.amount;
            price.innerHTML = item.price * item.amount;
            priceConst.innerHTML = item.price;

            itemPlate.appendChild(image);
            itemPlate.appendChild(name).className = 'item-name';
            itemPlate.appendChild(amount).className = 'item-amount';
            itemPlate.appendChild(price).className = 'item-price';
            itemPlate.appendChild(priceConst).id = 'priceConst';

            $('.shopping-list').append(itemPlate);
        }
    },

    setPrice: function(e) {

        var val = e.target.valueAsNumber,
            priceDiv = e.target.parentElement.children[3],
            price = e.target.parentElement.children[4].textContent;
        name = e.target.parentElement.children[1].href;

        localSave = JSON.parse(localStorage[name]);
        localSave.amount = val;
        localStorage[name] = JSON.stringify(localSave);
        priceDiv.innerHTML = val * price;
        this.setTotalPrice();

    },

    setTotalPrice: function() {

        var sum = 0;

        $('.item-price').each(function() {
            sum += parseInt(this.textContent)
        })
        $('.total').html('ИТОГО : ' + sum)

    },

    addToCart: function(e) {

        if (e.target.textContent == 'В КОРЗИНУ' &&
            e.currentTarget.children[3].textContent == 'в наличии') {
            var flag = true,
                item = {
                    name: e.currentTarget.children[1].textContent,
                    price: parseInt(e.currentTarget.children[2].textContent),
                    link: e.currentTarget.children[0].children[0].href,
                    img: e.currentTarget.children[0].children[0].children[0].currentSrc,
                    amount: 1
                },
                itemStr = JSON.stringify(item);

            for (var key in localStorage) {
                if (localStorage[key] === itemStr) {
                    flag = false;
                }
            }
            if (flag) {
                controller.count++;

                localStorage[item.link] = itemStr;

                this.renderCart(item)

            }
        }
    },

    showCart: function() {

        $("#popup1").css({ 'display': 'flex' });
    },

    closeCart: function() {

        $("#popup1").hide();
    },

    resetCart: function() {

        localStorage.clear()
        $('.shopping-list').html('<span>Корзина пуста :(</span>');
        $('.total').html('');
        $('.popup-buttons').hide();
        controller.count = 0;
        $('.counter').html(0);
    },

    showOrderPopup: function() {
        this.closeCart()
        $('#popup2').css({ 'display': 'flex' });

    },

    closeOrderPopup: function() {
        $("#popup2").hide();
    },

    backToCart: function() {
        $("#popup2").hide();
        $("#popup1").css({ 'display': 'flex' });

    },

    resetOrderForm: function() {
        $(':input', '#orderForm').val('');
    }

};


//==================================== CONTROLLER =====================================


var controller = {

    count: 0,

    load: function() {

        if (!window.location.hash) {
            window.location.hash = '#main';
        } else if (window.location.hash === '#main') {
            this.loadPage()
        } else {
            this.loadPage()
            model.getMainList()
        }
        $(window).on('hashchange', this.loadPage);
        this.submenuHandler();

    },

    loadPage: function() {

        var pageName = window.location.hash.substring(1);
        model.checkCart();
        if (model[pageName]) {
            model[pageName]()
        } else if (pageName.substr(-2) == '.c') {
            model.getCatalogData(window.location.hash.slice(0, -2));
        } else {
            model.getPage(pageName)
        }
    },

    submenuHandler: function() {
        $('body').click(function(e) {
            if (e.target.text == 'ламинат') {
                view.showSubmenu()
            } else if (!e.target.matches('li, ul')) {
                view.hideSubmenu()
            }
        });
    },

    buttonCatalogHandler: function() {
        $('.slogan button').on('click', function() {

            view.scrollToCatalog()
        })
    },

    feedbackHandler: function() {

        $('#feedback-form').submit(function(event) {
            event.preventDefault();
            model.sendFeedback($('#feedback-form'));

        })
    },

    cartHandler: function() {

        $('.cart').on('click', view.showCart);
        $('.popup-close').on('click', function() {
            view.closeCart()
            view.closeOrderPopup()
        });
        $('.item-amount').on('input', function(e) {
            view.setPrice(e);
        });
        $('.card').on('click', function(e) {
            view.addToCart(e);
        });
        $('#resetCart').on('click', view.resetCart);
        $('#placeAnOrder').on('click', function() {
            view.showOrderPopup()
        });
        $('#backward').on('click', view.backToCart);

    },

    productInfoHandler: function() {
        $('.card a').on('click', function(e) {
            e.preventDefault()

            //         model.getProductInfo(e)
        });
        //     $('.popup-close').on('click', view.closeProductInfo)

    }


};
$('#orderForm').on('submit', function(e) {
    e.preventDefault()

    model.sendOrder($(this));
})


function ajax(options) {
    return new Promise(function(resolve, reject) {
        $.ajax(options).done(resolve).fail(reject);

    });
}


// ===================================== MODEL =======================================


var model = {

    getPage: function(pageName) {

        return ajax({
            type: 'POST',
            url: 'http://localhost:3000/page',
            data: {
                name: pageName
            }
        }).then(function(page) {

            return view.showPage(page);


        }).catch(function(err) {
            console.log(err);
        })
    },

    main: function() {

        Promise.all([this.getPage('main'), this.getMainList()])
            .then(function(data) {

                view.setMainCatalog(data[1]);
                controller.buttonCatalogHandler();


            }).catch(function(err) {
                console.log(err);
            })
    },

    getMainList: function() {

        return ajax({
            type: 'GET',
            url: 'http://localhost:3000/mainList',
        }).then(function(data) {
            var list = data[0].names
            if (!document.querySelector('.sbm a')) {
                view.mainList(list)
            }

            return list;
        }).catch(function(err) {
            console.log(err);
        })
    },

    getCatalogData: function(catalogName) {

        ajax({
            type: 'POST',
            url: 'http://localhost:3000/catalog',
            data: {
                name: catalogName
            }

        }).then(function(data) {

            view.setCatalog(data[0].content, catalogName);
            controller.cartHandler()
            controller.productInfoHandler()

        }).catch(function(err) {
            console.log(err);
        })
    },

    contacts: function() {

        this.getPage('contacts')
            .then(function() {

                controller.feedbackHandler()
            })
    },

    checkCart: function() {

        if (localStorage.length) {
            controller.count = localStorage.length;
            view.renderCart();
        }
    },

    sendFeedback: function(form) {

        $.ajax({
            type: form.attr('method'),
            url: form.attr('action'),
            data: form.serialize(),
            success: function() {
                alert('Ваш вопрос сохранен, ожидайте ответ на email')
                view.resetFeedbackForm()
            },
            error: function(err) {
                alert('Не удалось отправить сообщение')
            }
        });

    },

    sendOrder: function(form) {

        var count = 0;
        var data = form.serialize();

        for (key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                count++
                data += '&' + count + '=' + localStorage[key];
            }
        }
        $.ajax({
            type: form.attr('method'),
            url: form.attr('action'),
            data: data,
            success: function() {
                alert('Ваш заказ оформлен, наш менеджер свяжется с вами.')
                view.resetOrderForm();
                view.resetCart()
                view.closeOrderPopup();
            },
            error: function(err) {
                alert('Не удалось оформитьзаказ')
            }
        });
    },


}

controller.load()