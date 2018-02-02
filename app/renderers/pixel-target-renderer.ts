import { Injectable, Inject } from "@angular/core";

import { ShaderProgram } from "../shaders/shader-program";
import { UNIFORM_SHADER } from "../shaders/shader-providers";
import { WEBGL } from "../webgl/webgl-tokens";
import { Texture2d } from "../materials/texture-2d";
import { CUBES } from "../geometry/mesh-providers";
import { Cube } from "../geometry/cube";
import { MainCamera } from "../canvas/main-camera";
import { InputManager } from "../canvas/input-manager";

@Injectable()
export class PixelTargetRenderer {

    private framebuffer_: WebGLFramebuffer;
    private depthbuffer_: WebGLRenderbuffer;
    private texture_: Texture2d;

    get width() {
        return this.buffer_width_;
    };

    get height() {
        return this.buffer_height_;
    };

    private buffer_width_ = 640;
    private buffer_height_ = 480;

    constructor(
        @Inject(WEBGL) private gl: WebGLRenderingContext,
        @Inject(UNIFORM_SHADER) private shader_program: ShaderProgram,
        @Inject(CUBES) private cubes_: Cube[],
        private main_camera_: MainCamera,
        private input_manager_: InputManager
    ) { };

    createFramebuffer() {

        this.shader_program.initProgram();

        // Create Framebuffer
        this.framebuffer_ = this.gl.createFramebuffer();
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer_);

        // Setup Texture
        this.texture_ = new Texture2d(this.buffer_width_, this.buffer_height_, this.gl);
        this.texture_.setTextureParameters("nearest", "nearest", false);
        this.texture_.allocateTextureStorage();

        // Attach Texture
        this.gl.framebufferTexture2D(
            this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.texture_.id, 0
        );

        // Setup and Attach Depthbuffer
        this.depthbuffer_ = this.gl.createRenderbuffer();
        this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this.depthbuffer_);
        this.gl.renderbufferStorage(
            this.gl.RENDERBUFFER, this.gl.DEPTH_COMPONENT16, this.buffer_width_, this.buffer_height_
        );
        this.gl.framebufferRenderbuffer(
            this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.RENDERBUFFER, this.depthbuffer_
        );
        this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, null);

        // Check Status
        if (this.gl.checkFramebufferStatus(this.gl.FRAMEBUFFER) != this.gl.FRAMEBUFFER_COMPLETE) {
            console.log("Frame buffer is not complete.");
        }

        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    };

    checkMouseTarget() {
        if (!this.input_manager_.isButtonPressed("right")) return;

        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer_);
        this.drawOffscreen();

        let x = Math.round(this.input_manager_.position.x * this.buffer_width_);
        let y = Math.round(this.input_manager_.position.y * this.buffer_height_);
        
        let color = new Uint8Array(4);
        this.gl.readPixels(x, y, 1, 1, this.gl.RGBA, this.gl.UNSIGNED_BYTE, color);

        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        return color;
    };
    
    drawOffscreen() {
        this.shader_program.useProgram(this.gl);

        this.gl.viewport(0, 0, this.buffer_width_, this.buffer_height_);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Camera Uniforms
        this.gl.uniformMatrix4fv(
            this.shader_program.getUniform("uView"), false, this.main_camera_.view.array
        );

        this.gl.uniformMatrix4fv(
            this.shader_program.getUniform("uProjection"), false, this.main_camera_.projection.array
        );

        this.cubes_.forEach(cube => cube.drawBasic(this.shader_program, this.gl));
    };
};