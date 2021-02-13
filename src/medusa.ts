import {
    BaseOptions,
    Options,
    defaults as defaultOptions
} from './types/options.ts'

console.log(BaseOptions)

class MedusaInstance {
    
    constructor(selector : string, instanceConfig: DefaultProps) {
        this.baseEl : HTMLElement = document.querySelector(selector)
        console.log(options)
    }
}

function _medusa() {

}

var medusa = function (
    selector: ArrayLike<Node> | Node | string,
    config?: Options
) {
    if (typeof selector === "string") {
        return 
    }
}


/* istanbul ignore next */
if (
    typeof HTMLElement !== "undefined" &&
    typeof HTMLCollection !== "undefined" &&
    typeof NodeList !== "undefined"
) {
    HTMLCollection.prototype.medusa = NodeList.prototype.medusa = function (
        config?: Options
    ) {
        return _medusa(this, config);
    };

    HTMLElement.prototype.medusa = function (config?: Options) {
        return _medusa([this], config) as Instance;
    }
}

/* istanbul ignore next */
let medusa = function (
    selector: ArrayLike<Node> | Node | string,
    config?: Options
) {
    if (typeof selector === "string") {
        return _medusa(window.document.querySelectorAll(selector), config);
    } else if (selector instanceof Node) {
        return _medusa([selector], config);
    } else {
        return _medusa(selector, config);
    }
} as MedusaFn;

medusa.defaultConfig = {};

medusa.setDefaults = (config: Options) => {
    medusa.defaultConfig = {
        ...medusa.defaultConfig,
        ...(config as ParsedOpions)
    }
}

if (typeof window !== "undefined") {
    window.medusa = medusa;
}

export default medusa;