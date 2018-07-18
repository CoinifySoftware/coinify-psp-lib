/******/ (function(modules) { // webpackBootstrap
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
class CardData {
    constructor() {
        this.cardNumber = '';
        this.cardHolderName = '';
        this.expirationMonth = '';
        this.expirationYear = '';
        this.CVV = 0;
    }
    static validate(card) {
        if (!card.cardNumber || !card.cardHolderName || !card.CVV || !card.expirationYear || !card.expirationMonth) {
            throw new Error('Invalid card data');
        }
    }
}
class UrlData {
    constructor() {
        this.is3DS = false;
        this.url = '';
        this.callbackUrl = '';
        this.PaReq = '';
    }
    static validate(urlData) {
        if (urlData.is3DS === undefined || !urlData.url || !urlData.callbackUrl || (urlData.is3DS && !urlData.PaReq)) {
            throw new Error('Invalid url data');
        }
    }
}
class CoinifyHttp {
    get(url) {
        return new Promise((callback, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url);
            //xhr.withCredentials = true;
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            //xhr.setRequestHeader("Access-Control-Allow-Headers","Access-Control-Allow-Headers,Origin,Content-Type,Accept");
            //xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onreadystatechange = () => {
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
    }
    post(url, values = {}) {
        return new Promise((callback, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', url);
            //xhr.withCredentials = true;
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onreadystatechange = () => {
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
    }
}
class Coinify {
    constructor() {
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
        this.container3dsForm = undefined;
        this.container3dsi1 = undefined;
        this.container3dsi2 = undefined;
        this.container3dsFrame = undefined;
        this.istBaseUrl = 'https://verify.isignthis.com';
        this.containerPay = undefined;
        this.options = {
            verbose: false
        };
        this.containerIsOverlay = false;
    }
    /**
     * Used to apply the card on a tradeInfo object.
     * It does so by adding it to the details.
     */
    static applyCardToTradeTransferInDetails(tradeInfo, atbs) {
        const provider = atbs.psp || atbs.provider;
        if (provider !== undefined && provider !== Coinify.PSPType.safecharge) {
            throw new Error('Invalid psp: ' + provider);
        }
        if (!tradeInfo || !tradeInfo.transferIn) {
            throw new Error('Invalid transfer In in trade info.');
        }
        const details = {
            card: {}
        };
        if (atbs.cardId || atbs.upoId || atbs.externalTokenId) {
            details.card.externalTokenId = atbs.cardId || atbs.upoId || atbs.externalTokenId;
            // details.card.returnUrl = atbs.returnUrl || 'https://app.sandbox.coinify.com/';
        }
        else if (atbs.ccTempToken) {
            details.card.ccTempToken = atbs.ccTempToken;
            details.card.returnUrl = atbs.returnUrl || 'https://app.sandbox.coinify.com/';
        }
        else {
            // TODO extend with token support.
            throw new Error('externalTokenId/cardId/upoId or ccTempToken was not present amoungst the attributes when applying card data');
        }
        tradeInfo.transferIn.details = details;
        return tradeInfo;
    }
    uri(path) {
        if (path[0] != '/') {
            path = '/' + path;
        }
        return 'http://localhost:8087' + path;
    }
    createOverlay() {
        if (this.overlay) {
            return this.overlay;
        }
        this.log("Creating overlay");
        const o = this.overlay = document.createElement('div');
        o.className = "c-overlay c-is-hidden";
        o.id = "c-overlay";
        const body = document.getElementsByTagName('body')[0];
        body.appendChild(o);
        const css = `
      .c-is-hidden {
        display: none;
      }
      .c-button-close {
        display: inline-block;
        width: 16px;
        height: 16px;
        position: absolute;
        top: 10px;
        right: 10px;
        cursor: pointer;
        background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAowAAAKMB8MeazgAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAB5SURBVDiNrZPRCcAwCEQfnUiySAZuF8kSWeH6Yz8KrQZMQAicJ+epAB0YwAmYJKIADLic0/GPPCbQAnLznCd/4NWUFfkgy1VjH8CryA95ApYltAiTRCZxpuoW+gz9WXE6NPeg+ra1UDIxGlWEObe4SGxY5fIxlc75Bkt9V4JS7KWJAAAAAElFTkSuQmCC59ef34356faa7edebc7ed5432ddb673d');
      }
      .c-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.6);
      }
      .c-modal-content {
        padding: 20px 30px;
        width: 600px;
        position: relative;
        min-height: 300px;
        margin: 5% auto 0;
        background: #fff;
      }
      .c-stretch {
        width: 100%;
        height: 100%;
      }
    `;
        const style = document.createElement('style');
        style.type = 'text/css';
        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        }
        else {
            style.appendChild(document.createTextNode(css));
        }
        const head = document.head || document.getElementsByTagName('head')[0];
        (head || body).appendChild(style);
        return o;
    }
    createLoadingOverlay() {
        if (this.loadingOverlay) {
            return this.loadingOverlay;
        }
        this.log("Creating loading overlay");
        const o = this.loadingOverlay = document.createElement('div');
        o.className = "c-working-overlay c-is-hidden";
        o.id = "c-working-overlay";
        const body = document.getElementsByTagName('body')[0];
        body.appendChild(o);
        const css = `
      .c-working-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.6);
        z-index: 15000000;
      }
    `;
        const style = document.createElement('style');
        style.type = 'text/css';
        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        }
        else {
            style.appendChild(document.createTextNode(css));
        }
        const head = document.head || document.getElementsByTagName('head')[0];
        (head || body).appendChild(style);
        return o;
    }
    create3DSFrame(url, PARequest, iframeCallbackUrl, cb) {
        let o = this.container3ds;
        if (!o) {
            const body = document.getElementsByTagName('body')[0];
            o = this.container3ds = document.createElement('div');
            o.style.backgroundColor = "white";
            const form = this.container3dsForm = document.createElement('form');
            const i1 = this.container3dsi1 = document.createElement('input');
            const i2 = this.container3dsi2 = document.createElement('input');
            const _iframe = this.container3dsFrame = document.createElement('iframe');
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
        let eventHandler; // = undefined;
        eventHandler = (event) => {
            const data = event.data ? event.data.toString() : '';
            if (data.indexOf('[SC-Embed]') != 0) {
                return;
            }
            window.removeEventListener('message', eventHandler);
            const msg = JSON.parse(event.data.replace('[SC-Embed]', ''));
            if (msg.command == 'close') {
                if (o.parentNode) {
                    o.parentNode.removeChild(o);
                    if (this.containerIsOverlay) {
                        this.showOverlay(false);
                    }
                }
                if (callback) {
                    callback(msg.param);
                    callback = undefined;
                }
            }
        };
        window.addEventListener('message', eventHandler, true);
        setTimeout(() => {
            this.container3dsForm.submit();
        });
        return o;
    }
    createPaymentFrame(url, cb) {
        const $ = this;
        let o = $.containerPay;
        if (!o) {
            const body = document.getElementsByTagName('body')[0];
            o = $.containerPay = document.createElement('div');
            o.className = "c-stretch";
            const _iframe = document.createElement('iframe');
            _iframe.setAttribute("id", "redirect-pay");
            _iframe.setAttribute("name", "coinify-paymentframe");
            _iframe.className = "c-stretch";
            _iframe.src = url;
            o.appendChild(_iframe);
            body.appendChild(o);
        }
        let callback = cb;
        let eventHandler;
        eventHandler = (event) => {
            //console.log("eventHandler ", event );
            const data = event.data ? event.data.toString() : '';
            if (data.indexOf('[SC-Embed]') != 0) {
                return;
            }
            window.removeEventListener('message', eventHandler);
            const msg = JSON.parse(data.replace('[SC-Embed]', ''));
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
    }
    showOverlay(value = true, container = null) {
        const overlay = this.overlay;
        if (value || value === undefined) {
            overlay.classList.remove("c-is-hidden");
            if (container) {
                container.appendChild(overlay);
            }
        }
        else {
            overlay.classList.add("c-is-hidden");
        }
    }
    showLoadingOverlay(value = true) {
        const overlay = this.createLoadingOverlay();
        if (value || value === undefined) {
            overlay.classList.remove("c-is-hidden");
        }
        else {
            overlay.classList.add("c-is-hidden");
        }
    }
    get Safecharge() {
        return window.Safecharge;
    }
    initSafecharge(cb) {
        const $ = this;
        $.log("Loading safecharge SDK");
        var _script = document.createElement('script');
        _script.type = 'text/javascript';
        _script.src = 'https://cdn.safecharge.com/js/v1/safecharge.js';
        _script.onload = () => {
            $.provider[Coinify.PSPType.safecharge].loaded = !!this.Safecharge; // Important: this is the script referance in this context.
            $.provider[Coinify.PSPType.safecharge].loading = false;
            if (!$.provider[Coinify.PSPType.safecharge].loaded) {
                throw new Error('Failed to load Safecharge library');
            }
            cb($.Safecharge);
        };
        const body = document.getElementsByTagName('body')[0];
        body.appendChild(_script);
    }
    init_iSignThis(cb) {
        const $ = this;
        $.log('Initializing iSignThis');
        const _script = document.createElement('script');
        _script.src = $.istBaseUrl + '/js/isx-embed.js';
        _script.async = true;
        _script.onload = (() => {
            $.iSignThis = _script;
            $.provider[Coinify.PSPType.isignthis].loaded = !!this.Safecharge; // Important: this is the script referance in this context.
            $.provider[Coinify.PSPType.isignthis].loading = false;
            cb(_script);
        });
    }
    isProviderLoaded(pspType) {
        const $ = this;
        pspType = $.validatePSP(pspType);
        if (pspType === Coinify.PSPType.isignthis) {
            return !!$.iSignThis;
        }
        return !!$.Safecharge;
    }
    getScriptForProvider(pspType) {
        const $ = this;
        pspType = $.validatePSP(pspType);
        if (pspType === Coinify.PSPType.isignthis) {
            return $.iSignThis;
        }
        return $.Safecharge;
    }
    validatePSP(pspType, fallbackOnSC = true) {
        if (!pspType && fallbackOnSC) {
            console.error('Payment service provider not defined, falling back on safecharge');
            return Coinify.PSPType.safecharge;
        }
        if (pspType !== Coinify.PSPType.safecharge &&
            pspType !== Coinify.PSPType.isignthis) {
            throw new Error('Invalid psp :' + pspType);
        }
        return pspType;
    }
    initPSP(pspType) {
        const $ = this;
        pspType = $.validatePSP(pspType);
        if ($.provider[pspType].loading) {
            throw new Error("Already loading");
        }
        return new Promise((cb, reject) => {
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
    }
    /**
     * Invoke the registerCard with some info like the following.
     */
    createTemporaryCardToken(payload, pspType) {
        const $ = this;
        pspType = $.validatePSP(pspType);
        return new Promise((resolve, reject) => {
            $.initPSP(pspType).then((psp) => {
                $.log("Creating ccTempToken with payload " + JSON.stringify(payload || {}));
                psp.card.createToken(payload, (e) => {
                    resolve(e);
                });
            }).catch((err) => {
                console.error('Error ', err);
                reject(err);
            });
        });
    }
    clearFrame() {
        /* TODO: add the code to ensure we can open hosted payment page again and again...
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
        */
    }
    // construct new SafeCharge iFrame
    createiFrame() {
        /*const iframe = document.createElement('iframe');
        sciFrame.src = `${this.providerPaymentUrl}`;
        sciFrame.id = 'iframe';
        sciFrame.width = "100%";
        sciFrame.scrolling = "no";
        sciFrame.style = "border:none;";*/
    }
    openPaymentUrl(urlData, pspType, container) {
        const $ = this;
        pspType = $.validatePSP(pspType);
        UrlData.validate(urlData);
        $.containerIsOverlay = false;
        if (!container) {
            container = $.createOverlay();
            $.containerIsOverlay = true;
            $.showOverlay();
        }
        return new Promise((cb, reject) => {
            let frame;
            if (urlData.is3DS) {
                const callbackUrl = urlData.callbackUrl || $.callbackUrl3DS;
                frame = $.create3DSFrame(urlData.url, urlData.PaReq, callbackUrl, cb);
            }
            else {
                const callbackUrl = urlData.callbackUrl || $.callbackUrlPayment;
                frame = $.createPaymentFrame(urlData.url, cb);
            }
            container.appendChild(frame);
        });
    }
    setOptions(opts) {
        this.options = opts;
    }
    log(text) {
        if (this.options.verbose) {
            console.log('Coinify:', text);
        }
    }
    registerCard(options) {
        const $ = this;
        const cardData = options.card;
        if (!cardData) {
            throw new Error('No card data');
        }
        const saveCard = !!options.saveCard;
        CardData.validate(cardData);
        $.log('Registering card; saving card: ' + (saveCard ? 'persistent' : 'temporary') + '; retrieving store card payload');
        return new Promise((resolve, reject) => {
            Coinify.http.get(this.uri(Coinify.urls.storeCardPayload)).then((storeCardsPayloadResponse) => {
                const payload = storeCardsPayloadResponse.payload;
                const psp = storeCardsPayloadResponse.psp;
                payload.cardData = cardData;
                $.log('Registering card; Requesting ccTempToken');
                $.createTemporaryCardToken(payload, psp).then((tokenResponse) => {
                    $.log('Registering card; Retrieved ccTempToken ' + tokenResponse.ccTempToken);
                    const status = (tokenResponse || {}).status;
                    if (status === "SUCCESS") {
                        if (saveCard) {
                            $.log('Registering card; saving cTempToken as userPaymentOption');
                            $.saveCardByTempToken(tokenResponse.ccTempToken, payload.sessionToken).then((saveCardResponse) => {
                                $.log('Saved card: ' + status);
                                resolve(saveCardResponse);
                            }).catch(reject);
                        }
                        else {
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
    }
    open3DSecureUrlForTrade(createTradeResponseTransferInDetails, container = null) {
        const $ = this;
        const details = createTradeResponseTransferInDetails;
        const provider = $.validatePSP(details.psp || details.provider);
        if (!details.acsUrl) {
            throw new Error('TransferIn details did not contain an acsUrl');
        }
        if (!details.paRequest) {
            throw new Error('TransferIn details did not contain a paRequest');
        }
        const finalizeTradeArgs = {
            PaRes: '',
            sessionToken: details.sessionToken,
            userTokenId: details.userTokenId,
            clientRequestId: details.clientRequestId,
            upoId: details.userPaymentOptionId || details.externalTokenId,
            clientUniqueId: details.clientUniqueId,
            orderId: details.orderId
        };
        Object.keys(finalizeTradeArgs).forEach(x => {
            if (finalizeTradeArgs[x] === undefined) {
                throw new Error('Missing argument ' + x);
            }
        });
        return new Promise((resolve, reject) => {
            // TODO: Impl support to accept non-3ds cards as well.
            const urlData = {
                url: details.acsUrl,
                PaReq: details.paRequest,
                is3DS: true,
                // set callback url // Fallback on the local url if a url is not given in the details.;
                callbackUrl: details.threeDSecureCallback || Coinify.urls.threeDSecureCallback
            };
            $.log('Opening payment url');
            $.openPaymentUrl(urlData, 'safecharge', container).then((PaRes) => {
                if (!PaRes) {
                    console.error("Failed to retrieve 3DS response.");
                    reject({ error: 'failed to auth3d', error_code: -5435 });
                }
                else {
                    finalizeTradeArgs.PaRes = PaRes.toString();
                    $.finalizePayment(finalizeTradeArgs).then((finalizePaymentResponse) => {
                        $.log("Payment Result: " + finalizePaymentResponse.status + " : " + finalizePaymentResponse.reason);
                        resolve(finalizePaymentResponse);
                    });
                }
            });
        });
    }
    finalizePayment(atbs) {
        if (!atbs.PaRes) {
            throw new Error("Invalid argument; PARes");
        }
        return new Promise((resolve, reject) => {
            this.log('Finalizing trade.');
            Coinify.http.post(this.uri('/cards/finalizePayment'), atbs).then((response) => {
                this.log('Finalized payment for trade.');
                resolve(response);
            }).catch(reject);
        });
    }
    saveCardByTempToken(ccTempToken, sessionToken) {
        if (!ccTempToken) {
            throw new Error('invalid ccTempToken');
        }
        if (!sessionToken) {
            throw new Error('invalid sessionToken');
        }
        this.log('Saving card by temp token');
        return Coinify.http.post(this.uri('/cards'), {
            ccTempToken: ccTempToken,
            sessionToken: sessionToken
        });
    }
    getCardList() {
        return new Promise((resolve, reject) => {
            Coinify.http.get(this.uri('cards')).then((cardList) => {
                resolve(cardList);
            }).catch(reject);
        });
    }
}
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
    storeCardPayload: '/cards/storeCardPayload',
    threeDSecureCallback: 'https://immense-hamlet-63274.herokuapp.com/?pares',
    hostedPaymentPageCallback: 'www.google.com'
};
Coinify.http = new CoinifyHttp();
function getCoinifyInstance() {
    let i = window.coinifyInstance;
    if (!i) {
        window.coinifyInstance = i = new Coinify();
    }
    return i;
}
function registerCard(options) {
    return getCoinifyInstance().registerCard(options);
}
function handleTradePaymentInfo(createTradeResponseTransferInDetails, container = null) {
    const details = createTradeResponseTransferInDetails;
    const coinify = getCoinifyInstance();
    console.log("handle trade payment info ", details);
    if (details.acsUrl || details.paRequest) {
        return coinify.open3DSecureUrlForTrade(details, container);
    }
    return coinify.openPaymentUrl({
        url: details.redirectUrl,
        is3DS: false,
        callbackUrl: details.returnUrl || Coinify.urls.hostedPaymentPageCallback,
        PaReq: undefined
    }, details.provider, container);
}
function applyCardToTradeTransferInDetails(tradeInfo, atbs) {
    return Coinify.applyCardToTradeTransferInDetails(tradeInfo, atbs);
}
function openHostedPaymentPage(url, provider = 'safecharge', container = undefined) {
    const args = { url: url, is3DS: false, callbackUrl: Coinify.urls.hostedPaymentPageCallback, PaReq: undefined };
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
//# sourceMappingURL=index.js.map