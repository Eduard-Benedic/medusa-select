import { BaseOptions, Options } from "./options";





export type Instance = {
    element: HTMLElement,
    input: HTMLInputElement,    
    parent: HTMLDivElement;
    container: HTMLUListElement;
    config: BaseOptions;
    // elements: OptElement[] | OptElement;
    
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