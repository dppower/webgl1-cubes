import { InjectionToken, StaticProvider } from "@angular/core";

import { WEBGL } from "../webgl/webgl-tokens";
import { Mesh } from "./mesh";
import { ObjectBuffer } from "./object-buffer";
import { RenderObject } from "./render-object";
import { Cube } from "./cube";
import { cube_mesh } from "./cube-mesh";
import { plane_mesh } from "./plane-mesh";

// Cubes
export const CUBES = new InjectionToken<Cube[]>("cubes");
const CUBE_BUFFER = new InjectionToken<ObjectBuffer>("cube-vertex-buffers");
const CUBE_MESH = new InjectionToken<Mesh>("cube-mesh");

// Plane
export const PLANE = new InjectionToken<RenderObject>("plane object");
const PLANE_BUFFER = new InjectionToken<ObjectBuffer>("plane-vertex-buffers");
const PLANE_MESH = new InjectionToken<Mesh>("plane-mesh");

const cubeFactory = (position?: number[], rotation?: number[]) => {
    return (buffer: ObjectBuffer) => new Cube(buffer, position, rotation);
};

const renderObjectFactory = (position?: number[], rotation?: number[]) => {
    return (buffer: ObjectBuffer) => new RenderObject(buffer, position, rotation);
};

const bufferFactory = (context: WebGLRenderingContext, mesh: Mesh) => {
    let buffer = new ObjectBuffer(context, mesh);
    buffer.initVertexArray();
    return buffer;
};

export const MESH_PROVIDERS: StaticProvider[] = [
    { provide: CUBE_MESH, useValue: cube_mesh },
    {
        provide: CUBE_BUFFER,
        useFactory: bufferFactory,
        deps: [WEBGL, CUBE_MESH]
    },
    { provide: CUBES, multi: true, useFactory: cubeFactory([0, 1, 0]), deps: [CUBE_BUFFER] },
    { provide: CUBES, multi: true, useFactory: cubeFactory([4, 1, 0]), deps: [CUBE_BUFFER] },
    { provide: CUBES, multi: true, useFactory: cubeFactory([-4, 1, 0]), deps: [CUBE_BUFFER] },
    { provide: PLANE_MESH, useValue: plane_mesh },
    {
        provide: PLANE_BUFFER,
        useFactory: bufferFactory,
        deps: [WEBGL, PLANE_MESH]
    },
    { provide: PLANE, useFactory: renderObjectFactory(), deps: [PLANE_BUFFER] },
];