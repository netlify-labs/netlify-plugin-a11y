# netlify-plugin-a11y

Check for accessibility issues on critical pages of your Netlify website.

## Demo

The demo site is an Eleventy blog containing some pages that have accessibility issues: https://netlify-plugin-a11y-demo.netlify.com/

- the "go home" link on [the 404 page](https://netlify-plugin-a11y-demo.netlify.app/404.html) has insufficient color contrast.
- the cat photo on [the blog post](https://netlify-plugin-a11y-demo.netlify.app/404.html) doesn't have an `alt` attribute.
- the textarea on [the contact page](https://netlify-plugin-a11y-demo.netlify.app/contact-me/) is missing a proper label


The build log for the demo site looks like this:

![](./assets/plugin-a11y-log.png)
<details>
	<summary>Text copy of the log screenshot</summary>

``` bash
 Results for URL: file:///opt/build/repo/demo/404.html
1:28:11 PM:  • Error: ARIA hidden element must not contain focusable elements (https://dequeuniversity.com/rules/axe/4.3/aria-hidden-focus?application=axeAPI)
1:28:11 PM:    ├── aria-hidden-focus
1:28:11 PM:    ├── #content-not-found. > a
1:28:11 PM:    └── <a class="direct-link" href="#content-not-found." aria-hidden="true">#</a>
1:28:11 PM:  • Error: Elements must have sufficient color contrast (https://dequeuniversity.com/rules/axe/4.3/color-contrast?application=axeAPI)
1:28:11 PM:    ├── color-contrast
1:28:11 PM:    ├── html > body > main > p > a
1:28:11 PM: Creating deploy upload records
1:28:11 PM:    └── <a href="/" style="color:#aaa">home</a>
1:28:11 PM: 2 Errors
1:28:11 PM: Results for URL: file:///opt/build/repo/demo/posts/2018-05-01/index.html
1:28:11 PM:  • Error: Images must have alternate text (https://dequeuniversity.com/rules/axe/4.3/image-alt?application=axeAPI)
1:28:11 PM:    ├── image-alt
1:28:11 PM:    ├── html > body > main > div:nth-child(2) > figure > img
1:28:11 PM:    └── <img src="/img/cats-570x720.png" width="570" height="720">
1:28:11 PM: 1 Errors
1:28:11 PM: Results for URL: file:///opt/build/repo/demo/contact-me/index.html
1:28:11 PM:  • Error: Form elements must have labels (https://dequeuniversity.com/rules/axe/4.3/label?application=axeAPI)
1:28:11 PM:    ├── label
1:28:11 PM:    ├── html > body > main > div:nth-child(2) > form > textarea
1:28:11 PM:    └── <textarea height="auto" rows="10" width="100%" style="width: 100%"></textarea>
1:28:11 PM: Starting post processing
1:28:11 PM: 1 Errors
1:28:11 PM: 4 accessibility violations found! Check the logs above for more information
```
</details>


## Usage

To install the plugin in the Netlify UI, use this [direct in-app installation link](https://app.netlify.com/plugins/netlify-plugin-a11y/install) or go to the [Plugins directory](https://app.netlify.com/plugins).

For file-based installation, add the following lines to your `netlify.toml` file:

```toml
[[plugins]]
package = "netlify-plugin-a11y"

  # all inputs are optional, we just show you the defaults below
  [plugins.inputs]

  # required config
  checkPaths = ['/'] # you can give an array of directories or paths to html files, that you want to run a11y checks on

  ## Another checkPaths Example
  checkPaths = [
    '/blog',
    '/about.html',
    '/super/specific/route/index.html',
  ]

  # # optional config
  # ignoreDirectories = ['/admin']  # explicitly ignore these directories

  # resultMode = "warn" # is "error" by default

  # # Developer only
  # debugMode = true # extra logging for plugin developers
```

To complete file-based installation, from your project's base directory, use npm, yarn, or any other Node.js package manager to add the plugin to `devDependencies` in `package.json`.

```bash
npm install -D netlify-plugin-a11y
```

### Execution in Netlify

Once installed and configured, the plugin will automatically run in the Netlify CI during its specified Netlify Build lifecycle event.

### Executing locally

To test the execution of the Netlify Build lifecycle locally, first ensure that netlify-build is installed:

```bash
# Ensure that you have the netlify build command available
# (in future this will be provided via the CLI)
npm install @netlify/build -g

# In the project working directory, run the build as netlify would with the build bot
netlify-build
```

## Future plans

- configure specific a11y rules to run
