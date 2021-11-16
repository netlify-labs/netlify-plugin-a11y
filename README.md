# netlify-plugin-a11y

Check for accessibility issues on critical pages of your Netlify website.

## What does this plugin do?
This plugin uses The [`pa11y`](https://github.com/pa11y/pa11y) (which in turn uses [`axe-core`](https://github.com/dequelabs/axe-core)) to check your Netlify project for accessibility issues.

If issues are found, the plugin generates a report which provides:
- the page on which the issue was found
- a description of the issue with a link to the relevant [Deque University rule](https://dequeuniversity.com/rules/axe/latest)
- the name of the error within the aXe API
- the path to the the relevant DOM element
- the DOM element itself
- the total number of issues on the page
- the sum of *all* issues across *all* pages that were checked

By default, the plugin checks **all** your site's pages for violations of WCAG 2.1 level AA, and fail the site build if any a11y issues are found.
## Demo

The demo site is an Eleventy blog containing some pages that have accessibility issues: https://netlify-plugin-a11y-demo.netlify.com/

- the "go home" link on [the 404 page](https://netlify-plugin-a11y-demo.netlify.app/404.html) has insufficient color contrast.
- the cat photo on [the blog post](https://netlify-plugin-a11y-demo.netlify.app/404.html) doesn't have an `alt` attribute.
- the textarea on [the contact page](https://netlify-plugin-a11y-demo.netlify.app/contact-me/) is missing a proper label


This is a screenshot of the build log for the demo site:
![Screenshot of demo site build log.](./assets/plugin-a11y-log.png)
<details>
	<summary>Text from screnshot of demo site build log</summary>

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


## Installation via the Netlify UI
To install the plugin in the Netlify UI, use this [direct in-app installation link](https://app.netlify.com/plugins/netlify-plugin-a11y/install) or go to the [plugins directory](https://app.netlify.com/plugins).

When installed this way, the plugin follows its default behavior, which is to check **all** your site's pages for violations of WCAG 2.1 level AA, and fail the site build if any a11y issues are found.

To change the plugin's behavior, you'll want to install it throigh your `netlify.toml` file.

## Installation via the `netlify.toml` file
First, you must be insalled as a dev dependency. If you're using NPM to manage your packages, run the following:
``` bash
npm install --save-dev @netlify/plugin-a11y
```

If you're using Yarn, run the following:
``` bash
yarn add --dev @netlify/plugin-a11y
```

Next, you'll need to add the `@netlify/plugin-a11y` to the plugins section of your `netlify.toml` file.

```toml
[[plugins]]
  package = "@netlify/plugin-a11y"
```
⚠️ In `.toml` files, whitespace is important! Make sure `package` is indented two spaces.

If you want to use the plugin's default settings (check **all** pages of your site for violations of WCAG 2.1 level AA; fail the netlify build if issues are found), this is all you need to do. If you want to change the way the plugin behaves, read on to the next section.

## Configuration
If you've installed the plugin via `netlify.toml`, you can add a `[[plugins.inputs]]` field to change how the plugin behaves. This table outlines the inputs the plugin accepts. All of them are optional.


| Input name          	| Description                                                                  	| Possible values                               	| Default value 	|
|---------------------	|------------------------------------------------------------------------------	|-----------------------------------------------	|---------------	|
| `checkPaths`        	| An array of strings indicating which pages of your site to check.            	| Any directories or html files in your project 	| `['/']`       	|
| `failWithIssues`    	| A boolean indicating whether the build should fail if a11y issues are found. 	| `true` or `false`                             	| `true`        	|
| `ignoreDirectories` 	| An array of directories that *should not* be checked for a11y issues.        	| Any directories within your project           	| `[]`          	|
| `wcagLevel`          	| The WCAG standard level against which pages are checked.                     	| `'WCAGA'` or `'WCAGAA'` or `'WCAGAAA'`        	| `'WCAGAA'`    	|

Here's how these inputs can be used in `netlify.toml`, with comments to explain how each input affects the plugin's behavior:

``` toml
[[plugins]]
  package = "@netlify/plugin-a11y"
  [plugins.inputs]
    # Check all HTML files in this project (the default behavior)
    checkPaths = ['/']
    # Do not fail the build if a11y issues are found
    failWithIssues = false
    # Ignore all HTML files in `/admin`
    ignoreDirectories = ['/admin']
    # Perform a11y check against WCAG 2.1 AAA
    wcagLevel = 'WCAGAAA'
```
