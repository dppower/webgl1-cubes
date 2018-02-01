import { Injectable } from "@angular/core";

import { RenderObject } from "./render-object";
import { ObjectBuffer } from "./object-buffer";
import { ShaderProgram } from "../shaders/shader-program";

@Injectable()
export class Cube extends RenderObject {
        
    constructor(object_buffer: ObjectBuffer, position?: number[], rotation?: number[]) {
        super(object_buffer, position, rotation);
    };

    loadTexture(gl: WebGLRenderingContext) {
        //this.texture_ = gl.createTexture();
        //let texture = new Image();
        //texture.onload = () => {
        //    gl.activeTexture(gl.TEXTURE0);
        //    gl.bindTexture(gl.TEXTURE_2D, this.texture_);
        //    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture);
        //    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        //    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        //    gl.generateMipmap(gl.TEXTURE_2D);
        //    gl.bindTexture(gl.TEXTURE_2D, null);
        //    this.textureLoaded_ = true;
        //};
        //texture.src = "textures/cube-texture.png";
    };

    updateCube(dt: number) {
        this.transform_.updateTransform();
    };   
}