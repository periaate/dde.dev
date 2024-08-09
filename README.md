# dde.dev

My website, along with the code that generates it.

## Tasks
Testing out [xc](https://github.com/joerdav/xc), which is like `Makefile`, but uses markdown. Handy!

### Build

```sh
go run main.go
```

### Dev

```sh
wgo -file .md -file .go -file .templ -xfile _templ.go -debounce 16ms templ generate :: go run main.go
```

