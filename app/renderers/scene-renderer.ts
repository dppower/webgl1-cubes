import { Injectable, Inject } from "@angular/core";

import { Cube } from "../geometry/cube";
import { RenderObject } from "../geometry/render-object";
import { CUBES, PLANE } from "../geometry/cube-providers";
import { ShaderProgram } from "../shaders/shader-program";
import { UNIFORM_SHADER } from "../shaders/shader-providers";
import { WEBGL } from "../webgl/webgl-tokens";
import { MainCamera } from "../canvas/main-camera";

@Injectable()
export class SceneRenderer {
    
    constructor(
        @Inject(WEBGL) private gl: WebGLRenderingContext,
        @Inject(UNIFORM_SHADER) private uniform_shader: ShaderProgram,
        @Inject(CUBES) private cubes_: Cube[],
        @Inject(PLANE) private plane_: RenderObject,
        private main_camera_: MainCamera
    ) { };

    initScene() {
        this.uniform_shader.initProgram();

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

        this.uniform_shader.useProgram(this.gl);

        // Texture
        //gl.activeTexture(gl.TEXTURE0);
        //gl.bindTexture(gl.TEXTURE_2D, this.texture_);
        //gl.uniform1i(program.getUniform("uBaseTexture"), 0);

        // Camera Uniforms
        this.gl.uniformMatrix4fv(
            this.uniform_shader.getUniform("uView"), false, this.main_camera_.view.array
        );

        this.gl.uniformMatrix4fv(
            this.uniform_shader.getUniform("uProjection"), false, this.main_camera_.projection.array
        );

        this.plane_.drawObject(this.gl, this.uniform_shader);
        this.cubes_.forEach(cube => cube.drawObject(this.gl, this.uniform_shader));
    };
}