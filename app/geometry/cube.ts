import { Injectable } from "@angular/core";

import { RenderObject } from "./render-object";
import { ObjectBuffer } from "./object-buffer";
import { ShaderProgram } from "../shaders/shader-program";

@Injectable()
export class Cube extends RenderObject {
    
    private uniform_colour_ = new Float32Array([1.0, 1.0, 1.0, 1.0]);

    constructor(object_buffer: ObjectBuffer, position?: number[], rotation?: number[]) {
        super(object_buffer, position, rotation);
    };

    /**
     * Set a unique uniform color for use in the picking renderer, override default color of white.
     */
    setUniformColor(array: number[]) {
        this.uniform_colour_.set(array);
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

    drawObject(gl: WebGLRenderingContext, shader_program: ShaderProgram) {
        //shader_program.useProgram(gl);
        this.object_buffer_.bindVertexArray(shader_program);

        gl.uniform4fv(shader_program.getUniform("uBaseColor"), this.uniform_colour_);
        gl.uniformMatrix4fv(shader_program.getUniform("uTransform"), false, this.transform_.transform.array);

        gl.drawArrays(gl.TRIANGLES, 0, this.object_buffer_.vertex_count);
    };
}