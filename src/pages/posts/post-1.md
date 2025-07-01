---
layout: ../../layouts/MarkdownPostLayout.astro
title: 'Getting Started'
pubDate: 2025-06-24
description: 'Lets get started with the AUP-ZU3!.'
author: 'Rosa Vergara'
image:
    url: 'https://www.realdigital.org/img/bb333648a727ad749067e8cc2ab51f6c.png'
    alt: 'Close up of the AUP-ZU3 FPGA development board.'
tags: ["Getting Started", "AUP-ZU3", "Tutorial"]
---
First a look at the basic tools we will be using to operate the AUP-ZU3 FPGA board:
<ul>
    <li>USB-C cable (for data/programming)</li>
    <li>USB-C power supply (for powering the board)</li>
    <li>Vivado (for hardware development)</li>
    <li>Vitis (for software development)</li>
</ul>

<details>
    <summary>Step 1: Tool Istallation</summary>
    <div class="content">
        content that can be expanded or collapesd.
    </div>
</details>

<details>
  <summary>Step 2: Block Design in Vivad</summary>
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