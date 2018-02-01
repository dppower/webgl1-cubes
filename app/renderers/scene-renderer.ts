import { Injectable, Inject } from "@angular/core";

import { Cube } from "../geometry/cube";
import { RenderObject } from "../geometry/render-object";
import { CUBES, PLANE } from "../geometry/mesh-providers";
import { ShaderProgram } from "../shaders/shader-program";
import { BASIC_SHADER } from "../shaders/shader-providers";
import { WEBGL } from "../webgl/webgl-tokens";
import { MainCamera } from "../canvas/main-camera";

@Injectable()
export class SceneRenderer {
    
    constructor(
        @Inject(WEBGL) private gl: WebGLRenderingContext,
        @Inject(BASIC_SHADER) private shader_: ShaderProgram,
        @Inject(CUBES) private cubes_: Cube[],
        @Inject(PLANE) private plane_: RenderObject,
        private main_camera_: MainCamera
    ) { };

    initScene() {
        this.shader_.initProgram();

        this.main_camera_.initialiseCamera();

        this.cubes_[0].setUniformColor([1.0, 0.0, 0.0, 1.0]);
        this.cubes_[1].setUniformColor([0.0, 1.0, 0.0, 1.0]);
        this.cubes_[2].setUniformColor([0.0, 0.0, 1.0, 1.0]);
    };

    updateScene(dt: number) {
        this.main_camera_.updateCamera(dt);
    };

    drawScene() {

        //if (!this.textureLoaded_) return;

        this.shader_.useProgram(this.gl);

        // Texture
        //gl.activeTexture(gl.TEXTURE0);
        //gl.bindTexture(gl.TEXTURE_2D, this.texture_);
        //gl.uniform1i(program.getUniform("uBaseTexture"), 0);

        // Camera Uniforms
        this.gl.uniformMatrix4fv(
            this.shader_.getUniform("uView"), false, this.main_camera_.view.array
        );

        this.gl.uniformMatrix4fv(
            this.shader_.getUniform("uProjection"), false, this.main_camera_.projection.array
        );

        this.plane_.drawObject(this.gl, this.shader_);
        this.cubes_.forEach(cube => cube.drawObject(this.gl, this.shader_));
    };
}