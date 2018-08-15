console.log("*** Coinify PSP Library ***");
export class CardData {
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
export class UrlData {
    constructor() {
        this.is3DS = false;
        this.url = '';
        this.callbackUrl = '';
        this.paRequest = '';
    }
    static validate(urlData) {
        if (urlData.is3DS === undefined || !urlData.url || !urlData.callbackUrl || (urlData.is3DS && !urlData.paRequest)) {
            throw new Error('Invalid url data');
        }
    }
}
export class CoinifyHttp {
    get(url, accessToken = '') {
        return new Promise((callback, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url);
            if (accessToken && accessToken !== '') {
                //xhr.withCredentials = true;
                xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
            }
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
    post(url, values = {}, accessToken = '') {
        return new Promise((callback, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', url);
            if (accessToken && accessToken !== '') {
                //xhr.withCredentials = true;
                xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
            }
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
export class Coinify {
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
    }
    uri(path) {
        if (path[0] != '/') {
            path = '/' + path;
        }
        return this.coinifyApiBaseUrl + path;
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
        this.ensureCSSLoaded();
        return o;
    }
    ensureCSSLoaded() {
        if (this.cssLoaded) {
            return;
        }
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
      .c-working-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.6);
        z-index: 15000000;
      }
      .c-iframe {
        min-height: 450px;
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
        const body = document.getElementsByTagName('body')[0];
        const head = document.head || document.getElementsByTagName('head')[0];
        (head || body).appendChild(style);
        this.cssLoaded = false;
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
        this.ensureCSSLoaded();
        return o;
    }
    create3DSFrame(url, paRequest, iframeCallbackUrl, cb) {
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
        // Wait a litle while to submit in order to ensure that the elements just created has been added to the DOM and
        // rendered.
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
            _iframe.className = "c-stretch c-iframe";
            _iframe.src = url;
            o.appendChild(_iframe);
            body.appendChild(o);
            this.ensureCSSLoaded();
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
                // Test:
                //payload.merchantSiteId = '1811';
                //payload.environment = 'sandbox';
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
                frame = $.create3DSFrame(urlData.url, urlData.paRequest, callbackUrl, cb);
            }
            else {
                const callbackUrl = urlData.callbackUrl || $.callbackUrlPayment;
                frame = $.createPaymentFrame(urlData.url, cb);
            }
            container.appendChild(frame);
        });
    }
    setOptions(opts) {
        const $ = this;
        $.log("Setting option(s) " + (opts ? JSON.stringify(opts) : 'undefined'));
        if (!$.options) {
            $.options = opts;
        }
        else if (opts) {
            for (let key in opts) {
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
            Coinify.http.get(this.uri(Coinify.urls.storeCardPayload), this.options.accessToken).then((storeCardsPayloadResponse) => {
                const payload = Object.assign({}, storeCardsPayloadResponse.payload);
                payload.sessionToken = payload.sessionToken || storeCardsPayloadResponse.sessionToken;
                const provider = (storeCardsPayloadResponse.psp || storeCardsPayloadResponse.provider);
                payload.cardData = cardData;
                $.log('Registering card; Requesting ccTempToken');
                $.createTemporaryCardToken(payload, provider).then((tokenResponse) => {
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
            paResponse: '',
            tradeId: details.tradeId,
            CVV: details.CVV
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
                paRequest: details.paRequest,
                is3DS: true,
                // set callback url // Fallback on the local url if a url is not given in the details.;
                callbackUrl: details.threeDSecureCallback || Coinify.urls.threeDSecureCallback
            };
            $.log('Opening payment url');
            $.openPaymentUrl(urlData, 'safecharge', container).then((paResponse) => {
                if (!paResponse) {
                    console.error("Failed to retrieve 3DS response.");
                    reject({ error: 'failed to auth3d', error_code: -5435 });
                }
                else {
                    finalizeTradeArgs.paResponse = paResponse.toString();
                    $.finalizePayment(finalizeTradeArgs).then((finalizePaymentResponse) => {
                        $.log("Payment Result: " + finalizePaymentResponse.status + " : " + finalizePaymentResponse.reason);
                        resolve(finalizePaymentResponse);
                    });
                }
            });
        });
    }
    finalizePayment(atbs) {
        if (!atbs.paResponse) {
            throw new Error("Invalid argument; paResponse is not defined");
        }
        return new Promise((resolve, reject) => {
            this.log('Finalizing trade.');
            Coinify.http.post(this.uri(Coinify.urls.finalizePayment), atbs, this.options.accessToken).then((response) => {
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
        return Coinify.http.post(this.uri(Coinify.urls.cards), {
            ccTempToken: ccTempToken,
            sessionToken: sessionToken
        }, this.options.accessToken);
    }
    getCardList() {
        return new Promise((resolve, reject) => {
            Coinify.http.get(this.uri(Coinify.urls.cards), this.options.accessToken).then((cardList) => {
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
    threeDSecureCallback: 'https://immense-hamlet-63274.herokuapp.com/?pares',
    hostedPaymentPageCallback: 'www.google.com',
    storeCardPayload: '/cards/store-card-payload',
    finalizePayment: '/cards/finalize-payment',
    cards: '/cards'
};
Coinify.http = new CoinifyHttp();
export function getCoinifyInstance() {
    let i = window.coinifyInstance;
    if (!i) {
        window.coinifyInstance = i = new Coinify();
    }
    return i;
}
export function registerCard(options) {
    return getCoinifyInstance().registerCard(options);
}
export function handleTradePaymentInfo(createTradeResponseTransferInDetails, container = null) {
    const details = createTradeResponseTransferInDetails;
    const coinify = getCoinifyInstance();
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
export function applyCardToTradeTransferInDetails(tradeInfo, atbs) {
    return Coinify.applyCardToTradeTransferInDetails(tradeInfo, atbs);
}
export function openHostedPaymentPage(url, provider = 'safecharge', container = undefined) {
    const args = { url: url, is3DS: false, callbackUrl: Coinify.urls.hostedPaymentPageCallback, paRequest: undefined };
    return getCoinifyInstance().openPaymentUrl(args, provider, container);
}
export function getCardList() {
    return getCoinifyInstance().getCardList();
}
export function setOptions(opts) {
    return getCoinifyInstance().setOptions(opts);
}
//# sourceMappingURL=Coinify.js.map