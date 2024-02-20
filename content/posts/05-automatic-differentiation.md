---
title: Differentiable programming in engineering
description: Design, finite differences, the allure of automatic differentiation.
date: 2024-02-19
draft: false
images: [/images/blog/04/OGImage.png]
tags: [software, business, opinion, engineering]
---

## Motivation

This post is just intended to serve as a longer form version of my thoughts on differentiable programming in
engineering. It's effectively a follow-up to a lot of back and forth on
[this Twitter thread](https://twitter.com/Andercot/status/1758216738314104872), where a whole bunch of us were
discussing differentiable programming in engineering. The folks involved were:

- Stellarator engineer, [@Andercot](https://twitter.com/Andercot),
- Zoo/KittyCAD CEO, [@jessfraz](https://twitter.com/jessfraz),
- _Firstname Bunchofnumbers_ and _design automation tinkerer_, [@Weston212872500](https://twitter.com/Weston212872500),
- Me, [@nick_mccleery](https://twitter.com/nick_mccleery).

Plus a fleeting contribution from [@afshawnl](https://twitter.com/afshawnl).

## Background

This video, [You Should Be Using Automatic Differentiation](https://www.youtube.com/watch?v=sq2gPzlrM0g), is probably
worth watching:

<iframe width="640" height="480"
src="https://www.youtube.com/embed/sq2gPzlrM0g">
</iframe>

Coincidentally, Ryan was also an advisor to [Quant Insight](https://quant-insight.com/) while I was there—and the
website would suggest he's still active in that position.

## Why you might want gradients: Part 1

Before I start into the mechanics of finite differences, analytical derivatives, and automatic differentation, it's
worth outlining at a very high level why any of this might be useful at all. Within the existing paradigm that we use to
design and develop physical systems, and without getting into the inner workings of relevant things I definitely don't
understand—like how OpenFOAM sets about solving the Navier-Stokes equations—there are three standout use cases that I
can see.

### #1: Sensitivity analysis

The most obvious use case for knowing the rate at which some parameter changes in relation to another, at least to me,
is in simple sensitivity analysis. For many systems, we're often interested in how some parameter will respond to
changes in another. You could be interested in how roadwheel camber angle responds to vertical hub displacement, how
system pressure responds to a change in temperature, or how much further a beam will deflect if asked to span a longer
distance.

For me, the thinking here is basically _"what would be the change in y for some nominal change in x?"_—effectively
$dy/dx$—and it's the sort of thing you often want to have some broad knowledge of because it provides you with
understanding and feel for the system. It doesn't really matter what these parameters are, or what the system is; it's
just useful to have a feel for how the system will respond to changes in its inputs.

Here's a very simple example that I would broadly think of as bilinear. This thing has two regimes; one where the output
is not very sensitive to change in input, and one where it is. I'd look at this and then commit to memory some
simplified notion that the system has a knee point at an input value of about $80$, and that the output is pretty
sensitive to changes in input from then on.

{{< figure src="/images/blog/05/sensitivity.png"
title="Input/output relationship for some imaginary system"
class="rounded margin">}}

Why you might want to have this knowledge of and feel for a system feeds into the next point.

### #2: Optimisation

#### Why optimisation?

Many engineering challenges are effectively optimisation problems. You might want to calibrate your engine to make as
much power as possible without it disintegrating, to design a bridge that uses as little material as possible without
collapsing, or to pick the right combination of setup options to help your car navigate a circuit as quickly as
possible.

In all of these cases, you basically have some objective function that you want to maximise or minimise subject to a set
of constraints. The objective function might be incredibly complex because you have to consider a whole list of
competing factors. For example, maybe your engine could make more power if you could change the exhaust design, but then
you might not be able to package the engine in the full lineup it's expected to serve—and you want to maintain as many
common parts across the range as possible, so this is undesirable.

There's a lot of this trade-off style decision making that goes into engineering, and this often involves several
people, each with different specialities and who each have some feel for the sensitivities of their own particular part
of the system. This means the optimisation happens somewhat organically—with conversations and meetings and
presentations that eventually yield what's thought to the best overall compromise for whatever the particular target
was.

However, there are some cases where you can do this with a computer. You can write a program that will explore the
design space and find the best solution. For example, you might want to determine the wing profile that will give you
the minimum amount of drag while your aircraft is in cruise, while still generating enough lift for take-off under hot
and high conditions.

In this scenario, you want an optimisation routine that can modify the wing profile, compute the relevant lift and drag
forces under the specified conditions, verify that all constraints are met, and then move on to the next iteration—all
the time homing in on the best solution.

#### What does that have to do with gradients?

I have certainly done things like this without having really explicitly calculated any gradients at all. I've built
tools that use [`fminsearch`](https://uk.mathworks.com/help/matlab/ref/fminsearch.html#bvadxhn-13) to hunt down the best
compromise solution to some problem by repeatedly calling on some 1D and 2D simulations, bottomed out long running
measurement issues by tasking
[Excel's Solver add-in](https://support.microsoft.com/en-gb/office/define-and-solve-a-problem-by-using-solver-5d1a388f-079d-43ac-a7eb-f63e45925040)
to find the best fit correction factor for some data, and I've built things that use
[Brent's method](https://en.wikipedia.org/wiki/Brent%27s_method) across a few programming languages.

{{< figure src="/images/blog/05/NelderMead.gif"
title="Nelder-Mead (fminsearch) finding the minimum of Himmelblau's function"
credit="Credit: <a href=\"https://commons.wikimedia.org/wiki/User:Nicoguaro\">https://commons.wikimedia.org/wiki/User:Nicoguaro</a>" class="rounded margin">}}

However, in some of these cases, and particuarly where Brent's method is effectively using the
[secant method](https://en.wikipedia.org/wiki/Secant_method), we are basically doing a
[finite difference](https://en.wikipedia.org/wiki/Secant_method) version of
[Newton's method](https://en.wikipedia.org/wiki/Newton%27s_method), ultimately evaluating our objective function at _at
least_ two points, and then using our two output values and our step size to inform our next guess.

At some point, what we are actually doing here is numerically estimating the gradient of our objective function with
respect to our design variables. So gradients are actually pretty fundamental to a lot of the optimisation that we do,
and this invites some questioning about whether we could do better... which I'll come back to shortly.

### #3: Control systems

The other use case that jumps out at me is control systems. I'm acutely aware that I'll get out of my depth here
quickly, so this should be short and sweet.

Control is about governing the behaviour of dynamic systems such that they do what their designer intended in a
regulated, stable, performant manner. That could mean designing a system that controls the amount of torque delivered to
the rear wheels of a car in order to help drivers reduce time lost to wheel spin. Or, it could mean designing a system
that selectively adjusts engine firing, thruster firing, and control surface position in order to help a rocket reverse
itself onto a barge.

To achieve this, you need to know how your system will respond to changes in its inputs, and often the control strategy
does too. The more direct use-cases I can think of are:

- Stability analysis.
  - Assessing how system stability changes with changes in parameters—particularly so you can suss out stability margin
    sensitivity to changes in parameters, so you can ensure the system won't become unstable at some corner of its
    operating envelope.
- Parameter tuning.
  - Adjusting control system parameters to achieve desired system behaviour, often involving a gradient-based
    optimisation routine. Gradient based approached are particularly attractive when you have a complex set of metrics
    to deal with, as these can help you find optimal settings quickly.
- Model predictive control and model reference adaptive control.
  - MPC uses gradients to optimise control inputs over some specified future horizon based on a system model, aiming to
    minimise a cost function that often includes terms for error, control effort, and constraints.
  - MRAC adjusts the controller parameters in real-time to match the behavior of the system to a reference model.
    Gradients in this context are used to update controller parameters to minimise the difference between the actual
    system behavior and the reference model.

## Why you might want gradients: Part 2

Here I want to zoom in on the design optimisation piece. This is the area where I think the potential for differentiable
programming is most obvious, and where I think it could have the most impact.

The panacea of design optimisation here is probably something like a flexible, paramaterised CAD model that's closely
coupled with a relevant set of simulation tools—CFD, FEA, MBS, etc.—and an optimisation routine that can explore the
design space to find the best overall solution _in an acceptably short period of time_.

The process for this would ultimately be an iterative one, where you’d start with some initial design, run some
simulations, evaluate the results, and then use the results to inform the next iteration of the design—repeating this
process until you arrive at some global optimum that forms your final design.

### I-beam example

To give an offensively simplified example of the broad process we would want to see here, let's pretend we have a
parametric model of a simply supported, symmetrical I-beam that's going to carry a central point load. We have the
freedom to adjust two of its parameters: overall external depth and overall breadth. Our goal is purely to minimise
deflection, and we have the following constraints on our design variables:

- The depth must be between 100mm and 200mm.
- The breadth must be between 50mm and 100mm.

#### Setup

Here's the section we're talking about with our free variables highlighted:

{{< figure src="/images/blog/05/BeamSection.png" title="Beam section">}}

Now, for anyone who's got the $bd^3/12$ formula etched into their brain, you can see where we're going to end up
here—but let's pretend we don't know the answer already.

This is the scenario we're talking about:

{{< figure src="/images/blog/05/BeamSetup.png"
title="Simply supported beam with central point load scenario"
credit="Credit: <a href=\"https://commons.wikimedia.org/w/index.php?title=User:Hermanoere&action=edit&redlink=1\">https://commons.wikimedia.org/wiki/File:Simple_beam_with_center_load.svg</a>" class="rounded margin">}}

And our equation for deflection at the centre of the beam is: $$ \delta = \frac{F L^3}{48 E I} $$

Where:

- $\delta$ is the deflection at the centre of the beam,
- $F$ is the force applied to the beam,
- $L$ is the length of the beam,
- $E$ is the modulus of elasticity of the beam material,
- $I$ is the second moment of area of the beam's cross section.

#### Objective function

We are trying to find the design that would give us the least deflection, so our objective is to minimise $\delta$. We
can do that by adjusting the beam section, which directly influences $I$. We will keep load, span, material, and other
section properties fixed—using values as follows:

- $F$ = 20kN,
- $L$ = 2000mm,
- $E$ = 200GPa,
- $t_w$, web thickness = 5mm,
- $t_f$, flange thickness = 5mm.

#### Brute force and ignorance

For a problem like this, it's not computationally challenging to explore the full design space. We can define a depth
series at 1mm increments, a breadth series at 1mm increments, then work through the calculations for $I$ and then
$\delta$ at each point.

In this way, we arrive at a nice 2D matrix of deflection values; one for each $(b, d)$ pair. That looks like this:

{{< figure src="/images/blog/05/BeamDeflection.png" title="Beam deflection as a function of breadth and depth">}}

Unsurprisingly, the minimum deflection occurs down on the bottom right hand corner as you look at the plot—where both
depth and breadth are at their maximum.

We knew that going into this problem, but for more complex problems, we might not have such a clear idea of where the
optimum solution lies before we start.

#### A smarter approach

In a more realistic example, we might have a complex, multi-dimensional design space with an awkward shape, and we might
not have any clear idea of where the best solution lies. Perhaps more imporantly, real-world simulation cases can be
incredibly complex—requiring vast HPC clusters and sometimes running for days. This is the scenario where we would want
to start using an optimisation routine to explore the design space for us, because anything even approaching an
exhaustive search would be infeasible.

To bring this back to our beam example, instead of computing deflection at some quantised version of every possible
$(b, d)$ pair, we would use an optimisation algorithm to explore the design space for us. We would start with an initial
guess, compute the deflection at that point, then iteratively improve our guess until we arrive at the best solution.

Though we could use Nelder-Mead or similar methoods mentioned above, this is where techniques like gradient descent come
into play. We can use the gradient of our objective function with respect to our design variables to inform our next
guess, and this can help us find the best solution more quickly.

That path to the best solution might look something like this:

{{< figure src="/images/blog/05/BeamGradientDescent.png" title="Simulated gradient descent towards minimum deflection">}}

This saves us from having to compute deflection at every point, instead effectively finding only the values along two
edges of the surface, and as a result it can help us find the best solution more quickly.

This is where the appeal of differentiable programming starts to raise its head. If we were to be able to somehow
isolate how beam deflection responds to change in depth and breadth—the objective function's sensitivity to our design
variables—we could plug into that an appropriate optimisation routine and let the computer not only do the work for us,
but also choose the best path to the best solution.

### Manual design optimisation

Unfortunately, the example above is not very representative of a real-world workflow. In a real engineering team, where
you run a mix of tools from Dassault and Ansys and Siemens and whoever else, you don't typically have hand-coded
geometry creation functions, hand-coded moment of inertia and deflection equations, and a simple 2D design space.
Instead, have a complex mix of often siloed products, with friction-heavy interfaces, and no straightforward way of
closing the loop between CAD and simulation.

As a result, your actual process will probably be more like this:

1. Do some initial calcs or analytical simulation to set your initial parameters.
2. Build a CAD model with those parameters.
3. Load that geometry into the relevant tool, pre-process/build/tweak/refine a mesh to fit your needs, and set your
   simulation running.
4. Once the simulation has finished, extract/post-process the relevant results and manually analyse them.
   - This could involve manual interrogation of flow velocity or pressure plots, identification of stress concentrations
     in particular areas of the geometry, extraction of peak stresses or deflections etc.
5. Using engineering judgement, tweak the CAD to address any of the more pressing issues you've identified, then go back
   to step 3 and repeat the process.
   - If you're lucky, you might have some variety of simplfied model from step 1 that you can adjust to correlate with
     your simulation results, and then use that to inform your next iteration of the CAD model.
   - Simulation results are largely best compared to other simulation results, so you might have to run a few iterations
     of this process to convince yourself that you're moving in the right direction.

### Parametric design optimisation

Taking the above manual process and applying some more structure to it leads you to what we might call 'parametric
design optimisation'. Here, as above, you start with some initial calcs or analytical simulation to set your initial
parameters, and once again you build a parametric CAD model cane be adjusted.

However, instead of manually running and interrogating simulation results and using engineering judgement to inform your
next iteration, you apply an optimisation tool and leverage that to home in on your optimum design. There are commercial
tools out there for this already, like [Ansys optiSLang](https://www.ansys.com/en-gb/products/connect/ansys-optislang).

Ignoring the option to integrate multiple simulation tools, the process here is effectively the same as above, but with
the software handling steps 3 to 5:

1. Do some initial calcs or analytical simulation to set your initial parameters.
2. Build a CAD model with those parameters.
3. Load that geometry into the relevant tool and pre-process/build/tweak/refine a mesh to fit your needs.
4. Tell your optimisation tool what your objective is, how it can invoke your simulation, and what your constraints are.
5. Let it run, building the simulations and running them, and interrogating the results—ultimately examining the design
   space and iterating on the best solution.

### Adjoint methods

### Adjoint optimisation and sensitivity analysis

## How can we get those gradients?

In the differentiable paradigm, those results would be composed not just of forces and torques and Von Mises stresses
and flow velocities, but also the gradients of each of those with respect to the design variables.

### Symbolic differentiation

### Numerical differentiation

For context, here's the maths behind the secant method. Note the $f(x_{n-1})$ and $f(x_{n-2})$ terms in the denominator
and the $x_{n-1}$ and $x_{n-2}$ in the numerator; effectively $dy$ and $dx$:

$$
x_n
 = x_{n-1} - f(x_{n-1}) \frac{x_{n-1} - x_{n-2}}{f(x_{n-1}) - f(x_{n-2})}
 = \frac{x_{n-2} f(x_{n-1}) - x_{n-1} f(x_{n-2})}{f(x_{n-1}) - f(x_{n-2})}.
$$

### Automatic differentiation

## Real-world example: I-beams

## CAD and differentiable programming

## Papers

Some of these provide some interest background, alternative techniques etc.

- [Linking Parametric CAD with Adjoint Surface Sensitivities](https://pureadmin.qub.ac.uk/ws/portalfiles/portal/51950626/Linking_parametric_CAD_with_adjoint_surface_sensitivities.pdf)
- [Differentiable 3D CAD Programs for Bidirectional Editing](https://arxiv.org/pdf/2110.01182.pdf)
- [Design Sensitivity Calculations Directly on CAD-based Geometry](https://acdl.mit.edu/ESP/Publications/AIAApaper2015-1370.pdf)
- [Adjoint Shape Optimization for Aerospace Applications](https://www.nas.nasa.gov/assets/nas/pdf/ams/2021/AMS_20210408_Kelecy.pdf)
