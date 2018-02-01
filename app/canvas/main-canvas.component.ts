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

    //update() {
    //    this.cancel_token = requestAnimationFrame(() => {
    //        this.update();
    //    });

    //    // Aspect depends on the display size of the canvas, not drawing buffer.
    //    let aspect = this.canvasWidth / this.canvasHeight;
    //    let inputs = this.input_manager.inputs;
    //    inputs.aspect = aspect;
    //    this.main_camera.Update(inputs);

    //    if (inputs.mouseX != 0 && inputs.mouseY != 0) {
    //        let mouse_position_x = (inputs.mouseX / this.canvasWidth) * this.pixel_target_renderer.width;
    //        let mouse_position_y = this.pixel_target_renderer.height - ((inputs.mouseY / this.canvasHeight) * this.pixel_target_renderer.height);
    //        this.pixel_target_renderer.getMouseTarget(mouse_position_x, mouse_position_y);
    //    }

    //    let time_now = window.performance.now();
    //    this.accumulated_time += (time_now - this.previous_time); 
    //    while (this.accumulated_time > this.time_step) {
    //        this.scene_renderer.updateScene(this.time_step);
    //        this.accumulated_time -= this.time_step;
    //    }
    //    this.Draw(this.accumulated_time);
    //    this.input_manager.Update();
    //    this.previous_time = time_now;
    //};
}