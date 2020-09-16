---
name: 'Why use Encodable?'
---

# Why use Encodable?

## Motivation

> Developing reusable components with consistent APIs is challenging.

Each component ends up having very different API.
If you develop a word cloud component, how would you let user specify the `fontSize`, `color`,
`text` etc.?

One common approach is to accept accessor functions as arguments, but then you punt most of the
implementation responsibilities to the library consumer. The configuration is also not serializable.

```js
{
  "fontSize": d => scale(d) // you have to setup a scale, set its domain, make domain start at 0, etc.
}
```

Then there are alternatives such as exposing a number of arbitrarily chosen fields, e.g.
`fontSizeField`, `fontSizeRange`, which you have to handle inside the component. If you start from
expecting `fontSize` to be using linear scale and later want to support log scale, you may have to
expose new field `fontSizeScaleType` and include new logic for creating log scale.

Later on, if you start developing a suite of components, you either have to come up with a list of
common properties or naming conventions, so all of your visualization components at least work
similarly. After all, this is likely to be yet another standard that only applies to your
components.

## Inspiration

This library was heavily inspired by [`vega-lite`](https://github.com/vega/vega-lite). `vega-lite`
gives you a grammar and rendering engine that you can use to create many different visualizations
from it. For example, this is how you create a
[bar chart](https://vega.github.io/vega-lite/examples/bar.html) of population by country in
`vega-lite`:

```json
{
  "mark": "bar",
  "encoding": {
    "x": {"field": "country", "type": "ordinal"},
    "y": {"field": "population", "type": "quantitative"}
  }
}
```

Notice how the encoding for channels `x` and `y` are described. See `vega-lite`'s
[channel definition](https://vega.github.io/vega-lite/docs/encoding.html#channel-definition) for
full syntax explanation. For those who are less familiar with `vega-lite`, this visualization
grammar is already supported on known platforms such as [Observable](https://observablehq.com/) or
Jupyter Notebook (via [Altair](https://altair-viz.github.io/), its python port).

> Could I develop a component which provides an API that looks like `vega-lite` grammar?

Although the grammar is very flexible and covers the definitions of the most common visualizations
already, what you can created are still limited by what `vega-lite` renderer supports. (`vega-lite`
has a fixed set of channels.) You hit a roadblock when you want to develop a non-traditional
component that cannot be described in `vega-lite`, or a traditional component with many subtle
details that you struggle to describe the visualization and its interactions in `vega-lite`'s
channels and grammar.

## Enter Encodable

`encodable` was created to address this need. When you already have a specific visualization in mind
and know how to build it, this library helps you **make the component "encodable"** and provide
standardized API similar to `vega-lite`'s
[channel definition](https://vega.github.io/vega-lite/docs/encoding.html#channel-definition) for
consumers to define their **encoding**.

This is an example of how component consumers define `color`, `fontSize` and `text` channels for a
word cloud component that is powered by `encodable`.

```js
{
  encoding: {
    color: {
      field: 'name',
      scale: {
        scheme: 'd3Category10',
      },
      type: 'nominal',
    },
    fontSize: {
      field: 'numberOfStudents',
      scale: { range: [0, 72] },
      type: 'quantitative',
    },
    text: {
      field: 'name',
    }
  }
}
```

See the full
[example code](https://codesandbox.io/s/encodable-wordcloud-demo-k66ui?fontsize=14&hidenavigation=1&theme=dark).

More specifically, Encodable

- provides configuration for defining your own grammar for the encoding channels of your component.
  The resulting grammar is a TypeScript type, which can be used to type-check the specification from
  component users.
- adopts the
  [channel definition](https://vega.github.io/vega-lite/docs/encoding.html#channel-definition)
  grammar from `vega-lite` (only key features) to define visual encoding channels as well as logic
  for determining smart defaults (e.g. choosing scale type based on data type, etc.)
- does NOT render the component. It only parses incoming specification from component users into utility functions that helps you render
  the visualization component.
- framework agnostic: You can use anything you want (D3, React, Vue, etc.).

<!-- ## Demo

Most recent release: https://kristw.github.io/encodable

-->

