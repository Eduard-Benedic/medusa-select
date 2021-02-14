import {
    BaseOptions,
    Options,
    defaults as defaultOptions
} from './types/options';

import {
    Instance,
    MedusaFn
} from './types/instance';

import './utils/polyfills'

function MedusaInstance(
    element: HTMLElement,
    instanceConfig?: Options
): Instance {
    const self = {
        config: {
            ...instanceConfig,
            ...defaultOptions,
        }
    } as Instance;

    self.element = element;
    self.input = document.createElement('input');
    self.parent = document.createElement('div')
    self.container = document.createElement('ul')
    // self.elements = [self];
    return self;
}

function _medusa(
    nodeList: ArrayLike<Node>,
    config?: Options
) : Instance | Instance[] {
    const nodes = Array.prototype.slice
        .call(nodeList)
        .filter((x:any) => x instanceof HTMLElement) as HTMLElement[];

    const instances : Instance[] = [];
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        try {
            node._medusa = MedusaInstance(node, config || {});
            instances.push(node._medusa);
        } catch (e) {
            console.error(e)
        }
     
    }

    return instances.length === 1 ? instances[0] : instances;
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


if (typeof window !== 'undefined') {
    window.medusa = medusa;
}


export default medusa;

