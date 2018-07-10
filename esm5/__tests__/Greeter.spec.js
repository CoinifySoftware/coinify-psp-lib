jest.mock('../environment.ts', function () { return ({
    IS_DEV: true,
    IS_PROD: false,
}); });
import { Greeter } from '../Greeter';
describe("Greeter", function () {
    var greeter;
    beforeEach(function () {
        greeter = new Greeter('World');
    });
    it("should greet", function () {
        var actual = greeter.greet();
        var expected = 'Hello, World!';
        expect(actual).toBe(expected);
    });
    it("should greet and print deprecation message if in dev mode", function () {
        var spyWarn = jest.spyOn(console, 'warn');
        var actual = greeter.greetMe();
        var expected = 'Hello, World!';
        expect(actual).toBe(expected);
        expect(spyWarn).toHaveBeenCalledWith('this method is deprecated, use #greet instead');
    });
});
//# sourceMappingURL=Greeter.spec.js.map