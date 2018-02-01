import { StaticProvider, InjectionToken } from "@angular/core";

import { WEBGL } from "../webgl/webgl-tokens";
import { ShaderProgram } from "./shader-program";
import { VertexShaderSource, FragmentShaderSource } from "./shader";
import { ActiveProgramAttributes } from "./active-program-attributes";

const UNIFORM_VERTEX_SHADER = new InjectionToken<VertexShaderSource>("vertex-shader");
const UNIFORM_FRAGMENT_SHADER = new InjectionToken<FragmentShaderSource>("fragment-shader");

const BASIC_VERTEX_SHADER = new InjectionToken<VertexShaderSource>("vertex-shader");
const BASIC_FRAGMENT_SHADER = new InjectionToken<FragmentShaderSource>("fragment-shader");

export const UNIFORM_SHADER = new InjectionToken<ShaderProgram>("uniform shader");
export const BASIC_SHADER = new InjectionToken<ShaderProgram>("uniform shader");

export const SHADER_PROVIDERS: StaticProvider[] = [
    { provide: ActiveProgramAttributes, useClass: ActiveProgramAttributes, deps: [] },
    {
        provide: BASIC_VERTEX_SHADER, useValue: {
            attributes: ["aVertexPosition", "aNormal"],
            uniforms: ["uView", "uProjection", "uTransform"],
            source: `
            #version 100
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
        provide: BASIC_FRAGMENT_SHADER, useValue: {
            attributes: [],
            uniforms: ["uBaseColor"],
            source: `
            #version 100
            precision mediump float;    
            const float PI = 3.14159265358979323846;
            const vec4 ambient = vec4(0.1, 0.1, 0.1, 1.0);
            // A single fixed light position
            const vec3 light_position = vec3(1.0, 1.0, 1.0);
            uniform vec4 uBaseColor;
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
                //vec4 c = vec4(0.898, 0.815, 0.482, 1.0);
                float NdotL = clamp(dot(n, l), 0.0, 1.0);
                gl_FragColor = uBaseColor * ambient + vec4(uBaseColor.xyz * NdotL, 1.0);
            }`
        }
    },
    {
        provide: BASIC_SHADER,
        useClass: ShaderProgram,
        deps: [WEBGL, BASIC_VERTEX_SHADER, BASIC_FRAGMENT_SHADER, ActiveProgramAttributes]
    },
    {
        provide: UNIFORM_VERTEX_SHADER, useValue: {
            attributes: ["aVertexPosition"],
            uniforms: ["uView", "uProjection", "uTransform"],
            source: `
            #version 100
            attribute vec3 aVertexPosition;
            uniform mat4 uView;
            uniform mat4 uProjection;
            uniform mat4 uTransform;
            void main(void) {       
            gl_Position = uProjection * uView * uTransform * vec4(aVertexPosition, 1.0);           
            }`
        }
    },
    {
        provide: UNIFORM_FRAGMENT_SHADER, useValue: {
            attributes: [],
            uniforms: ["uBaseColor"],
            source: `
            #version 100
            precision mediump float;
            uniform vec4 uBaseColor;
            void main(void) {
            gl_FragColor = uBaseColor;
            }`
        }
    },
    {
        provide: UNIFORM_SHADER,
        useClass: ShaderProgram,
        deps: [WEBGL, UNIFORM_VERTEX_SHADER, UNIFORM_FRAGMENT_SHADER, ActiveProgramAttributes]
    }
];
