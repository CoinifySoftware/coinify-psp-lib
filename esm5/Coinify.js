console.log("*** Coinify PSP Library ***");
var CardData = /** @class */ (function () {
    function CardData() {
        this.cardNumber = '';
        this.cardHolder = '';
        this.expireMonth = '';
        this.expireYear = '';
        this.CVV = 0;
    }
    return CardData;
}());
export { CardData };
var UrlData = /** @class */ (function () {
    function UrlData() {
        this.is3DS = false;
        this.url = '';
        this.callbackUrl = '';
        this.PaReq = '';
    }
    return UrlData;
}());
export { UrlData };
var Coinify = /** @class */ (function () {
    function Coinify() {
        this.loaded = false;
        this.loading = false;
        this.overlay = undefined;
        this.loadingOverlay = undefined;
        this.container3ds = undefined;
        this.callbackUrl3DS = "localhost:6564";
        this.callbackUrlPayment = "localhost:1234";
        this.container3dsForm = undefined;
        this.container3dsi1 = undefined;
        this.container3dsi2 = undefined;
        this.container3dsFrame = undefined;
        this.containerPay = undefined;
        this.containerIsOverlay = false;
    }
    Coinify.getRequest = function (url) {
        return new Promise(function (callback, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url);
            //xhr.withCredentials = true;
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            //xhr.setRequestHeader("Access-Control-Allow-Headers","Access-Control-Allow-Headers,Origin,Content-Type,Accept");
            //xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onreadystatechange = function () {
                console.log("on ready state changed ", xhr.readyState);
                if (xhr.readyState === 4) {
                    if (xhr.status === 200 || (xhr.status === 0 && xhr.responseText !== '')) {
                        callback(JSON.parse(xhr.responseText || '{}'));
                    }
                    else {
                        reject({
                            url: url,
                            status: xhr.status,
                            body: xhr.responseText || ''
                        });
                    }
                }
            };
            xhr.send();
        });
    };
    Coinify.postRequest = function (url, values) {
        if (values === void 0) { values = {}; }
        return new Promise(function (callback, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', url);
            //xhr.withCredentials = true;
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onreadystatechange = function () {
                console.log("on ready state changed ", xhr.readyState);
                if (xhr.readyState === 4) {
                    if (xhr.status === 200 || (xhr.status === 0 && xhr.responseText !== '')) {
                        callback(JSON.parse(xhr.responseText || '{}'));
                        /*callback({
                          url: url,
                          status: 200,
                          body: xhr.responseText || ''
                        });*/
                    }
                    else {
                        reject({
                            url: url,
                            status: xhr.status,
                            body: xhr.responseText || ''
                        });
                    }
                }
            };
            xhr.send(JSON.stringify(values));
        });
    };
    Coinify.applyCardToTradeTransferInDetails = function (tradeInfo, payload, pspType, cardData) {
        if (pspType !== Coinify.PSPType.safecharge) {
            throw new Error('Invalid psp: ' + pspType);
        }
        if (!tradeInfo || !tradeInfo.transferIn) {
            throw new Error('Invalid transfer in method.');
        }
        // payload = Object.assign( {}, payload || {} );
        tradeInfo.transferIn.details = cardData;
        return tradeInfo;
    };
    Coinify.prototype.uri = function (path) {
        if (path[0] != '/') {
            path = '/' + path;
        }
        return 'http://localhost:8087' + path;
    };
    Coinify.prototype.createOverlay = function () {
        if (this.overlay) {
            return this.overlay;
        }
        console.log("Creating overlay");
        var o = this.overlay = document.createElement('div');
        o.className = "c-overlay c-is-hidden";
        o.id = "c-overlay";
        var body = document.getElementsByTagName('body')[0];
        body.appendChild(o);
        var css = "\n      .c-is-hidden {\n        display: none;\n      }\n      .c-button-close {\n        display: inline-block;\n        width: 16px;\n        height: 16px;\n        position: absolute;\n        top: 10px;\n        right: 10px;\n        cursor: pointer;\n        background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAowAAAKMB8MeazgAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAB5SURBVDiNrZPRCcAwCEQfnUiySAZuF8kSWeH6Yz8KrQZMQAicJ+epAB0YwAmYJKIADLic0/GPPCbQAnLznCd/4NWUFfkgy1VjH8CryA95ApYltAiTRCZxpuoW+gz9WXE6NPeg+ra1UDIxGlWEObe4SGxY5fIxlc75Bkt9V4JS7KWJAAAAAElFTkSuQmCC59ef34356faa7edebc7ed5432ddb673d');\n      }\n      .c-overlay {\n        position: fixed;\n        top: 0;\n        left: 0;\n        width: 100%;\n        height: 100%;\n        background: rgba(0,0,0,0.6);\n      }\n      .c-modal-content {\n        padding: 20px 30px;\n        width: 600px;\n        position: relative;\n        min-height: 300px;\n        margin: 5% auto 0;\n        background: #fff;\n      }\n      .c-stretch {\n        width: 100%;\n        height: 100%;\n      }\n    ";
        var style = document.createElement('style');
        style.type = 'text/css';
        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        }
        else {
            style.appendChild(document.createTextNode(css));
        }
        var head = document.head || document.getElementsByTagName('head')[0];
        (head || body).appendChild(style);
        return o;
    };
    Coinify.prototype.createLoadingOverlay = function () {
        if (this.loadingOverlay) {
            return this.loadingOverlay;
        }
        console.log("Creating overlay");
        var o = this.loadingOverlay = document.createElement('div');
        o.className = "c-working-overlay c-is-hidden";
        o.id = "c-working-overlay";
        var body = document.getElementsByTagName('body')[0];
        body.appendChild(o);
        var css = "\n      .c-working-overlay {\n        position: fixed;\n        top: 0;\n        left: 0;\n        width: 100%;\n        height: 100%;\n        background: rgba(0,0,0,0.6);\n        z-index: 15000000;\n      }\n    ";
        var style = document.createElement('style');
        style.type = 'text/css';
        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        }
        else {
            style.appendChild(document.createTextNode(css));
        }
        var head = document.head || document.getElementsByTagName('head')[0];
        (head || body).appendChild(style);
        return o;
    };
    Coinify.prototype.create3DSFrame = function (url, PARequest, iframeCallbackUrl, cb) {
        var _this = this;
        var o = this.container3ds;
        if (!o) {
            var body = document.getElementsByTagName('body')[0];
            o = this.container3ds = document.createElement('div');
            o.style.backgroundColor = "white";
            var form = this.container3dsForm = document.createElement('form');
            var i1 = this.container3dsi1 = document.createElement('input');
            var i2 = this.container3dsi2 = document.createElement('input');
            var _iframe = this.container3dsFrame = document.createElement('iframe');
            o.className = "c-stretch";
            form.setAttribute("target", "coinify-3dsframe");
            form.setAttribute("id", "redirect-3ds");
            form.setAttribute("method", "post");
            _iframe.setAttribute("name", "coinify-3dsframe");
            _iframe.className = "c-stretch";
            i1.setAttribute("type", "hidden");
            i1.setAttribute("name", "PaReq");
            i2.setAttribute("type", "hidden");
            i2.setAttribute("name", "TermUrl");
            form.appendChild(i1);
            form.appendChild(i2);
            o.appendChild(form);
            o.appendChild(_iframe);
            body.appendChild(o);
        }
        this.container3dsForm.setAttribute("action", url);
        this.container3dsi1.setAttribute("value", PARequest);
        this.container3dsi2.setAttribute("value", iframeCallbackUrl);
        //console.log("submit paRequest:" + PARequest + " url:" + url );
        var callback = cb;
        var eventHandler; // = undefined;
        eventHandler = function (event) {
            var data = event.data ? event.data.toString() : '';
            if (data.indexOf('[SC-Embed]') != 0) {
                return;
            }
            window.removeEventListener('message', eventHandler);
            var msg = JSON.parse(event.data.replace('[SC-Embed]', ''));
            // console.log( "msg ", msg );
            if (msg.command == 'close') {
                if (o.parentNode) {
                    o.parentNode.removeChild(o);
                    if (_this.containerIsOverlay) {
                        _this.showOverlay(false);
                    }
                }
                if (callback) {
                    callback(msg.param);
                    callback = undefined;
                }
            }
        };
        window.addEventListener('message', eventHandler, true);
        setTimeout(function () {
            _this.container3dsForm.submit();
        });
        return o;
    };
    Coinify.prototype.createPaymentFrame = function (url, cb) {
        var _this = this;
        var o = this.containerPay;
        if (!o) {
            var body = document.getElementsByTagName('body')[0];
            o = this.containerPay = document.createElement('div');
            o.className = "c-stretch";
            var _iframe = document.createElement('iframe');
            _iframe.setAttribute("id", "redirect-pay");
            _iframe.setAttribute("name", "coinify-paymentframe");
            _iframe.className = "c-stretch";
            _iframe.src = url;
            o.appendChild(_iframe);
            body.appendChild(o);
        }
        var callback = cb;
        var eventHandler;
        eventHandler = function (event) {
            //console.log("eventHandler ", event );
            var data = event.data ? event.data.toString() : '';
            if (data.indexOf('[SC-Embed]') != 0) {
                return;
            }
            window.removeEventListener('message', eventHandler);
            var msg = JSON.parse(data.replace('[SC-Embed]', ''));
            // console.log( "msg ", msg );
            if (msg.command == 'close') {
                if (o.parentNode) {
                    o.parentNode.removeChild(o);
                    if (_this.containerIsOverlay) {
                        _this.showOverlay(false);
                    }
                }
                if (callback) {
                    callback(msg.param);
                    callback = undefined;
                }
            }
        };
        window.addEventListener('message', eventHandler, true);
        return o;
    };
    Coinify.prototype.showOverlay = function (value, container) {
        if (value === void 0) { value = true; }
        if (container === void 0) { container = null; }
        var overlay = this.overlay;
        if (value || value === undefined) {
            overlay.classList.remove("c-is-hidden");
            if (container) {
                container.appendChild(overlay);
            }
        }
        else {
            overlay.classList.add("c-is-hidden");
        }
    };
    Coinify.prototype.showLoadingOverlay = function (value) {
        if (value === void 0) { value = true; }
        var overlay = this.createLoadingOverlay();
        if (value || value === undefined) {
            overlay.classList.remove("c-is-hidden");
        }
        else {
            overlay.classList.add("c-is-hidden");
        }
    };
    Object.defineProperty(Coinify.prototype, "Safecharge", {
        get: function () {
            return window.Safecharge;
        },
        enumerable: true,
        configurable: true
    });
    Coinify.prototype.initPSP = function (pspType) {
        var _this = this;
        if (pspType !== Coinify.PSPType.safecharge) {
            throw new Error('Invalid psp :' + pspType);
        }
        if (this.loading) {
            throw new Error("Already loading");
        }
        return new Promise(function (cb, reject) {
            if (_this.loaded) {
                cb(_this.Safecharge);
                return;
            }
            // Bootstrap SafeCharge and then execute the create token request,
            var self = _this;
            self.loaded = false;
            self.loading = true;
            var _script = document.createElement('script');
            _script.type = 'text/javascript';
            _script.src = 'https://cdn.safecharge.com/js/v1/safecharge.js';
            _script.onload = function () {
                self.loaded = !!_this.Safecharge;
                self.loading = false;
                if (!self.loaded) {
                    throw new Error('Failed to load Safecharge library');
                }
                cb(_this.Safecharge);
            };
            var body = document.getElementsByTagName('body')[0];
            body.appendChild(_script);
        });
    };
    /**
     * Invoke the registerCard with some info like the following.
     */
    Coinify.prototype.createTemporaryCardToken = function (payload, pspType) {
        var _this = this;
        if (pspType !== Coinify.PSPType.safecharge) {
            throw new Error('Invalid psp :' + pspType);
        }
        return new Promise(function (cb, reject) {
            console.log("fetching safecharge SDK.");
            _this.initPSP(pspType).then(function (psp) {
                console.log("creating token with payload ", payload);
                psp.card.createToken(payload, function (e) {
                    cb(e);
                });
            });
        });
    };
    Coinify.prototype.openPaymentUrl = function (urlData, pspType, container) {
        var _this = this;
        if (!pspType || pspType !== Coinify.PSPType.safecharge) {
            throw new Error('Invalid psp: ' + pspType);
        }
        this.containerIsOverlay = false;
        if (!container) {
            container = this.createOverlay();
            this.containerIsOverlay = true;
            this.showOverlay();
        }
        return new Promise(function (cb, reject) {
            var frame;
            if (urlData.is3DS) {
                var callbackUrl = urlData.callbackUrl || _this.callbackUrl3DS;
                frame = _this.create3DSFrame(urlData.url, urlData.PaReq, callbackUrl, cb);
            }
            else {
                var callbackUrl = urlData.callbackUrl || _this.callbackUrlPayment;
                frame = _this.createPaymentFrame(urlData.url, cb);
            }
            container.appendChild(frame);
        });
    };
    Coinify.prototype.registerCard = function (options) {
        var _this = this;
        var cardData = options.card;
        var saveCard = !!options.saveCard;
        console.log("REGISTER CARD!!! ", cardData);
        return new Promise(function (resolve, reject) {
            Coinify.getRequest(_this.uri('/cards/storeCardPayload')).then(function (storeCardsPayloadResponse) {
                var payload = storeCardsPayloadResponse.payload;
                var psp = storeCardsPayloadResponse.psp;
                payload.cardData = cardData;
                _this.createTemporaryCardToken(payload, psp).then(function (tokenResponse) {
                    console.log("createTemporaryCardToken ", tokenResponse);
                    if (tokenResponse && tokenResponse.status === "SUCCESS") {
                        // console.log( "response ", tokenResponse );
                        _this.saveCardByTempToken(tokenResponse.ccTempToken, payload.sessionToken).then(function (saveCardResponse) {
                            console.log("saveCardResponse ", saveCardResponse);
                            reject("Failed " + saveCardResponse);
                        }).catch(reject);
                    }
                    else {
                        console.error("Failed ", tokenResponse);
                        reject("Failed " + tokenResponse);
                    }
                }).catch(reject);
            }).catch(reject);
        });
    };
    Coinify.prototype.handleTradePaymentInfo = function (trade, payload, pspType, cardData) {
        console.log("HANDLE TRADE INFO !");
    };
    Coinify.prototype.saveCardByTempToken = function (ccTempToken, sessionToken) {
        return Coinify.postRequest(this.uri('/cards'), {});
    };
    // Constants.
    Coinify.Register = {
        Permanently: 1,
        ForTemporaryUse: 2
    };
    Coinify.PSPType = {
        safecharge: 'safecharge',
        isignthis: 'isignthis'
    };
    return Coinify;
}());
export { Coinify };
export function getCoinifyInstance() {
    var i = window.coinifyInstance;
    if (!i) {
        console.log("created coinify instance ");
        window.coinifyInstance = i = new Coinify();
    }
    return i;
}
export function registerCard(options) {
    return getCoinifyInstance().registerCard(options);
}
export function handleTradePaymentInfo(trade) {
    return getCoinifyInstance().handleTradePaymentInfo(trade);
}
export function applyCardToTradeTransferInDetails(trade, payload, pspType, cardData) {
    return Coinify.applyCardToTradeTransferInDetails(trade, payload, pspType, cardData);
}
//# sourceMappingURL=Coinify.js.map