---
title: Building a palatable 3D viewer
description: Engineering review procedures and using Three.js to visualise 3D CAD data.
date: 2023-12-19
draft: false
images: [/images/blog/02/lobbying.png]
tags: [software, development, 3D, CAD, Three.js]
---

## Motivation: design reviews _suck_

The need to tackle this came from wanting to visualise 3D CAD data in a web browser, all as part of
[Anneal](https://www.getanneal.com)&rsquo;s design review tooling.

The general background is that engineering teams typically do—and are in many cases obligated to—perform some variety of
stage-gated review process for new designs and design modifications. At one end, you might a have high-level concept
review, and at the other, a detailed drawing review. The first allows the team to opine on design philosophy and
direction, and the last serves to get more sets of eyes on things like
[GD&T](https://en.wikipedia.org/wiki/Geometric_dimensioning_and_tolerancing) on fully fleshed-out, detailed designs.

<hr/>
<details open>
 <summary><i>If you don't care about engineering procedure, you can skip this bit...</i></summary>
 <hr/>

To illustrate, that process might look something like this:

{{< figure src="/images/blog/03/DesignReview.drawio.png" title="Simplfied review procedure flowchart." class="rounded margin">}}

So the flowchart looks fine; no issues there. Unfortunately, the actual, practical processes followed by engineering
teams are often archaic, unwieldy, untraceable, and error-prone. Ignoring the drawing component, which—where it
remains—is obviously 2D, the process of reviewing 3D designs tends to take one of the following forms:

### Option A: The meeting room

This involves getting some people in the same room, preferably in front of a projector screen, such that a designer can
twirl a model around in front them. While this happens, the assembled group try to make sense of what they're looking
at, and may occasionally chirp up with their thoughts on the design. If you're lucky, the designer will have prepared
some slides, and if you're even luckier, somebody will be taking minutes.

#### Pros

- Quick and easy to arrange—just go and sit in a room and talk it out.
- No need to worry about file formats, or how to get the data into the room... unless you don't have a laptop.
- Interactive, and allows for a degree of back-and-forth that can be hard to replicate with remote/asynchronous
  processes.

#### Cons

- Still some vulnerability to temperamental equipment; we've all been in meetings held up by uncooperative projectors.
- No real record of the meeting, and no way to trace the evolution of the design—unless your team is hot on keeping good
  meeting minutes. _(They aren't; they're too busy.)_
- Requires everyone to be in the office, and many teams have not yet returned to the office full-time.
- No real context for recording contributions; how do you verbally describe a particular feature or point in
  three-dimensional space where you see an issue or an opportunity?
- No way to share the detailed commentary with people who aren't in the room, or who can't make the meeting.
- Incredibly easy to get sidetracked.
- More reserved participants may not feel comfortable speaking up in a group setting, and may not be able to articulate
  their thoughts in the moment.
- Less reserved participants may dominate the conversation, and may speak up before they've really considered what
  they're looking at.
- Potential for _groupthink_ to set in, and for the team to miss something important.

For small, agile teams where traceability isn't a big concern, I think this actually makes the most sense. If you're
working on simple components in a domain you all understand and you can trust your colleagues to be competent and
diligent, then this can work just fine.

However, if your team is remote, big, working on anything complex, working on anything regulated or important, or even
just wants to be able to look back on the evolution of a design, then this is already a poor choice.

### Option B: PowerPoint e-mail ping-pong

This involves a designer taking screenshots of their CAD system and pasting them into a PowerPoint presentation—or maybe
a Google Doc, if you're lucky.

By collating some salient views of the design, perhaps annotating them, and then sending them around to the team, the
designer can get try and elicit some feedback from their team.

#### Pros

- You don't have to leave your desk, and providing you can operate PowerPoint, don't even need to learn any new
  software.
- Going asynchronous forces the designer to think about what they're sending out, and to try and anticipate questions
  and concerns. The PowerPoint becomes a guided introduction to the design.
- Caters to the needs of remote teams.

#### Cons

- The design is not shared in 3D, limiting comprehension and depth of understanding, and preventing interaction and
  exploration.
- Visibility is restricted to only the views and features the designer has thought pertinent.
- Feedback requires circulating the document via e-mail and waiting for responses.
  - If this process involves four or five people, especially for truly single-player PowerPoint workflows, the designer
    must wait for all of these responses, then piece together the feedback from several e-mails and individual documents
    into a some collated, actionable list.
  - Unbeknownst to one another, contributors may cover the same ground in parallel, suggesting similar or identical
    changes to the design without the opportunity to actually discuss those changes in context.
  - For the designer, the admin penalty from all this is high, and the process is slow and _painful_.
- Version control is a nightmare. Which version of the design was this feedback for? Which version of the PowerPoint was
  the feedback for that model version _in_? Which one's the latest? Which one's the one we're working on now?
- Traceability _sucks_. Reviewing the design's evolution, even months later, involves piecing together the narrative
  from scattered, asynchronous e-mail conversations.
  - Teams may get around this by dragging the e-mails into a folder, but then they must remember to do that, and
    remember to keep doing it, and it's still painful to trawl through at any point down the line.

### Option C: _"My PLM system has a 3D viewer!"_

You might thing the solution to this lies in the fact that SOLIDWORKS Manage or 3DEXPERIENCE claim to have 3D viewers
that even allow markup. Unfortunately, having been demoed a few of these, I can say that all that I've seen so far have
been incredibly disappointing.

Packaging up a Snipping Tool knock-off and putting a button for it in your toolbar is not providing a 3D review process.
It's just the PowerPoint screenshot ping-pong review process that happens to be accessed from your PLM.

This should be short and sweet:

#### Pros

- It's sort of convenient, I guess?

#### Cons

- See [Option B](#option-b-powerpoint-e-mail-ping-pong).

<hr/>

_For what it's worth, I do think it's pretty unforgivable that the CAx oligopoly has been so slow to provide good
functionality here. Onshape seem to be on top of it, and I don't have much exposure to the Siemens stack, but if you own
everything from geometry constraint system kernel through to the PLM, then you should be able to do better than this._

<hr/>

### Option D: Something different

This is where we come in—and there are also a couple of other start-ups playing in the space, so hopefully you'll start
to see more of the 'something different' approach in the near future.

In our case, we wanted a tool that:

1. Provides centralised, asynchronous, remote review functionality.
2. Allows for the design to be reviewed in 3D, with the ability to explore and interact with the model.
3. Includes a mechanism for recording feedback in context, and for immediately making that feedback visible to the
   designer and any other interested parties.
4. Provides clear traceability of the design's evolution, and of the feedback provided at each stage.
5. Doesn't require the installation of any additional software.

Practically, this means we needed to be able to:

- Run in a web browser.
- Ingest CAD data at discrete points in the design process.
- Process that CAD data such that it can be rendered.
- Allow users to view and interact with the rendered model.
- Allow users to toggle between a perspective and orthographic/parallel projection; see
  [cameras and projections](#cameras-and-projections).
- Allow users to annotate the model, providing contextualised feedback.

</details>
<hr/>

## Enter Three.js

[Anneal](https://www.getanneal.com) is a web-based platform, so we're already running in a browser. We can also already
ingest user uploads, with these being encrypted and stored in a customer-specific object store.

That really just left processing, display, and annotation. To address these, we built:

- A server-side processing pipeline that can process STEP and STEP assembly data into a more readily renderable format.
- A Three.js based viewer.
- Our own annotation functionality on top of that.

Our processing pipeline and annotation functionality are out of scope here, so let's stick to the Three.js viewer, and
how you can coax some nice behaviour out of it.

There are plenty of guides to using Three.js out there, so I'm going to work on the assumption that you've got some
stuff ready to render and you've put together a basic scene. If you haven't, then I'd recommend starting with the
[docs](https://threejs.org/docs/#manual/en/introduction/Creating-a-scene).

## A primer on 3D graphics

Once you've got some data that's capable of being rendered, you need to think more about how you want to present it to
the user. This is where some basic 3D graphics concepts and high school trigonometry come in handy.

### Cameras and projections

In 3D graphics, the camera is the point from which the scene is viewed; it determines what the viewer sees and how they
see it—effectively dictating how the 3D scene is projected onto a 2D screen.

There are two camera types that are commonly used in this context:
[perspective](<https://en.wikipedia.org/wiki/Perspective_(graphical)>) and
[orthographic](https://en.wikipedia.org/wiki/Orthographic_projection).

Perspective projection is designed to mimic the way in which the human eye perceives the world. In this projection,
objects appear smaller as they move further away from the viewer, creating a depth effect that helps create a sense of
scale within the scene. Perspective projection is the default choice for anything you would wish to present to the user
with realistic proportions: video games, public-facing product renders, special effects, etc.

{{< figure src="/images/blog/03/Perspective.jpg" title="Father Ted Crilly explains perspective to Father Dougal McGuire" credit="Credit: Hat Trick Productions / Channel 4" class="rounded margin">}}

In contrast, orthographic projection ignores the effects of perspective. Objects in orthographic projection retain their
size and shape regardless of their distance from the viewer. This means there's no foreshortening, and parallel lines in
the scene remain parallel in the rendered image.

Orthographic projection is particularly useful in technical and engineering applications, where accurate and undistorted
measurements tend to be important. It's widely employed in CAD programs, which is probably the only place you'd ever
really see it in use—though many will have also seen isometric illustrations, which are a form of orthographic
projection.

Here's a nice illustration of projection types:

{{< figure src="/images/blog/03/Comparison_of_graphical_projections.svg.png" title="Graphical projection comparison." credit="Credit: <a href=\"https://commons.wikimedia.org/wiki/User:Cmglee\">https://commons.wikimedia.org/wiki/User:Cmglee</a>" class="rounded margin">}}

Each of those you see in the axonometric projection column will be achievable in our viewer by manipulating the camera,
provided it is set to use an orthographic projection.

<hr/>

_Note:_

_Since this post is already incredibly long, I'm going to stick to the perspective camera for now, and leave the rest
for another time. Apologies to anyone who's reading this while building similar engineering-focused tools—a lot of the
work in building a slick implementation for that use-case really relates to how seamless transitions between
orthographic and perspective projections can be achieved._

<hr/>

### View frustums

The view frustum is the volume of space that is visible to the camera. In the case of a perspective camera, it's
effectively an imaginary, truncated pyramid sitting somewhere in 3D space. It is defined by:

- A set of four angled planes/panels that form a shape akin to a pyramid with its top lopped off. If you were to extend
  these planes such that their edges converged, they would form the intersecting, lateral faces of a pyramid whose apex
  sits at the camera position.
  - These are referred to as the _**left**_, _**right**_, _**top**_, and _**bottom**_ planes.
- A set of two planes, both parallel to the imaginary pyramid's base and lying perpendicular to a line struck from the
  camera through its target, that intersect with the pyramid—cutting it to leave the frustum portion.
  - These two parallel planes, referred to as the _**near**_ and _**far**_ planes, define the depth of the view frustum.

Here's a diagram I put together to illustrate this:

{{<figure
src="/images/blog/03/ViewFrustum.png"
title="View frustum."
credit="The vector along which the camera is looking is shown in red, the frustum in blue, and the remainder of the imaginary pyramid in grey."
class="rounded margin">}}

### Bounding boxes and bounding spheres

These concepts are much simpler to explain than the view frustum, and will be useful when we actually get around to
parameterising things.

In 3D, a bounding box is simply the smallest possible _axis aligned_ cuboid that can contain the given object. Axis
aligned just means that the box's edges are parallel to the coordinate axes of the scene—so you can't sneakily rotate
your boudning box cf. the axes to minimise its volume.

{{< figure src="/images/blog/03/Bounding_box.png" title="Axes aligned bounding box of a sphere." credit="Credit: <a href=\"https://commons.wikimedia.org/wiki/File:Bounding_box.png\">https://commons.wikimedia.org/wiki/User:Cobra w</a>" class="rounded margin">}}

In Three.js, a bounding box is described by two [`Vector3`](https://threejs.org/docs/#api/en/math/Vector3) objects:
`min` and `max`. As I think about it, the `min` vector describes the coordinates of the box's lower-left-front corner,
and the `max` vector describes the coordinates of the box's upper-right-back corner.

You could also imagine numbering each of the box's eight vertices, pulling together the coordinates of each, then taking
the minimum and maximum for each of your sets of x, y, and z values:

<br/>
$$
\begin{align}
x_{min} &= \min(x_1, x_2, x_3, x_4, x_5, x_6, x_7, x_8) \\
y_{min} &= \min(y_1, y_2, y_3, y_4, y_5, y_6, y_7, y_8) \\
z_{min} &= \min(z_1, z_2, z_3, z_4, z_5, z_6, z_7, z_8) \\
box_{min} &= \begin{bmatrix} x_{min} \\ y_{min} \\ z_{min} \end{bmatrix}
\end{align}
$$

<br/>
$$
\begin{align}
x_{max} &= \max(x_1, x_2, x_3, x_4, x_5, x_6, x_7, x_8) \\
y_{max} &= \max(y_1, y_2, y_3, y_4, y_5, y_6, y_7, y_8) \\
z_{max} &= \max(z_1, z_2, z_3, z_4, z_5, z_6, z_7, z_8) \\
box_{max} &= \begin{bmatrix} x_{max} \\ y_{max} \\ z_{max} \end{bmatrix}
\end{align}
$$

Similarly, a bounding sphere is simply the smallest possible sphere that can wholly enclose the target object or group
of objects. Its centre will lie at the midpoint of the bounding box's `min` to `max` diagonal, and its radius will be
half the length of that diagonal.

In our case, we derive our bounding sphere from the bounding box. As I think about it, when our bounding box is a cube,
the bounding sphere is one whose surface is coincident with each of the bounding box's eight vertices. When the bounding
box is not a cube, it is the smallest sphere that can contain the bounding box, but all eight vertices will no longer be
coincident with the its surface.

## Viewer setup

### Camera position

First up, we need to set the camera position. This is the point from which the scene is viewed, and it's defined by a
set of coordinates in 3D space. In Three.js, this is done by setting the camera's `position` property, and this takes a
[`Vector3`](https://threejs.org/docs/#api/en/math/Vector3) object.

In order to set the initial position, we need to decide where we want the camera to be—and what we want it to be able to
see.
