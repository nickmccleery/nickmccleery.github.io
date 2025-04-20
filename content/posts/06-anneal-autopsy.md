---
title: Anneal autopsy
description: Post-mortem reflections on a failed engineering software start-up.
date: 2024-04-23
draft: false
images: [/images/og/06-anneal-autopsy.png]
tags: [startups, business]
---

## _Preface_

<i>

I've been trying to put this together for the past few weeks, but it's incredibly difficult to condense such a
wide-ranging experience into a coherent piece of writing, especially one that might actually be of interest or utility
to anyone else. I've done my best to outline what actually happened, give my view on contributing factors and lessons
learned, then put forward what I think I would do differently if I were to start again.

Please forgive the endless first person and any hint of whingeing; that really isn't the intention. I do largely view
the whole experience as an incredibly deep learning moment, and the failure as basically being attributable to 'skill
issue'—even in the face of a genuinely challenging market.

</i>

<hr/>

## TL;DR

We built an engineering collaboration system for hardware engineers. We pitched it as _The Engineering OS for Complex
Hardware Development_, but failed to solve early distribution. We struggled for market access, failed to establish what
our go-to-market motion should be, and eventually ran out of money.

Also, [here are some rules I'd set myself if I had my time again](#what-i-would-do-differently).

## Concept

### Background

I think it's hard to accurately identify where a concept truly originates, and it's easy to get so wrapped up in the
narrative crafted around a start-up that you can forget what ground truth actually looks like, but I do think the idea
behind Anneal is a relatively direct product of my experiences as an engineer prior to starting the company.

For context, the first six years of my career were spent in Formula One. My experience there, though mostly rooted in
data analysis, simulation, and performance optimisation, was pretty wide ranging. Beyond the thousands of hours spent
wringing performance out of now ancient versions of MATLAB in ultimate search of marginally faster lap times, I've
devised procedures for inspecting components, overseen the installation of imaging equipment, designed custom (physical)
tools to support product assembly, and served time doing more traditional mechanical design work; covering everything
from the most minor washer chamfer detail through to wholesale redesign of big chunks of critical systems.

Across all of these roles, a common theme in my work was what I refer to as _process focus_. As an engineer with a
deep-seated aversion to grunt work, distaste for unnecessary complexity, and a fondness for getting the computer to do
the work for me, a chunk of my contribution tended to lie in trying to improve process and procedure, often leaning on
the fact that I'd learned to write code fairly early on, and so could actually build little tools to help.

### Problem

The unfortunate reality is that hardware development processes, even at some of the most advanced engineering
organisations on the planet, are slow, opaque, largely untraceable, and do almost nothing to systematically capture and
leverage performance differentiating knowledge.

This is something that I had felt first hand to varying degrees, but that was later backed up by the
[research](https://www.getanneal.com/engineering-productivity.html) we undertook. We saw widespread fragmentation of
communications, limited adoption of version control, frequent adverse impacts arising from out-of-date data in the
design cycle, and design and drawing review procedures that both slow product development and wholly fail to reliably
capture engineer commentary for later inspection.

### Spark

In 2019, I moved into software development full-time, eventually leading the backend development of a quantitative
financial analytics platform. This transition provided my first exposure to modern, collaborative tools for software
development, and to the modern DevOps space. I was struck by how good some of these products were, and by how much value
they could add for engineering teams. They freed engineers from having to wade through bureaucratic treacle, and
generally allowed them to focus on the actual engineering.

As briefly touched on above, a common theme across all my motorsport roles had been my desire to leverage software to
try and improve process and to make things run more smoothly. Seeing how the software space had managed to do such an
incredible job of building tech to support their own work, I felt that the logical conclusion of all my prior
process-oriented efforts was to build an engineering operations platform that would offer hardware people the same
painless, productive experience that was being offered to software people by GitLab, GitHub, Linear _et. al_.

### Solution

Inspired by the software development tool landscape, I wanted to build something that would address the unfortunate
reality of hardware development described above. I wanted to build a product that would help accelerate the design and
development of complex physical systems by reducing the administrative burden placed upon engineers, and by helping
engineering organisations better capture and utilise their knowledge. I also wanted to do this in such a way that
engineering teams would not have to move away from their existing CAD and PLM systems.

We pitched Anneal as **"The Engineering OS for Complex Hardware Development"**. It was, in effect, a centralised,
user-friendly software system that helped engineers to plan, track, collaborate, and manage their data. We intended it
to drop in alongside incumbent PLM systems, offering functionality that would actually allow engineers to collaborate
and orchestrate product development without having to endlessly trawl through e-mails, notes from phone calls, paper
drawings, and PowerPoints stuffed with screenshots of their CAD systems.

To that end, we built tools for the multiplayer review of 2D drawings and 3D CAD. We built nice issue tracking, Kanban
boards, search functionality, $\LaTeX$ rendering, a diagram/schematic editor, drawing diff tools… and lots more stuff I
still think would add value in a high-performing, high-velocity engineering team.

## Company trajectory

### Timeline of events

The product concept lifespan runs almost exactly three years, from the Ignite pre-accelerator in Q1 of 2021 through to
us getting down to our last few thousand dollars in late 2023.

The high level view of the timeline of some significant milestones is as shown below:
{{< figure src="/images/blog/06/AnnealTimelineDiagram.png" title="Anneal timeline." class="rounded margin big-img">}}

### Start

#### Initial vision

The vision comes from my experience as an engineer. I didn't grow up idolising Steve Jobs, I'd never heard of Sequoia,
and nobody in my family had ever run a business. This sounds so myopic in hindsight that I'm almost embarrassed by it,
but, at the outset, I didn't even have a view on whether or not I should pursue venture investment, and I had no real
concept for how I wanted to design a business; at least not beyond its engineering function. I was just an engineer who
wanted to build a tool that I thought could make engineering teams more effective, and that I thought they'd be willing
to pay for.

So, after deciding I wanted to have a go at pursuing the idea, I sat down and schemed out the application I envisaged,
then I applied for the January 2021 intake of [Ignite's](https://www.ignite.io/) 'Propel' pre-accelerator programme.
There was no searching for co-founders, no market research, no customer discovery, no market size analysis; just
product. Perhaps not all, but some of this I now know to be broadly typical of a somewhat cavalier first time technical
founder with no commercial experience.

Unfortunately, I can't actually access the one remaining Adobe XD file I have because XD is now ~dead. At any rate, the
scope here was relatively large. It included everything from drawing review tools to engineering-oriented CI/CD and
decision support. Some of the intended functionality overlaps with the more fully featured PLM tools, but you can see
the origin of the _Engineering OS_ vision from the file preview image:

{{< figure src="/images/blog/06/AppDesign.png" title="Anneal initial designs." class="rounded margin" >}}

You'll have to forgive how it looks. Despite my skills having since improved a bit, I am still not the most natural
designer, and I'd also not yet fully discovered component libraries and templates. Most of my previous GUI application
development experience had involved using bog standard configurations of form designer apps<sup>†</sup>, and all of my
prior web/web-adjacent experience was in backend work, so I was incredibly green on this front too. For whatever reason,
I sort of just assumed everyone built everything from scratch... so I basically wound up reinventing the wheel in a few
places, before at least stumbling on icon libraries.

<hr/>

<sup>†</sup>How exactly we ended up largely abandoning tools like this that allowed you to build an entire app in a day
is sort of beyond me:

{{< figure src="/images/blog/06/FormDesigner.jpg"
title="XP-era form designer easiness"
credit="<a href=\"https://stackoverflow.com/questions/5533131/creating-a-professional-looking-and-behaving-form-designer\">https://stackoverflow.com/questions/5533131/creating-a-professional-looking-and-behaving-form-designer</a>"
class="rounded margin" >}}

<hr/>

Aesthetics aside, I've highlighted a couple of interesting regions on this design:

{{< figure src="/images/blog/06/AppDesignAnnotated.png" title="Anneal initial designs." class="rounded margin" >}}

Taking the right hand side first, you can see the initial reference to the CI/CD-style functionality, where I'd
envisaged us deploying something like an automated FEA unit test for a redesigned part.

Then, on the left hand side, there's the initial set of things I'd imagined being useful in an _Engineering OS_. Some of
these functionalities really belong to PLM, but there are still a decent chunk that aren't handled by existing PLM
solutions. We have:

| Feature                             | PLM          | Anneal                |
| ----------------------------------- | ------------ | --------------------- |
| BoM management                      | ✅           | _Via PLM integration_ |
| Drawing and part libraries          | ✅           | _Via PLM integration_ |
| 2D & 3D review and markup           | _Not really_ | ✅                    |
| Task management                     | _Sometimes_  | ✅                    |
| Fault and non-conformance reporting | ❌           | ✅                    |
| Change notification management      | ✅           | _Via PLM integration_ |
| Requirements management             | ❌           | ✅                    |
| Test and R&D management             | ❌           | ✅                    |
| Knowledge sharing                   | ❌           | ✅                    |
| Decision support tools              | ❌           | ✅                    |

In terms of how the product was actually to be built and deployed, the vision was always to build a web app. This was to
allow for cross-platform compatibility, and to make it easier to deploy updates and new features while also, at least
theoretically, saving us from having to impose desktop app installation on future users.

#### Pre-accelerator, coronavirus, and tech stack selection

The Propel 'pre-accelerator' was really like a startups 101 course; the sort of thing designed to poke and prod first
time founders and get them thinking about their business more broadly. It provided a lot of exposure to people who'd
been through the process before, and helped educate us on the mechanics of raising capital, running customer discovery,
thinking about sales, ensuring we had global outlook etc. The programme kicked off in the middle of COVID-19. We started
remotely in January 2021, and never really got going with office-based activity.

The impact of coronavirus aside, and with the XD mockup in hand, I set about starting to build the actual app. I'd just
spend the past year and a bit handling cloud architecture and backend development, so I started there. I went for a
Flask/SQLAlchemy/Postgres stack, which wasn't too far removed from the Chalice/PonyORM/MySQL tech stack at my previous
job. I also began experimenting with frontend frameworks, working through React, Angular, and Vue, and deciding that Vue
was the least bad option. We went first for Vue 2, then later upgraded to Vue 3.

I laid out the architecture, starting writing some backend code, then the Propel guys convinced me to down tools and try
and do some customer discovery. After taking the advice of the Propel team, I started trying to talk to potential
customers. I read [The Mom Test](https://www.momtestbook.com/), wrote some interview questions, then reached out to the
half dozen or so engineers I rated and would consider friends.

Having gathered some data, I tried to feed that into product planning, and over time I think this started to push us
more and more towards building a tool that was more like a System of Engagement for engineers, with a focus on design
and drawing reviews.

#### Predatory contracts to pre-seed funding

Around this time, I also got speaking to a company working on something super interesting, and that had a lot of overlap
with the things I'd worked on previously. They faced a lot of similar engineering challenges to those in top-rung
motorsport, so we chatted through the possibility of them being a pilot customer, and they seemed interested. I met the
team and gave a quick demo of what I'd already built, and talked through where I saw it going. After that, they put
together a draft agreement, then sent it over in early April '21. Unfortunately, this document demanded that:

- A) They would be able to use the software for free forever, if they liked it.
- B) They would get 5% of all of our revenue going forwards. _**Forever.**_

The first I could live with. A prestigious logo, some valuable data, and a design partner in exactly the space we'd been
aiming for... certainly seemed worth giving away some software for free. The second, much less so. Aside from likely
making us effectively uninvestable, I viewed it as a bit of a predatory move and, at least from my side, it soured any
desire to work with them. I told them it was a non-starter and moved on.

Later that year, having learned a bit more about funding options and the process of raising capital, I got into proper
discussions with our first investors. Eventually, I came to the conclusion that we'd be putting ourselves at a
significant competitive disadvantage compared with better funded competitors if we weren't to raise. I think this is a
compelling argument in favour of seeking investment, but I was also keen to avoid trying to raise an enormous amount of
money for fear of becoming the stereotypical vapourware flogging, cash burning start-up that I imagined would be
unattractive to our target market. To that end, I put together a plan that I genuinely thought would allow us to get to
a point where we secured some big name customers, then figured we could raise further funding on the back of that.

Ultimately, we raised £350k in pre-seed funding in Q4 of 2021, basically tied to proving that:

- A) We can build a product.
- B) We can build a team.
- C) We can acquire some engaged, representative early customers and demonstrate market appetite.

