import { IS_DEV } from './environment';

console.log("*** Coinify PSP Library ***");

export class CardData {
  public cardNumber: string = '';
  public cardHolder: string = '';
  public expireMonth: string = '';
  public expireYear: string = '';
  public CVV: number = 0;
}

export class UrlData {
  public is3DS = false;
  public url = '';
  public callbackUrl = '';
  public PaReq = '';
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

  public static getRequest( url: string ) {
    return new Promise( (callback, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      //xhr.withCredentials = true;
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      //xhr.setRequestHeader("Access-Control-Allow-Headers","Access-Control-Allow-Headers,Origin,Content-Type,Accept");
      //xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onreadystatechange = () => {
        console.log( "on ready state changed ", xhr.readyState );
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

  public static postRequest( url: string, values: any = {} ) {
    return new Promise( (callback, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', url);
      //xhr.withCredentials = true;
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onreadystatechange = () => {
        console.log( "on ready state changed ", xhr.readyState );
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

  public static applyCardToTradeTransferInDetails( tradeInfo: any, payload: any, pspType: string, cardData: any ): any {
    if ( pspType !== Coinify.PSPType.safecharge ) {
      throw new Error( 'Invalid psp: ' + pspType );
    }
    if ( !tradeInfo || !tradeInfo.transferIn ) {
      throw new Error( 'Invalid transfer in method.' );
    }
    // payload = Object.assign( {}, payload || {} );
    tradeInfo.transferIn.details = cardData;
    return tradeInfo;
  }
  
  loaded = false;
  loading = false;
  overlay: any = undefined;
  loadingOverlay: any = undefined;
  container3ds: any = undefined;

  callbackUrl3DS = "localhost:6564";
  callbackUrlPayment = "localhost:1234";

  container3dsForm: any = undefined;
  container3dsi1: any = undefined;
  container3dsi2: any = undefined;
  container3dsFrame: any = undefined;

  containerPay: any = undefined;

  containerIsOverlay = false;

  private uri( path: string ): string {
    if ( path[0] != '/' ) {
      path = '/' + path;
    }
    return 'http://localhost:8087' + path;
  }

  private createOverlay() {
    if ( this.overlay ) {
      return this.overlay;
    }
    console.log( "Creating overlay" );
    const o = this.overlay = document.createElement( 'div' );
    o.className = "c-overlay c-is-hidden";
    o.id = "c-overlay";
    const body = document.getElementsByTagName('body')[0];

    body.appendChild( o );
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
    if ( (style as any).styleSheet ) {
      (style as any).styleSheet.cssText = css;
    } else {
      style.appendChild( document.createTextNode(css) );
    }
    const head = document.head || document.getElementsByTagName('head')[0];
    (head || body).appendChild(style);
    return o;
  }

  private createLoadingOverlay () {
    if ( this.loadingOverlay ) {
      return this.loadingOverlay;
    }
    console.log( "Creating overlay" );
    const o = this.loadingOverlay = document.createElement( 'div' );
    o.className = "c-working-overlay c-is-hidden";
    o.id = "c-working-overlay";
    const body = document.getElementsByTagName('body')[0];

    body.appendChild( o );
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
    if ( (style as any).styleSheet ) {
      (style as any).styleSheet.cssText = css;
    } else {
      style.appendChild( document.createTextNode(css) );
    }
    const head = document.head || document.getElementsByTagName('head')[0];
    (head || body).appendChild(style);
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

      i1.setAttribute("type", "hidden");
      i1.setAttribute("name", "PaReq");
      i2.setAttribute("type", "hidden");
      i2.setAttribute("name", "TermUrl");

      form.appendChild( i1 );
      form.appendChild( i2 );
      o.appendChild( form );
      o.appendChild( _iframe );
      body.appendChild( o );
    }
    this.container3dsForm.setAttribute("action", url);
    this.container3dsi1.setAttribute("value", PARequest);
    this.container3dsi2.setAttribute("value", iframeCallbackUrl );
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
      // console.log( "msg ", msg );
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

    setTimeout( () => {
      this.container3dsForm.submit();
    } );

    return o;
  }

  private createPaymentFrame ( url: string, cb: Function ) {
    let o = this.containerPay;
  
    if ( !o ) {
      const body = document.getElementsByTagName('body')[0];
      o = this.containerPay = document.createElement( 'div' );
      o.className = "c-stretch";
      const _iframe = document.createElement( 'iframe' );
      _iframe.setAttribute("id", "redirect-pay");
      _iframe.setAttribute("name", "coinify-paymentframe");
      _iframe.className = "c-stretch";
      _iframe.src = url;
      o.appendChild( _iframe );
      body.appendChild( o );
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

  private initPSP ( pspType: string ) {
    if ( pspType !== Coinify.PSPType.safecharge ) {
      throw new Error( 'Invalid psp :' + pspType );
    }
    if ( this.loading ) {
      throw new Error( "Already loading" );
    }
    return new Promise( (cb, reject) => {
      if ( this.loaded ) {
        cb( this.Safecharge );
        return;
      }

      // Bootstrap SafeCharge and then execute the create token request,
      var self = this;
      self.loaded = false;
      self.loading = true;
      var _script = document.createElement( 'script' );
      _script.type = 'text/javascript';
      _script.src = 'https://cdn.safecharge.com/js/v1/safecharge.js';
      _script.onload = () => {
        self.loaded = !!this.Safecharge;
        self.loading = false;
        if ( !self.loaded ) { 
          throw new Error( 'Failed to load Safecharge library' );
        }
        cb( this.Safecharge );
      };
      const body = document.getElementsByTagName('body')[0];
      body.appendChild(_script);
    } );
  }

  /**
   * Invoke the registerCard with some info like the following.
   */
  private createTemporaryCardToken ( payload: any, pspType: string ) {
    if ( pspType !== Coinify.PSPType.safecharge ) {
      throw new Error( 'Invalid psp :' + pspType );
    }
    return new Promise( (cb, reject) => {
      console.log( "fetching safecharge SDK." );
      this.initPSP( pspType ).then( ( psp: any ) => {
        console.log( "creating token with payload ", payload );
        psp.card.createToken( payload, ( e: Event ) => {
          cb( e );
        } );
      } );
    });
  }

  private openPaymentUrl ( urlData: UrlData, pspType: string, container: any ) {
    if ( !pspType || pspType !== Coinify.PSPType.safecharge ) {
      throw new Error( 'Invalid psp: ' + pspType );
    }
    this.containerIsOverlay = false;
    if ( !container ) {
      container = this.createOverlay();
      this.containerIsOverlay = true;
      this.showOverlay();
    }
    return new Promise( (cb, reject) => {
      let frame;
      if ( urlData.is3DS ) {
        const callbackUrl = urlData.callbackUrl || this.callbackUrl3DS;
        frame = this.create3DSFrame( urlData.url, urlData.PaReq, callbackUrl, cb );
      } else {
        const callbackUrl = urlData.callbackUrl || this.callbackUrlPayment;
        frame = this.createPaymentFrame( urlData.url, cb );
      }
      container.appendChild(frame);
    });
  }

  public registerCard( options: any ) {
    const cardData = <CardData>options.card;
    const saveCard = !!options.saveCard;
    console.log( "REGISTER CARD!!! ", cardData );

    return new Promise<any>( ( resolve, reject ) => {
      Coinify.getRequest( this.uri('/cards/storeCardPayload') ).then( (storeCardsPayloadResponse: any) => {
        const payload = storeCardsPayloadResponse.payload;
        const psp = storeCardsPayloadResponse.psp as string;
        payload.cardData = cardData;
        this.createTemporaryCardToken( payload, psp ).then( (tokenResponse: any) => {
          console.log( "createTemporaryCardToken ", tokenResponse );
          if ( tokenResponse && tokenResponse.status === "SUCCESS" ) {
            // console.log( "response ", tokenResponse );
            this.saveCardByTempToken( tokenResponse.ccTempToken, payload.sessionToken ).then( ( saveCardResponse: any ) => {
              console.log( "saveCardResponse ", saveCardResponse );
              reject( "Failed " + saveCardResponse );
            } ).catch( reject );
          } else {
            console.error( "Failed ", tokenResponse );
            reject( "Failed " + tokenResponse );
          }
        } ).catch( reject );
      } ).catch( reject );
    } );
  }

  public handleTradePaymentInfo( trade: any, payload: any, pspType: string, cardData: CardData ): void {
    console.log( "HANDLE TRADE INFO !" );
  }

  private saveCardByTempToken( ccTempToken: string, sessionToken: string ) {
    return Coinify.postRequest( this.uri('/cards'), {} );
  }
}

export function getCoinifyInstance() {
  let i = (window as any).coinifyInstance;
  if ( !i ) {
    console.log( "created coinify instance " );
    (window as any).coinifyInstance = i = new Coinify();
  }
  return i;
}

export function registerCard( options: any ) {
  return getCoinifyInstance().registerCard( options );
}

export function handleTradePaymentInfo( trade: any ) {
  return getCoinifyInstance().handleTradePaymentInfo( trade );
}

export function applyCardToTradeTransferInDetails( trade: any, payload: any, pspType: string, cardData: CardData ) {
  return Coinify.applyCardToTradeTransferInDetails( trade, payload, pspType, cardData );
}
