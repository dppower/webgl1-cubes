import { Inject, Injectable } from "@angular/core"

import { WEBGL } from "../webgl/webgl-tokens";
import { ShaderProgram } from "../shaders/shader-program";
import { Mesh } from "./mesh";

@Injectable()
export class ObjectBuffer {

    get vertex_count() {
        return this.vertex_count_;
    };

    private vertex_count_: number;

    private vertex_buffers_: WebGLBuffer[] = [];

    constructor(@Inject(WEBGL) private gl: WebGLRenderingContext, private mesh: Mesh) { };

    initVertexArray() {

        this.vertex_count_ = this.mesh.vertex_count;

        this.bufferData(0, this.mesh.vertex_positions);

        if (this.mesh.vertex_normals) {
            this.bufferData(1, this.mesh.vertex_normals);
        }

        if (this.mesh.vertex_colors) {
            this.bufferData(2, this.mesh.vertex_colors);
        }

        if (this.mesh.texture_coordinates) {
            this.bufferData(3, this.mesh.texture_coordinates);
        }
    };

    getBuffer(index = 0) {
        return this.vertex_buffers_[index];
    };

    bindVertexArray(shader_program: ShaderProgram) {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertex_buffers_[0]);
        this.gl.vertexAttribPointer(
            shader_program.getAttribute("aVertexPosition"), 3, this.gl.FLOAT, false, 0, 0
        );

        if (this.vertex_buffers_[1]) {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertex_buffers_[1]);
            this.gl.vertexAttribPointer(
                shader_program.getAttribute("aNormal"), 3, this.gl.FLOAT, false, 0, 0
            );
        }

        if (this.vertex_buffers_[2]) {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertex_buffers_[2]);
            this.gl.vertexAttribPointer(
                shader_program.getAttribute("aVertexColor"), 3, this.gl.FLOAT, false, 0, 0
            );
        }

        if (this.vertex_buffers_[3]) {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertex_buffers_[3]);
            this.gl.vertexAttribPointer(
                shader_program.getAttribute("aTextureCoordinates"), 2, this.gl.FLOAT, false, 0, 0
            );
        }
    };

    bufferData(index: number, data: number[]) {
        this.vertex_buffers_[index] = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertex_buffers_[index]);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(data), this.gl.STATIC_DRAW);
    };
};