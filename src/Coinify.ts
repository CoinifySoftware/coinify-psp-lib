import { IS_DEV } from './environment';

console.log("*** Coinify PSP Library ***");

export class CardData {
  public static validate( card: CardData ) {
    if ( !card.cardNumber || !card.cardHolderName || !card.CVV || !card.expirationYear || !card.expirationMonth ) {
      throw new Error( 'Invalid card data' );
    } 
  }
  public cardNumber: string = '';
  public cardHolderName: string = '';
  public expirationMonth: string = '';
  public expirationYear: string = '';
  public CVV: number = 0;
}

export class UrlData {
  public static validate( urlData: UrlData ) {
    if ( urlData.is3DS === undefined || !urlData.url || !urlData.callbackUrl || (urlData.is3DS && !urlData.PaReq ) ) {
      throw new Error('Invalid url data');
    }
  }
  public is3DS = false;
  public url = '';
  public callbackUrl = '';
  public PaReq = '';
}

export class CoinifyHttp {
  public get( url: string, accessToken: any = '' ) {
    return new Promise( (callback, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      if ( accessToken && accessToken !== '' ) {
        //xhr.withCredentials = true;
        xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
      }
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onreadystatechange = () => {
        if ( xhr.readyState === 4 ) {
          if ( xhr.status === 200 || ( xhr.status === 0 && xhr.responseText !== '' ) ) {
            callback( JSON.parse( xhr.responseText || '{}' ) );
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
    } );
  }

  public post( url: string, values: any = {}, accessToken: string = '' ) {
    return new Promise( (callback, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', url);
      if ( accessToken && accessToken !== '' ) {
        //xhr.withCredentials = true;
        xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
      }
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onreadystatechange = () => { 
        // console.log( "on ready state changed ", xhr.readyState );
        if ( xhr.readyState === 4 ) {
          if ( xhr.status === 200 || ( xhr.status === 0 && xhr.responseText !== '' ) ) {
            callback( JSON.parse( xhr.responseText || '{}' ) );
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
      xhr.send( JSON.stringify(values) );
    } );
  }
}

export class Coinify {
  // Constants.
  public static Register = {
    Permanently: 1,
    ForTemporaryUse: 2
  };

  public static PSPType = {
    safecharge: 'safecharge',
    isignthis: 'isignthis'
  };

  public static urls = {
    threeDSecureCallback: 'https://immense-hamlet-63274.herokuapp.com/?pares',
    hostedPaymentPageCallback: 'www.google.com',
    storeCardPayload: '/cards/storeCardPayload',
    finalizePayment: '/cards/finalize-payment',
    cards: '/cards'
  };

  public static http = new CoinifyHttp();

  /**
   * Used to apply the card on a tradeInfo object.
   * It does so by adding it to the details.
   */
  public static applyCardToTradeTransferInDetails( tradeInfo: any, atbs: any ): any {
    const provider = atbs.psp || atbs.provider;
    if ( provider !== undefined && provider !== Coinify.PSPType.safecharge ) {
      throw new Error( 'Invalid psp: ' + provider );
    }
    if ( !tradeInfo || !tradeInfo.transferIn ) {
      throw new Error( 'Invalid transfer In in trade info.' );
    }

    const details = {
      card: {
      }
    };
    if ( atbs.cardExternalId ) {
      (details.card as any).cardExternalId = atbs.cardExternalId;

    } else if ( atbs.ccTempToken ) {
      (details.card as any).ccTempToken = atbs.ccTempToken;
      (details.card as any).returnUrl = atbs.returnUrl || 'https://app.sandbox.coinify.com/';

    } else {
      // TODO extend with token support.
      throw new Error('cardExternalId or ccTempToken was not present amoungst the attributes when applying card data' );
    }

    tradeInfo.transferIn.details = details;
    return tradeInfo;
  }
  
  provider = {
    'safecharge': {
      loaded: false,
      loading: false
    },
    'isignthis': {
      loaded: false,
      loading: false
    }
  };

  overlay: any = undefined;
  loadingOverlay: any = undefined;
  container3ds: any = undefined;

  callbackUrl3DS = "localhost:6564";
  callbackUrlPayment = "localhost:1234";
  coinifyApiBaseUrl = 'http://localhost:8087';

  container3dsForm: any = undefined;
  container3dsi1: any = undefined;
  container3dsi2: any = undefined;
  container3dsFrame: any = undefined;

  istBaseUrl = 'https://verify.isignthis.com';

  containerPay: any = undefined;

  private options: any = {
    verbose: false,
    accessToken: ''
  };

  iSignThis: any;

  containerIsOverlay = false;

  cssLoaded = false;

  private uri( path: string ): string {
    if ( path[0] != '/' ) {
      path = '/' + path;
    }
    return this.coinifyApiBaseUrl + path;
  }

  private createOverlay() {
    if ( this.overlay ) {
      return this.overlay;
    }
    this.log( "Creating overlay" );
    const o = this.overlay = document.createElement( 'div' );
    o.className = "c-overlay c-is-hidden";
    o.id = "c-overlay";
    const body = document.getElementsByTagName('body')[0];

    body.appendChild( o );
    this.ensureCSSLoaded();
    return o;
  }

  private ensureCSSLoaded() {
    if ( this.cssLoaded ) {
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
    if ( (style as any).styleSheet ) {
      (style as any).styleSheet.cssText = css;
    } else {
      style.appendChild( document.createTextNode(css) );
    }
    const body = document.getElementsByTagName('body')[0];
    const head = document.head || document.getElementsByTagName('head')[0];
    (head || body).appendChild(style);
    this.cssLoaded = false;
  }

  private createLoadingOverlay () {
    if ( this.loadingOverlay ) {
      return this.loadingOverlay;
    }
    this.log( "Creating loading overlay" );
    const o = this.loadingOverlay = document.createElement( 'div' );
    o.className = "c-working-overlay c-is-hidden";
    o.id = "c-working-overlay";
    const body = document.getElementsByTagName('body')[0];
    body.appendChild( o );
    this.ensureCSSLoaded();
    return o;
  }

  private create3DSFrame ( url: string, PARequest: string, iframeCallbackUrl: string, cb: any | Function ) {
    let o = this.container3ds;

    if ( !o ) {
      const body = document.getElementsByTagName('body')[0];
      o = this.container3ds = document.createElement( 'div' );
      o.style.backgroundColor = "white";
      const form = this.container3dsForm = document.createElement( 'form' );
      const i1 = this.container3dsi1 = document.createElement( 'input' );
      const i2 = this.container3dsi2 = document.createElement( 'input' );
      const _iframe = this.container3dsFrame = document.createElement( 'iframe' );

      o.className = "c-stretch";
      form.setAttribute("target", "coinify-3dsframe");
      form.setAttribute("id", "redirect-3ds");
      form.setAttribute("method", "post");

      _iframe.setAttribute("name", "coinify-3dsframe");
      _iframe.className = "c-stretch";
      _iframe.scrolling = "no";
      _iframe.setAttribute("style", "border: none;");

      i1.setAttribute("type", "hidden");
      i1.setAttribute("name", "PaReq");
      i2.setAttribute("type", "hidden");
      i2.setAttribute("name", "TermUrl");

      form.appendChild( i1 );
      form.appendChild( i2 );
      o.appendChild( form );
      o.appendChild( _iframe );
      body.appendChild( o );
      this.ensureCSSLoaded();
    }
    this.container3dsForm.setAttribute( "action", url );
    this.container3dsi1.setAttribute( "value", PARequest );
    this.container3dsi2.setAttribute( "value", iframeCallbackUrl );
    //console.log("submit paRequest:" + PARequest + " url:" + url );

    var callback = cb;
    let eventHandler: EventListenerOrEventListenerObject; // = undefined;
    eventHandler = ( event: any ) => {
      const data = event.data ? event.data.toString() : '';
      if ( data.indexOf( '[SC-Embed]' ) != 0 ) {
        return;
      }
      window.removeEventListener( 'message', eventHandler );
      const msg = JSON.parse( event.data.replace( '[SC-Embed]', '' ) );
      if ( msg.command == 'close' ) {
        if ( o.parentNode ) {
          o.parentNode.removeChild( o );
          if ( this.containerIsOverlay ) {
            this.showOverlay(false);
          }
        }
        if ( callback ) {
          callback( msg.param );
          callback = undefined;
        }
      }
    };
    window.addEventListener( 'message', eventHandler, true );

    // Wait a litle while to submit in order to ensure that the elements just created has been added to the DOM and
    // rendered.
    setTimeout( () => {
      this.container3dsForm.submit();
    } );

    return o;
  }

  private createPaymentFrame ( url: string, cb: Function ) {
    const $ = this;
    let o = $.containerPay;
  
    if ( !o ) {
      const body = document.getElementsByTagName('body')[0];
      o = $.containerPay = document.createElement( 'div' );
      o.className = "c-stretch";
      const _iframe = document.createElement( 'iframe' );
      _iframe.setAttribute("id", "redirect-pay");
      _iframe.setAttribute("name", "coinify-paymentframe");
      _iframe.className = "c-stretch c-iframe";
      _iframe.src = url;
      o.appendChild( _iframe );
      body.appendChild( o );
      this.ensureCSSLoaded();
    }

    let callback: any = cb;
    let eventHandler: EventListenerOrEventListenerObject;
    eventHandler = ( event: any ) => {
      //console.log("eventHandler ", event );
      const data = event.data ? event.data.toString() : '';
      if ( data.indexOf( '[SC-Embed]' ) != 0 ) {
        return;
      }
      window.removeEventListener( 'message', eventHandler );
      const msg = JSON.parse( data.replace( '[SC-Embed]', '' ) );
      // console.log( "msg ", msg );
      if ( msg.command == 'close' ) {
        if ( o.parentNode ) {
          o.parentNode.removeChild( o );
          if ( $.containerIsOverlay ) {
            $.showOverlay(false);
          }
        }
        if ( callback ) {
          callback( msg.param );
          callback = undefined;
        }
      }
    };
    window.addEventListener( 'message', eventHandler, true );

    return o;
  }

  private showOverlay ( value: boolean = true, container: any = null ) {
    const overlay = this.overlay;
    if ( value || value === undefined ) {
      overlay.classList.remove("c-is-hidden");
      if ( container ) {
        container.appendChild( overlay );
      }
    } else {
      overlay.classList.add("c-is-hidden");
    }
  }

  private showLoadingOverlay ( value: boolean = true ) {
    const overlay = this.createLoadingOverlay();
    if ( value || value === undefined ) {
      overlay.classList.remove("c-is-hidden");
    } else {
      overlay.classList.add("c-is-hidden");
    }
  }

  private get Safecharge() {
    return (window as any).Safecharge;
  }

  private initSafecharge( cb: Function ): void {
    const $ = this;
    $.log( "Loading safecharge SDK" );
    var _script = document.createElement( 'script' );
    _script.type = 'text/javascript';
    _script.src = 'https://cdn.safecharge.com/js/v1/safecharge.js';
    _script.onload = () => {
      $.provider[Coinify.PSPType.safecharge].loaded = !!this.Safecharge; // Important: this is the script referance in this context.
      $.provider[Coinify.PSPType.safecharge].loading = false;
      if ( !$.provider[Coinify.PSPType.safecharge].loaded ) { 
        throw new Error( 'Failed to load Safecharge library' );
      }
      cb( $.Safecharge );
    };
    const body = document.getElementsByTagName('body')[0];
    body.appendChild(_script);
  }

  private init_iSignThis( cb: Function ): void {
    const $ = this;
    $.log( 'Initializing iSignThis' );
    const _script = document.createElement('script');
    _script.src = $.istBaseUrl + '/js/isx-embed.js';
    _script.async = true;
    _script.onload = (() => {
      $.iSignThis = _script;
      $.provider[Coinify.PSPType.isignthis].loaded = !!this.Safecharge; // Important: this is the script referance in this context.
      $.provider[Coinify.PSPType.isignthis].loading = false;
      cb( _script );
    });
  }

  private isProviderLoaded( pspType: string ): boolean {
    const $ = this;
    pspType = $.validatePSP(pspType);
    if ( pspType === Coinify.PSPType.isignthis ) {
      return !!$.iSignThis;
    }
    return !!$.Safecharge;
  }

  private getScriptForProvider( pspType: string ) {
    const $ = this;
    pspType = $.validatePSP(pspType);
    if ( pspType === Coinify.PSPType.isignthis ) {
      return $.iSignThis;
    }
    return $.Safecharge;
  }

  private validatePSP( pspType: string, fallbackOnSC = true ) {
    if ( !pspType && fallbackOnSC ) {
      console.error( 'Payment service provider not defined, falling back on safecharge' );
      return Coinify.PSPType.safecharge;
    }
    if ( pspType !== Coinify.PSPType.safecharge &&
         pspType !== Coinify.PSPType.isignthis )
    {
      throw new Error( 'Invalid psp :' + pspType );
    }
    return pspType;
  }

  private initPSP ( pspType: string ) {
    const $ = this;
    pspType = $.validatePSP( pspType );
    if ( $.provider[pspType].loading ) {
      throw new Error( "Already loading" );
    }
    return new Promise( (cb, reject) => {
      if ( $.provider[pspType].loaded ) {
        cb( $.getScriptForProvider(pspType) );
        return;
      }
      // Bootstrap SafeCharge and then execute the create token request,
      $.provider[pspType].loaded = false;
      $.provider[pspType].loading = true;
      if ( pspType === Coinify.PSPType.isignthis ) {
        $.init_iSignThis( cb );
      } else if ( pspType === Coinify.PSPType.safecharge ) {
        $.initSafecharge( cb );
      }
    } );
  }

  /**
   * Invoke the registerCard with some info like the following.
   */
  private createTemporaryCardToken ( payload: any, pspType: string ) {
    const $ = this;
    pspType = $.validatePSP( pspType );
    return new Promise( (resolve, reject) => {
      $.initPSP( pspType ).then( ( psp: any ) => {
        // Test:
        //payload.merchantSiteId = '1811';
        //payload.environment = 'sandbox';
        $.log( "Creating ccTempToken with payload " + JSON.stringify( payload || {} ) );
        psp.card.createToken( payload, ( e: Event ) => {
          resolve( e );
        } );
      } ).catch( (err) => {
        console.error( 'Error ', err );
        reject( err );
      } );
    } );
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

  private openPaymentUrl ( urlData: UrlData, pspType: string, container: any ) {
    const $ = this;
    pspType = $.validatePSP( pspType );
    UrlData.validate( urlData );
    $.containerIsOverlay = false;
    if ( !container ) {
      container = $.createOverlay();
      $.containerIsOverlay = true;
      $.showOverlay();
    }
    return new Promise( (cb, reject) => {
      let frame;
      if ( urlData.is3DS ) {
        const callbackUrl = urlData.callbackUrl || $.callbackUrl3DS;
        frame = $.create3DSFrame( urlData.url, urlData.PaReq, callbackUrl, cb );
      } else {
        const callbackUrl = urlData.callbackUrl || $.callbackUrlPayment;
        frame = $.createPaymentFrame( urlData.url, cb );
      }
      container.appendChild(frame);
    });
  }

  public setOptions( opts: any ) {
    const $ = this;
    $.log("Setting option(s) " + ( opts ? JSON.stringify(opts) : 'undefined') );
    if ( !$.options ) {
      $.options = opts;
    } else if ( opts ) {
      for( let key in opts ) {
        $.options[key] = opts[key];
      }
    }
    if ( !this.options ) {
      $.log("Failed to set options.");
      return;
    }
    if ( $.options.coinifyApiBaseUrl ) {
      $.log("Setting Coinity API base url : " + $.options.coinifyApiBaseUrl );
      $.coinifyApiBaseUrl = $.options.coinifyApiBaseUrl;
    }
    if ( $.options.default3DSCallback ) {
      $.log("Setting Default 3DS callback url : " + $.options.default3DSCallback );
      $.callbackUrl3DS = $.options.default3DSCallback;
    }
    if ( $.options.defaultHostedPaymentCallback ) {
      $.log("Setting trade service url : " + $.options.defaultHostedPaymentCallback );
      $.callbackUrlPayment = $.options.defaultHostedPaymentCallback;
    }
  }

  private log( text: string ) {
    if ( this.options.verbose ) {
      console.log( 'Coinify:', text );
    }
  } 

  public registerCard( options: { card: CardData, saveCard: boolean } ) {
    const $ = this;
    const cardData = <CardData>options.card;
    if ( !cardData ) {
      throw new Error( 'No card data' );
    }
    const saveCard = !!options.saveCard;
    CardData.validate( cardData );
    $.log('Registering card; saving card: ' + ( saveCard ? 'persistent' : 'temporary') +  '; retrieving store card payload' );
    return new Promise<any>( ( resolve, reject ) => {
      Coinify.http.get( this.uri( Coinify.urls.storeCardPayload ), this.options.accessToken ).then( (storeCardsPayloadResponse: any) => {
        const payload = Object.assign( {}, storeCardsPayloadResponse.payload );
        payload.sessionToken = payload.sessionToken || storeCardsPayloadResponse.sessionToken;
        const provider = (storeCardsPayloadResponse.psp || storeCardsPayloadResponse.provider) as string;
        payload.cardData = cardData;
        $.log('Registering card; Requesting ccTempToken' );
        $.createTemporaryCardToken( payload, provider ).then( ( tokenResponse: any ) => {
          $.log( 'Registering card; Retrieved ccTempToken ' + tokenResponse.ccTempToken );
          const status = (tokenResponse||{}).status;
          if ( status === "SUCCESS" ) {
            if ( saveCard ) {
              $.log('Registering card; saving cTempToken as userPaymentOption' );
              $.saveCardByTempToken( tokenResponse.ccTempToken, payload.sessionToken ).then( ( saveCardResponse: any ) => {
                $.log( 'Saved card: ' + status );
                resolve( saveCardResponse );
              } ).catch( reject );
            } else {
              resolve( tokenResponse );
            }
          } else {
            console.error( "Failed ", tokenResponse );
            reject( "Failed " + status );
          }
        } ).catch( reject );
      } ).catch( reject );
    } );
  }

  public open3DSecureUrlForTrade( createTradeResponseTransferInDetails: any, container: any = null ): Promise<any> {
    const $ = this;
    const details = createTradeResponseTransferInDetails;
    const provider = $.validatePSP( details.psp || details.provider );

    if ( !details.acsUrl ) {
      throw new Error( 'TransferIn details did not contain an acsUrl' );
    }

    if ( !details.paRequest ) {
      throw new Error( 'TransferIn details did not contain a paRequest' );
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
    Object.keys(finalizeTradeArgs).forEach( x => {
      if ( finalizeTradeArgs[x] === undefined ) {
        throw new Error( 'Missing argument ' + x );
      }
    } );

    return new Promise<any>( (resolve, reject) => {
      // TODO: Impl support to accept non-3ds cards as well.
      const urlData = {
        url: details.acsUrl,
        PaReq: details.paRequest,
        is3DS: true,
        // set callback url // Fallback on the local url if a url is not given in the details.;
        callbackUrl: details.threeDSecureCallback || Coinify.urls.threeDSecureCallback
      };

      $.log( 'Opening payment url' );
      $.openPaymentUrl( urlData, 'safecharge', container ).then( (PaRes: any) => {
        if ( !PaRes ) {
          console.error( "Failed to retrieve 3DS response." );
          reject( { error: 'failed to auth3d', error_code: -5435 } );
        } else {
          finalizeTradeArgs.PaRes = PaRes.toString();
          $.finalizePayment( finalizeTradeArgs ).then( (finalizePaymentResponse: any) => {
            $.log( "Payment Result: " + finalizePaymentResponse.status + " : " + finalizePaymentResponse.reason );
            resolve( finalizePaymentResponse );
          } );
        }
      } );
    } );
  }

  private finalizePayment( atbs: {
      PaRes: string,
      sessionToken: string,
      userTokenId: string,
      clientRequestId: string,
      upoId: string,
      clientUniqueId: string,
      orderId: string
    } ) {
    if ( !atbs.PaRes ) {
      throw new Error( "Invalid argument; PARes" );
    }
    return new Promise( ( resolve, reject ) => {
      this.log('Finalizing trade.');
      Coinify.http.post( this.uri( Coinify.urls.finalizePayment ), atbs, this.options.accessToken ).then( (response: any) => {
        this.log( 'Finalized payment for trade.' );
        resolve( response );
      } ).catch( reject );
    } );
  }

  private saveCardByTempToken( ccTempToken: string, sessionToken: string ) {
    if ( !ccTempToken ) {
      throw new Error( 'invalid ccTempToken' );
    }
    if ( !sessionToken ) {
      throw new Error( 'invalid sessionToken' );
    }
    this.log( 'Saving card by temp token' );
    return Coinify.http.post( this.uri( Coinify.urls.cards ), {
      ccTempToken: ccTempToken,
      sessionToken: sessionToken
    }, this.options.accessToken );
  }

  private getCardList() {
    return new Promise<any>( (resolve, reject) => {
      Coinify.http.get( this.uri( Coinify.urls.cards ), this.options.accessToken ).then( ( cardList: any ) => {
        resolve( cardList );
      } ).catch( reject );
    } );
  }
}

export function getCoinifyInstance() {
  let i = (window as any).coinifyInstance;
  if ( !i ) {
    (window as any).coinifyInstance = i = new Coinify();
  }
  return i;
}

export function registerCard( options: any ) {
  return getCoinifyInstance().registerCard( options );
}

export function handleTradePaymentInfo( createTradeResponseTransferInDetails: any, container: any = null ) {
  const details = createTradeResponseTransferInDetails;
  const coinify = getCoinifyInstance();
  coinify.log( "Handle trade payment info ", details );

  if ( details.acsUrl || details.paRequest ) {
    return coinify.open3DSecureUrlForTrade( details, container );
  }

  return coinify.openPaymentUrl( {
    url: details.redirectUrl,
    is3DS: false,
    callbackUrl: details.returnUrl || Coinify.urls.hostedPaymentPageCallback,
    PaReq: undefined
  }, details.provider, container );
}

export function applyCardToTradeTransferInDetails( tradeInfo: any, atbs: any ) {
  return Coinify.applyCardToTradeTransferInDetails( tradeInfo, atbs );
}

export function openHostedPaymentPage( url: string, provider = 'safecharge', container: any = undefined ) {
  const args = { url: url, is3DS: false, callbackUrl: Coinify.urls.hostedPaymentPageCallback, PaReq: undefined };
  return getCoinifyInstance().openPaymentUrl( args, provider, container );
}

export function getCardList() {
  return getCoinifyInstance().getCardList();
}

export function setOptions( opts: any ) {
  return getCoinifyInstance().setOptions( opts );
}
