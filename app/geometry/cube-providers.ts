import { InjectionToken, StaticProvider } from "@angular/core";

import { WEBGL } from "../webgl/webgl-tokens";
import { Cube } from "./cube";
import { Mesh } from "./mesh";
import { ObjectBuffer } from "./object-buffer";
import { CubeMesh } from "./cube-mesh";

export const CUBES = new InjectionToken<Cube[]>("cubes");
export const CUBE_BUFFER = new InjectionToken<ObjectBuffer>("cube-vertex-buffers");
export const CUBE_MESH = new InjectionToken<Mesh>("cube-mesh");

const cubeFactory = (position?: number[], rotation?: number[]) => {
    return (buffer: ObjectBuffer) => new Cube(buffer, position, rotation);
};

export const CUBE_PROVIDERS: StaticProvider[] = [
    { provide: CUBE_MESH, useClass: CubeMesh, deps: [] },
    {
        provide: CUBE_BUFFER,
        useFactory: (context: WebGLRenderingContext, mesh: Mesh) => {
            let buffer = new ObjectBuffer(context, mesh);
            buffer.initVertexArray();
            return buffer;
        },
        deps: [WEBGL, CUBE_MESH]
    },
    { provide: CUBES, multi: true, useFactory: cubeFactory([0, 0, 0]), deps: [CUBE_BUFFER] },
    { provide: CUBES, multi: true, useFactory: cubeFactory([2, 0, 0]), deps: [CUBE_BUFFER] },
    { provide: CUBES, multi: true, useFactory: cubeFactory([-2, 0, 0]), deps: [CUBE_BUFFER] },
];