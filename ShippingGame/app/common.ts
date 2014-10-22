
import ko = require('knockout');

/*
 * modules will be given their root element.
 * On init, they use their template and root element and call this to implement their template.
*/
export function applyTemplate(target: string, data: any, template: string, bind?: boolean, prepend?: boolean);
export function applyTemplate(target: JQuery, data: any, template: string, bind?: boolean, prepend?: boolean);
export function applyTemplate(target: HTMLElement, data: any, template: string, bind?: boolean, prepend?: boolean);
export function applyTemplate(target: any, data: any, template: string, bind: boolean= true, prepend?: boolean) {
    var el;
    if (prepend) {
        el = $(target).prepend(template);
    } else {
        el = $(target).append(template);
    }
    if (bind) {
        ko.applyBindings(data, el[0]);
    }
}

export class BaseModule {
    self;

    constructor(public container: JQuery, public template:string) {
        this.self = this;
        this.render();
    }

    render() {
        applyTemplate(this.container, this, this.template);
    }
}

export class BaseRepeatingModule {
    constructor(container: JQuery, template: JQuery, prepend?: boolean);
    constructor(container: JQuery, template: string, prepend?: boolean);
    constructor(public container: JQuery, public template: any, public prepend?: boolean) {
        this.render();
    }

    render() {
        applyTemplate(this.container, this, this.template, false, this.prepend);
    }
}

export class Configuration {
    static numStacks: number = 5;
    static stackHeight: number = 8;
    static matchAmount: number = 4;
    static rematchDelay: number = 500; // animation delay for subsequent match checking on matches
    static startDelay: number = 1000;
    static spawnInterval: number = 3000;
}

