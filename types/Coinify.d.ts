export declare class CardData {
    static validate(card: CardData): void;
    cardNumber: string;
    cardHolderName: string;
    expirationMonth: string;
    expirationYear: string;
    CVV: number;
}
export declare class UrlData {
    static validate(urlData: UrlData): void;
    is3DS: boolean;
    url: string;
    callbackUrl: string;
    paRequest: string;
}
export declare class CoinifyHttp {
    get(url: string, accessToken?: any): Promise<{}>;
    post(url: string, values?: any, accessToken?: string): Promise<{}>;
}
export declare class Coinify {
    static Register: {
        Permanently: number;
        ForTemporaryUse: number;
    };
    static PSPType: {
        safecharge: string;
        isignthis: string;
    };
    static urls: {
        threeDSecureCallback: string;
        hostedPaymentPageCallback: string;
        storeCardPayload: string;
        finalizePayment: string;
        cards: string;
    };
    static http: CoinifyHttp;
    /**
     * Used to apply the card on a tradeInfo object.
     * It does so by adding it to the details.
     */
    static applyCardToTradeTransferInDetails(tradeInfo: any, atbs: any): any;
    provider: {
        'safecharge': {
            loaded: boolean;
            loading: boolean;
        };
        'isignthis': {
            loaded: boolean;
            loading: boolean;
        };
    };
    overlay: any;
    loadingOverlay: any;
    container3ds: any;
    callbackUrl3DS: string;
    callbackUrlPayment: string;
    coinifyApiBaseUrl: string;
    container3dsForm: any;
    container3dsi1: any;
    container3dsi2: any;
    container3dsFrame: any;
    istBaseUrl: string;
    containerPay: any;
    private options;
    iSignThis: any;
    containerIsOverlay: boolean;
    cssLoaded: boolean;
    private uri;
    private createOverlay;
    private ensureCSSLoaded;
    private createLoadingOverlay;
    private create3DSFrame;
    private createPaymentFrame;
    private showOverlay;
    private showLoadingOverlay;
    private readonly Safecharge;
    private initSafecharge;
    private init_iSignThis;
    private isProviderLoaded;
    private getScriptForProvider;
    private validatePSP;
    private initPSP;
    /**
     * Invoke the registerCard with some info like the following.
     */
    private createTemporaryCardToken;
    private openPaymentUrl;
    setOptions(opts: any): void;
    private log;
    registerCard(options: {
        card: CardData;
        saveCard: boolean;
    }): Promise<any>;
    open3DSecureUrlForTrade(createTradeResponseTransferInDetails: any, container?: any): Promise<any>;
    private finalizePayment;
    private saveCardByTempToken;
    private getCardList;
}
export declare function getCoinifyInstance(): any;
export declare function registerCard(options: any): any;
export declare function handleTradePaymentInfo(createTradeResponseTransferInDetails: any, container?: any): any;
export declare function applyCardToTradeTransferInDetails(tradeInfo: any, atbs: any): any;
export declare function openHostedPaymentPage(url: string, provider?: string, container?: any): any;
export declare function getCardList(): any;
export declare function setOptions(opts: any): any;
//# sourceMappingURL=Coinify.d.ts.map