We hit those first two quickly, but the third just dragged on and on. Frankly, we never got there.

### Middle

#### Hiring

After raising some capital, I started to build out the team. Given my lack of frontend skills, I was keen to get some
dev expertise in that area. Initially, I'd also planned to hire a designer, seeing UX as a critical part of
differentiation; particularly in a world where the incumbent tools are just so horrible to use. However, what quickly
became obvious is that hiring is _hard_, hiring for a start-up is even harder, and trying to do both of these things in
a corner of the world that has suffered decades of brain drain is harder still.

After a couple of months of posting ads and doing direct outreach, I'd got basically nowhere and decided to bring in a
recruitment agency. I had a strong preference for getting people who were local, because I wanted the company to, at
least at some point, operate from an office 100% of the time.

Recruiters cost a fortune. They have a weird monopoly on the market, for reasons I don't quite understand, and their
incentives are not really aligned with either candidate or employer. The cost component meant I had to revise hiring
plans, as we'd be paying a big chunk to the recruitment agency for each hire. So, I decided to go after engineering
talent, figuring that I would pick up the commercial work, and that we could bring a designer in on a freelance basis.

This is exactly what happened, and we managed to find two great people. One had been working on a complicated product in
the legal document management space, mostly working with Angular, though he had done a lot of Python development at
university. The other had an intersectional electronics/software background, and had been with Qualcomm and a local
electrical infrastructure company, latterly developing internal tools for them using modern web stack stuff.

#### Building

With a team in place, we started to build out the product. Most of my initial frontend work was eventually ripped out
and replaced as we migrated from Vue 2 to Vue 3, and moved away from using the options API in favour of the composition
API. My technical contribution eventually fell back to being mostly backend oriented, as I was the only one with any
real experience with cloud architecture, relational databases, and the like, but the team eventually picked this up as
well.

