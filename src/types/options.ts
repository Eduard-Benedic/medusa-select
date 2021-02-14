

export interface BaseOptions {
    /*
    The placeholder to be displayed in the container that will trigger the
    pop up of the entire dropdown.
    */
    placeholder: string;
    
    /* The number of comma separeted values to be displayed */
    csv: number;

    /* How you want to see the format */
    captionFormat: string;

    /* The text to be shown when all options are selected */
    allSelected: string;
    
    /* If true selects all options by default */
    selectAll: boolean;

    /* Enable search */
    search: boolean;

    /*  */

}


export const defaults: BaseOptions = {
    placeholder: "Search something",
    csv: 3,
    captionFormat: "habar n-am",
    allSelected: "Are all selected",
    selectAll: false,
    search: false
}


export type Options = Partial<BaseOptions>;