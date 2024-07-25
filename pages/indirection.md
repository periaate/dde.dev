# Abstraction, not indirection

Cognitive overhead comes from indirection, not abstraction.

This expression is relatively abstract. Some might argue that it is hard to read, not maintainable, etc.
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

			res = append(res, path)
			return nil
		})

		return
	}
}
```


This isn't just any abstraction, but an abstraction based on tacit programming and combinatory logic.
I believe that tacit programming perfectly represents the low indirection, high abstraction paradigm.
Data and transformations are separated.

The value of this paradigm, in my opinion, comes from its utility in the initial stages of creating solutions.
By not needing to focus on the details, the structure, the flow of data, the algorithms and transformations, they can be fleshed out.

But in reality, as Rob Pike points out, this level of coupling and dependence on higher order functions isn't the best for performance or for maintainability.


<blockquote>
    <p>A little copying is better than a little dependency — <cite><a href="https://www.youtube.com/watch?v=PAAkCSZUG1c&t=568s">Rob Pike</a></cite></p>
</blockquote>

Our paradigm here is very synergistic with this ideology.
Once the structure of a program is clear, it can be unwrapped, inlining the abstractions to create idiomatic, procedural code.
This is because our paradigm is not separate from the procedural paradigm, but just a higher order abstraction of it.


```go
fsio.Walk(gen.Not(fsio.IsDir))(".")
```

Directly simplifies to:

```go
err = filepath.Walk(".", func(path string, info os.FileInfo, err error) error {
    if err != nil || info.IsDir() {
        return err
    }

    res = append(res, path)
    return nil
})
```

Declarative programming is not purely the domain of functional programming. If anything, it has great affinity to procedural code, as, what is a procedure but a piece of logic?
The "purity" of that logic is inconsequential to the role and outcome of that logic.

Procedures are de facto declarative. For example, `map` is just a procedure over an array with a function. Internalizing this enables you to approach procedures from the perspective of defining logic over data using another function. This is what `map` is at its core. A procedure which simply describes the way in which a transformation is applied over data. Whether it is "functional" or "pure" is irrelevant to its nature. It's nothing but an implementation detail.
