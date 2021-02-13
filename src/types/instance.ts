import { Options } from "./options";


export interface MedusaFn {
    (selector: Node, config?: Options): Instance;
}