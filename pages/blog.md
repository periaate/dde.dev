# Building process of this blog

This "blog" has taken a lot of development to get it to even a basic state. Speaking of which, this page is not yet finished. <span icon=business></span>

Where does the overhead in making a blog come from? To me, the first barrier was the overhead that exists with web development itself.
You need to setup a local server. Simple enough. But what if you want automatic reloads and all those handy things?
I know that there exists tools which do make all of this simpler, but to my eye, these are still quite high overhead.

My solution? I made my own, simple, web development utility. It injects a websocket script into all `.html` files, and scans files for changes.
Other than that, it's just a local fileserver.

Now I have a smooth development cycle, I save, it'll update the page, and things work as they should. But what about actually writing something?
Am I going to rawdog HTML? Duplicate the head, header, footer, etc.? No, that sounds awful.
Although I looked at existing templating options, none seemed to be that much better than another.
So I decided to make my own, how hard could it be after all? <span icon="clueless"></span>

- Static file web development tooling.
- Theme toggling JS.
- Generating static HTML from markdown files.



Finalized process:

1. list all `.part.html` files in `parts/`.
2. read found files, use the filename without the `.part.html` as the object keys, the content of those files as the value.
3. use [`mdtohtml`](https://github.com/gomarkdown/markdown) to parse markdown to html.
4. use JS templating to compile the `part` files and the compiled html to a single, complete page.


