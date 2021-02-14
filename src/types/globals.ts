import { Options } from './options';
import { Instance, MedusaFn } from './instance';


declare global {
    interface HTMLElement {
        medusa: (config?: Options) => Instance;
        
    }

    interface NodeList {
        medusa: (config?: Options) => Instance | Instance[];
    }

    interface HTMLCollection {
        medusa: (config?: Options) => Instance | Instance[];
    }

    interface Window {
        medusa: MedusaFn;
    }
}