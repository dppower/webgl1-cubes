import { ObjectBuffer } from "./object-buffer";
import { Transform } from "./transform";
import { ShaderProgram } from "../shaders/shader-program";

export abstract class RenderObject {
    
    get transform() {
        return this.transform_;
    };

    protected transform_: Transform;
    
    constructor(protected object_buffer_: ObjectBuffer, position = [0, 0, 0], rotation = [0, 0, 0, 1]) {
        this.transform_ = new Transform(position, rotation);
    };

    abstract drawObject(gl: WebGLRenderingContext, shader_program: ShaderProgram): void;
};