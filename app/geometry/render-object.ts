import { ObjectBuffer } from "./object-buffer";
import { Transform } from "./transform";
import { ShaderProgram } from "../shaders/shader-program";

export class RenderObject {
    
    get transform() {
        return this.transform_;
    };

    protected transform_: Transform;
    protected uniform_colour_ = new Float32Array([1.0, 1.0, 1.0, 1.0]);

    constructor(protected object_buffer_: ObjectBuffer, position = [0, 0, 0], rotation = [0, 0, 0, 1]) {
        this.transform_ = new Transform(position, rotation);
    };

    /**
     * Set a unique uniform color for use in the picking renderer, override default color of white.
     */
    setUniformColor(array: number[]) {
        this.uniform_colour_.set(array);
    };

    drawObject(gl: WebGLRenderingContext, shader_program: ShaderProgram) {
        //shader_program.useProgram(gl);
        this.object_buffer_.bindVertexArray(shader_program);

        gl.uniform4fv(shader_program.getUniform("uBaseColor"), this.uniform_colour_);
        gl.uniformMatrix4fv(shader_program.getUniform("uTransform"), false, this.transform_.transform.array);

        gl.drawArrays(gl.TRIANGLES, 0, this.object_buffer_.vertex_count);
    };
};