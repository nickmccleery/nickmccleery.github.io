---
title: How to program an Arduino from WSL2
description: Forcing cooperation between PlatformIO, Windows, WSL2, and a USB-connected Arduino.
date: 2025-03-29
draft: false
images: [/images/og/08-kanban-indexing.png]
tags: [software, hardware, arduino, wsl2]
---

## TL;DR

Windows:

- Install usbipd: https://github.com/dorssel/usbipd-win
- Connect Arduino
- List USB devices via PowerShell (admin) terminal: `usbipd list`
- Share (bind) target USB device: `usbipd bind --busid X-Y`
- Connect (attach) target USB device: `usbipd attach --busid X-Y --wsl`

Linux:

- Run `sudo chmod a+rw /dev/ttyACM0`, or whatever your device is.
- Run `sudo usermod -a -G dialout $USER` to add your user to the dialout group.

## Background

### _Don't do this, just use Windows_

<i>
I don't think I would really recommend this setup. If your objective is to write some C++ and ship it to an Arduino, just 
install git and PlatformIO on your Windows environment, then accept that your projects cannot all live together in a
beautifully organised directory in your WSL environment.

However, if you are determined... </i>

### The problem with WSL2

I'm comfortable working across Windows, Linux, and MacOS, but take the view that Windows 11 with WSL2 is generally the
least bad OS setup available for anyone doing a broad mix of technical work.

You can have a native Windows environment that will run real Excel, Photoshop, PrePoMax etc., and any other desktop
applications you might need, while also having a tightly coupled Linux environment for software development. In my case,
I also find living without [Paint.NET](https://www.getpaint.net/) to be pretty painful—and I don't think I've ever found
a real alternative to it on any other OS.

With respect to the WSL setup, I find it to be effectively flawless for web development. You can run whatever resources
you need in the Linux environment, and access these completely seamlessly from Windows. I don't think I've ever
encountered a hiccup developing on the typical Postgres/MySQL with Flask/FastAPI and Vue/React on Vite type stacks.
However, I have found two cases where this setup starts to get in your way:
[anything involving CUDA](https://learn.microsoft.com/en-us/windows/ai/directml/gpu-cuda-in-wsl), and programming
Arduinos.

Getting closer to the metal seems to cause things to fray a little, though both cases have been mostly—though not
entirely—soluble for me. In the Arduino case, there actually isn't much of a reason to use WSL2 at all, but if you're
suitably determined that you want Linux shell nearby, you can get it to work.

### Why PlatformIO

I'm a fan of [PlatformIO](https://platformio.org/) largely because the 'developer experience' with the Arduino IDE is
pretty rough. Adding the PlatformIO extension to VSCode gives me similarly easy access to the Arduino libraries, and to
build and deploy tooling, but allows me to structure projects however I like, and allows me to stick with the IDE I use
every day.

## Brass tacks: sharing USB devices

### 0: Install usbipd-win

The actual problem is that WSL2 can't see your USB devices by default. To get around this, you first need to install
[usbipd-win](https://github.com/dorssel/usbipd-win).

Once you've done that, fire up a PowerShell terminal with admin privileges and run the following command to list your
USB devices:

```powershell
usbipd list
```

That should give you something like this:

{{<figure
src="/images/blog/09/usbipd-list.png"
title="usbipd devices"
class="rounded margin">}}

Once you hook up a board, you'll see it added to the list:

{{<figure
src="/images/blog/09/usbipd-list-board.png"
title="usbipd devices with board connected"
class="rounded margin">}}

At this point, a quick sanity check over on the WSL side should show that you have no USB devices connected:

```bash
lsusb
```

{{<figure
src="/images/blog/09/lsusb.png"
title="lsusb devices with Arduino not listed"
class="rounded margin">}}

### 1: Share the device

Now the device is connected, you need to share it with WSL. To do this, you need to bind the device to the usbipd-win
service. You can do this by running the following command in your PowerShell terminal:

```powershell
usbipd bind --busid 1-1
```

Where `1-1` is the bus ID of the device you want to share, visible in the `usbipd list` output above.

### 2: 'Connect' the device

Now you need to connect the device to WSL. You can do this by running the following command in your PowerShell terminal:

```powershell
usbipd attach --busid 1-1
```

Where `1-1` is the same bus ID as above.

Now you should be able to see the device in WSL:

{{<figure
src="/images/blog/09/usbipd-attached.png"
title="usbipd devices with Arduino attached"
class="rounded margin">}}

{{<figure
src="/images/blog/09/lsusb-attached.png"
title="lsusb with Arduino attached"
class="rounded margin">}}

### 3: Set permissions

Your Arduino board will likely appear as a 'teletypewriter' with 'Abstract Control Model' device, e.g., `/dev/ttyACM0`,
but you can check this by running `ls /dev/tty*` and looking for the device that appears when you connect the board.

Before you can actually program the board, you need to set permissions on the device. You can do this by running the
following command in your WSL terminal:

```bash
sudo chmod a+rw /dev/ttyACM0
```

This will give all users read and write permissions on the device—but this is probably bad practice for multi-user
systems.

### 4: Add your user to the dialout group

You also need to add your user to the `dialout` group, which is the group that has access to serial devices. You can do
this by running the following command in your WSL terminal:

```bash
sudo usermod -a -G dialout $USER
```

This will allow you to access serial devices without needing to use `sudo`.

### 5: Program

After that, you can build your project and program the board directly from the PlatformIO extension in VSCode.

{{<figure
src="/images/blog/09/pio-detection.png"
title="PlatformIO board detection"
class="rounded margin">}}

{{<figure
src="/images/blog/09/pio-programming.png"
title="PlatformIO board programming"
class="rounded margin">}}

## Limitations

This approach isn't perfect. While the sharing of devices via usbipd is persistent across reboots, the binding of the
devices is not. This means that you need to run the `usbipd bind` command every time you restart your computer. You may
also find you need to run the `chmod` command repeatedly, though a solution is given
[here](https://askubuntu.com/questions/1219498/could-not-open-port-dev-ttyacm0-error-after-every-restart).

This approach also will not work with all boards. For example, I have a Leonardo Rev3, which requires a press of the
reset button to enter programming mode. Pressing that reset button, however, triggers a disconnect/reconnect cycle,
which causes the usbipd connection to be lost before the upload can complete.

That said, this approach worked for two of the boards I have—and allowed me to stick with my regular tools until I
capitulated and transitioned to just programming the boards from Windows.
