jest.mock('../environment.ts', () => ({
    IS_DEV: true,
    IS_PROD: false,
}));
import { Greeter } from '../Greeter';
describe(`Greeter`, () => {
    let greeter;
    beforeEach(() => {
        greeter = new Greeter('World');
    });
    it(`should greet`, () => {
        const actual = greeter.greet();
        const expected = 'Hello, World!';
        expect(actual).toBe(expected);
    });
    it(`should greet and print deprecation message if in dev mode`, () => {
        const spyWarn = jest.spyOn(console, 'warn');
        const actual = greeter.greetMe();
        const expected = 'Hello, World!';
        expect(actual).toBe(expected);
        expect(spyWarn).toHaveBeenCalledWith('this method is deprecated, use #greet instead');
    });
});
//# sourceMappingURL=Greeter.spec.js.map