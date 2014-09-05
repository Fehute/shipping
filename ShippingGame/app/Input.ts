
/*
    todo:
    * handle input for the current device (expand to mobile)
    
    * instead of directly sending the event data, create our own interface for
    it and convert all device input data to the form/stuff we care about
*/

export function grab(el: JQuery, callback: (e: any) => void);
export function grab(el: HTMLElement, callback: (e: any) => void);
export function grab(el: any, callback: (e:any) => void) {
    $(el).mousedown(callback);
}

export function release(el: JQuery, callback: (e: any) => void);
export function release(el: HTMLElement, callback: (e: any) => void);
export function release(el: any, callback: (e: any) => void) {
    $(el).mouseup(callback);
}