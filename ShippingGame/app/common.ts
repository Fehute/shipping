
import ko = require('knockout');

/*
 * modules will be given their root element.
 * On init, they use their template and root element and call this to implement their template.
*/
export function applyTemplate(target: string, data: any, template: string, bind?: boolean);
export function applyTemplate(target: JQuery, data: any, template: string, bind?: boolean);
export function applyTemplate(target: HTMLElement, data: any, template: string, bind?: boolean);
export function applyTemplate(target: any, data: any, template: string, bind: boolean= true) {
    var el = $(target).append(template);
    if (bind) {
        ko.applyBindings(data, el[0]);
    }
}

export class BaseModule {
    constructor(public container: JQuery, public template:string) {
        this.render();
    }

    render() {
        applyTemplate(this.container, this, this.template);
    }
}

export class BaseRepeatingModule {
    constructor(container: JQuery, template: JQuery);
    constructor(container: JQuery, template: string);
    constructor(public container: JQuery, public template: any) {
        this.render();
    }

    render() {
        applyTemplate(this.container, this, this.template, false);
    }
}

export class Configuration {
    static numStacks: number = 5;
    static stackHeight: number = 8;
}