By Q3 of 2022, we'd deployed an alpha version of the product and onboarded some users. We had university projects, a
niche aerospace manufacturer, and a few others. Users couldn't sign-up themselves, so I had to manually onboard people,
but we managed to get some initial feedback and started to iterate on the product. At this point, we'd built out our
task management, fault/non-conformance management, drawing review, and schematics/diagram functionality, and were
looking for direction on what to build or improve, and what integrations we should pursue.

On this front, we basically settled on building 3D review tools, nice search functionality, mentions, and a
notifications system. All of these were eventually delivered, alongside a frontend redesign that took the app from being
sort of ok to being something that I think was genuinely great looking, and a pleasure to use.

Here are a few relevant screengrabs from the app at a few points in its life:

{{< figure src="/images/blog/06/Gallery-Kanban.png" title="Kanban boards with human-friendly filters." class="rounded margin big-img">}}

{{< figure src="/images/blog/06/Gallery-3DReview.png" title="3D review functionality." class="rounded margin big-img">}}

{{< figure src="/images/blog/06/Gallery-2DReview.png" title="2D review functionality." class="rounded margin big-img">}}

{{< figure src="/images/blog/06/Gallery-Fault.png" title="Non-conformance reporting." class="rounded margin big-img">}}

We even had a nice documentation site that I put together:

{{< figure src="/images/blog/06/Gallery-Docs.png" title="Documentation site." class="rounded margin big-img">}}

#### Selling

**TL;DR: Skill issue. Couldn't get in the room, couldn't acquire customers.**

I'll come back to this later, but for us, trying to engage the target market was just phenomenally difficult; a million
times harder than I thought it would be. It's comfortably the hardest thing I've ever done, and just a soul destroying
process to get up and drag yourself through, day after day, when every new thing you try seems to come to nothing.

##### The plan

_The best laid schemes o' Mice an' Men_...

My initial plan, which seemed fairly rational at the time, was to start with prestigious, high-performing engineering
organisations. I figured that if we could get a few of these on board, we'd be able to leverage their logos to build
trust with the wider market. I'd also worked at these organisations, so the product we built was very much driven by
wanting to improve the pace and quality of engineering work within these sorts of teams—and I'd assumed that they'd be
willing to talk to me about it. Besides, after just four months at this thing, we'd seen enough interest from one of
these sorts of folks for them to put that predatory deal in front of us, so surely there would be others just as
interested...

After we'd bagged a few F1 and America's Cup teams, the idea was to move into the younger parts of the aerospace and
automotive markets, targeting EV companies, NewSpace startups, and the teams building electric aircraft. After that? The
rest of the world.

For context, here's a little snippet from the contents page of the business plan I put together for our pre-seed round:
{{< figure src="/images/blog/06/BusinessPlan.png" title="Initial market strategy." class="rounded margin big-img">}}

##### The reality

_Gang aft agley, An’ lea’e us nought but grief an’ pain_

When my attempts at getting the F1 folks on the phone didn't pan out, I realised we'd basically have to do it the hard
way. We had no unfair advantage; I didn't have the ear of any senior leaders, I had no advisors who could open their
Rolodexes, I had effectively zero profile, and our investors weren't well connected to this world. When I did pursue
some of the people I knew, I tried to get in touch with a former employer who had left me with an _'if you ever want to
come back, just give me a call'_ offer. We got a meeting set up and they didn't show up. Then we rearranged and they
no-showed again, twice.

So, I realised we had to start from cold. Biting the bullet, I sent thousands upon thousands of e-mails, InMails, direct
messages, and LinkedIn connection requests. I sent enough snail mail that the post office staff asked what I was up to.
I had countless introductions that were ignored.

Long term, our response rate to cold outbound was on the order of 1%, though we did eventually manage to get this up
into the 15% or so range for doing discovery work with engineers.

Thinking we might have better luck if people had perhaps heard of us before I came knocking, I tried to get a content
marketing strategy going. I started a company blog where I wrote about engineering process, and about the history of
engineering tools and the future of engineering work. I arranged for guest posts from engineers with profile and
experience and a shared view of the world.

I ran advertising campaigns on LinkedIn and Google, and some of these even saw genuinely high click through rates. I
managed to get us some domestic press coverage, and I attended industry events as both a delegate and a speaker.
Unfortunately, for the most part, it seems there are no engineers at European engineering events; it's just sales people
talking to other sales people.

<hr/>

_Here's couple of the ads I ran, after finally picking up a little bit of design skill:_

{{< figure src="/images/blog/06/LinkedInAdA.png" class="rounded margin big-img">}}

{{< figure src="/images/blog/06/LinkedInAdB.png" class="rounded margin big-img">}}

_This is the launch carousel that went out on LinkedIn when we went to public beta:_

{{< image-gallery gallery_dir="/images/blog/06/carousel" >}}

<hr/>

Beyond the ads and cold outbound, we joined a relevant trade body who were genuinely incredible at trying to help, but
there was just nobody close to home who was really a relevant prospect for us. The ones who did take the intro tended to
not take us seriously.

We attended dedicated aerospace innovation events where the aerospace primes told us they were very interested in
working with startups, then sat there as they gave multiple hour-long presentations about the history of the companies
half the room had already worked at, then they all disappeared before bothering to speak with any of the startups.

Over and over, I tried variations on this set of engagement channels as we swept through different target customers,
from mid-market aerospace companies to primes, and back down to three man startups. We covered everything from
motorsport and aerospace to medical devices and e-mobility. We tried to get in touch with everyone from engineers to
CTOs, and with PLM managers, CFOs, and even founders themselves.

Despite all of that, none of it really worked. Each conversation was so difficult to secure, and any escalation to a
sales-like conversation was just impossible. I'd get engineers on the phone, and they'd talk about problems they had
that we were solving, then they'd basically just say they have no desire—or permission—to do anything about it.

We even found a two-man hardware start-up who openly said they would never buy software from a start-up because of the
vendor risk, which is a rational argument... but I was dumbstruck by this on the grounds that they themselves very
clearly embody vendor risk.

There were a few cases where we faced the timescale issue. We had one organisation who were struggling with the time it
took them to get designs reviewed, signed off, and released—to the extent that they said that process was becoming their
top priority. When I asked about timelines, they said they'd be looking to fix it over the next five years.

This never really got any better, and I'm still struck by how difficult it was to get people to engage with us. Doubly
so after a few experiences where a well connected VC just shot a text message to a relevant leader at whatever hardware
company, and the call was scheduled for the next day. That network impact really wasn't something I was prepared for;
not knowing people is a huge disadvantage, and I think you need a really good plan for overcoming that if you don't have
a network to lean on.

