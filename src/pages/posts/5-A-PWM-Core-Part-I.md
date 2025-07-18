---
layout: ../../layouts/MarkdownPostLayout.astro
title: 'Creating a VHDL PWM Core: Part I'
pubDate: 2025-07-07
description: 'Develop and test a core in simulation that generates a periodic signal that pulses with a specified duty-cycle.'
author: 'Ron Sass <rsass@charlotte.edu>'
image:
  url: '/assets/aupzu3/aupzu3.png'
  alt: 'Close up of the AUP-ZU3 FPGA development board.'
tags: ["AUP-ZU3", "Tutorial", "Helpful Hint"]
---

This XYZ-minute lab will show how to create a simple RTL core
written in VHDL to create a periodic waveform that pulses with
a specified duty-cycle.  It has two inputs:  one parameter counts
system clock periods (to determine output frequency) and a second
says how many of these periods are low before transitioning high
(to determine the duty-cycle).  The approach will use a mix of
behavioral and structural VHDL code to describe the hardware.
Vivado 2025.1 will be used to develop and test the core.

This is Part One of a two-part series.  In Part Two, we will use
our validated core in a complete adaptive computing system by
adding a processing system, interconnect, and a bus interface.
Ultimately what we want to do is dim the brightness of an LED
by controlling how much energy goes into the device (and relying
on how human perceive high-frequencies).

## Objective

By following along, an engaged user will see how to create a
HDL core from scratch using AMD's Vivado.  The approach uses
both Vivado's GUI and TCL command-line to accomplish specific
tasks such as design entry, syntax checking, adding a testbench.
The lab stops with a waveform but leave the project set for the
next step (which will be building an entire system-on-chip with
processing systems and integrating our new core).

## Pre-Requisites

* installed board_files that match (AUP-ZU3-8GB or AUP-ZU3-4GB)
  see "install hint"


## Warning

There are many ways to skin a cat when designing hardware cores
and systems.  Best practices and conventions vary across the industry!  
Our approach is very subjective and while it is currently our
preferred way we are always willing to adopt a more productive or
safer way to do things.  You should be too.

Also, be warned that strobing any light can cause adverse effects
on some humans.  The frequencies used here are generally considered
safe but be aware and conscious of any unintended side-effects of
manipulating energy in any form.

## Set-Up

While many IDEs have defaults which makes it easy to start a project,
we prefer to make a directory structure ("folders") to organize
the variety of components (hardware, run-time system, libraries,
testing software, application, etc) in our system.  For this part,
we only need the hardware but we are setting up a structure for
future parts.

If you haven't already, set up your terminal window for Vivado.
Your steps might vary ...

```
source /opt/xilinx/Vivado/2024.2/settings64.sh
term-title "Vivado 2024.2"
```

(The second command is a local script that sets the title on the
terminal window; just a handy way of keeping track which window
was has the settings64.sh sourced and which does not.  You can
set it with a menu option on most terminal applications.)

Then go to where you'd like to collect a set of related projects
(by tutorial, course, semester, customer, ... or some combination)
and then start with a hardware directory.

```
❱ cd 07-06/
❱ mkdir labN
❱ cd labN
```

In this case, `labN` will hold all of the components (hw, sw, ...)
for this specific lab exercise.

<details>
    <summary>Developing the Core</summary>
    <div class="content">

If you are seasoned hardware designer and fluent in HDL, skip ahead
to Source Files.  If you are not sure how to begin, this might be
helpful.

1.  This problem is often called a "clock divider" but that's kind of
an awkward name.  It is really a frequency divider.  If our eventual
target is an Ultrascale+ (16nm technology IC) FPGA fabric, then the
default peripheral bus clock speed is a 100 MHz.  This is really fast for human
perception --- a normal flashing light might be 0.5 to 2 Hz (a 100 million
to one ratio).  So if we want a lower-frequency, periodic signal
we split our output period into two parts.  During the first part,
we count a bunch ($M$ number) of high-frequency clock cycles while
outputing low.  During the second part we count a bunch of ($N$ number)
of high-frequency clock cycles while outputing high.  Then repeat.
The resulting output signal is periodic and a lower frequency than
the original.  How much lower?  The original frequency is divided
by $M+N$.  Also, how we set $M$ and $N$ determine the percentage of
time in the period that the output is high, which is called its
duty cycle.  So understanding this, we can now tackle the problem.

