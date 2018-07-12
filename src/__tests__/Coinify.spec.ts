jest.mock('../environment.ts', () => ({
  IS_DEV: true,
  IS_PROD: false,
}))

import { Coinify } from '../Coinify';

describe(`Coinify`, () => {
  let coinify: Coinify;

  beforeEach(() => {
    coinify = new Coinify()
  })

  it(`should apply saved card to trade info`, () => {
    const savedCard = {
      cardId: '1234'
    };
    const tradeInfo = {
      transferIn: {
        medium: 'card',
        details: undefined
      }
    };
    const actual = Coinify.applyCardToTradeTransferInDetails( tradeInfo, {}, 'safecharge', savedCard );
    const expected = 'Hello, World!'
    expect(tradeInfo.transferIn.details).not.toBe(undefined);
  })

  /*it(`should greet and print deprecation message if in dev mode`, () => {
    const spyWarn = jest.spyOn(console, 'warn')
    const actual = greeter.greetMe()
    const expected = 'Hello, World!'

    expect(actual).toBe(expected)
    expect(spyWarn).toHaveBeenCalledWith(
      'this method is deprecated, use #greet instead'
    )
  })*/
})
