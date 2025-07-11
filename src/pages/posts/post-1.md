---
layout: ../../layouts/MarkdownPostLayout.astro
title: 'Getting Started'
pubDate: 2025-06-24
description: 'Lets get started with the AUP-ZU3!.'
author: 'Rosa Vergara'
image:
    url: '/assets/aupzu3/aupzu3.png'
    alt: 'Close up of the AUP-ZU3 FPGA development board.'
tags: ["Getting Started", "AUP-ZU3", "Tutorial"]
---
First a look at the basic tools we will be using to operate the AUP-ZU3 FPGA board:

- USB-C cable (for data/programming)</li>
- USB-C power supply (for powering the board)</li>
- Vivado (for hardware development)</li>
- Vitis (for software development)</li>

<details>
    <summary>Step 1: Tool Installation</summary>
    <div class="content">
        content that can be expanded or collapsed.
    </div>
</details>

<details>
  <summary>Step 2: Block Design in Vivado</summary>
  content that can be expanded or collapesd.
</details>

<style>
  .content {
    display: none;
  }
  details[open] .content {
    display: block;
  }
  summary {
    cursor: pointer;
  }
</style>

Sources:
<a href="https://github.com/RealDigitalOrg/aup-zu3-bsp" target="_blank" rel="noopener noreferrer">Real Digital's GitHub aup-zu3-bsp repository
</a>