2. First observation is that throughout our description we kept
refering to ``counting clock'' cycles.  This gives us a huge hint.
If we know how to describe a counter circuit, we could use two
counters -- one for $M$ and one for $N$.  Or we could use one counter
(for $M+N$) and then be clever about how we output the resulting
signal.  A sophomore-level Digital Logic course will typically
teach FSM by starting with a block design that uses has a register,
a next-state function (what happens on the rising clock edge of the
input clock), and an output function.  And a counter is
very common first example.  The register holds the current "value"
of the counter.  The next-state function either (1) resets value
once the maximum is reached or (2) set the input to be one more than
the current value.  This counts the range $0$ to $M+N$,
advancing once every clock cycle, which is almost exactly what we
need.  The only missing piece is that while the current "value" is
less than $M$, we need to output low and when it is not less than,
we output high.

Visually, one can map this to the blocks of an FSM.  Or one can leap
to an HDL-style textual representation of the PWM core.  It is not
unreasonable to reference some pre-existing examples of how people
have coded up a counter at this point --- no reason in this situation
to re-invent the wheel.  Either by reference or by reasoning, we
will want

* a register (large enough to count to 100 million)

* a next-state function that will change the register every clock
cycle

From this, we get the VHDL process pseudocode ...

```vhdl
signal value: unsigned(31 downto 0) ; -- infers a register

if clk'event and clk='1' then  -- (a rising clock edge)
    if a reset then
        set next value to 0
    else
        if value is not the last value
            set next value to be one more than current value
        else
            set next value to 0
end if ;
```

For those that are new to FPGA design, it is worth noting we
have made a subtle choice here.  Every FSM has an initial state
and customarily use a reset signal to say, "start".  So in the
pseudocode we have choosen to check first for whether there is a
rising clock edge and then we check if reset is asserted.  This is
called a synchronous reset.  (An asynchronous reset checks for
reset before looking for a rising clock edge and will immediately
put the FSM in its reset state.)  An immediate reset is faster on
average (by half a clock period) but for an LED, does 5 ns matter?
Not really.  However the FPGA vendor recommends synchronous
(versus asynchronous) reset because of how the programmable
logic is wired internally.  So while either is possible, it is
usually the case that one way is more efficient than the other
--- you should check for your target technology.  An experience
designer in your group will have horror stories of how these
little inefficiencies can add up to catastrophic design fails.
So when in doubt, ask someone with gray hair and wrinkles.

A second thing to observe is that
we are setting next value to 0 in two places, we
might want to refactor this code before we formalizing it.  The
equivalent logic is to the nested if statements is to say
"if it is a reset or last value" then
set the next value to 0 and the alternative is one more than
add one, so the new pseudocode is

```vhdl
signal value: unsigned(31 downto 0) ; -- infers a register

if clk'event and clk='1' then  -- (a rising clock edge)
    if rst='1' or value=($M+N-1$) then
        set next value to 0
    else
        set next value to be one more than current value
end if ;
```

It turns out that it makes no difference to compiler/synthesis tool
and does not change how it is implemented in programmable logic.
So, if it is easier for a human, then one could argue that the
refactoring yielded a net gain.   (Many consider a one-deep nested
if-statement less complex than doubly-nested, if even though the
condition becomes more complex.)  Perhaps the strongest argument
against making this change is that it breaks from a very common idiom
(if rising clock and then a nested if reset) which might cause
someone to have to do a double-take, just to figure out what's going
on.

A final thing to consider before considering the entity is:
should the then-clause be the most common case and the else-clause
be the exception?  After the previous simplification, I'm not
sure if the change adds any clarity but the condition "not reset
and not the last" is less clear than the original.  In this case,
we opt not to change it.

