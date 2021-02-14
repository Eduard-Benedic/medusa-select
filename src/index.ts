import {
    BaseOptions,
    Options,
    defaults as defaultOptions
} from './types/options';

import {
    Instance,
    MedusaFn,
    OptElement
} from './types/instance';


import {
    createElement
} from './utils/dom'

import './utils/polyfills'
import { isInterfaceDeclaration } from 'typescript';

function MedusaInstance(
    element: HTMLSelectElement,
    instanceConfig?: Options
): Instance {
    const self = {
        config: {
            ...instanceConfig,
            ...defaultOptions,
        }
    } as Instance;

    self.selectTag = element;
    
    self._appendEl = appendEl;
    self.remove = _remove;
    self._bind = bind;


    function init() {
        buildElements()
    }

    function getMainSelect() {
        return self.selectTag;
    }

    function buildElements() {
        const selectEl = getMainSelect();
        self.root = createElement('div', self.config.baseClass)
        self.parent = createElement('div', self.config.baseClass + "__wrapper")
        self.container = createElement('ul', self.config.baseClass + "__container")
        self.input = createElement('input', self.config.baseClass + "__input");
        self.elements = createOptReplacer(selectEl);
        
        self._appendEl(self.root, self.parent)
        self._appendEl(self.parent, self.input);
        self._appendEl(self.parent, self.container as HTMLElement);
        
        for (let i = 0; i < self.elements.length; i++) {
            self._appendEl(self.container, self.elements[i].el as HTMLElement)
        }
        document.body.appendChild(self.root)
    }

    function appendEl<E extends HTMLElement | Document>(
        to: E,
        el: E | E[]
    ): void {
        if (el instanceof Array) return el.forEach((item) => appendEl(to, item))
        to.appendChild(el)
    }

    function _remove(index: number, el?: boolean): boolean {
        if (el) {}
        return true;
    }


    /**
     * 
     * @param {Element} element - the el to add the listener to 
     * @param {String} event  - the name of the event
     * @param {Function} handler - event handler
     */
    
    function bind<E extends Element | Window | Document>(
        element: E | E[],
        event: string | string[],
        handler: (e?: any) => void,
        options?: object
    ): void {
        if (event instanceof Array) {
            return event.forEach((ev) => bind (element, ev, handler, options))
        }
        if (element instanceof Array) {
            return element.forEach((el) => bind(el, event, handler, options))
        }

        element.addEventListener(event, handler, options);
        self._handlers.push({
            remove: () => element.removeEventListener(event, handler);
        })
    }

    


    function createOptReplacer(selectEl: HTMLSelectElement): OptElement[] {
        const opts = selectEl.options;
        const optElements: OptElement[] = []
        for (let i = 0; i < opts.length; i++) {
            optElements.push({
                el: createElement('li',
                        self.config.baseClass + "__item",
                        opts[i].textContent),
                val: opts[i].value,
                text: opts[i].textContent
            })
        }
        return optElements
    }

    init()
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