Reflecting on this for the guys over at
[The Analog](https://www.theanalog.io/interview-details/q-a-nick-mccleery/r/rec5VlnUdCLmQqbc7), I basically figured that
without that network, you need Jim Farley on your board or $20mm to burn on sales, evangelism, and market education. Or
both.

##### A silver lining

One thing that does buoy me about this experience, and this I also found reflected in my experience as a younger
engineer, is that the really high-performing organisations often seem to be much more open and orders of magnitude
easier to deal with.

We had an incredibly positive, helpful set of calls with probably the most advanced driving simulator company on the
planet. They took a cold message, got people involved, understood the problem, and were willing to engage with us. I had
a former F1 technical director who, for the avoidance of doubt couldn't remember me, give me an hour of his time to talk
through the concept and give me his view on where bottlenecks tended to be. I still have a positive relationship with
probably the second most successful private rocket company in the world because they responded to a tweet.

In addition, the people who responded to the cold outbound were amazing, whatever they were working on. Literally every
single person I spoke to was incredibly helpful, open, polite, and courteous; these people are saints, and I think
startups of all varieties probably owe a lot to these folks.

This is in pretty stark contrast with the experiences I tended to have when trying to engage local companies and
educational institutions—though there are two firms who were absolutely great. In the end, we even wound up helping a
Formula Student team with who I'd had no prior relationship whatsoever because they actually responded to my e-mail, and
I was so incredibly impressed by them.

{{< figure src="/images/blog/06/SheffieldFSUK.jpg" title="Sheffield Formula Student car with our logo on the rear wing." class="rounded margin big-img">}}

#### Love letter to the NDRC

I can't reasonably touch on the middle period without mentioning the [NDRC](https://www.ndrc.ie/), which we were lucky
enough to participate in from January '23. Aside from the investment, which was the initial appeal and certainly very
useful, the programme was just so incredibly helpful at getting me to improve my commercial acumen. That 15% response
rate from engineers was down at 1% when I started, and really I owe so much of that step forward to the EIRs and the
other staff there.

This review I gave them elsewhere says it all:

> "Praise from me is a rare thing, but the programme was amazing. It was an incredibly valuable experience; worth far
> more than the €100k that was the most attractive component going into it. Happy to be proved wrong about the money
> being the good bit, this basically came down to two things outdoing the cash: the programme itself, and the cohort we
> got to work side by side with.

> "From a programme perspective, the real value-add comes from the people involved. I think uniquely for the Irish
> ecosystem, NDRC were able to provide significant amounts of face time with legitimately successful founders,
> engineers, and salespeople. Not only did we have the opportunity to seek their guidance, ask about their experiences,
> and use them as sounding boards—they were effectively on our side, like an extension of the team. Critically, almost
> everyone involved had globally significant credentials, and believed in global-scale ambition; nobody ever made
> suggestions of aiming lower or starting smaller.

> "From a cohort effect perspective, it’s incredibly energising to be working alongside other motivated, driven, sharp
> founders. Even when they’re tackling different problems in different sectors, a lot of learning seems to transcend
> those boundaries, so their input was often both helpful and actionable. Then, when things were tough, they formed a
> handy crutch for your morale—keeping you grounded, and helping you to keep pushing.""

### End

Towards the end of Q4 2023, we faced a cashflow crisis. We'd seen a total of 39 organisations sign-up, though many of
them tyre kicking single users. Our pipeline had dried up, and we were continuing to struggle to get any conversations
going. At the same time, some funding that I had been expecting to come through was questioned, went up for
investigation, and we were forced to jump through some significant hoops with no timeline or certainty of outcome
provided.

The plan we'd opted to take was effectively a _burn the boats_ focus on hardware startups. If we could get a few
half-decent customers from this space, we might catch a fortunate bounce with the funding we were expecting, or be able
to raise a round, or even a bridge to keep us afloat.

Unfortunately, that didn't work either. Just like the bigger players, we again found hardware startups generally
wouldn't speak to us, except where intros were made by their investors. We had a few of these, some of them incredible
companies, but the culture and approach to tool adoption was largely equivalent to that of the larger companies we had
managed to speak to.

With the funding still not arriving, and fearing that we wouldn't be able to make payroll into 2024, I had to make the
pretty brutal decision to make the team redundant right before Christmas. I'd taken the view that, with patchy usage
from generally low value users and no real volume in our pipeline, we were unlikely to be able to raise further capital.
So, as we got towards the end of our runway, there really weren't any other options.

In the end, if the team had stayed on, we'd have been insolvent in January. The funding we were expecting was still
nowhere to be seen, so we wouldn't have been able to make payroll.

#### Shutdown

In February 2024, after conversations with our investors, with a couple of bills hanging over our heads, and with AWS
starting to charge us for our now relatively significant infrastructure costs, at least as compared with the few
thousand dollars remaining in the bank, we made the decision to shut things down. I sat down and wrote an open letter,
then started tearing down infrastructure.

The open letter that I put out at the end of February 2024 is available [here](/documents/240228-Shutdown.pdf).

## Reflections & realisations

### On fondness for the deep end

The best way to learn, at least for some of us, is to just be thrown in the deep end. Few things are as satisfying as
being drowned in new things you don't understand, eventually managing to figure it all out and meet the expected
standard, then starting to get ideas about what you might do differently in order to make things better. So, it made
sense for me to just dive into this. For everything else I'd ever done well, all the technical stuff, I started out
knowing nothing—so why not just get going and learn on the way?

The problem with this is that technical problems tend to give you feedback. You run a rig test and you get a result you
can learn from. You write some code that errors out and you can interrogate the stack trace. You can iterate and perturb
the system and each time you do something different you get more information back, and your understanding of the system
grows and you get better.

But, if you try five different variants of outreach copy and nobody responds to any of them, or you're so close to zero
that you can't trust comparison between the stats you're getting back, then you're not really learning much from that
except that nobody's interested. Plus, people are legitimately often busy, and maybe your message got caught in their
spam filter, maybe they're on holiday, maybe they don't feel they're allowed to talk to outside companies... whatever.
The system has so many unknowns that if you aren't getting some reliable feedback, it's hard to get better.

I still think diving in is broadly the right way to go, but despite my fondness for being chucked right into the deep
end, I do wish I'd spent literally a few weeks reading about startups more broadly before I did anything else. Read
[Traction](https://www.amazon.co.uk/Traction-Startup-Achieve-Explosive-Customer/dp/1591848369),
[Zero to One](https://www.amazon.co.uk/Zero-One-Notes-Start-Future/dp/0753555204), and
[The Mom Test](https://www.momtestbook.com/).

If you want to play in the aerospace or automotive world, maybe read
[Jet Man](https://www.amazon.co.uk/Jet-Man-Breaking-Whittle-Revolution/dp/1788544706),
[Stealth](https://www.amazon.co.uk/Stealth-Secret-Contest-Invisible-Aircraft/dp/0197627242), and
[Liftoff](https://www.amazon.co.uk/Liftoff-Desperate-Early-Launched-SpaceX/dp/0008445664)... though, fair warning, these
might put you off even trying.

### Received wisdom and suppressed contrarianism

This is something that probably applies to a lot of would-be start-up founders. If you're thinking about starting a tech
company, you are likely to be pretty high agency. Unless you're just churning out ChatGPT wrappers or running a crypto
scam or doing whatever the current hype cycle fancies, it's not the sort of thing you stumble into; you have to have
some initiative and ideas and hopefully some independence of thought.

It's oft repeated that for your start-up to succeed, your company's position has to be both contrarian and right. So
there's a good chance that you, as a would-be founder, have some contrarian inclination too; I certainly do.

However, I'd also never run a business. I'd never worked in the commercial side of any organisation, and I didn't know
anyone who'd built and scaled a start-up beyond seed stage. So, when I started into this, I made a real, conscious
effort to try and listen to the advice of others—on the grounds that many of these people have done this stuff before,
so they might be worth listening to.

In general, this is fine, but you really have to take what everyone says with a pinch of salt. In particular, I think a
lot of the advice that's dished out, the received wisdom, is either now out of date or simply never would have been
applicable to our target sector.

The basic template advice is generally along the lines of:

- Talk to your customers before you do anything; try and validate your ideas.
- Gather lots of data about how they work and pick out their biggest pain points.
- Hack together an MVP that maybe addresses just that one issue, and put that in front of them.
- Sell it immediately.
- Iterate, scale, exit.

This is probably a grossly unfair oversimplification, but my view is now that this advice is probably a result of
something like a 2006 - 2016 SaaS era, where you could walk into a barber shop or a veterinary clinic or a restaurant,
and find that they're using a paper diary to manage bookings and that their rota goes up on a whiteboard in the staff
room. You could then present yourself and your merry band of nerds to these people, who are entirely non-technical, and
offer to make their life a million times easier by building some technology for them.

I view this as consultancy-style product development by committee. There isn't necessarily a deep initial product vision
driven by personal experience or lifelong ambition; you're just trying to solve a problem for someone who is well aware
of the problem, but doesn't have the technical capability to do it themselves. You build that solution once, then you
sell it over and over to similar looking customers, of which there are many.

However, if you're targeting extremely technical people within a relatively small number of large, high-capability
hardware organisations, you'll probably find that they tend to be a bit secretive, that they're often subject to
restrictive NDAs, and that they are generally challenging to engage with. These orgs also often have in-house software
teams who are dedicated to building internal tools to address business need. So, not only are they difficult to access,
they are also conditioned to believe that they can identify and address their own problems. This is often true, but not
always.

This poses a whole host of challenges:

1. Can you get in the room?
2. Will they tell you anything good once you're in there?
3. Do they see the problem you see?
   - If not, how do you tell them that you basically think they're not doing their job right?
   - If so, will they believe you can solve their problem better than a well-resourced internal team?
4. What's the level of technical maturity they expect?
5. Are they willing to buy mission-critical software from you?

All considered, I think this means the template advice isn't a great fit for this target market; at least not today,
assuming you don't have some unfair advantage in customer access. Even if you do have that unfair advantage, I think
this quote is always worth bearing in mind:

> "The trouble with market research is that people don't think what they feel, they don't say what they think and they
> don't do what they say." - David Ogilvy

#### Necessity's Mother and McKinsey vs. Rick Rubin

Coming back to the received wisdom on this, I'm left wondering if a different approach might have been better advised.
As I see it, you basically have two extremes in approach:

- A) You go consultative. You emulate McKinsey. You leverage credibility/network/charisma/whatever to get in the room,
  you do a bunch of discovery work, you feed that into a product plan, you build some MVP, you validate it, you expand
  the product, then you sell it to the customer.
- B) You adopt supreme confidence in your own vision. You emulate Rick Rubin. You basically decide that your business is
  driven by you having identified something you think everyone else has missed, and you lean into building the product
  that _you_ wanted. You develop it to a reasonable level of maturity, and then you start seriously thinking about
  sales.

The first is what I view as the received wisdom on how to build a B2B SaaS company; you address a hair-on-fire problem
for someone else based on what they tell you about the problem. The second is how I now view most of the big tech
successes as having actually been delivered; they're opinionated vision plays.

Everything I've read about Apple and Steve Jobs suggests that they were vision and intuition driven. Were they doing
market research before developing the Apple I? Was the iPhone the result of Apple doing a bunch of customer discovery
with Nokia or Blackberry users? Were people complaining about the terrible imposition of using buttons... or did Apple
decide that Apple was going to write the future?

Twitter and Snapchat have organic origins, and Figma took three years to release its beta; it was five before it added
paid tiers.

Dropbox's slating on Hacker News is now notorious, so we can assume they weren't building their product to meet the
declared needs of the HN crowd:

{{< figure src="/images/blog/06/Dropbox.png" title="Dropbox comments on Hacker News" class="rounded margin big-img">}}

Look back a century and you can find more of the same thing:

> "If I had asked people what they wanted, they would have said faster horses." - Henry Ford

In the end, I think I now take the view that there's value in not suppressing your contrarianism, and instead doing
whatever the hell it is you wanted to at the outset. It might not be the standard playbook, and it might even adversely
impact the probability of a moderately successful outcome... but the big outcomes are always outliers anyway.

### Launch now

"Launch now" is the first item in
[YC's essential startup advice](https://www.ycombinator.com/library/4D-yc-s-essential-startup-advice).

Launching immediately is obviously at odds with the Figma-style, build-your-vision approach above, but there's some
engineering-specific insight I now have on this.

As far as I can tell, engineers generally like _things_. They like products they can see and test and play with. What
engineers generally don't like is sales. They don't like talking to people when they don't have to, especially when they
think the other party is non-technical. They don't like bullshit, and they don't buy hype.

This is probably a good argument for making sure you recruit one or two of the grandmaster salespeople that Peter Thiel
describes; the ones who can do sales without anyone noticing, but it's also a good argument for launching as early as
you can.

For a long time after founding the company, our website was just a vanilla HTML landing page with a contact e-mail
address on there. The copy was a bit non-specific, the design was basic, and there were no screenshots or demo videos or
real evidence of us having built anything. I think this was a mistake.

As soon as I rebuilt the site and put some screenshots and a demo video on there, we started to find that things got a
little easier. Once we launched to private alpha, we saw another little step up, then again after moving to public beta,
adding demo videos, documentation etc.

All of that to say that launching, beyond actually allowing you to start getting users, also seems to serve a role in
helping your target audience believe that your company is real, that you can actually build product, and that you aren't
trying to scam them or waste their time.

### Perceptions and first impressions

This can really be broken down into two categories; one relating to the company, and one to the person.

#### The company

In the case of the company, and linked to the point above about launching now, I was actually surprised by how much more
success we had in getting discovery calls going once I'd invested a little more time in building a palatable website,
crafting some less janky branding, and writing some considered copy. I think my takeaway here is that it's really worth
spending a week or two designing a brand, producing guidelines, building a relatively high quality website, and
generally trying to project credibility. You can always iterate on this later, but you only get one chance at that first
impression when someone visits your website or the company LinkedIn.

#### The person

In the case of the person, I think things are a little bit more complicated. The engineering space is both conservative
and incredibly homogeneous. In every engineering org where I've ever worked, the demographics have been fairly
repeatable: overwhelmingly white and male, 'business casual' dress codes, and pretty strong correlation between age and
seniority. This near-uniformity in how the discipline is composed seems to produce an expectation that other credible
people will present themselves in a similar way. In our case, I think this posed a legitimate challenge, and one that we
should have tried better to address.

For context, I just turned 32 and I have more than a decade of actual cross-discipline engineering experience. I'm also
relatively small and skinny, and look a fair bit younger than I actually am. I have a bit of a chip on my shoulder about
this now, but one thing that became increasingly obvious over time was that we were often not taken seriously when first
engaging with people—I think largely because of appearances.

At events, when I was introduced to new people, I'd often face either dismissive responses or enthusiastic but
patronising ones. I had more than a few comments about 'going back to the boss', and several instances where the
introduction mentioned my motorsport background, which then resulted in questions about whether or not I was working on
this project as part of a Formula Student team<sup>†</sup>.

This point brings us back to the possible advantage to be had from ignoring received wisdom, which here states that
founders should be the people running sales during the early days. I get the argument, but I think there's nuance here:
if you don't look the way the market expects you to look, and you don't have the network or the brand to compensate, I
think it's worth thinking up a different approach. That could be professional sales staff, a puppet CEO, or just sending
your most grownup-looking team member to do the talking, which is exactly what Microsoft did when they signed their
first contract with MITS for Altair BASIC.

Alternatively, _lean in_. Rock up to those events in shorts and flip-flops, and just embody the stereotype of the tech
world. The early adopters you're looking for are probably sick of having to don that navy polyester blend suit and pair
of battered brown leather shoes every time they leave the factory, and you can stand out by looking different.

<hr/>

<sup>†</sup>My view on the Formula Student questions:

{{< figure src="/images/blog/06/LinkedInSnippet.png" title="LinkedIn comment on Formula Student questions" class="rounded margin big-img">}}

<hr/>

### Distribution; or, why will nobody f\*\*king talk to me?

This follows on from the challenges we faced with establishing credibility. If I were to start again from, or start
another business from scratch, I would be thinking about distribution above all else. No matter how fantastic you think
your idea is, or how great your product may be, it's all moot if you can't work out how to distribute it.

In our case, we had such a hard time just getting conversations going, even the discovery calls with engineers were hard
to secure, that I began thinking about other ways we might be able to go about distribution given that direct sales
wasn't looking too promising. In hindsight, this thinking came too late; working out how we were going to handle
distribution should have been one of the top priorities from day one.

Working through the options I was able to think up, I first set up calls with some of the big CAE vendors, trying to
explore whether integration and partnership might be a viable route. These guys were good: responsive, understood the
concept, and were willing to engage, but they wanted us to be serving their existing customers before they'd really
consider anything. This was a bit of a Catch-22, as we were hoping to piggyback their distribution in order to get in
front of their customers, but they weren't willing to support that until we already had some customers in common. I
tried to get in touch with the big CAD and PLM vendors too, but was unable to get a response from any of them.

A little more creatively, I went after a couple of the big consultancy firms, thinking that we could perhaps set up some
mutually beneficial arrangement where everybody wins. The idea was that Acme Aerospace Inc. would approach Accenture or
Porsche Consulting or whoever seeking some assistance with how they run things, the consultant could recommend our
product or some rebranded version thereof, and the engineers would wind up using our tools. To me, this seemed like
everybody would win:

- The consulting firm get to look like they're all over new and emerging tech, helping their client with productivity
  and everything else we were pursuing.
- The client gets to use modern software they might actually like... without any project leaders having to wed their job
  security to a high-risk vendor. _Nobody ever got fired for buying <strike>IBM</strike> Accenture._
- We get to distribute our product to the end user. Sure, there would be a middleman taking a cut, but that beats not
  selling anything.

This seemed like quite an attractive prospect, but again, I couldn't get anywhere with it. We had one call with a
relevant party who then ghosted us; none of the others ever responded.

We also dipped our toe in the water with what is a very long-term play; trying to provide students with free access to
our software. The idea here was that we'd get them using it, they'd like it and get used to it, and then when they enter
the workforce they'd both see the problem we're solving, and already be familiar with an off-the-shelf solution.

Aside from making me want to pull my hair out, the near-complete inability to get _anyone_ to engage with us made me
reflect pretty hard on distribution. It's a phrase I used above, in both
['On fondess for the deep end'](#on-fondness-for-the-deep-end) and in ['Selling'](#selling), but I think this is another
area that I would really want some unfair advantage.

I'd be looking for existing relationships with business development people in the space, inside knowledge on what sort
of functionalities the big players are keen to add, or some slam dunk relationship with [HAX](https://hax.co/) or some
other hardware start-up community. Whatever it is, I'd be thinking about that front and centre and trying to get it
locked in early.

As a high risk alternative option, if you pulled the trigger on the
[Rick Rubin](#necessitys-mother-and-mckinsey-vs-rick-rubin) approach, you might be able to get away with not worrying
about this early doors, then just going all in on sales and marketing once you've got a product you're happy with. Note
that everyone will tell you this is a bad idea.

### Being a solo founder

I think being a solo founder is entirely possible, but it's like opting for hard mode. This might not apply if you raise
enough capital to go out and hire experienced start-up people across all business functions, but you probably won't have
anyone you can bounce all of your ideas off, you won't have anybody you can joke about the never-ending barrage of bad
news with, you won't have anyone to pick up your endless joblist if you get COVID and continue to test positive for
three weeks, and you won't have anyone quite as willing as you are to wrangle with a SEV 1 at 4AM.

All of those things are made less bad by having a cofounder or two. I don't know how effective these cofounder matching
programmes are, but if you have someone who's a good fit who you have a good relationship with, I would 100% opt for the
cofounder route.

In our case, for something like 18 months of the company's life, I was the only person working on it. I had nobody to
review my code, proof my copy, or call me an idiot when I was being an idiot. None of that is insurmountable, but I
definitely prefer being part of a team. I can get up and go to work on my own day in day out, but being part of a team
is energising; you have a responsibility to one another, some common goals, different thought processes, different life
experiences and perspectives to draw on. A good team is more than the sum of its parts.

At times, when you've got a million different things to do _and_ you also need to find some creativity or product vision
or clever ways to try and engage a customer, trying to run a high growth potential business without a team just leaves
you in crank the handle mode. You're just working through a list, without any of the organic magic that comes from a
team working together. Not that I intend to compare being part of a team with consuming amphetamines, but that feeling
does remind me of how notoriously collaborative mathematician Paul Erdős described his experience of trying to do
mathematics without them:

> "I didn't get any work done. I'd get up in the morning and stare at a blank piece of paper. I'd have no ideas, just
> like an ordinary person." - Paul Erdős

### Velocity

One thing I felt pretty acutely while focusing on customer work was a lack of product velocity. This wasn't really
justified, as our weekly retros would always demonstrate week on week progress, and when I showed people our product,
the scope of the thing was often commented on. That said, if you're a technical founder who's used to getting a lot done
on the product front, just be aware that pulling yourself out of the product development cycle will make it _feel_ like
you're losing speed. In fact, you probably are losing speed, but velocity is about speed and direction, so it is
important to gather that data that helps keep you pointing the right way.

Looking back, however, I do think we would have benefitted from a couple of changes.

Firstly, I think I should have taken a more serial approach to the product development and customer discovery piece. We
should have put bounds on the dates where customer discovery was to take place, batch up our learning, then schedule
however many sprints to deliver on what we'd decided. Then, we should have gone again, showing the new bits to the
market. Instead, I was always context switching; jumping back and forth between ad-hoc customer discovery and developing
new product concepts. It felt somewhat unplanned and unstructured, and we could have done a better job, even if startups
are always chaotic.

Secondly, I think I would have placed more of a cultural focus on the importance of speed. I am very supportive of the
idea that good engineering work is often exploratory, and it often takes a couple of days and a few stabs to work out
the right way to solve the problem at hand—so I appreciate the compromise. However, I might have been too comfortable
with rewrites and refactors and iterative improvement of functionality that end-users might not even notice. Had we
focused more on speed, we might have been able to work through more iterations, test more ideas, and generally build a
higher confidence picture of what our product should be.

Also, that retro saved me from my own pessimism more than once. Run retros. Write it down.

### WFH

I am not a fan of working from home, and I'm generally suspicious of the big WFH advocates. I appreciate that there can
be some actual output benefit for people whose living arrangement allows for periods of deep work, but the org-wide
downsides can be pretty significant.

Aside from remote-heavy patterns being hard for people who live in shared accommodation, or who have kids in the house,
or who just don't have a good home-working setup, I think you lose out on so much organic communication, learning,
sharing of ideas, griping about common problems, relationship building, and so on. Above all of that, I think WFH is
incredibly unfair on junior staff. If every single request for help or guidance has to be formalised, then they'll be
more inclined to resist reaching out until they're really stuck or they have a batch of questions to ask all at once. If
they're in the office next to you, a casual question might be answered in five seconds, and the junior team member up
and running again.

Beyond the requirement for formalised requests for help and support, junior staff are also deprived of the opportunity
to overhear a conversation from which they might learn something. They're deprived of the ability to absorb knowledge by
osmosis, and they're deprived of incidental exposure to what other teams and departments are working on. Given that they
might well discover that they would be better suited to a different role by overhearing another team's discussions, it
may be the case that your organisation would benefit from supporting that move, and that win-win opportunity would
simply never present itself with your team all working from home.

I also think there's something positive to be said for the act of getting out of bed, getting showered, and _going
somewhere else_. I've lost count of the number of times that solutions to intractable problems have come to me on the
drive home from work, but there's also something about physically separate spaces that seems to help with focus and
productivity.

In our case, our hand was forced by COVID. We started out remote, doing remote interviews and remote onboarding.
Eventually we rented a small office, but most of the team wanted to be in the office somewhere in the 1-3 days a week
range, which I appreciate makes sense for many people. When we were all in the office together, it was great, and I wish
we'd have been able to manage that every day without it causing logistical headaches or costing anyone a fortune in
fuel. Given my time again, I think I would try and actively select for a team who want to be in the office every day.
There's a reason why Peter Thiel
[used to pay people an extra $1000 a month to be close to the office](https://finance.yahoo.com/news/peter-thiel-paid-staff-extra-175629184.html).

### Geography

My thinking here is pretty similar to that on remote working: you absolutely can build a unicorn anywhere, and there are
some great examples of companies in unexpected places, and remote-first ones, that have done exactly that. However, I do
think geography is worth some relatively considered thought. As with Thiel and his desire to get people in the office,
there are some very valid reasons why the US has produced 645 unicorns, the UK 46, and Ireland just 6[^1].

For us, what was incredibly obvious, and what we realised too late, was that US culture is markedly more open, a million
times more supportive of enterprise, and has signficantly more appetite for risk. We should have started with a focus on
California, not ended.

I should caveat the above by saying my experience of American openness may involve a bit of path dependence, given that
I didn't set foot on Californian soil until nearly three years into the company's life. At this point, I _maybe_ had a
tiny bit of profile to help with things, but even so, I don't think I could have spent a Friday evening drinking beers
in a satellite factory with engineers I'd never met anywhere in Europe; it just wouldn't happen.

If I were to go again, I think I would just find a way to set up shop in California. It feels like voluntarily eating a
massive competitive disadvantage to do anything else. It's a bigger market, with better access to capital, talent, and
customers. Plus, they all speak the same language, so it makes sense to focus your energy there. If a move isn't
possible, spend as much time as you possibly can there; people care about their work, they want to meet people who've
flown thousands of miles to be there, and they don't care about what your accent says about your socioeconomic
background.

### Just business, my friend

This really relates to the experience with the early day [predatory contract](#predatory-contracts-to-pre-seed-funding).
At the time, my honest reaction was basically an expletive-ridden version of _go away_.

In hindsight, I probably could have spun that interaction into something more valuable. It could have been a time
limited clause for revenue sharing or we could have negotiated that section away altogether, and that might have
benefitted us by being able to trade on the existence of that deal.

My inclination to pretty vocally resist anyone trying to take advantage of me is what induced that reaction, but if we'd
taken the view that it was just business, we might have been able to make something more of it. Standing up for yourself
and for your company's interests is important, but maybe sitting on that e-mail for a day or two and being a bit less
reactive might have been a better approach.

The other thing that would have made more sense would have been to go into those conversations with a pre-prepared pilot
contract ready to go. Don't wait for some big company to draft an agreement that suits them then try and push you
around; simply present them with your standard terms. That way, the starting point for any negotiation is the
arrangement you'd envisaged. We eventually went this way, but the agreement was pretty long and unwieldy, and we should
have pushed for a simpler, crisp document that people would be confident they'd understood.

This pre-prepared document concept would probably be worth having for a few situations; pilot contracts, NDAs,
investment agreements, and so on. You don't have to wait for someone else to set the terms of whatever deal—you can take
the lead and try and force an outcome, whether that's terms, timeline, or whatever else.

### Death by half-measure

One other thing that might have played a hand in our demise was a half-measure approach to things. In several corners of
the business, from fundraising to product to marketing, we dipped our toes in the water, but didn't really commit.

We built a product... but based it neither on a supremely confident vision of the future, nor on a deeply researched
thesis on customer behaviour. We targeted engineers... but we didn't narrow the focus enough, and were too broad with
our messaging. We produced some nice content, but didn't really commit to a firm content strategy or reliable content
schedule.

Even on funding, we raised some capital... but just enough to place a single bet. When it seemed that bet wasn't working
out, we didn't really have the resources to fund a big pivot and keep the team.

Across the board, I think we would have benefitted from a more committed approach. If you're going to raise capital,
raise enough to give yourself some headroom. If you're going to do content, build a good plan and deliver on it. If
you're using your experience to drive product development, lean into that and build the product you envisage.

In general, I think I now prefer the approach of considering your options, making a plan, then committing to that with
all of your resources. If it doesn't work out, you reassess and go again, but the attractiveness of the half-measure
should be resisted; by trying to do a little bit of everything, you might end up not doing anything particularly well.

### A note on 'entrepreneurial' activity

I've been asked a few intelligence insulting questions about steps I took to try and get some customers, literally
including: _"I saw you worked at Mercedes. Why didn't you sell it to them?"_

Stating the obvious, the idea did occur to me. Nobody would speak to us; they wouldn't even speak to us on a discovery
basis.

As mentioned above, we tried to get around the not knowing people bit in other ways. At the simpler end, this included
things like crafting relatively nice, personalised letters, printing them on nice paper, and sending them all over the
world asking for some guidance and feedback. Everyone gets a thousand e-mails a day; how many hand-signed letters do you
get at work anymore? We also did things like having nice scale rules printed up, then sent those out to teams who might
still work with printed drawings. Everyone gets branded pens, but pens run out, and my dad has some promotional scale
rules lying around that are as old as me.

Somewhere in the middle, I worked through the notion of varying my job title across my internet presence to see if that
helped. I swept through a few options, and generally found both 'Founder' and 'CEO' to be poor choices for our target
market. 'CTO' was the best I found for getting responses from engineers... I think because they view it as a more
technical role, and a request for technical feedback is more likely to be taken seriously and not viewed as a poorly
disguised sales pitch. I also swept through profile picture variants, different colour backgrounds, different branding,
website copy... all of it.

At the more wiley end of things, at one point I went to the effort of identifying executives who were in charge of
English speaking, engineering-heavy teams, but whose native language was not English, and whose EA did not speak their
native language. I then wrote up a nice letter, had it translated to their native language, and sent it to them. The
thinking here was that the EA is likely to filter out any comms that they think are not worth the executive's time, but
if presented with one in their boss's native language, they might just balk, shrug, and pass it over.

Unfortunately, the furthest I got with any of the more 'clever' stuff was a single response saying kudos for choosing an
atypical method for outreach, but that they weren't interested.

### Out of sequence interest development

Looking back on the experience, one thing that I now recognise is that my interest and enthusiasm didn't necessarily
develop in the order that might have given the highest probability of a good outcome. I didn't read any business focused
books until relatively recently, largely because I didn't find the content grabbed my attention.

I was more interested in building a product, and building an engineering culture, and trying to solve technical
problems. The interest in how you design a business, how you distribute a product, how you get the attention of
customers, and how you position yourself... that all came later.

Recently, sat on my partner's parents' patio, I found myself glued to
[Zero to One](https://www.amazon.co.uk/Zero-One-Notes-Start-Future/dp/0753555204). I read it cover to cover, having
previously read a couple of chapters and thrown it away, generally preferring to read about cars or motorbikes or
aeroplanes or transistors or whatever. At the time, it occurred to me that the book was full of useful information...
but, more than that, my desire to keep reading told me that I had, at some point, developed a legitimate interest in all
of these other facets of running a business that I had previously neglected.

That development of interest in the non-technical aspects of trying to run the company, I think, came a little too late.
Had I had that interest earlier, I might have read more and learned more and had better background knowledge, and I
might have been able to make some better decisions, or at least have leveraged the interest and energy to drive myself
to do a better job.

Maybe this overlaps with [what I said about being thrown in the deep end](#on-fondness-for-the-deep-end), but I take
some solace in the fact that not only do I now think I'd do a much better job at twice the speed if I were to start
again, but I also have a newfound depth of respect and admiration for just about every function of every business out
there; it's all hard.

## What I would do differently

Boiling all of that waffle down to something potentially useful, if I were to start again, these would effectively be
the rules I'd set myself:

1. Find a cofounder.
   - Solo founder companies are statistically less likely to raise capital, and they do it more slowly[^2] . If you're
     on a B2B venture track, find a cofounder.
   - Ideally, aim for someone who is energised by the things that drain you. Even if they're not yet amazing at those
     things, the fact that they're energised by them will mean they'll be buzzing to keep pushing, trying, and learning.
1. Find an unfair advantage in distribution.
   - At the outset, think about distribution. How will you reach your customers, and how will you sell to them?
   - Can you think of a way to test that before you commit to the idea?
   - Aim for having some unfair advantage that nobody else has.
1. Choose the right geography<sup>†</sup>.
   - I would probably go straight to the US; west coast for most things, east coast for medical. Risk appetite is
     higher, people are more open, equity-based compensation is better understood, and the market is enormous. I think
     this makes it a better place to raise capital, find talent, and find customers.
   - In Europe, I would be thinking London, Paris, or Berlin, though Germany sounds like a procedurally challenging
     place to start a business.
1. Invest in your first impression: part 1.
   - Spend a week or two designing a brand, producing guidelines and template assets, building a relatively high quality
     website etc.
   - Accept that this won't feel like 'real work' if you're an engineer. It is work; it's still important.
   - Consider bringing in outside expertise for this; you only get one chance at that first impression. It's worth
     spending money on.
1. Invest in your first impression: part 2.
   - If you're doing in-person events, make sure you have an 'outside person' with a face that fits.
   - If you can't achieve this, lean-in to being different. Polarise the customer base, and get the obstinate old guard
     out of the way so you don't waste your time. There is probably no value in conversing with a grouchy 65 year old
     who won't retire, hates computers, resents the size of his software bill, and thinks young people spend too much
     money on avocado toast.
1. Outlaw WFH... but focus on output.
   - Actively select for people who want to be in the office every day, then make that mandatory.
   - There are exceptions to this, but my view is basically that WFH is a bad idea unless you're working on an
     incredibly well defined product, and you have an experienced team who already know each other.
   - Even with an in-person expectation, your culture can be relaxed, fair, and non-toxic.
   - Dental appointments and kids' sports days are part of life; nobody should care if someone disappears for an hour
     here or there. Focus on output. Get the work done, and try to spend your working time together.
1. Do what you can to bias situations in your favour.
   - Have pre-prepared pilot and early customer contracts ready to go. Leverage these to set the starting point for any
     negotiation.
   - Don't wait for someone else to propose the terms of a deal. You can take the lead and try and force an outcome.
   - There are no rules beyond the law. You don't have to follow the normal playbook for anything. From fundraising to
     sales, you may be able to tilt the situation to your advantage by doing things differently.
1. Avoid shiny object syndrome; choose simple tools where possible.
   - I chased my tail a bit trying to decide between MacOS, Ubuntu, and Windows. I tried a bunch of fancy CRMs and
     e-mail tools. In the end, I settled on Windows/WSL2, and did a whole bunch of things with Word, Excel, and
     PowerPoint.
   - You can run e-mail campaigns with Word and Excel. You don't need a fancy CRM at the start. Plus, they all suck.
   - You can also just use Dropbox to keep your data room live at all times; you don't need a separate, ad-hoc updated
     data room for investors.
1. Track everything.
   - Your whole business is an experiment, not just the product.
   - When you change _anything_: profile pictures, branding, taglines, copy, layout, whatever... try track the impact on
     response rates, engagement, etc.
1. Launch now; ship early and often.
   - Once your product is interesting and of reasonably high quality, ship it<sup>‡</sup>. Get it in front of people.
   - Once it's out, ship updates regularly. Invest some time in designing a a CI/CD strategy that enables this.

<hr/>

<sup>†</sup>Running a successful venture-scale business in an atypical location is clearly entirely possible, but I
think I would only consider it if I had supreme confidence that I'd already absolutely nailed the go-to-market strategy,
and had some incredibly compelling evidence that we were going to be able to sell the product at scale.

<sup>‡</sup>I think the days of shipping a hacked together, piece-of-shit MVP are broadly over. You should ship early,
but the bar is higher than the received wisdom says; particularly if you're targeting a technical customer base.

## References

[^1]: https://en.wikipedia.org/wiki/List_of_unicorn_startup_companies
[^2]:
    https://www.linkedin.com/posts/adamshuaib_what-is-the-optimum-number-of-founders-for-activity-7112389479671181313-zcdI
