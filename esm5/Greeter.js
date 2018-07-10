import { IS_DEV } from './environment';
var Greeter = /** @class */ (function () {
    function Greeter(greeting) {
        this.greeting = greeting;
    }
    Greeter.prototype.greet = function () {
        return "Hello, " + this.greeting + "!";
    };
    Greeter.prototype.greetMe = function () {
        /* istanbul ignore next line */
        if (IS_DEV) {
            console.warn('this method is deprecated, use #greet instead');
        }
        return this.greet();
    };
    return Greeter;
}());
export { Greeter };
//# sourceMappingURL=Greeter.js.map