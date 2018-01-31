import { StaticProvider, InjectionToken } from "@angular/core";

import { WEBGL } from "../webgl/webgl-tokens";
import { ShaderProgram } from "./shader-program";
import { VertexShaderSource, FragmentShaderSource } from "./shader";
import { ActiveProgramAttributes } from "./active-program-attributes";

const VERTEX_SHADER = new InjectionToken<VertexShaderSource>("vertex-shader");
const FRAGMENT_SHADER = new InjectionToken<FragmentShaderSource>("fragment-shader");

export const UNIFORM_SHADER = new InjectionToken<ShaderProgram>("uniform shader");

export const SHADER_PROVIDERS: StaticProvider[] = [
    { provide: ActiveProgramAttributes, useClass: ActiveProgramAttributes, deps: [] },
    {
        provide: VERTEX_SHADER, useValue: {
            attributes: ["aVertexPosition", "aNormal"],
            uniforms: ["uView", "uProjection", "uTransform"],
            source: `
            #version 100 es
            attribute vec3 aVertexPosition;
            attribute vec3 aNormal;
            //attribute vec2 aTextureCoordinates;
            uniform mat4 uView;
            uniform mat4 uProjection;
            uniform mat4 uTransform;    
            //varying vec2 vTextureCoordinates;
            varying vec3 vNormal;
            varying vec3 vVertexPosition;
            void main(void) {       
            vec4 mv_position = uView * uTransform * vec4(aVertexPosition, 1.0);
            gl_Position = uProjection * mv_position;
            //vTextureCoordinates = aTextureCoordinates;
            vVertexPosition = vec3(mv_position);
            // Caution this should be changed to a distinct normal_mat = transpose(inverse(M * V)) when scaling is non-uniform
            vNormal = vec3(uView * uTransform * vec4(aNormal, 0.0));
            }`
        }
    },
    {
        provide: FRAGMENT_SHADER, useValue: {
            attributes: [],
            uniforms: [],
            source: `
            #version 100 es
            precision mediump float;    
            const float PI = 3.14159265358979323846;
            const vec4 ambient = vec4(0.1, 0.1, 0.1, 1.0);
            // A single fixed light position
            const vec3 light_position = vec3(1.0, 1.0, 1.0);
            varying vec3 vVertexPosition;
            varying vec3 vNormal;
            //varying vec2 vTextureCoordinates;
            //uniform sampler2D uTexture;
            void main(void) {
                vec3 n = normalize(vNormal);
                vec3 l = normalize(light_position - vVertexPosition);
                // Since camera is at (0, 0, 0), can just negate the vertex position for view vector
                vec3 v = -vVertexPosition;
                vec3 h = normalize(l + v);

                //vec4 c = texture2D(uTexture, vTextureCoordinates);
                vec4 c = vec4(0.898, 0.815, 0.482, 1.0);
                float NdotL = clamp(dot(n, l), 0.0, 1.0);
                gl_FragColor = c * ambient + vec4(c.xyz * NdotL, 1.0);
            }`
        }
    },
    { provide: UNIFORM_SHADER, useClass: ShaderProgram, deps: [WEBGL, VERTEX_SHADER, FRAGMENT_SHADER, ActiveProgramAttributes] }
];
