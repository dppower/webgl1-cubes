import { Component, ViewChild, AfterViewInit } from "@angular/core";

import { WebglDirective } from "../webgl/webgl.directive";

@Component({
    selector: 'main-canvas',
    template: `
    <canvas webgl canvas-controller><p>{{fallback_text}}</p></canvas>
    `,
    styles: [`
    canvas {
        height: 100%;
        width: 100%;
        border: none;
        position: absolute;
        z-index: 0;
    }
    `]
})
export class MainCanvas implements AfterViewInit {

    @ViewChild(WebglDirective) webgl_context: WebglDirective;

    fallback_text = "Loading Canvas...";
    
    cancel_token: number;

    constructor() { };

    ngAfterViewInit() {
        if (!this.webgl_context.createContext()) {
            console.log("Unable to initialise Webgl.");
            setTimeout(() => {
                this.fallback_text = "Unable to initialise Webgl."
            }, 0);
        }
    };
}