Now we turn to the public interface --- what should the entity
look like?  Clearly, we need a clock and reset as inputs and the
names `clk` and `rst` are customary.  Our parameters $M$ and $N$
are fine for pseudocode but more descriptive names
`input_cycles_per_output_period` and `num_of_low_cycles` define
themselves.  But a 30-character signal name is not practical
so we might settle on `period` and `low` and be rely on the
documentation to describe them more fully.  The output is one
bit that toggles back and forth to generate the output signal.
While `output` might be a candidate, we reject it over `toggle`
because it is so generic.  While `toggle` has the potential of
being replaced, it works for now and if it is not immediately
obvious about what it does, it will drive a future designer to
the documenation to answer it.  So we call this good enough
for now.  The only other thing to consider is whether we should
output the current value.  As an output, it does not address
any of the problem statement's requirements.  However, when
we have simulate the core, it will be very convenient to
see the progress and will tell us to look changes to toggle.
Futhermore, if we do not connect the output to anything in
synthesis, the tools will trim away all of the logic needed
to produce the output.  So it costs us nothing but might be
helpful in debugging, so we map it out the generic name `Q`.
Why `Q`?  Well, if you recall, $q_i$ is the customary names
of states in an FSM and so we use `Q` for generic signals
coming out of a state register.  So for debugging purposes,
`Q` is providing insight into the current state of the FSM.

Armed with these thoughts about the public interface to our
module, we can write the VHDL:

```vhdl
entity pwm is
    Port ( 
        clk    : in std_logic ;
        rst    : in std_logic ;
        period : in unsigned(31 downto 0) ;  -- num of cycles in output period
        low    : in unsigned(31 downto 0) ; -- num of low cycles
        Q      : out unsigned(31 downto 0) ; -- just for debugging
        toggle : out std_logic 
    );
end pwm ;
```

To this we need add the ieee library and import the symbols
from the appropriate namespaces.  And then formally code up
our pseudocode as actual VHDL in an architecture for our
`pwm` module.
    </div>
</details>


<details>
    <summary>Create Source Files</summary>
    <div class="content">

1. core : taking our design notes (previous section) we can derive a
simple VHDL entity/architecture pair to describe our PWM core.
I call this file `pwm.vhdl` and I create it outside of my project
and then copy it into the Vivado tool.  It would be perfectly
reasonable to create empty source files in Vivado and type in the
code using the built-in editor.

```vhdl
library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

-- poor man's simple PWM; just a modified counter state machine
-- with a output function for when to toggle high and low
-- duty cycle is:  (period-low)/period   (i.e. percent high)

entity pwm is
    Port ( 
        clk    : in std_logic ;
        rst    : in std_logic ;
        period : in unsigned(31 downto 0) ;  -- num of cycles in output period
        low    : in unsigned(31 downto 0) ; -- num of low cycles
        Q      : out unsigned(31 downto 0) ; -- just for debugging
        toggle : out std_logic 
    ) ;
end pwm ;

architecture imp of pwm is
    signal value: unsigned(31 downto 0) ; -- infers a register
begin
    -- next state function (behaviorial)
    process(clk) begin
        if clk'event and clk='1' then
            if rst='1' or value=>(period-1) then
                -- restart next FSM cycle in the initial state
                value <= (others => '0') ;
            else
                -- if it is not a reset and we are not at the last cycle,
                -- then advance the counter for next cycle
                value <= value + 1 ;
            end if ;
        end if ;
    end process ;
    -- output function (structural)
    Q <= value ;  -- helpful to see in simulation
    toggle <= '0' when value<low else '1' ;
end imp ;
```

2. testbench : VHDL is terribly wordy and, in the case
of testbench, mindlessly repetitive.  So you can use any number of
sophisticated tools (cocotb, VUnit, etc.) or simple ones or even
some editors plug-ins that automate this task for you.  I googled
"source for VHDL testbench generator script" and a web page called
"VHDL Testbench Creation Using Perl" showed up first.  Using their
online generator, I dropped in my VHDL core.  (I wouldn't do this
for any proprietary code obviously but this is so trivial it would
take more effort to decide if it is useful than to create it from
scratch!)

