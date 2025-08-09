# Astro Starter Kit: Minimal

```sh
npm create astro@latest -- --template minimal
```

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/withastro/astro/tree/latest/examples/minimal)
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/sandbox/github/withastro/astro/tree/latest/examples/minimal)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/withastro/astro?devcontainer_path=.devcontainer/minimal/devcontainer.json)

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

## Adding tabs to cards (On Blog index page)

1. Navigate to src/styles/card.css
2. Under "Selected tab style" comment add 
    * ,#tabN:checked ~ .tab-labels label[for="tabN"]
    * where N = next tab number
3. Under "Ensure the panel doesn't overlap the tab visually" comment near the bottom, add
    * ,#tabN:checked ~ .card-panels #cardN
    * where N = next tab number
4. Navigate to src/pages/blog.astro
    1. If you need to make a new map for a directory
        * Add dirctory in src/blog/
        * In frontmatter under the "\//get posts from certain directories" comment, add
            * const postsMap = sortedPosts.filter(post => post.id.startsWith('blogDir/'));
            * Where postsMap = name of map, blogDir = directory where posts live
    2. In \<div class="stack-tabs"> \</div>
        1. Under "\<!-- Inputs must come first -->" comment, add
            * \<input type="radio" name="tab" id="tabN" hidden />
            * where N = next tab number
        2. Under "\<!-- Then the labels -->" comment, add
            * \<label for="tabN">Other Board</label>
            * where N = next tab number
        3. Under "\<!-- Then the panels -->" comment, add
            1. \<section id="card2">\</section>
            2. Inside it add: \<div class="index-card-stack">\</div>
            3. Inside it add: \<div class="index-card">\</div>
            4. Inside it add: 
                1. \<span class="index-card-label">LabelN\</span>
                    * Where LabelN = tab label name
                2. \<p>Content message.\</p>
                3. \<ul>{ PostsMap.map((post) => (<BlogPost url={`/posts/${post.id}/`} title={post.data.title} />))}\</ul>
                    * Where PostsMap = name of mapped posts directory being used