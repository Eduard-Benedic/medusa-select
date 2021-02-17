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
    createElement,
    clearNode,
    toggleClass
} from './utils/dom'

import './utils/polyfills'
import { createLiteralTypeNode, ElementFlags, isInterfaceDeclaration, nodeModuleNameResolver, parseConfigFileTextToJson } from 'typescript';

function MedusaInstance(
    element: HTMLSelectElement,
    instanceConfig?: Options
): Instance {
    const self = {
        config: {
            ...defaultOptions,
            ...instanceConfig,
        }
    } as Instance;

    self.selectTag = element;
    self._realSelectedValues = []
    
    self._appendEl = appendEl;
    self._bind = bind;
    self._handleOptionClick = handleOptionClick;
    self._handleSearch = handleSearch

    function init() {

        parseConfig();
        buildElements()
        bindEvents()
    }

    function parseConfig() {
        Object.defineProperty(self, "_filteredOptions", {
            get: () => self._filteredOptions,
            set: (elements) => {
                 filteredOptionsSetter(elements)
            } 
        })
    }

    // function update(elements: OptElement[]): void {
        
    // }


    function filteredOptionsSetter(elements: OptElement[]) : void {
        clearNode(self.container);

        elements.forEach(element => {
            let elementTag  : HTMLLIElement  = element.el;
            self._appendEl(self.container, elementTag as HTMLElement)
        })
    }


    function getMainSelect() {
        return self.selectTag;
    }

    function buildElements() {
        const selectEl = getMainSelect();
        const baseClass = self.config.baseClass;

        self.root = createElement('div', baseClass)
        self.parent = createElement('div', baseClass + "__wrapper")
        self.container = createElement('ul', baseClass + "__container")
        self.input = createElement('input', baseClass + "__input");
        self.caption = createElement('p', baseClass + "__caption", self.config.captionFormat)
        self.elements = createOptReplacer(selectEl);
        
        self._appendEl(self.root, [selectEl, self.parent])
        self._appendEl(self.parent, [self.input,self.caption,  self.container as HTMLElement]);
        // self._appendEl(self.parent, );s
        for (let i = 0; i < self.elements.length; i++) {
            self._appendEl(self.container, self.elements[i].el as HTMLElement)
        }
        document.body.appendChild(self.root)
    }


    function bindEvents() {
        bind(getOptsElements(self.elements as OptElement[]), 'click', handleOptionClick)
        if (self.config.search) {
            bind(self.input as HTMLInputElement, 'keyup', handleSearch)
        }
        bind(self.caption,'click', handleToggleDropDown);
    }

    function handleToggleDropDown(e: any) {
        toggleClass(self.container, 'open')
        
    }


    function handleSearch(e: any): void {
        const userText : string = e.target.value;
        let remainingItems : OptElement[] = (self.elements as OptElement[]).filter(el => {
            return (String(el.text).toLowerCase() as string).includes(userText.toLowerCase())
        })
        self._filteredOptions = remainingItems
    }

    function getOptsElements(elements: OptElement[]) : HTMLLIElement[] {
        const extractedElements : HTMLLIElement[] = [];
        for (let i = 0; i < elements.length; i++) {
            console.log(elements[i].el)
            extractedElements.push(elements[i].el)
        }
        return extractedElements
    }

    function handleOptionClick(e?: any) {
        const option = e.target;
        updateFunctionally(option);
        updateVisually(option)
    }

    function updateVisually(el: HTMLLIElement): void {
        const isDefaultCaption = self.caption.textContent === self.config.captionFormat
        const selectedOptions: ArrayLike<HTMLOptionElement> = getMainSelect().selectedOptions;
        const optCount: number = selectedOptions.length;

        if (isDefaultCaption) {
            self.caption.textContent = el.dataset.val + ", "
        } else {
            if (optCount > self.config.csv) {
                self.caption.textContent = (optCount + " Selected").toString()
            } else if (self._realSelectedValues.length < 1) {
                self.caption.textContent= self.config.captionFormat
            }
            else {
                self.caption.textContent = self._realSelectedValues.join()
            }
        }
    }

    function updateFunctionally(el: HTMLLIElement): void {
        // Each item in the list has a mapped data index that
        //maps to the corresponding option.
        const index = parseInt(el.dataset.index)
        const mappedOption = self.selectTag.options[index]
        if (!self._realSelectedValues.includes(el.dataset.val)) {
            self._realSelectedValues.push(el.dataset.val as string);
        } else {
            const newArr = self._realSelectedValues.filter(val => {
                return val != el.dataset.val
            })
            self._realSelectedValues = newArr
        }
        toggleOptSelection(mappedOption);
        el.classList.toggle('selected')
    }

    function toggleOptSelection(opt: HTMLOptionElement): void {
        opt.selected == true ? opt.removeAttribute('selected') : opt.setAttribute('selected', 'selected' )
    }
    
    function appendEl<E extends HTMLElement | Document>(
        to: E,
        el: E | E[]
    ): void {
        if (el instanceof Array) return el.forEach((item) => appendEl(to, item))
        to.appendChild(el)
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
        // self._handlers.push({
        //     remove: () => element.removeEventListener(event, handler);
        // })
    }


    function createOptReplacer(selectEl: HTMLSelectElement): OptElement[] {
        const opts = selectEl.options;
        const optElements: OptElement[] = [];

        for (let i = 0; i < opts.length; i++) {
            const optReplacer: HTMLLIElement = createElement('li',
                self.config.baseClass + "__item",
                opts[i].textContent);
            optReplacer.dataset.index = String(i);
            optReplacer.dataset.val = opts[i].textContent;
            optElements.push({
                el: optReplacer,
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

