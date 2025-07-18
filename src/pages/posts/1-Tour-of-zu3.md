---
layout: ../../layouts/MarkdownPostLayout.astro
title: 'Tour of AUP-ZU3 Board'
pubDate: 2025-07-09
description: 'A trip to the "Zu"'
author: 'Ron Sass'
image:
    url: '/assets/aupzu3/aupzu3.png'
    alt: 'Close up of the AUP-ZU3 FPGA development board.'
tags: ["AUP-ZU3", "Tour"]
---

This XYZ-min introduction to AMD's University Program's
adaptive computing board, the AUP-ZU3 with no coding
or EDA tools needed!

## Objective

The simple goal of these brief instructions is to help
a user identify the ports needed for powering the board
and programming/debugging.  Highlight some of the on-board
peripherals.

## Pre-Requisites

* get your hands on either a 4 or 8 GB AUP-ZU3 board


<details>
<summary>Initial Connections</summary>
<div class="content">

1.  power

    *   identify the power USB
    *   on/off switch
    *   word about power block (looks like a phone charger but it
        uses USB-C protocol and requires a 45W transformer)

2.  debugging

    *   serial console
    *   JTAG

3.  SD memory card

    *   technically, it is a microSD (not roughly 3cm x 2cm)
    *   card can move between the ZU3's microSD slot and a
        reader, either a built-in laptop/desktop reader
        or an external USB reader; people say reader but all
        of them read and write

There is a switch below the microSD slot the selects the default
boot mode:  "JTAG" means wait for JTAG commands (over the USB cable)
and "SD" means immediately look for a BOOT.BIN file and start
the power-up sequence with its contents.

</div>
</details>


<details>
<summary>Welcome to the Board!</summary>
<div class="content">

Before we even try to create our first custom computing machine
or even write our first C program, let's load an existing design
and look at some of the peripherals.

1.  Download this BOOT.BIN file.

2.  Put the SD card into a laptop/desktop computer with a reader
    and when the card is detected, look for the first partition.

3.  Copy this BOOT.BIN file over top of the existing BOOT.BIN on
    card.  (If it is a brand new card; you may need to format it
    and prepare the right partitions ... see ??? Digilent? Real Digital?)

4.  On the board, set the power switch off.  Plug the power block
    into an electrical socket, plug in the USB-C cable to the block
    and the other end into the board.

5.  Move/insert the microSD card into the ZU3's microUSB slot.
    (face side ... up?)

6.  Using a second USB-C cable, plug one end into a computer.  Even
    without powering on the board, one or two new (virtual) Serial Port(s)
    will appear.  On Linux, this will be something like "/dev/ttyUSB0"
    and "/dev/ttyUSB1".  On Windows ... control panel or something ...
    and show up as COM99 ... ???

7.  Next you need a (virtual) terminal application; also know as a terminal
    emulator.  There are lots and lots
    to choose from and nowadays most IDEs have one built into them
    (somewhere).  For Linux, I like gtkterm because it is very simple,
    supports all the basic stuff an embedded systems programmer
    might want.  (You can use stty and directly access the serial
    device with ordinary Unix commands as well which is not a bad
    trick to learn if you want a cheap easy way to collect data
    from an experiment.)  For windows, PuTTY is a good option and
    it does a lot more than just terminal emulation.  TeraTerm,
    X, Y, and Z are all Windows options as well...

    Using the tool of your choice, open the terminal and set the
    port options.  At minimum, you need to set the serial port
    and UART confirations.  For Linux, this is the second USB port
    with UART configured for 115,200 baud rate, 8 bit words, no parity,
    and 1 stop bit.
    For Windows ... I have no idea ... it is one of the COM ports
    that pop up and same UART configuration.

    It should look something like this ...

8.  Now we are ready!  Flip the power switch to on!

    *   the power light should go on 
        (screen shot)

    *   the "programmed" light should turn on after 2-3 second delay
        (this indicates the programmable logic was configured)

    *   on the terminal window ... the welcome greeting should show
        up

    *   you can follow instructions in the terminal window to see
        some of the features on the board demonstrated

    *   at any point you can simple flip the power switch to off
        and disconnect the board

</div>
</details>

## What Did We Learn?

So what did we do in this exercise?  Hopefully, you now see how
connect up the board.  You learned what a couple of the switches
do.  You were able to get a terminal window open, which will be
helpful when debugging your designs.  And hopefully you learned
how to avoid a few pit-falls.  These are all useful skills so that
when you go to do your first design or project, this part of testing
your design is not going to be brand new.  In other blog entries,
we don't bother to create a BOOT.BIN and transfer the image from
a computer to the board on a microSD.  Instead, we'll use the
JTAG port and transfer the image directly over the cable from
the computer to the board.  However, you always have the option
of making and using the microSD route.


