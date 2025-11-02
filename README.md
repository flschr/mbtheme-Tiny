Tiny Theme is created and maintained by Matt Langford. This is my custom version powering my [personal Micro.blog](https://fischr.org/).

## Social preview alternative text

To provide a custom alternative text for the social preview images, add an `opengraph` block to the page's front matter:

```yaml
opengraph:
  image: https://example.com/path/to/social-card.jpg
  alt: "Sunset over the valley from my last hike"
```

When no page-level alternative text is supplied, the theme falls back to the page title. You can optionally configure a global fallback that is used when a title is not available by defining `params.opengraph.altFallback` in your `config.json`/`config.yaml`.