```vhdl
library IEEE;
use IEEE.Std_logic_1164.all;
use IEEE.Numeric_Std.all;

entity pwm_tb is
end;

architecture bench of pwm_tb is

  component pwm
      Port ( 
          clk : in std_logic ;
          rst : in std_logic ;
          period : in unsigned(31 downto 0) ;
          low    : in unsigned(31 downto 0) ;
          q   : out unsigned(31 downto 0) ;
          toggle : out std_logic 
      );
  end component;

  signal clk: std_logic;
  signal rst: std_logic;
  signal period: unsigned(31 downto 0) := to_unsigned(20,32)  ;
  signal low: unsigned(31 downto 0) := to_unsigned(2,32) ;
  signal q: unsigned(31 downto 0) ;
  signal toggle : std_logic ;

  constant clock_period: time := 10 ns;
  signal stop_the_clock: boolean;

begin

  -- set parameters to output a 20-cycle clock period with 2 LOW, 18 HIGH
  uut: pwm port map ( clk    => clk,
                          rst    => rst,
                          period => to_unsigned(20,32),
                          low    => to_unsigned(2,32),
                          q      => q,
                          toggle => toggle );

  stimulus: process
  begin

    -- Put initialisation code here
    rst <= '1' ;
    wait for 10 ns ;
    rst <= '0' ;
    
    -- Put test bench stimulus code here
    wait for 10*100 ns ;

    stop_the_clock <= true;
    wait;
  end process;

  clocking: process
  begin
    while not stop_the_clock loop
      clk <= '0', '1' after clock_period / 2;
      wait for clock_period;
    end loop;
    wait;
  end process;

end;
```

For the basic step, we want to take the VHDL entity declaration from
our core and generates a skeleton testbench.  The first one that
came up when I searched "source VHDL testbench generator script" was
[https://www.doulos.com/knowhow/perl/vhdl-testbench-creation-using-perl/]

I call this file `pwm_tb.vhdl` and I create it outside of my project
and then copy it in ...  Again, inside the IDE you can create a new
source and copy/paste or type this code into an empty file.
I find working with an standalone editor faster and more familiar
so I'm adept at making changes.  However, the IDE's editor definitely
provides better syntax checking and tab-completion if you like that.

When I plug in my entity, got a start that retooled for what I wanted
to check.  I'm less concerned about formatting and naming conventions
on this testbench because it really is meant to be thrown away.  However,
if you are going to be developing a more complex core and expect
revisions and reuse --- you want to a tool to automate unit testing
and employ unit testing best practices.  This, however, is beyond our
scope here!
    </div>
</details>

<details>
    <summary>Create Project</summary>
    <div class="content">

As mentioned before, we want a directory structure where the
hierarchy organizes a set of projects (say, a semester-long course)
and then create a directory in this structure for this current project.
Starting in that directory ... we are going to begin creating a
hierarchy for hardware and software components.  If you copy the
`pwm.vhdl` and `pwm_tb.vhdl` into this directory, it is their
temporary home since we will copy them into their proper place
with TCL in Vivado.

1. Start Vivado in command-line mode so we can create a hardware
project.

```
❱ vivado -mode tcl
file mkdir hw
cd hw
create_project test_pwm . -part xczu3eg-sfvc784-2-e
set_property board_part realdigital.org:aup-zu3-8gb:part0:1.0 [current_project]
set_property target_language VHDL [current_project]
```

For the Z2 ...
```
create_project test_pwm . -part xc7z020clg400-1
set_property board_part_repo_paths $env(HOME)/.Xilinx/Vivado/2024.2/xhub/board_store/xilinx_board_store [current_project]
set_property board_part tul.com.tw:pynq-z2:part0:1.0 [current_project]
```

From TCL script generated from `File > Project > Write Tcl`
```
set_property -name "board_part_repo_paths" -value "/home/rsass/.Xilinx/Vivado/2024.2/xhub/board_store/xilinx_board_store" -objects [current_project]
```


These commands will create a project called "test_pwm" and identify
the board (an aup-zu3-8gb from realdigital.org).  While not required
for this (simulation) lab, it will be helpful for Part II when we
build a system and add our PWM core to it.


2. Next, let's add our core to the source set (where it can be used
for simulation or synthesis in Part II).  Then we add the testbench
to just a fileset for simulation.  Depending where your VHDL files
are, you may have to tweak the path to them.

```
add_files -norecurse $env(HOME)/Downloads/pwm.vhdl
add_files -fileset sim_1 -norecurse $env(HOME)/Downloads/pwm_tb.vhdl 
import_files -force -norecurse
```

