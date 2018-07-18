jest.mock('../environment.ts', function () { return ({
    IS_DEV: true,
    IS_PROD: false,
}); });
import { Coinify } from '../Coinify';
describe("Coinify", function () {
    var coinify;
    beforeEach(function () {
        coinify = new Coinify();
    });
    it("should apply saved card to trade info", function () {
        var savedCard = {
            cardId: '1234'
        };
        var tradeInfo = {
            transferIn: {
                medium: 'card',
                details: undefined
            }
        };
        var actual = Coinify.applyCardToTradeTransferInDetails(tradeInfo, { cardId: savedCard.cardId, provider: 'safecharge' });
        var expected = 'Hello, World!';
        expect(tradeInfo.transferIn.details).not.toBe(undefined);
    });
    /*it(`should greet and print deprecation message if in dev mode`, () => {
      const spyWarn = jest.spyOn(console, 'warn')
      const actual = greeter.greetMe()
      const expected = 'Hello, World!'
  
      expect(actual).toBe(expected)
      expect(spyWarn).toHaveBeenCalledWith(
        'this method is deprecated, use #greet instead'
      )
    })*/
});
//# sourceMappingURL=Coinify.spec.js.map