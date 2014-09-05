
import ko = require('knockout');

/*
 * modules will be given their root element.
 * On init, they use their template and root element and call this to implement their template.
*/
export function applyTemplate(target: string, data: any, template: string);
export function applyTemplate(target: JQuery, data: any, template: string);
export function applyTemplate(target: HTMLElement, data: any, template: string);
export function applyTemplate(target: any, data: any, template: string) {
    var el = $(target).html(template);
    ko.applyBindings(data, el[0]);
}

export class BaseModule {
    constructor(container:JQuery, template:string) {
        applyTemplate(container, this, template);
    }
}