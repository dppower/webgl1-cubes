import { Inject, Injectable } from "@angular/core"

import { WEBGL } from "../webgl/webgl-tokens";
import { ShaderProgram } from "../shaders/shader-program";
import { Mesh } from "./mesh";

@Injectable()
export class ObjectBuffer {

    private vertex_buffers_: WebGLBuffer[] = [];

    constructor(@Inject(WEBGL) private gl: WebGLRenderingContext, private mesh: Mesh) { };

    initVertexArray() {

        this.bufferData(this.vertex_buffers_[0], this.mesh.vertex_positions);

        if (this.mesh.vertex_normals) {
            this.bufferData(this.vertex_buffers_[1], this.mesh.vertex_normals);
        }

        if (this.mesh.vertex_colors) {
            this.bufferData(this.vertex_buffers_[2], this.mesh.vertex_colors);
        }

        if (this.mesh.texture_coordinates) {
            this.bufferData(this.vertex_buffers_[3], this.mesh.texture_coordinates);
        }
    };

    bindVertexArray(shader_program: ShaderProgram) {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertex_buffers_[0]);
        this.gl.vertexAttribPointer(
            shader_program.getAttribute("vertex_position"), 3, this.gl.FLOAT, false, 0, 0
        );

        if (this.vertex_buffers_[1]) {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertex_buffers_[1]);
            this.gl.vertexAttribPointer(
                shader_program.getAttribute("vertex_normal"), 3, this.gl.FLOAT, false, 0, 0
            );
        }

        if (this.vertex_buffers_[2]) {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertex_buffers_[2]);
            this.gl.vertexAttribPointer(
                shader_program.getAttribute("vertex_color"), 3, this.gl.FLOAT, false, 0, 0
            );
        }

        if (this.vertex_buffers_[3]) {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertex_buffers_[3]);
            this.gl.vertexAttribPointer(
                shader_program.getAttribute("texture_coordinates"), 3, this.gl.FLOAT, false, 0, 0
            );
        }
    };

    bufferData(buffer_id: WebGLBuffer, data: number[]) {
        buffer_id = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer_id);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(data), this.gl.STATIC_DRAW);
    };
};