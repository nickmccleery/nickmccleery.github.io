---
title: Building a palatable 3D viewer | Part II
description: Three.js, toggling projections, and building a viewer that's familiar to CAD users.
date: 2024-05-21
draft: false
images: [/images/blog/07/OGImage.png]
tags: [engineering, review, software, development, 3D, CAD, Three.js]
---

{{< figure src="/images/blog/03/Screenshot.png" title="Anneal CAD viewer: perspective projection of coilover STEP file." class="rounded margin">}}

<hr/>

## Overview

In the [previous post](/posts/03-building-a-palatable-3d-viewer), I talked through the motivation for us building a 3D
viewer, then introduced the basics of our old Three.js setup. This worked through cameras and projections, view
frustums, controls, and a few other things—but stopped short of giving the viewer a more polished feel.

The items that were listed under the previous article's 'further work' section were:

1. A mechanism for toggling between orthographic and perspective projections.
2. A grid on the ground plane.
3. A view cube style axes helper.
4. A quick 'return to home' button that resets the view.
5. An unfolded cube widget that can be used to orient the camera parallel to a given face.

Taking these in order...

## 1: Orthographic projections and projection toggling

The last article broadly introduced the concept of these two projections, but didn't provide any practical examples on
the orthographic front. Before looking at any code, it's worth running through what our desired behaviour actually is,
and then the basic setup that we used to enable that.

### Requirements

The desire here is fairly straightforward: we want the user to be able to spin the model around, zoom in and out, and
generally navigate the scene however they like. This should be possible in either projection mode. Then, should the user
wish to, they can click a button that will switch the projection to the alternate mode—without changing the apparent
camera position or camera orientation, and without dramatically changing which parts of the scene are visible. We want
equivalent scenes in both projections.

Practically, when changing projections, the camera should remain pointed at the same point in 3D space, and the section
of the scene where it's pointed should occupy roughly the same area of the screen.

### Example

The below images give a nice example of what this actually means. In this case, we're focused on the origin of the scene
in both cases. That red castellated spring seat which I'm just going to call the 'preload adjuster' is pretty close to
the origin, so that's basically the centre of everything. As we toggle back and forward, we don't want to dramatically
alter how that part appears to the user.

{{< figure src="/images/blog/07/Comparison.png"
title="Side-by-side comaprison of perspective and parallel projections."
class="rounded margin">}}

The side-by-side comparison above shows the same scene in both projection modes. To me, it's a little hard to make out
the differences as the grid is a bit of a distraction—so let's take an overlay approach instead.

{{< figure src="/images/blog/07/Overlay.png" title="Overlay of perspective and parallel projections."  class="rounded margin">}}

This is much clearer. You can see that the preload adjuster looks almost identical between projections, while the lower
mount on the coilver is quite different. The perspective projection shows some foreshortening, with the lower mount
appearing both reduced in size and closer to the centre of our screen.

### Viewing volumes, zoom, and view equivalence

'Viewing volume' is the generic term for the space that the camera can see. For perspective cameras, this is a truncated
pyramid known as a frustum that tapers off into the distance. For orthographic cameras, it's just a box.

In order to achieve an equivalent view between the two projection modes, we first want to keep the apparent camera
position and orientation the same, such that we're looking at the rendered objects from what looks like exactly the same
place, and that we're focused on exactly the same point in 3D space. Then, we want to ensure that the visible area of
the scene is roughly the same in both modes.

Since the field of view (FOV) parameter refers to vertical field of view, I think about this equivalence in terms of
'visible height'—the height of the scene that's visible at the camera's target position. This figure produced for the
[previous post](/posts/03-building-a-palatable-3d-viewer) illustrates what I mean by visible height:

{{<figure
src="/images/blog/03/ViewFrustumSideAnnotated.png"
title="Side view of frustum."
class="rounded margin">}}

This example is for a perspective camera, but the concept is the same for orthographic cameras. To convert our scenario
to orthographic, you can imagine making our truncated pyramid into a cube, leaving the camera where it is, then
configuring it such that you still squeeze a height of $2CB$ into exactly the same vertical region on your screen.

Configuring our cameras such that the visible height in that target plane is the same in both modes is the key to
achieving our desired equivalence.

#### A note on zoom

Since the previous article only covered perspective cameras, where the zoom property is not commonly used, it's worth
mentioning that the orthographic camera has a `zoom` property that is actively used to adjust the scale of the scene.

For perspective cameras:

- The `zoom` property exists but is not commonly used. Instead, the default Three.js controls employ 'dollying' bound to
  the mouse wheel, where the camera moves closer to or further from the target point along the line of sight—the vector $\vec{AB}$ in the
  figure above.
- As the camera moves closer to the target, the visible area decreases, making objects appear larger, and as the camera
  moves further from the target, the visible area increases, making objects appear smaller.

While for orthographic cameras:

- The `zoom` property directly affects the size of the viewing volume. Increasing the zoom level reduces the visible
  area, making objects appear larger, while decreasing the zoom level increases the visible area, making objects appear
  smaller.
- Since an orthographic camera projects objects without perspective distortion, zooming in and out simply scales the
  scene uniformly without changing the relative sizes of objects based on distance.

This means that we need to think about zoom when switching between the two modes as, for a given camera position, we'll
need to adjust the orthographic camera's zoom level in order to match the visible height of the perspective camera.
Similarly, when switching back to perspective, we'll need to adjust the perspective camera's distance from the target to
match the visible height of the orthographic camera.

Note that this last point is important. When converting from orthographic to perspective, our final perspective camera
position may not be exactly the same as the initial orthographic camera position. Instead, we may need to move the
camera closer to or further from the target point in order to achieve the desired visible height—even if the vector
along which we're dollying is the same.

#### Parameters of interest

Since we achieve equivalence by matching up the viewing volumes, camera positions, and zoom level, the parameters we're
interested in are:

- [`PerspectiveCamera`](https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera):

  - `fov`
  - `near`
  - `far`

