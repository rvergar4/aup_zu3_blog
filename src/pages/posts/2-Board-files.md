---
layout: ../../layouts/MarkdownPostLayout.astro
title: 'Board Files'
pubDate: 2025-07-12
description: 'how to install 3rd part board descriptions in Vivado to simplify the integration of on-board peripherals; most tutorials assume these files have been installed'
author: 'Ron Sass <rsass@charlotte.edu>'
image:
  url: '/assets/aupzu3/aupzu3.png'
  alt: 'Close up of the AUP-ZU3 FPGA development board.'
tags: ["AUP-ZU3", "Installation Note"]
---

This very short "how to" shows how to install a "boards file"
for Vivado, especially if it is not in the Xilinx Board Store.

AMD's Vivado tool works just fine if you just specify which chip
you are using (AMD knows every detail of the ICs it manufactures).
However, many third-parties put AMD chips on Printed Circuit
Boards (PCBs) and there is no way for Vivado to know how the pins
on the packaged IC are wired to other components on the PCB ---
unless the PCB manufacturer tells Vivado.  That's exactly what
the "board file" does.  Inside the GUI, a wizard will walk a
user through the one-time process.  However it does not install
the files system-wide and not every board is in the wizard's
catalog.  For these cases, use these instructions.

## Objective

(1) decide what kind of install (per-user or system-wide) and (2)
how to copy the files

## Pre-Requisites

*   Vivado already installed 

*   board file archive from 3rd party vendor

*   basic UNIX command-line tools

<details>
<summary>1. Hardware Configuration</summary>
<div class="content">

something something something ... XSA

</div>
</details>


<details>
<summary>2. Software Executable</summary>
<div class="content">

something something something ... ELF

</div>
</details>

<details>
<summary>3. Download and Debug</summary>
<div class="content">

Connect - download - run or debug

</div>
</details>


