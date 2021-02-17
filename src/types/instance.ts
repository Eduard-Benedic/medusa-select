import { BaseOptions, Options } from "./options";





export type Instance = {
    
    root: HTMLDivElement;
    parent: HTMLDivElement;
    container: HTMLUListElement;
    selectTag: HTMLSelectElement,
    input: HTMLInputElement,
    caption: HTMLParagraphElement;
    config: BaseOptions;
    elements: OptElement[] | OptElement;


    _realSelectedValues: string[];
    _filteredOptions: OptElement[];
    // Internals
    _handlers: {
        remove: () => void;
    }[];

    _appendEl: <E extends HTMLElement | Document>(
        to: E,
        el: E | E[]
    ) => void;
    _bind: <E extends Element>(
        element: E | E[],
        event: string | string[],
        handler: (e?: any) => void
    ) => void;
    _createElement: <E extends HTMLElement>(
        tag: keyof HTMLElementTagNameMap,
        className: string,
        content?: string,
    ) => E;
    _handleOptionClick: (e?: any) => void;
    _handleSearch: (e?: any) => void;
    _toggleClass: <E extends HTMLElement> (
        el: E,
        className: string
    ) => void;
}

export type OptElement = {
    el: HTMLLIElement
    val: string | number;
    text: string | number;
}

export interface MedusaFn {
    (selector: Node, config?: Options): Instance;
    (selector: ArrayLike<Node>, config?: Options): Instance[];
    (selector: string, config?: Options): Instance | Instance[];

}