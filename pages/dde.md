# dde

This "blog" has taken a lot of development to get it to even a basic state.

Where does the overhead in making a blog come from? To me, the first barrier was the overhead that exists with web development itself.
You need to setup a local server. Simple enough. But what if you want automatic reloads and all those handy things?
I know that there exists tools which do make all of this simpler, but to my eye, these are still quite high overhead.

My solution? I made my own, simple, web development utility. It injects a websocket script into all `.html` files, and scans files for changes.
Other than that, it's just a local fileserver.

Now I have a smooth development cycle, I save, it'll update the page, and things work as they should. But what about actually writing something?
Am I going to rawdog HTML? Duplicate the head, header, footer, etc.? No, that sounds awful.
Although I looked at existing templating options, none seemed to be that much better than another.
So I decided to make my own, how hard could it be after all? <span class="clueless"></span>

1. list files in pages
2. compile md pages to html
3. use JS template literals to produce full html pages



- Static file web development tooling.
- Theme toggling JS.
- Generating static HTML from markdown files.

## Abstraction, not indirection

Cognitive overhead comes from indirection, not necessarily abstraction.

This expression is relatively abstract. Some might argue that it is hard to read, not maintanable, etc.
But in truth, this is deceptively simple. It might be higher order in the way it abstracts its logic,
but at its core, it is procedural.
```go
fileNames, err := fsio.Walk(gen.Not(fsio.IsDir))(".")
```

It has just a single level of indirection. It doesn't hide the underlying procedures, but rather raises them to higher order of abstraction.

```go
// fsio.IsDir
func IsDir(f string) bool {
	info, err := os.Stat(f)
	if err != nil {
		return false
	}
	return info.IsDir()
}
```


```go
// gen.Not
func Not[T any](fn func(T) bool) func(T) bool {
	return func(t T) bool { return !fn(t) }
}
```


```go
// fsio.Walk
func Walk(fn func(string) bool) func(string) (res []string, err error) {
	return func(root string) (res []string, err error) {
		err = filepath.Walk(root, func(path string, info os.FileInfo, err error) error {
			if err != nil {
				return err
			}
			if !fn(path) {
				return nil
			}

			path = Normalize(path)
			res = append(res, path)
			return nil
		})

		return
	}
}
```


The goal of abstraction, to me anyway, is not to obfuscate the nature of the underlying procedures.
But rather, to enable the reuse, composition, and utilization of those abstractions.

Conceptualize it by analogy to natural language.
What would a spoken language be like if words hid their meaning?
The value of a word, in truth, comes not from the meaning of the ***word***, but from the way that word transforms the meaning of the ***sentence***.

Applied to software, library and core development especially, then, the goal of an abstraction is to provide constructive "words" which can be composed to create "sentences".


So when we compare this kind of "low indirection, high abstraction" approach to the more common "high indirection, high abstraction" approach, what do we find?
The difference between them lies in the nature of how things are structured. Low indirection means high "width", while high indirection means high "depth".

If to understand what a piece of code does requires you to recurse through function or struct definitions, that would be high indirection.
If to understand what a piece of code does requires you to one by one look at the definitions of functions being composed, that is low indirection.

To conclude, low indirection enables the logic to be uncovered piece by piece, as opposed to having to maintain a "stack" of definitions while recursing through an abstraction.