If you want to add the files by copy/paste, skip these three steps
above and proceed to start the GUI.

```
start_gui
```

At this point you should be able to see the opened project in the
"PROJECT MANAGER" perspective.  The sub-window with "Project Summary"
will show some key properties of the project.  It will look something
like this:

<figure>
    <a href="/assets/5-A-PWM-Core-Part-I/project-summary.png" target="_blank">
        <img src="/assets/5-A-PWM-Core-Part-I/project-summary.png" width="500"
            alt="project summary">
    </a>
    <figcaption>Figure 1: Project Summary</figcaption>
</figure>

Personal note:  Since I know the part number (xczu3eg-sfvc784-2-e)
and the board (realdigital.org:aup-zu3-8gb), the first three lines of
Listing 1 are way easier to me than hunting and pecking my way through
a "wizard" in a GUI.  And, yeah, the Wizard will let me added the
two files automatically but still prefer to just state what I want
before starting the GUI.  BTW:  You can start the GUI immediately
and type these lines in on the TCL console ... the effect is the same.
    </div>
</details>

<details>
    <summary>Test!</summary>
    <div class="content">

* open files in Vivado's editor, check for syntax errors

1. go to sources window, expand all
2. double click on bold pwm(imp) (pwm.vhdl)
3. double click on bold pwm_tb(bench) (pwm_tb.vhdl)
you can inspect the files, looking for an obvious errors highlighted
by the IDE editor

<figure>
    <a href="/assets/5-A-PWM-Core-Part-I/sources-window.png" target="_blank">
        <img src="/assets/5-A-PWM-Core-Part-I/sources-window.png"
            alt="sources window">
    </a>
    <figcaption>Figure 2: Sources Subwindow</figcaption>
</figure>

If all looks good, let's create a waveform

* test in simulation

1. click on "Run Simulation" -> "Run Behavioral Simulation"

* you get a compact form that's hard to read (imho) ... quick adjustments
for a small screen ...
<figure>
    <a href="/assets/5-A-PWM-Core-Part-I/waveform-subwindow.png" target="_blank">
        <img src="/assets/5-A-PWM-Core-Part-I/waveform-subwindow.png" width="500"
            alt="waveform subwindow">
    </a>
    <figcaption>Figure 3: Waveform Subwindow</figcaption>
</figure>

- in the waveform subwindow, click on the "float" icon to pop the
    window out on its own
- then I hit the "Maximize" icon to fill the screen
- then I hit "Zoom to fit" to get my entire testbench waveform visible
- then I move my "current time" slider back to t=0 which you can slide
    manually or by hitting the "Go to Time 0" back button
- now hit "Zoom in" three times to get me to pleasant 10ns time scale
    which matches the 10ns the testbench generator script automatically
    created
<figure>
    <a href="/assets/5-A-PWM-Core-Part-I/zoomed-in-waveform.png" target="_blank">
        <img src="/assets/5-A-PWM-Core-Part-I/zoomed-in-waveform.png" width="600"
            alt="zoomed in waveform">
    </a>
    <figcaption>Figure 4: Zoomed in Waveform</figcaption>
</figure>

* discuss the output ... 
    - first look at Q ... is my counter working?
    - check the corner cases ... starts on 0, ends on 19 ... exactly
      20 cycles ... check what was input? x'14 is 20 decimal, so, yup,
      exactly right
    - now let's look at my real output ... the other input says it should
      be low for 2 clock cycles ... `x'00` and `x'01` are 0 then it goes
      to 1 ...
    - scrolling ahead, I don't have to count them because if 2 are low,
      then the rest are high, then we Q cycles back to 0, it should go
      low again ... so it must be right

* let's pop that window back in by hitting "Dock" button and we can
  close the simulation (little X in the simulator perspective) and it
  takes us back to our Project Manager perspective

* there is so much more we could do with the simulator but this is all
we needed for this part

    </div>
</details>

## What Did We Demonstrate

So what did we do in this exercise?  We started with a problem statement
and sketched out a design based on our past experience and the
particulars of this problem.  We refined our design, expressing it
in pseudocode and then formally code it up.