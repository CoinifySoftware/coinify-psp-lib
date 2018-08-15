(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("CoinifyPspLib", [], factory);
	else if(typeof exports === 'object')
		exports["CoinifyPspLib"] = factory();
	else
		root["CoinifyPspLib"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/Coinify.ts":
/*!************************!*\
  !*** ./src/Coinify.ts ***!
  \************************/
/*! exports provided: CardData, UrlData, CoinifyHttp, Coinify, getCoinifyInstance, registerCard, handleTradePaymentInfo, applyCardToTradeTransferInDetails, openHostedPaymentPage, getCardList, setOptions */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CardData", function() { return CardData; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UrlData", function() { return UrlData; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CoinifyHttp", function() { return CoinifyHttp; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Coinify", function() { return Coinify; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getCoinifyInstance", function() { return getCoinifyInstance; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "registerCard", function() { return registerCard; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handleTradePaymentInfo", function() { return handleTradePaymentInfo; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "applyCardToTradeTransferInDetails", function() { return applyCardToTradeTransferInDetails; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "openHostedPaymentPage", function() { return openHostedPaymentPage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getCardList", function() { return getCardList; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setOptions", function() { return setOptions; });
console.log("*** Coinify PSP Library ***");
var CardData = /** @class */ (function () {
    function CardData() {
        this.cardNumber = '';
        this.cardHolderName = '';
        this.expirationMonth = '';
        this.expirationYear = '';
        this.CVV = 0;
    }
    CardData.validate = function (card) {
        if (!card.cardNumber || !card.cardHolderName || !card.CVV || !card.expirationYear || !card.expirationMonth) {
            throw new Error('Invalid card data');
        }
    };
    return CardData;
}());

var UrlData = /** @class */ (function () {
    function UrlData() {
        this.is3DS = false;
        this.url = '';
        this.callbackUrl = '';
        this.paRequest = '';
    }
    UrlData.validate = function (urlData) {
        if (urlData.is3DS === undefined || !urlData.url || !urlData.callbackUrl || (urlData.is3DS && !urlData.paRequest)) {
            throw new Error('Invalid url data');
        }
    };
    return UrlData;
}());

var CoinifyHttp = /** @class */ (function () {
    function CoinifyHttp() {
    }
    CoinifyHttp.prototype.get = function (url, accessToken) {
        if (accessToken === void 0) { accessToken = ''; }
        return new Promise(function (callback, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url);
            if (accessToken && accessToken !== '') {
                //xhr.withCredentials = true;
                xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
            }
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onreadystatechange = function () {
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
    CoinifyHttp.prototype.post = function (url, values, accessToken) {
        if (values === void 0) { values = {}; }
        if (accessToken === void 0) { accessToken = ''; }
        return new Promise(function (callback, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', url);
            if (accessToken && accessToken !== '') {
                //xhr.withCredentials = true;
                xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
            }
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onreadystatechange = function () {
                // console.log( "on ready state changed ", xhr.readyState );
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
    return CoinifyHttp;
}());

var Coinify = /** @class */ (function () {
    function Coinify() {
        this.provider = {
            'safecharge': {
                loaded: false,
                loading: false
            },
            'isignthis': {
                loaded: false,
                loading: false
            }
        };
        this.overlay = undefined;
        this.loadingOverlay = undefined;
        this.container3ds = undefined;
        this.callbackUrl3DS = "localhost:6564";
        this.callbackUrlPayment = "localhost:1234";
        this.coinifyApiBaseUrl = 'http://localhost:8087';
        this.container3dsForm = undefined;
        this.container3dsi1 = undefined;
        this.container3dsi2 = undefined;
        this.container3dsFrame = undefined;
        this.istBaseUrl = 'https://verify.isignthis.com';
        this.containerPay = undefined;
        this.options = {
            verbose: false,
            accessToken: ''
        };
        this.containerIsOverlay = false;
        this.cssLoaded = false;
    }
    /**
     * Used to apply the card on a tradeInfo object.
     * It does so by adding it to the details.
     */
    Coinify.applyCardToTradeTransferInDetails = function (tradeInfo, atbs) {
        var provider = atbs.psp || atbs.provider;
        if (provider !== undefined && provider !== Coinify.PSPType.safecharge) {
            throw new Error('Invalid psp: ' + provider);
        }
        if (!tradeInfo || !tradeInfo.transferIn) {
            throw new Error('Invalid transfer In in trade info.');
        }
        var details = {
            card: {}
        };
        if (atbs.cardExternalId) {
            details.card.cardExternalId = atbs.cardExternalId;
        }
        else if (atbs.ccTempToken) {
            details.card.ccTempToken = atbs.ccTempToken;
            details.card.returnUrl = atbs.returnUrl || 'https://app.sandbox.coinify.com/';
        }
        else {
            // TODO extend with token support.
            throw new Error('cardExternalId or ccTempToken was not present amoungst the attributes when applying card data');
        }
        tradeInfo.transferIn.details = details;
        return tradeInfo;
    };
    Coinify.prototype.uri = function (path) {
        if (path[0] != '/') {
            path = '/' + path;
        }
        return this.coinifyApiBaseUrl + path;
    };
    Coinify.prototype.createOverlay = function () {
        if (this.overlay) {
            return this.overlay;
        }
        this.log("Creating overlay");
        var o = this.overlay = document.createElement('div');
        o.className = "c-overlay c-is-hidden";
        o.id = "c-overlay";
        var body = document.getElementsByTagName('body')[0];
        body.appendChild(o);
        this.ensureCSSLoaded();
        return o;
    };
    Coinify.prototype.ensureCSSLoaded = function () {
        if (this.cssLoaded) {
            return;
        }
        var css = "\n      .c-is-hidden {\n        display: none;\n      }\n      .c-button-close {\n        display: inline-block;\n        width: 16px;\n        height: 16px;\n        position: absolute;\n        top: 10px;\n        right: 10px;\n        cursor: pointer;\n        background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAowAAAKMB8MeazgAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAB5SURBVDiNrZPRCcAwCEQfnUiySAZuF8kSWeH6Yz8KrQZMQAicJ+epAB0YwAmYJKIADLic0/GPPCbQAnLznCd/4NWUFfkgy1VjH8CryA95ApYltAiTRCZxpuoW+gz9WXE6NPeg+ra1UDIxGlWEObe4SGxY5fIxlc75Bkt9V4JS7KWJAAAAAElFTkSuQmCC59ef34356faa7edebc7ed5432ddb673d');\n      }\n      .c-overlay {\n        position: fixed;\n        top: 0;\n        left: 0;\n        width: 100%;\n        height: 100%;\n        background: rgba(0,0,0,0.6);\n      }\n      .c-modal-content {\n        padding: 20px 30px;\n        width: 600px;\n        position: relative;\n        min-height: 300px;\n        margin: 5% auto 0;\n        background: #fff;\n      }\n      .c-stretch {\n        width: 100%;\n        height: 100%;\n      }\n      .c-working-overlay {\n        position: fixed;\n        top: 0;\n        left: 0;\n        width: 100%;\n        height: 100%;\n        background: rgba(0,0,0,0.6);\n        z-index: 15000000;\n      }\n      .c-iframe {\n        min-height: 450px;\n      }\n    ";
        var style = document.createElement('style');
        style.type = 'text/css';
        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        }
        else {
            style.appendChild(document.createTextNode(css));
        }
        var body = document.getElementsByTagName('body')[0];
        var head = document.head || document.getElementsByTagName('head')[0];
        (head || body).appendChild(style);
        this.cssLoaded = false;
    };
    Coinify.prototype.createLoadingOverlay = function () {
        if (this.loadingOverlay) {
            return this.loadingOverlay;
        }
        this.log("Creating loading overlay");
        var o = this.loadingOverlay = document.createElement('div');
        o.className = "c-working-overlay c-is-hidden";
        o.id = "c-working-overlay";
        var body = document.getElementsByTagName('body')[0];
        body.appendChild(o);
        this.ensureCSSLoaded();
        return o;
    };
    Coinify.prototype.create3DSFrame = function (url, paRequest, iframeCallbackUrl, cb) {
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
            _iframe.scrolling = "no";
            _iframe.setAttribute("style", "border: none; width: 100%; min-height: 350px;");
            i1.setAttribute("type", "hidden");
            i1.setAttribute("name", "PaReq");
            i2.setAttribute("type", "hidden");
            i2.setAttribute("name", "TermUrl");
            form.appendChild(i1);
            form.appendChild(i2);
            o.appendChild(form);
            o.appendChild(_iframe);
            body.appendChild(o);
            this.ensureCSSLoaded();
        }
        this.container3dsForm.setAttribute("action", url);
        this.container3dsi1.setAttribute("value", paRequest);
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
        // Wait a litle while to submit in order to ensure that the elements just created has been added to the DOM and
        // rendered.
        setTimeout(function () {
            _this.container3dsForm.submit();
        });
        return o;
    };
    Coinify.prototype.createPaymentFrame = function (url, cb) {
        var $ = this;
        var o = $.containerPay;
        if (!o) {
            var body = document.getElementsByTagName('body')[0];
            o = $.containerPay = document.createElement('div');
            o.className = "c-stretch";
            var _iframe = document.createElement('iframe');
            _iframe.setAttribute("id", "redirect-pay");
            _iframe.setAttribute("name", "coinify-paymentframe");
            _iframe.className = "c-stretch c-iframe";
            _iframe.src = url;
            o.appendChild(_iframe);
            body.appendChild(o);
            this.ensureCSSLoaded();
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
                    if ($.containerIsOverlay) {
                        $.showOverlay(false);
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
    Coinify.prototype.initSafecharge = function (cb) {
        var _this = this;
        var $ = this;
        $.log("Loading safecharge SDK");
        var _script = document.createElement('script');
        _script.type = 'text/javascript';
        _script.src = 'https://cdn.safecharge.com/js/v1/safecharge.js';
        _script.onload = function () {
            $.provider[Coinify.PSPType.safecharge].loaded = !!_this.Safecharge; // Important: this is the script referance in this context.
            $.provider[Coinify.PSPType.safecharge].loading = false;
            if (!$.provider[Coinify.PSPType.safecharge].loaded) {
                throw new Error('Failed to load Safecharge library');
            }
            cb($.Safecharge);
        };
        var body = document.getElementsByTagName('body')[0];
        body.appendChild(_script);
    };
    Coinify.prototype.init_iSignThis = function (cb) {
        var _this = this;
        var $ = this;
        $.log('Initializing iSignThis');
        var _script = document.createElement('script');
        _script.src = $.istBaseUrl + '/js/isx-embed.js';
        _script.async = true;
        _script.onload = (function () {
            $.iSignThis = _script;
            $.provider[Coinify.PSPType.isignthis].loaded = !!_this.Safecharge; // Important: this is the script referance in this context.
            $.provider[Coinify.PSPType.isignthis].loading = false;
            cb(_script);
        });
    };
    Coinify.prototype.isProviderLoaded = function (pspType) {
        var $ = this;
        pspType = $.validatePSP(pspType);
        if (pspType === Coinify.PSPType.isignthis) {
            return !!$.iSignThis;
        }
        return !!$.Safecharge;
    };
    Coinify.prototype.getScriptForProvider = function (pspType) {
        var $ = this;
        pspType = $.validatePSP(pspType);
        if (pspType === Coinify.PSPType.isignthis) {
            return $.iSignThis;
        }
        return $.Safecharge;
    };
    Coinify.prototype.validatePSP = function (pspType, fallbackOnSC) {
        if (fallbackOnSC === void 0) { fallbackOnSC = true; }
        if (!pspType && fallbackOnSC) {
            console.error('Payment service provider not defined, falling back on safecharge');
            return Coinify.PSPType.safecharge;
        }
        if (pspType !== Coinify.PSPType.safecharge &&
            pspType !== Coinify.PSPType.isignthis) {
            throw new Error('Invalid psp :' + pspType);
        }
        return pspType;
    };
    Coinify.prototype.initPSP = function (pspType) {
        var $ = this;
        pspType = $.validatePSP(pspType);
        if ($.provider[pspType].loading) {
            throw new Error("Already loading");
        }
        return new Promise(function (cb, reject) {
            if ($.provider[pspType].loaded) {
                cb($.getScriptForProvider(pspType));
                return;
            }
            // Bootstrap SafeCharge and then execute the create token request,
            $.provider[pspType].loaded = false;
            $.provider[pspType].loading = true;
            if (pspType === Coinify.PSPType.isignthis) {
                $.init_iSignThis(cb);
            }
            else if (pspType === Coinify.PSPType.safecharge) {
                $.initSafecharge(cb);
            }
        });
    };
    /**
     * Invoke the registerCard with some info like the following.
     */
    Coinify.prototype.createTemporaryCardToken = function (payload, pspType) {
        var $ = this;
        pspType = $.validatePSP(pspType);
        return new Promise(function (resolve, reject) {
            $.initPSP(pspType).then(function (psp) {
                // Test:
                //payload.merchantSiteId = '1811';
                //payload.environment = 'sandbox';
                $.log("Creating ccTempToken with payload " + JSON.stringify(payload || {}));
                psp.card.createToken(payload, function (e) {
                    resolve(e);
                });
            }).catch(function (err) {
                console.error('Error ', err);
                reject(err);
            });
        });
    };
    /*private clearFrame() {
       TODO: add the code to ensure we can open hosted payment page again and again...
      // empty container of any existing elements
      while (iFrameContainer.firstChild) {
        iFrameContainer.removeChild(iFrameContainer.firstChild);
      }
  
      // add new SafeCharge iframe
      iFrameContainer.appendChild( sciFrame );
  
      window.addEventListener( "message", event => {
        if ( event.data.indexOf( scEmbed ) != 0 ) {
          return;
        }
        const msg = JSON.parse( event.data.replace( '[SC-Embed]', '' ) );
        if ( msg.command == 'close' ) {
          if ( msg.param == 'cancelled' ) {
            this.fire( 'cancel', null, { bubbles: false } );
          } else {
            this.fire( 'completed', null, { bubbles: false } );
          }
        }
      }, true );
      
    }
  
    // construct new SafeCharge iFrame
    public createiFrame() {
      const iframe = document.createElement('iframe');
      sciFrame.src = `${this.providerPaymentUrl}`;
      sciFrame.id = 'iframe';
      sciFrame.width = "100%";
      sciFrame.scrolling = "no";
      sciFrame.style = "border:none;";
    }*/
    Coinify.prototype.openPaymentUrl = function (urlData, pspType, container) {
        var $ = this;
        pspType = $.validatePSP(pspType);
        UrlData.validate(urlData);
        $.containerIsOverlay = false;
        if (!container) {
            container = $.createOverlay();
            $.containerIsOverlay = true;
            $.showOverlay();
        }
        return new Promise(function (cb, reject) {
            var frame;
            if (urlData.is3DS) {
                var callbackUrl = urlData.callbackUrl || $.callbackUrl3DS;
                frame = $.create3DSFrame(urlData.url, urlData.paRequest, callbackUrl, cb);
            }
            else {
                var callbackUrl = urlData.callbackUrl || $.callbackUrlPayment;
                frame = $.createPaymentFrame(urlData.url, cb);
            }
            container.appendChild(frame);
        });
    };
    Coinify.prototype.setOptions = function (opts) {
        var $ = this;
        $.log("Setting option(s) " + (opts ? JSON.stringify(opts) : 'undefined'));
        if (!$.options) {
            $.options = opts;
        }
        else if (opts) {
            for (var key in opts) {
                $.options[key] = opts[key];
            }
        }
        if (!this.options) {
            $.log("Failed to set options.");
            return;
        }
        if ($.options.coinifyApiBaseUrl) {
            $.log("Setting Coinity API base url : " + $.options.coinifyApiBaseUrl);
            $.coinifyApiBaseUrl = $.options.coinifyApiBaseUrl;
        }
        if ($.options.default3DSCallback) {
            $.log("Setting Default 3DS callback url : " + $.options.default3DSCallback);
            $.callbackUrl3DS = $.options.default3DSCallback;
        }
        if ($.options.defaultHostedPaymentCallback) {
            $.log("Setting trade service url : " + $.options.defaultHostedPaymentCallback);
            $.callbackUrlPayment = $.options.defaultHostedPaymentCallback;
        }
    };
    Coinify.prototype.log = function (text) {
        if (this.options.verbose) {
            console.log('Coinify:', text);
        }
    };
    Coinify.prototype.registerCard = function (options) {
        var _this = this;
        var $ = this;
        var cardData = options.card;
        if (!cardData) {
            throw new Error('No card data');
        }
        var saveCard = !!options.saveCard;
        CardData.validate(cardData);
        $.log('Registering card; saving card: ' + (saveCard ? 'persistent' : 'temporary') + '; retrieving store card payload');
        return new Promise(function (resolve, reject) {
            Coinify.http.get(_this.uri(Coinify.urls.storeCardPayload), _this.options.accessToken).then(function (storeCardsPayloadResponse) {
                var payload = Object.assign({}, storeCardsPayloadResponse.payload);
                payload.sessionToken = payload.sessionToken || storeCardsPayloadResponse.sessionToken;
                var provider = (storeCardsPayloadResponse.psp || storeCardsPayloadResponse.provider);
                payload.cardData = cardData;
                $.log('Registering card; Requesting ccTempToken');
                $.createTemporaryCardToken(payload, provider).then(function (tokenResponse) {
                    $.log('Registering card; Retrieved ccTempToken ' + tokenResponse.ccTempToken);
                    var status = (tokenResponse || {}).status;
                    if (status === "SUCCESS") {
                        if (saveCard) {
                            $.log('Registering card; saving cTempToken as userPaymentOption');
                            $.saveCardByTempToken(tokenResponse.ccTempToken, payload.sessionToken).then(function (saveCardResponse) {
                                $.log('Saved card: ' + status);
                                resolve(saveCardResponse);
                            }).catch(reject);
                        }
                        else {
                            tokenResponse.sessionToken = storeCardsPayloadResponse.sessionToken;
                            resolve(tokenResponse);
                        }
                    }
                    else {
                        console.error("Failed ", tokenResponse);
                        reject("Failed " + status);
                    }
                }).catch(reject);
            }).catch(reject);
        });
    };
    Coinify.prototype.open3DSecureUrlForTrade = function (createTradeResponseTransferInDetails, container) {
        if (container === void 0) { container = null; }
        var $ = this;
        var details = createTradeResponseTransferInDetails;
        var provider = $.validatePSP(details.psp || details.provider);
        if (!details.acsUrl) {
            throw new Error('TransferIn details did not contain an acsUrl');
        }
        if (!details.paRequest) {
            throw new Error('TransferIn details did not contain a paRequest');
        }
        var finalizeTradeArgs = {
            paResponse: '',
            tradeId: details.tradeId,
            CVV: details.CVV
        };
        Object.keys(finalizeTradeArgs).forEach(function (x) {
            if (finalizeTradeArgs[x] === undefined) {
                throw new Error('Missing argument ' + x);
            }
        });
        return new Promise(function (resolve, reject) {
            // TODO: Impl support to accept non-3ds cards as well.
            var urlData = {
                url: details.acsUrl,
                paRequest: details.paRequest,
                is3DS: true,
                // set callback url // Fallback on the local url if a url is not given in the details.;
                callbackUrl: details.threeDSecureCallback || Coinify.urls.threeDSecureCallback
            };
            $.log('Opening payment url');
            $.openPaymentUrl(urlData, 'safecharge', container).then(function (paResponse) {
                if (!paResponse) {
                    console.error("Failed to retrieve 3DS response.");
                    reject({ error: 'failed to auth3d', error_code: -5435 });
                }
                else {
                    finalizeTradeArgs.paResponse = paResponse.toString();
                    $.finalizePayment(finalizeTradeArgs).then(function (finalizePaymentResponse) {
                        $.log("Payment Result: " + finalizePaymentResponse.status + " : " + finalizePaymentResponse.reason);
                        resolve(finalizePaymentResponse);
                    });
                }
            });
        });
    };
    Coinify.prototype.finalizePayment = function (atbs) {
        var _this = this;
        if (!atbs.paResponse) {
            throw new Error("Invalid argument; paResponse is not defined");
        }
        return new Promise(function (resolve, reject) {
            _this.log('Finalizing trade.');
            Coinify.http.post(_this.uri(Coinify.urls.finalizePayment), atbs, _this.options.accessToken).then(function (response) {
                _this.log('Finalized payment for trade.');
                resolve(response);
            }).catch(reject);
        });
    };
    Coinify.prototype.saveCardByTempToken = function (ccTempToken, sessionToken) {
        if (!ccTempToken) {
            throw new Error('invalid ccTempToken');
        }
        if (!sessionToken) {
            throw new Error('invalid sessionToken');
        }
        this.log('Saving card by temp token');
        return Coinify.http.post(this.uri(Coinify.urls.cards), {
            ccTempToken: ccTempToken,
            sessionToken: sessionToken
        }, this.options.accessToken);
    };
    Coinify.prototype.getCardList = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            Coinify.http.get(_this.uri(Coinify.urls.cards), _this.options.accessToken).then(function (cardList) {
                resolve(cardList);
            }).catch(reject);
        });
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
    Coinify.urls = {
        threeDSecureCallback: 'https://immense-hamlet-63274.herokuapp.com/?pares',
        hostedPaymentPageCallback: 'www.google.com',
        storeCardPayload: '/cards/store-card-payload',
        finalizePayment: '/cards/finalize-payment',
        cards: '/cards'
    };
    Coinify.http = new CoinifyHttp();
    return Coinify;
}());

function getCoinifyInstance() {
    var i = window.coinifyInstance;
    if (!i) {
        window.coinifyInstance = i = new Coinify();
    }
    return i;
}
function registerCard(options) {
    return getCoinifyInstance().registerCard(options);
}
function handleTradePaymentInfo(createTradeResponseTransferInDetails, container) {
    if (container === void 0) { container = null; }
    var details = createTradeResponseTransferInDetails;
    var coinify = getCoinifyInstance();
    coinify.log("Handle trade payment info ", details);
    if (details.acsUrl || details.paRequest) {
        return coinify.open3DSecureUrlForTrade(details, container);
    }
    return coinify.openPaymentUrl({
        url: details.redirectUrl,
        is3DS: false,
        callbackUrl: details.returnUrl || Coinify.urls.hostedPaymentPageCallback,
        paRequest: undefined
    }, details.provider, container);
}
function applyCardToTradeTransferInDetails(tradeInfo, atbs) {
    return Coinify.applyCardToTradeTransferInDetails(tradeInfo, atbs);
}
function openHostedPaymentPage(url, provider, container) {
    if (provider === void 0) { provider = 'safecharge'; }
    if (container === void 0) { container = undefined; }
    var args = { url: url, is3DS: false, callbackUrl: Coinify.urls.hostedPaymentPageCallback, paRequest: undefined };
    return getCoinifyInstance().openPaymentUrl(args, provider, container);
}
function getCardList() {
    return getCoinifyInstance().getCardList();
}
function setOptions(opts) {
    return getCoinifyInstance().setOptions(opts);
}


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! exports provided: CardData, UrlData, CoinifyHttp, Coinify, getCoinifyInstance, registerCard, handleTradePaymentInfo, applyCardToTradeTransferInDetails, openHostedPaymentPage, getCardList, setOptions */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Coinify__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Coinify */ "./src/Coinify.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CardData", function() { return _Coinify__WEBPACK_IMPORTED_MODULE_0__["CardData"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "UrlData", function() { return _Coinify__WEBPACK_IMPORTED_MODULE_0__["UrlData"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CoinifyHttp", function() { return _Coinify__WEBPACK_IMPORTED_MODULE_0__["CoinifyHttp"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Coinify", function() { return _Coinify__WEBPACK_IMPORTED_MODULE_0__["Coinify"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getCoinifyInstance", function() { return _Coinify__WEBPACK_IMPORTED_MODULE_0__["getCoinifyInstance"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "registerCard", function() { return _Coinify__WEBPACK_IMPORTED_MODULE_0__["registerCard"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "handleTradePaymentInfo", function() { return _Coinify__WEBPACK_IMPORTED_MODULE_0__["handleTradePaymentInfo"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "applyCardToTradeTransferInDetails", function() { return _Coinify__WEBPACK_IMPORTED_MODULE_0__["applyCardToTradeTransferInDetails"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "openHostedPaymentPage", function() { return _Coinify__WEBPACK_IMPORTED_MODULE_0__["openHostedPaymentPage"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getCardList", function() { return _Coinify__WEBPACK_IMPORTED_MODULE_0__["getCardList"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "setOptions", function() { return _Coinify__WEBPACK_IMPORTED_MODULE_0__["setOptions"]; });




/***/ }),

/***/ 0:
/*!****************************!*\
  !*** multi ./src/index.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /Users/krm/workspace/Coinify/coinify-psp-lib/src/index.ts */"./src/index.ts");


/***/ })

/******/ });
});
//# sourceMappingURL=coinify-psp-lib.umd.js.map