- [`OrthographicCamera`](https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera):
  - `left`
  - `right`
  - `top`
  - `bottom`
  - `near`
  - `far`
  - `zoom`

These are what we'll need to work with to establish the two viewing volumes, plus the aspect ratio of the canvas. With
those parameters and a bit of trigonometry, we'll be able to set up our view equivalence.

### Technical approach

In Three.js, a camera's projection mode is an immutable property of the camera object. This means that a given camera
instance can't be switched between the two modes. Instead, we need to create two separate camera instances, one for each
mode, then we can switch between them as needed. To do that, we can just point the renderer at the appropriate camera
instance.

When it comes time to switch between the modes, the process will broadly be:

1. Copy the current camera's position and orientation to the alternate camera.
2. Compute the parameters for the alternate camera that would provide an equivalent view.
3. Update the alternate camera with the new parameters.
4. Point the renderer at the alternate camera.

Computation of the required parameters will be slightly different depending on whether we're switching from perspective
to orthographic, or vice versa, but we'll come back to that later.

### Initialisation

Getting into the actual structure of things, we'll need to set up two cameras, two sets of controls, and a renderer.
We'll also set up 'active' variables which will just reference the currently active camera and controls. This will make
it easier to switch between the two as we won't need to think about the renderer explicitly—we just swap out the active
camera.

