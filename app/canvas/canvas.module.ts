import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

// Modules
import { WebglModule } from "../webgl/webgl.module";
// Components
import { MainCanvas } from "./main-canvas.component";
// Directives
import { CanvasController } from "./canvas-controller.directive";
// Providers
import { InputManager } from "./input-manager";
import { RenderLoop } from "./render-loop";

@NgModule({
    imports: [ CommonModule, WebglModule ],
    declarations: [ MainCanvas, CanvasController ],
    providers: [ InputManager, RenderLoop ],
    exports: [ MainCanvas ]
})
export class CanvasModule { };