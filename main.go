package main

import (
	"bytes"
	"context"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"dde/parts"

	"github.com/gomarkdown/markdown"
	"github.com/gomarkdown/markdown/html"
	"github.com/gomarkdown/markdown/parser"
	"github.com/periaate/blume/clog"
	"github.com/periaate/blume/fsio"
	"github.com/periaate/blume/str"
	"golang.org/x/text/cases"
	"golang.org/x/text/language"
)

func mdToHTML(md []byte) []byte {
	// create markdown parser with extensions
	extensions := parser.CommonExtensions | parser.AutoHeadingIDs | parser.NoEmptyLineBeforeBlock
	p := parser.NewWithExtensions(extensions)
	doc := p.Parse(md)

	// create HTML renderer with extensions
	htmlFlags := html.CommonFlags | html.HrefTargetBlank
	opts := html.RendererOptions{Flags: htmlFlags}
	renderer := html.NewRenderer(opts)

	return markdown.Render(doc, renderer)
}

type Page struct {
	Meta parts.Meta
	Path []string
	Body string
}

var foot = `<small>Contact me: <a href="mailto:daniel@saury.fi">daniel@saury.fi</a></small>`

func Compose(p Page) string {
	headB := bytes.NewBuffer(nil)

	parts.Head(p.Meta).Render(context.Background(), headB)

	headerB := bytes.NewBuffer(nil)
	parts.Header(parts.Path(p.Path...)).Render(context.Background(), headB)

	return fmt.Sprintf(`
		<!DOCTYPE html>
		<html>
		<head>
			%s
		</head>
		<body>	
			%s
			%s
			%s
		</body>
		</html>`,
		headB.String(), headerB.String(), p.Body, foot)
}

func main() {
	clog.Info("building site")
	clog.Info("cleaning pages")
	ht, err := fsio.Walk(str.HasSuffix(".html"))("./")
	if err != nil {
		clog.Fatal("failed to walk html files", "err", err)
	}

	for _, h := range ht {
		err = os.Remove(h)
		if err != nil {
			clog.Fatal("failed to remove html file", "path", h, "err", err)
		}
	}

	clog.Info("building pages")
	pages, err := fsio.Walk(str.HasSuffix(".md"))("./pages/")
	if err != nil {
		clog.Fatal("failed to walk pages", "err", err)
	}

	roots := make(map[string][]parts.Meta)

	for _, page := range pages {
		clog.Info("building page", "path", page)
		mdb, err := os.ReadFile(page)
		if err != nil {
			clog.Fatal("failed to read md file", "path", page, "err", err)
		}
		page = strings.TrimSuffix(page, ".md")
		path := strings.Split(page, "/")[1:]

		md := string(mdb)
		args := strings.Split(md, "\n")[:2]
		title := strings.TrimPrefix(args[0], "# ")
		desc := args[1]

		root := fsio.Normalize(filepath.Dir(strings.Join(path, "/")))
		name := fsio.Name(page)
		html := mdToHTML(mdb)

		p := Page{
			Meta: parts.Meta{
				Title:       title,
				Description: desc,
				URL:         "https://dde.dev/" + root + "/" + name,
				Name:        name,
			},
			Path: strings.Split(strings.TrimSuffix(page, "index"), "/")[1:],
			Body: string(html),
		}

		htmlf := Compose(p)
		page = strings.Join(path, "/")

		err = fsio.EnsureDir(filepath.Dir(page))
		if err != nil {
			clog.Fatal("failed to ensure dir", "err", err)
		}

		err = os.WriteFile(page+".html", []byte(htmlf), 0o644)
		if err != nil {
			clog.Fatal("failed to write file", "err", err)
		}

		if len(root) > 2 {
			roots[root] = append(roots[root], p.Meta)
		}
	}

	clog.Info("building index")
	for root, metas := range roots {
		root = strings.TrimSuffix(root, "/")
		clog.Info("building index", "root", root)

		p := Page{
			Meta: parts.Meta{
				Title:       cases.Title(language.English).String(root),
				Description: "index",
				URL:         "https://dde.dev/" + root,
			},
			Path: strings.Split(root, "/"),
		}

		dirb := bytes.NewBuffer(nil)
		parts.Directory(root, metas).Render(context.Background(), dirb)

		p.Body = dirb.String()
		htmlf := Compose(p)

		err = os.WriteFile(root+".html", []byte(htmlf), 0o644)
		if err != nil {
			clog.Fatal("failed to write file", "err", err)
		}
	}
}