This is provided [below](#threeviewervue) in the `mounted` hook of our Vue component. Initial camera configuration is
driven by our `init` method.

The novel bit here, compared to the previous post, is that we need to set up the viewing volume for the orthographic
camera. That's handled by the `setDefaultOrthoCameraViewingVolume` method, which is given as follows:

```javascript
setDefaultOrthoCameraViewingVolume() {
    const { clientWidth, clientHeight } = this.viewerContainer;
    const aspect = clientWidth / clientHeight;

    const defaultParams = Geometry.computeDefaultOrthographicCameraViewingVolume(
        this.boundingSphere.radius,
        aspect,
        constants.ZOOM_SCALAR,
        this.boundingSphere.radius * constants.GRID_SIZE_SCALAR
    );

    // Compute orthographic viewing volume.
    this.orthoCamera.left = defaultParams.left;
    this.orthoCamera.right = defaultParams.right;
    this.orthoCamera.top = defaultParams.top;
    this.orthoCamera.bottom = defaultParams.bottom;
    this.orthoCamera.near = defaultParams.near;
    this.orthoCamera.far = defaultParams.far;

    this.orthoCamera.updateProjectionMatrix();
},
```

The function that's actually doing the work here lives in our 3D geometry module:

```javascript
export function computeDefaultOrthographicViewingVolume(
  objectRadius: number,
  aspect: number,
  zoomScalar: number,
  xGridSize: number
): {
  left: number,
  right: number,
  top: number,
  bottom: number,
  near: number,
  far: number,
} {
  // Compute first component.
  const r = objectRadius;

  const left = -1 * zoomScalar * aspect * r;
  const right = zoomScalar * aspect * r;
  const top = zoomScalar * r;
  const bottom = -1 * zoomScalar * r;

  // For near/far, we need to accommodate the grid. xGridSize is the size of
  // the grid as fed to Three.js' GridHelper.
  const xGridHalfSize = xGridSize / 2; // We're going back from center, so only need half.

  const near = -1 * xGridHalfSize;
  const far = xGridHalfSize * X_FAR_SCALAR;

  return { left, right, top, bottom, near, far };
}
```

In our case, we feed in some scalars that have utility elsewhere in the viewer:

- `GRID_SIZE_SCALAR`: a scalar that we use to determine the size of the grid that we overlay on the scene. In effect,
  this defines our scene bounds as the grid is always bigger than the objects rendered. In this scenario, we use it to
  set the position of the near and far planes of the viewing volume. For the far plane, we also use the `X_FAR_SCALAR`
  to ensure we're not chopping off the back of the scene.
- `ZOOM_SCALAR`: a scalar that we use to provide a bit of space on render. For perspective cameras, we work out the
  camera position required to fit everything in, then we 'zoom out' by dollying the camera back from the target by 50%
  of the distance between its original position and the target. For orthographic cameras, we use this value to set the
  bounds of the viewing volume.

I do think we could do a better job with the amount of space we leave around the scene rather than being so liberal with
the viewing volume... but for now, this is fine.

Then, after setting the viewing volume, we also need to think about zoom. That `setDefaultOrthoCameraZoom` method looks
like this:

```javascript
setDefaultOrthoCameraZoom() {
    // Calculate the visible height at the PerspectiveCamera's position.
    const currentControlTarget = this.controls.target.clone();
    let distance = this.perspectiveCamera.position.distanceTo(currentControlTarget);
    let visibleHeightAtDistance = Geometry.calculateHeightFromAngleAndDistance(
        constants.PHI_FOV,
        distance
    );

    // Calculate zoom required.
    let initialHeight = this.orthoCamera.top - this.orthoCamera.bottom;
    let zoom = initialHeight / visibleHeightAtDistance;

    this.defaultOrthoCameraZoom = zoom;
},
```

It's basically just a calculation for visible height in our target plane that we then convert to a zoom based on the top
and bottom of the orthographic camera's viewing volume. We take the distance from the perspective camera since this is
the camera we're trying to match up with, though this feels a bit janky to me... especially since we have a
`defaultCameraDistanceFromTarget` variable to work with.

Either way, the actual calculation is just some trigonometry:

```typescript
export function calculateHeightFromAngleAndDistance(phiFov: number, distance: number): number {
  // Effectively reversing calculateDistanceFromAngleAndHeight to yield
  // visible height from FOV angle and distance from camera to target.
  const thetaFov = phiFov / 2;
  const thetaRad = deg2rad(thetaFov);

  const visibleHalfHeight = distance * Math.tan(thetaRad);
  const visibleHeight = 2 * visibleHalfHeight;

  return visibleHeight;
}
```

### Toggling

Whether we're transitiong from perspective to orthographic or vice versa, the process is broadly the same. We need to
configure our alternate camera for an equivalent view, then switch the renderer to point at that camera. The actual
process is as follows:

#### Perspective to orthographic

1. Copy the perspective camera’s position and target to the ortho camera.
2. Calculate the current visible height based on the distance from the perspective camera to the target.
3. Determine the required zoom level for the orthographic camera using the initial frustum height and visible height.
4. Set the orthographic camera’s zoom and position.
5. Switch active camera and controls to the orthographic setup.

In code, that looks like this:

```javascript
convertPerspectiveCameraToOrthoCamera() {
    // Get current position.
    const currentCameraPosition = this.perspectiveCamera.position.clone();
    const currentControlTarget = this.perspectiveControls.target.clone();

    // Calculate the visible height at the PerspectiveCamera's position.
    let distance = this.perspectiveCamera.position.distanceTo(currentControlTarget);
    let visibleHeightAtDistance = Geometry.calculateHeightFromAngleAndDistance(
        constants.PHI_FOV,
        distance
    );

    // Calculate zoom required.
    let initialHeight = this.orthoCamera.top - this.orthoCamera.bottom;
    let zoom = initialHeight / visibleHeightAtDistance;

    // Set the zoom value.
    this.orthoCamera.zoom = zoom;

    // Set the OrthoCamera's new position.
    this.orthoCamera.position.set(
        currentCameraPosition.x,
        currentCameraPosition.y,
        currentCameraPosition.z
    );

    // Flip active.
    this.camera = this.orthoCamera;
    this.controls = this.orthoControls;
    this.viewHelper = this.orthoViewHelper;
    this.orthoControls.enabled = true;
    this.perspectiveControls.enabled = false;
    this.currentProjection = ProjectionType.Orthographic;
},
```

#### Orthographic to perspective

1. Extract the orthographic camera’s position and target.
2. Calculate the current visible height based on the orthographic camera’s frustum and zoom.
3. Determine the required distance for the perspective camera to match the view using the FOV and visible height.
4. Compute the new position for the perspective camera based on this distance and while maintaining the same direction
   to the target.
5. Update the perspective camera’s position.
6. Switch active camera and controls to the perspective setup.

In code, that looks like this:

```javascript
convertOrthoCameraToPerspectiveCamera() {
    // Get current position.
    const currentCameraPosition = this.orthoCamera.position.clone();
    const currentControlTarget = this.orthoControls.target.clone();

    // Convert ortho camera config to equivalent perspective camera config.
    let top = this.orthoCamera.top;
    let bottom = this.orthoCamera.bottom;
    let zoom = this.orthoCamera.zoom;

    // Calculate the visible height at the OrthographicCamera's zoom level.
    const initialHeight = top - bottom;
    const visibleHeightAtZoom = initialHeight / zoom;

    // Calculate the distance the PerspectiveCamera should be from the target.
    let distance = Geometry.calculateDistanceFromAngleAndHeight(
        constants.PHI_FOV,
        visibleHeightAtZoom
    );

    // Calculate the direction from the active target to the PerspectiveCamera.
    let currentOrthoCameraPosition = new Geometry.Vector3D(
        currentCameraPosition.x,
        currentCameraPosition.y,
        currentCameraPosition.z
    );

    let targetPosition = new Geometry.Vector3D(
        currentControlTarget.x,
        currentControlTarget.y,
        currentControlTarget.z
    );

    // Direction from camera to target.
    const direction = Geometry.computeVectorDirectionAB(
        targetPosition,
        currentOrthoCameraPosition
    );

    const newPosition = targetPosition.add(direction.scale(distance));

    // Update and flip active.
    this.perspectiveCamera.position.set(newPosition.x, newPosition.y, newPosition.z);
    this.perspectiveControls.target.set(
        currentControlTarget.x,
        currentControlTarget.y,
        currentControlTarget.z
    );

    this.camera = this.perspectiveCamera;
    this.controls = this.perspectiveControls;
    this.viewHelper = this.perspectiveViewHelper;
    this.orthoControls.enabled = false;
    this.perspectiveControls.enabled = true;
    this.currentProjection = ProjectionType.Perspective;
},
```

That's basically it. Having not looked at any of this code for a few months, I can certainly see a few nice
opportunities for refactoring and restructurig in the interest of simplicity here, but bind the `toggleProjection`
method to a button and you get nice, functional projection toggling:

### Finished product

{{<figure
src="/images/blog/07/Toggle.gif"
title="Toggling in action."
class="rounded margin">}}

## 2: Ground plane grid

Compared to the projection toggling, this is very straightforward. All we need to do is configure a
[`GridHelper`](https://threejs.org/docs/#api/en/helpers/GridHelper). For our implementation, I baked this into our
`threeHelper.js` module.

We pass that our bounding sphere radius:

```javascript
// Create grid.
const gridHelper = threeHelper.createGridHelper(this.boundingSphere.radius);
this.scene.add(gridHelper);
```

Then the actual grid helper is created using some constants:

```javascript
function createGridHelper(boundingSphereRadius) {
  const gridHelper = new THREE.GridHelper(
    boundingSphereRadius * constants.GRID_SIZE_SCALAR,
    constants.GRID_DIVISIONS,
    constants.WIREFRAME_ACCENT_COLOR,
    constants.WIREFRAME_COLOR
  );

  return gridHelper;
}
```

Relevant constants for our configuration:

```javascript
export const GRID_DIVISIONS = 20;
export const GRID_SIZE_SCALAR = 5;
export const WIREFRAME_ACCENT_COLOR = 0x000000;
export const WIREFRAME_COLOR = 0xbbbbbb;
```

## 3: Axes and view helpers

The axes and view helpers are another simple addition. The axes helper just draws coloured lines along the x, y, and z
axes, while the view helper provides a little axes widget whose orientation is locked to the scene's, just to help users
keep track of where they are.

{{<figure
src="/images/blog/07/ViewHelper.png"
title="View helper."
class="rounded margin">}}

Getting the [`AxesHelper`](https://threejs.org/docs/#api/en/helpers/AxesHelper) going is as simple as creating the
helper and adding it to the scene. As with the grid, we try to pull some relevant dimensions from the rendered objects
to scale the helper appropriately:

```javascript
// Create axes helper.
const axesHelper = new THREE.AxesHelper(this.boundingSphere.radius * 0.5);
this.scene.add(axesHelper);
```

The view helper is a _little_ more complicated. You need to import the helper from the three addons:

```javascript
import { ViewHelper } from "three/addons/helpers/ViewHelper.js";
```

Then we need to provide references to the relevant camera, controls, and renderer element:

```javascript
// Create view helpers.
this.perspectiveViewHelper = threeHelper.createViewHelper(
  this.perspectiveCamera,
  this.renderer.domElement,
  this.perspectiveControls
);

this.orthoViewHelper = threeHelper.createViewHelper(this.orthoCamera, this.renderer.domElement, this.orthoControls);
```

As with the grid, our actual view helper instantiation is handled in the `threeHelper.js` module:

```javascript
function createViewHelper(camera, rendererElement, controls) {
  const viewHelper = new ViewHelper(camera, rendererElement);
  viewHelper.controls = controls;
  viewHelper.controls.center = controls.target;

  return viewHelper;
}
```

The view helper can also be manipulated directly to navigate the scene:

{{<figure
src="/images/blog/07/ViewHelper.gif"
title="View helper."
class="rounded margin">}}

## 4: Returning to home view

This is literally a few lines of code. All we need to do is call our default setting methods touched on earlier when the
user clicks a button. In our case, we have a 'revert view' button that calls the `revertCamerPosition` method:

```javascript
revertCameraPosition() {
    if (this.currentProjection === ProjectionType.Orthographic) {
        this.setDefaultOrthoCameraViewingVolume();
        this.orthoCamera.zoom = this.defaultOrthoCameraZoom;
    }

    this.setDefaultCameraPosition(this.camera, this.controls);
},
```

Here's our implementation in action:

{{<figure
src="/images/blog/07/RevertView.gif"
title="Reverting camera."
class="rounded margin">}}

## 5: Cube widget

Finally there's our cube widget. This exists purely to facilitate quick navigation around the model—so it can be viewed
from above, below, front-on, side-on etc.

For our implementation, I thought the best way to present this would be to 'unfold' a cube into a flat plane, then
highlight the relevant face. When a user clicks a particular button for a target face, we orient the camera to be
parallel to that face then zoom out to fit the whole model in view.

This is the design I settled on:
{{<figure
src="/images/blog/07/ViewCube.png"
title="Unfolded standard view cube."
class="rounded margin">}}

In terms of actual implementation, we first set up an enum for the standard views, then define a function to compute the
camera position for each of the standard views.

```javascript
export enum StandardView {
    Front,
    Back,
    Left,
    Right,
    Top,
    Bottom,
}

export function computeStandardViewCameraPosition(view: StandardView, distance: number) {
    let cameraPosition: Coordinate;

    switch (view) {
        case StandardView.Front:
            // From positive z-axis towards origin.
            cameraPosition = { x: 0, y: 0, z: distance };
            break;
        case StandardView.Back:
            // From negative z-axis towards origin.
            cameraPosition = { x: 0, y: 0, z: -1 * distance };
            break;
        case StandardView.Left:
            // From negative x-axis towards origin.
            cameraPosition = { x: -1 * distance, y: 0, z: 0 };
            break;
        case StandardView.Right:
            // From positive x-axis towards origin.
            cameraPosition = { x: distance, y: 0, z: 0 };
            break;
        case StandardView.Top:
            // From positive y-axis towards origin.
            cameraPosition = { x: 0, y: distance, z: 0 };
            break;
        case StandardView.Bottom:
            // From negative y-axis towards origin.
            cameraPosition = { x: 0, y: -1 * distance, z: 0 };
            break;
        default:
            throw new Error(`Invalid view: ${view}`);
    }
    return cameraPosition;
}
```

This method is then bound to each of the standard view buttons in our Vue component:

```javascript
setCubePosition(view) {
    let cameraPosition = Geometry.computeStandardViewCameraPosition(
        view,
        this.defaultCameraDistanceFromTarget * constants.ZOOM_SCALAR
    );

    this.camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
    this.controls.target.set(constants.ORIGIN.x, constants.ORIGIN.y, constants.ORIGIN.z);
},
```

That's it—nothing more to it:

{{<figure
src="/images/blog/07/ViewCube.gif"
title="Unfolded standard view cube widget in use."
class="rounded margin">}}

## Appendix: Code

### `3DGeometry.ts`

This file contains some geometry related functionality that is used throughout. Includes some vector maths, trig
functions and so on.

```typescript
const X_FAR_SCALAR = 5;
const X_NEAR_SCALAR = 0.05;
const X_NEAR_DEFAULT = 0.1;

type Coordinate = {
  x: number;
  y: number;
  z: number;
};

// We could use glMatrix, but feels like overkill for something evaluated so infrequently.
export class Vector3D {
  constructor(public x: number, public y: number, public z: number) {}

  add(vector: Vector3D): Vector3D {
    return new Vector3D(this.x + vector.x, this.y + vector.y, this.z + vector.z);
  }

  subtract(vector: Vector3D): Vector3D {
    return new Vector3D(this.x - vector.x, this.y - vector.y, this.z - vector.z);
  }

  normalize(): Vector3D {
    const magnitude = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    return new Vector3D(this.x / magnitude, this.y / magnitude, this.z / magnitude);
  }

  scale(scalar: number): Vector3D {
    return new Vector3D(this.x * scalar, this.y * scalar, this.z * scalar);
  }
}

export enum ProjectionType {
  Perspective,
  Orthographic,
}

export enum StandardView {
  Front,
  Back,
  Left,
  Right,
  Top,
  Bottom,
}

export function deg2rad(angle: number): number {
  return (angle * Math.PI) / 180;
}

export function convertToCartesian(azimuth: number, elevation: number, distance: number): Coordinate {
  // Convert azimuth and elevation to radians.
  const azimuthRad = deg2rad(azimuth);
  const elevationRad = deg2rad(elevation);

  // Calculate the x, y, and z coordinates using spherical coordinates formula.
  const x = distance * Math.cos(elevationRad) * Math.sin(azimuthRad);
  const z = distance * Math.cos(elevationRad) * Math.cos(azimuthRad);
  const y = distance * Math.sin(elevationRad);

  return { x, y, z };
}

export function computeVectorDirectionAB(A: Vector3D, B: Vector3D): Vector3D {
  let direction: Vector3D = B.subtract(A);
  direction = direction.normalize();
  return direction;
}

export function computeDefaultCameraPosition(
  phiFov: number,
  objectRadius: number,
  objectCenter: Coordinate,
  azimuth: number,
  elevation: number,
  zoomScalar: number
): {
  position: Coordinate;
  l: number;
} {
  // Calculate distance from camera to center of bounding sphere (including scaling).
  const r = objectRadius;
  const height = computeVisibleHeightFromAngleAndRadius(phiFov, r);
  const l = calculateDistanceFromAngleAndHeight(phiFov, height) * zoomScalar;

  // Get coords for camera, offset from box center.
  const coords = convertToCartesian(azimuth, elevation, l);

  const x = coords.x + objectCenter.x;
  const y = coords.y + objectCenter.y;
  const z = coords.z + objectCenter.z;

  const position = { x, y, z };

  return { position, l };
}

export function computeDefaultPerspectiveCameraViewingVolume(
  objectRadius: number,
  cameraDistanceFromTarget: number
): {
  near: number;
  far: number;
} {
  const r = objectRadius;
  const l = cameraDistanceFromTarget; // From camera to center of bounding sphere.

  // Handle frustum calcs.
  const far = (l + r) * X_FAR_SCALAR; // Distance to back of scene, scaled.
  const near = Math.min((l - r) * X_NEAR_SCALAR, X_NEAR_DEFAULT);

  return { near, far };
}

export function computeDefaultOrthographicCameraViewingVolume(
  objectRadius: number,
  aspect: number,
  zoomScalar: number,
  xGridSize: number
): {
  left: number;
  right: number;
  top: number;
  bottom: number;
  near: number;
  far: number;
} {
  // Compute first component.
  const r = objectRadius;

  const left = -1 * zoomScalar * aspect * r;
  const right = zoomScalar * aspect * r;
  const top = zoomScalar * r;
  const bottom = -1 * zoomScalar * r;

  // For near/far, we need to accommodate the grid. xGridSize is the size of
  // the grid as fed to Three.js' GridHelper.
  const xGridHalfSize = xGridSize / 2; // We're going back from center, so only need half.

  const near = -1 * xGridHalfSize;
  const far = xGridHalfSize * X_FAR_SCALAR;

  return { left, right, top, bottom, near, far };
}

export function computeStandardViewCameraPosition(view: StandardView, distance: number) {
  let cameraPosition: Coordinate;

  switch (view) {
    case StandardView.Front:
      // From positive z-axis towards origin.
      cameraPosition = { x: 0, y: 0, z: distance };
      break;
    case StandardView.Back:
      // From negative z-axis towards origin.
      cameraPosition = { x: 0, y: 0, z: -1 * distance };
      break;
    case StandardView.Left:
      // From negative x-axis towards origin.
      cameraPosition = { x: -1 * distance, y: 0, z: 0 };
      break;
    case StandardView.Right:
      // From positive x-axis towards origin.
      cameraPosition = { x: distance, y: 0, z: 0 };
      break;
    case StandardView.Top:
      // From positive y-axis towards origin.
      cameraPosition = { x: 0, y: distance, z: 0 };
      break;
    case StandardView.Bottom:
      // From negative y-axis towards origin.
      cameraPosition = { x: 0, y: -1 * distance, z: 0 };
      break;
    default:
      throw new Error(`Invalid view: ${view}`);
  }
  return cameraPosition;
}

export function computeVisibleHeightFromAngleAndRadius(phiFov: number, radius: number): number {
  // Calculate visible height of the object.
  const thetaFov = phiFov / 2;
  const thetaRad = deg2rad(thetaFov);

  const visibleHalfHeight = radius / Math.cos(thetaRad);
  const visibleHeight = 2 * visibleHalfHeight;

  return visibleHeight;
}

export function calculateDistanceFromAngleAndHeight(phiFov: number, visibleHeight: number): number {
  // Calculate distance from camera to center of a bounding sphere.
  // Note that visible height will be larger than sphere diameter, as produced
  // by computeVisibleHeightFromAngleAndRadius, and phi is full
  // included vertical FOV angle.
  //
  // |----visible height-----|
  //             |-----h-----|
  //  \          |          /
  //   \         |         /
  //    \        |        /
  //     \    l  |       /
  //      \      |      /
  //       \     |     /
  //        \    |    /
  //         \   | θ /
  //          \  |  /
  //           \ | /
  //            \|/
  //           camera
  //
  const thetaFov = phiFov / 2;
  const thetaRad = deg2rad(thetaFov);

  const h = visibleHeight / 2;
  const l = h / Math.tan(thetaRad);

  return l;
}

export function calculateHeightFromAngleAndDistance(phiFov: number, distance: number): number {
  // Effectively reversing calculateDistanceFromAngleAndHeight to yield
  // visible height from FOV angle and distance from camera to target.
  const thetaFov = phiFov / 2;
  const thetaRad = deg2rad(thetaFov);

  const visibleHalfHeight = distance * Math.tan(thetaRad);
  const visibleHeight = 2 * visibleHalfHeight;

  return visibleHeight;
}
```

### `threeHelper.js`

The file contains some helper functions that we used to set up the scene. Some function definitions that don't relate to
the topics above have been removed.

```javascript
import * as constants from "@/cad_viewer/constants.ts";
import * as Geometry from "@/cad_viewer/3DGeometry";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { ViewHelper } from "three/addons/helpers/ViewHelper.js";

function createRenderer() {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.autoClear = false;

  return renderer;
}

function createOrbitControls(camera, rendererElement, enabled) {
  const controls = new OrbitControls(camera, rendererElement);

  controls.enableDamping = true;
  controls.dampingFactor = constants.CONTROL_DAMPING_FACTOR;
  controls.screenSpacePanning = true;
  controls.enabled = enabled;

  return controls;
}

function createGridHelper(boundingSphereRadius) {
  const gridHelper = new THREE.GridHelper(
    boundingSphereRadius * constants.GRID_SIZE_SCALAR,
    constants.GRID_DIVISIONS,
    constants.WIREFRAME_ACCENT_COLOR,
    constants.WIREFRAME_COLOR
  );

  return gridHelper;
}

function createViewHelper(camera, rendererElement, controls) {
  const viewHelper = new ViewHelper(camera, rendererElement);
  viewHelper.controls = controls;
  viewHelper.controls.center = controls.target;

  return viewHelper;
}

function computeSceneBounds(mesh) {
  const boundingBox = new THREE.Box3().setFromObject(mesh);
  const boundingSphere = boundingBox.getBoundingSphere(new THREE.Sphere());

  return {
    box: boundingBox,
    sphere: boundingSphere,
  };
}

export default {
  createRenderer,
  createOrbitControls,
  createGridHelper,
  createViewHelper,
  computeSceneBounds,
};
```

### `ThreeViewer.vue`

This is a trimmed down version of our Vue view. I've chopped out the template section and the style section, as well as
some functionality that doesn't relate to the topics above.

```javascript
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { FileExtension } from "@/constants";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { toRef, watch, ref } from "vue";
import { useApiClient } from "@/composables/useApiClient.ts";
import { useDataFetcher } from "@/composables/useDataFetcher.ts";
import { useDisplay } from "vuetify";
import { useLoadingFlag } from "@/composables/useLoadingFlag.ts";
import { useToastMessages } from "@/composables/useToastMessages.ts";
import * as constants from "@/cad_viewer/constants.ts";
import * as Geometry from "@/cad_viewer/3DGeometry.ts";
import * as THREE from "three";
import FullScreenContainer from "@/components/layouts/FullScreenContainer.vue";
import threeHelper from "@/cad_viewer/threeHelper.js";

const StandardView = Geometry.StandardView;

const ProjectionType = {
    Perspective: "Perspective",
    Orthographic: "Orthographic",
};

export default {
    name: "ThreeViewer",
    components: { FullScreenContainer },

    props: {
        fileId: { type: String, required: true },
    },

    setup(props) {
        const fileId = toRef(props, "fileId");
        const viewerContainer = ref();
        const apiClient = useApiClient();
        const { showErrorToast } = useToastMessages();
        const { loading } = useLoadingFlag(true);
        const { data: metadata, fetchData: fetchMetadata } = useDataFetcher(() =>
            apiClient.getUploadMetadata(fileId.value)
        );
        const { height: windowHeight, width: windowWidth } = useDisplay();
        watch(fileId, fetchMetadata);
        return {
            apiClient,
            showErrorToast,
            controller,
            loading,
            metadata,
            windowHeight,
            windowWidth,
            viewerContainer,
        };
    },

    data() {
        return {
            isDragging: false,
            showRevertViewButton: true,
            geometryLoading: true,
            viewControlsCollapsed: 1,
            StandardView,
            ProjectionType,
            currentProjection: null,
        };
    },

    watch: {
        geometryLoading() {
            if (!this.geometryLoading) {
                this.loadSprites();
            }
        },
    },

    mounted() {
        // ThreeJS variables don't need be reactive.
        this.scene = null;
        this.renderer = null;
        this.meshGroup = null;
        this.viewHelper = null;

        this.perspectiveCamera = null;
        this.orthoCamera = null;
        this.camera = null;

        this.perspectiveControls = null;
        this.orthoControls = null;
        this.controls = null;

        this.boundingSphere = null;

        this.defaultCameraPosition = null;
        this.defaultCameraDistanceFromTarget = null;
        this.defaultCameraParams = null;
        this.defaultOrthoCameraZoom = null;

        this.init();
    },

    methods: {
        async init() {
            // Create scene.
            this.scene = new THREE.Scene();

            // Load file.
            await this.loadFile();

            // Create renderer.
            this.renderer = threeHelper.createRenderer();
            this.viewerContainer.appendChild(this.renderer.domElement);

            // Create cameras.
            this.perspectiveCamera = new THREE.PerspectiveCamera();
            this.orthoCamera = new THREE.OrthographicCamera();

            // Create controls.
            this.perspectiveControls = threeHelper.createOrbitControls(
                this.perspectiveCamera,
                this.renderer.domElement,
                true
            );
            this.orthoControls = threeHelper.createOrbitControls(
                this.orthoCamera,
                this.renderer.domElement,
                false
            );

            // Set active camera and controls.
            this.camera = this.perspectiveCamera;
            this.controls = this.perspectiveControls;
            this.currentProjection = ProjectionType.Perspective;

            // Get bounding box info.
            const bounds = threeHelper.computeSceneBounds(this.meshGroup);
            this.boundingSphere = bounds.sphere;

            // Get default camera position; applies to both ortho and perspective.
            const defaultCameraPositionParams = Geometry.computeDefaultCameraPosition(
                constants.PHI_FOV,
                this.boundingSphere.radius,
                this.boundingSphere.center,
                constants.HOME_AZIMUTH,
                constants.HOME_ELEVATION,
                constants.ZOOM_SCALAR
            );

            this.defaultCameraPosition = defaultCameraPositionParams.position;
            this.defaultCameraDistanceFromTarget = defaultCameraPositionParams.l;

            // Set camera positions.
            this.setDefaultCameraPosition(this.perspectiveCamera, this.perspectiveControls);
            this.setDefaultCameraPosition(this.orthoCamera, this.orthoControls);

            // Configure cameras.
            this.setDefaultPerspectiveCameraViewingVolume();
            this.setDefaultOrthoCameraViewingVolume();
            this.setDefaultOrthoCameraZoom();

            // Create grid.
            const gridHelper = threeHelper.createGridHelper(this.boundingSphere.radius);
            this.scene.add(gridHelper);

            // Create axes helper.
            const axesHelper = new THREE.AxesHelper(this.boundingSphere.radius * 0.5);
            this.scene.add(axesHelper);

            // Create view helpers.
            this.perspectiveViewHelper = threeHelper.createViewHelper(
                this.perspectiveCamera,
                this.renderer.domElement,
                this.perspectiveControls
            );

            this.orthoViewHelper = threeHelper.createViewHelper(
                this.orthoCamera,
                this.renderer.domElement,
                this.orthoControls
            );

            this.viewHelper = this.perspectiveViewHelper;

            this.loading = false;
            this.animate();
        },

        async loadFile() {
            this.geometryLoading = true;

            // If we're in dev mode, load the local shock file.
            let assetURL;
            let isGltf;
            if (DEV_MODE) {
                assetURL = DEV_FILE_PATH;
                isGltf = true;
            } else {
                assetURL = this.apiClient.helpers.buildDownloadUrl(this.fileId, true, true);
                const response = await this.apiClient.getUploadMetadata(this.fileId);
                isGltf = response.data.extension !== FileExtension.STL;
            }

            const loader = isGltf ? new GLTFLoader() : new STLLoader();
            if (isGltf) {
                const dracoLoader = new DRACOLoader();
                dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
                loader.setDRACOLoader(dracoLoader);
            }

            return new Promise((resolve, reject) => {
                loader.load(
                    assetURL,
                    (geometry) => {
                        if (isGltf) {
                            const replaceMaterial = (mesh) => {
                                if (mesh.children?.length) {
                                    mesh.children.forEach(replaceMaterial);
                                } else if (mesh.material instanceof THREE.MeshStandardMaterial) {
                                    const newMaterial = new THREE.MeshPhongMaterial();
                                    THREE.MeshStandardMaterial.prototype.copy.call(
                                        newMaterial,
                                        mesh.material
                                    );
                                    mesh.material = newMaterial;
                                }
                            };
                            replaceMaterial(geometry.scene);
                            this.meshGroup = geometry.scene;
                        } else {
                            const material = new THREE.MeshPhongMaterial({
                                color: constants.DEFAULT_COLOR,
                                wireframe: false,
                                side: THREE.DoubleSide,
                            });

                            const wireframeMaterial = new THREE.MeshBasicMaterial({
                                color: constants.WIREFRAME_COLOR,
                                wireframe: true,
                                transparent: true,
                                opacity: constants.WIREFRAME_OPACITY,
                                side: THREE.DoubleSide,
                            });

                            const mesh = new THREE.Mesh(geometry, material);
                            const wireframe = new THREE.Mesh(geometry, wireframeMaterial);

                            this.meshGroup = new THREE.Group();
                            this.meshGroup.add(mesh);
                            this.meshGroup.add(wireframe);
                        }

                        this.scene.add(this.meshGroup);

                        this.geometryLoading = false;
                        this.loading = false;
                        resolve();
                    },
                    () => {
                        // XHR reports infinity?
                    },
                    (error) => {
                        this.showErrorToast(this.$t("annotation.loadFail"));
                        reject(error);
                    }
                );
            });
        },

        animate() {
            if (this.loading === false) {
                requestAnimationFrame(this.animate);
                this.controls.update();

                if (this.viewerContainer) {
                    const { clientWidth, clientHeight } = this.viewerContainer;
                    const canvas = this.renderer.domElement;
                    if (canvas.width !== clientWidth || canvas.height !== clientHeight) {
                        this.camera.aspect = clientWidth / clientHeight;
                        this.camera.updateProjectionMatrix();
                        this.renderer.setSize(clientWidth, clientHeight);
                    }
                }

                this.renderer.clear();
                this.renderer.render(this.scene, this.camera);
                this.viewHelper.render(this.renderer);
            }
        },

        render() {
            this.renderer.render(this.scene, this.camera);
            this.updateNumberSpriteOpacity();
        },

        revertCameraPosition() {
            if (this.currentProjection === ProjectionType.Orthographic) {
                this.setDefaultOrthoCameraViewingVolume();
                this.orthoCamera.zoom = this.defaultOrthoCameraZoom;
            }

            this.setDefaultCameraPosition(this.camera, this.controls);
        },

        setDefaultCameraPosition(camera, controls) {
            camera.position.set(
                this.defaultCameraPosition.x,
                this.defaultCameraPosition.y,
                this.defaultCameraPosition.z
            );

            controls.target.set(constants.ORIGIN.x, constants.ORIGIN.y, constants.ORIGIN.z);
            controls.update();
            camera.updateProjectionMatrix();
        },

        setDefaultPerspectiveCameraViewingVolume() {
            const params = Geometry.computeDefaultPerspectiveCameraViewingVolume(
                this.boundingSphere.radius,
                this.defaultCameraDistanceFromTarget
            );

            const { clientWidth, clientHeight } = this.viewerContainer;
            const aspect = clientWidth / clientHeight;

            this.perspectiveCamera.fov = constants.PHI_FOV;
            this.perspectiveCamera.aspect = aspect;
            this.perspectiveCamera.near = params.near;
            this.perspectiveCamera.far = params.far;
        },

        setDefaultOrthoCameraViewingVolume() {
            const { clientWidth, clientHeight } = this.viewerContainer;
            const aspect = clientWidth / clientHeight;

            const defaultParams = Geometry.computeDefaultOrthographicCameraViewingVolume(
                this.boundingSphere.radius,
                aspect,
                constants.ZOOM_SCALAR,
                this.boundingSphere.radius * constants.GRID_SIZE_SCALAR
            );

            // Compute orthographic frustum.
            this.orthoCamera.left = defaultParams.left;
            this.orthoCamera.right = defaultParams.right;
            this.orthoCamera.top = defaultParams.top;
            this.orthoCamera.bottom = defaultParams.bottom;
            this.orthoCamera.near = defaultParams.near;
            this.orthoCamera.far = defaultParams.far;

            this.orthoCamera.updateProjectionMatrix();
        },

        setDefaultOrthoCameraZoom() {
            // Calculate the visible height at the PerspectiveCamera's position.
            const currentControlTarget = this.controls.target.clone();
            let distance = this.perspectiveCamera.position.distanceTo(currentControlTarget);
            let visibleHeightAtDistance = Geometry.calculateHeightFromAngleAndDistance(
                constants.PHI_FOV,
                distance
            );

            // Calculate zoom required.
            let initialHeight = this.orthoCamera.top - this.orthoCamera.bottom;
            let zoom = initialHeight / visibleHeightAtDistance;

            this.defaultOrthoCameraZoom = zoom;
        },

        toggleProjection(targetProjection) {
            if (this.currentProjection === targetProjection) {
                return;
            }

            const currentControlTarget = this.controls.target.clone();

            if (targetProjection === ProjectionType.Perspective) {
                this.convertOrthoCameraToPerspectiveCamera();
            } else if (targetProjection === ProjectionType.Orthographic) {
                this.convertPerspectiveCameraToOrthoCamera();
            } else {
                throw new Error(`Invalid targetProjection: ${targetProjection}`);
            }

            // Set new control target to match previous.
            this.controls.target.set(
                currentControlTarget.x,
                currentControlTarget.y,
                currentControlTarget.z
            );

            // Update the aspect ratio and projection matrix of the new active camera.
            const { clientWidth, clientHeight } = this.viewerContainer;
            const aspect = clientWidth / clientHeight;
            this.camera.aspect = aspect;
            this.camera.updateProjectionMatrix();
        },

        convertOrthoCameraToPerspectiveCamera() {
            // Get current position.
            const currentCameraPosition = this.orthoCamera.position.clone();
            const currentControlTarget = this.orthoControls.target.clone();

            // Convert ortho camera config to equivalent perspective camera config.
            let top = this.orthoCamera.top;
            let bottom = this.orthoCamera.bottom;
            let zoom = this.orthoCamera.zoom;

            // Calculate the visible height at the OrthographicCamera's zoom level.
            const initialHeight = top - bottom;
            const visibleHeightAtZoom = initialHeight / zoom;

            // Calculate the distance the PerspectiveCamera should be from the target.
            let distance = Geometry.calculateDistanceFromAngleAndHeight(
                constants.PHI_FOV,
                visibleHeightAtZoom
            );

            // Calculate the direction from the active target to the PerspectiveCamera.
            let currentOrthoCameraPosition = new Geometry.Vector3D(
                currentCameraPosition.x,
                currentCameraPosition.y,
                currentCameraPosition.z
            );

            let targetPosition = new Geometry.Vector3D(
                currentControlTarget.x,
                currentControlTarget.y,
                currentControlTarget.z
            );

            // Direction from camera to target.
            const direction = Geometry.computeVectorDirectionAB(
                targetPosition,
                currentOrthoCameraPosition
            );

            const newPosition = targetPosition.add(direction.scale(distance));

            // Update and flip active.
            this.perspectiveCamera.position.set(newPosition.x, newPosition.y, newPosition.z);
            this.perspectiveControls.target.set(
                currentControlTarget.x,
                currentControlTarget.y,
                currentControlTarget.z
            );

            this.camera = this.perspectiveCamera;
            this.controls = this.perspectiveControls;
            this.viewHelper = this.perspectiveViewHelper;
            this.orthoControls.enabled = false;
            this.perspectiveControls.enabled = true;
            this.currentProjection = ProjectionType.Perspective;
        },

        convertPerspectiveCameraToOrthoCamera() {
            // Get current position.
            const currentCameraPosition = this.perspectiveCamera.position.clone();
            const currentControlTarget = this.perspectiveControls.target.clone();

            // Calculate the visible height at the PerspectiveCamera's position.
            let distance = this.perspectiveCamera.position.distanceTo(currentControlTarget);
            let visibleHeightAtDistance = Geometry.calculateHeightFromAngleAndDistance(
                constants.PHI_FOV,
                distance
            );

            // Calculate zoom required.
            let initialHeight = this.orthoCamera.top - this.orthoCamera.bottom;
            let zoom = initialHeight / visibleHeightAtDistance;

            // Set the zoom value.
            this.orthoCamera.zoom = zoom;

            // Set the OrthoCamera's new position.
            this.orthoCamera.position.set(
                currentCameraPosition.x,
                currentCameraPosition.y,
                currentCameraPosition.z
            );

            // Flip active.
            this.camera = this.orthoCamera;
            this.controls = this.orthoControls;
            this.viewHelper = this.orthoViewHelper;
            this.orthoControls.enabled = true;
            this.perspectiveControls.enabled = false;
            this.currentProjection = ProjectionType.Orthographic;
        },

        setCubePosition(view) {
            let cameraPosition = Geometry.computeStandardViewCameraPosition(
                view,
                this.defaultCameraDistanceFromTarget * constants.ZOOM_SCALAR
            );

            this.camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
            this.controls.target.set(constants.ORIGIN.x, constants.ORIGIN.y, constants.ORIGIN.z);
        },
};
```
