export declare class CardData {
    cardNumber: string;
    cardHolder: string;
    expireMonth: string;
    expireYear: string;
    CVV: number;
}
export declare class UrlData {
    is3DS: boolean;
    url: string;
    callbackUrl: string;
    PaReq: string;
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
    static getRequest(url: string, error: Function): Promise<{}>;
    static applyCardToTradeTransferInDetails(tradeInfo: any, payload: any, pspType: string, cardData: any): any;
    loaded: boolean;
    loading: boolean;
    overlay: any;
    loadingOverlay: any;
    container3ds: any;
    callbackUrl3DS: string;
    callbackUrlPayment: string;
    container3dsForm: any;
    container3dsi1: any;
    container3dsi2: any;
    container3dsFrame: any;
    containerPay: any;
    containerIsOverlay: boolean;
    private createOverlay;
    private createLoadingOverlay;
    private create3DSFrame;
    private createPaymentFrame;
    private showOverlay;
    private showLoadingOverlay;
    private readonly Safecharge;
    private initPSP;
    /**
     * Invoke the registerCard with some info like the following.
     */
    private createTemporaryCardToken;
    private openPaymentUrl;
    registerCard(cardData: CardData): void;
    handleTradePaymentInfo(trade: any, payload: any, pspType: string, cardData: CardData): void;
}
export declare function registerCard(cardData: CardData): any;
export declare function handleTradePaymentInfo(trade: any): any;
export declare function applyCardToTradeTransferInDetails(trade: any, payload: any, pspType: string, cardData: CardData): any;
//# sourceMappingURL=Coinify.d.ts.map