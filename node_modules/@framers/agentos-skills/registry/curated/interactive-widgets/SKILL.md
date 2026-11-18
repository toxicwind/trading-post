---
name: interactive-widgets
version: '1.0.0'
description: Generate interactive HTML/CSS/JS widgets — data visualizations, 3D scenes, dashboards, maps, and more.
author: Wunderland
namespace: wunderland
category: productivity
tags: [widget, interactive, html, visualization, d3, threejs, charts, maps, dashboard]
requires_secrets: []
requires_tools: [generate_widget]
metadata:
  agentos:
    emoji: "\u2728"
    homepage: https://wunderland.sh
---

# Interactive Widgets

You can create interactive HTML/CSS/JS widgets that run in the browser. Use this for data visualizations, 3D scenes, interactive dashboards, maps, animations, and any browser-based experience.

## When to Create Widgets

- User asks for data visualization, charts, graphs
- User asks for interactive demos, simulations, explorations
- User asks for 3D content, product viewers, scenes
- User asks for maps, geographic visualizations
- User says "show me", "visualize", "make it interactive"
- Data-heavy responses that benefit from interactivity

Do NOT create widgets for simple text responses, code examples, or static content.

## How to Write Widget HTML

Write self-contained HTML — all CSS in `<style>`, all JS in `<script>`, libraries via CDN.

### Common CDN URLs

- Three.js: `https://cdn.jsdelivr.net/npm/three@0.170/build/three.module.js`
- D3.js: `https://cdn.jsdelivr.net/npm/d3@7`
- Chart.js: `https://cdn.jsdelivr.net/npm/chart.js@4`
- Plotly: `https://cdn.jsdelivr.net/npm/plotly.js-dist@2`
- Leaflet: `https://unpkg.com/leaflet@1.9/dist/leaflet.js` (+ CSS: `https://unpkg.com/leaflet@1.9/dist/leaflet.css`)
- p5.js: `https://cdn.jsdelivr.net/npm/p5@1`
- Mermaid: `https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js`
- Anime.js: `https://cdn.jsdelivr.net/npm/animejs@4`

Use `type="module"` for ES module imports.

## Widget Format

Wrap widget HTML in `:::widget` fences in your response:

```
Here's an interactive chart of the data:

:::widget
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Data Chart</title>
  <style>body { margin: 0; background: #1a1a2e; color: #fff; font-family: system-ui; }</style>
</head>
<body>
  <script src="https://cdn.jsdelivr.net/npm/d3@7"></script>
  <script>
    // visualization code
  </script>
</body>
</html>
:::

Hover over the bars to see exact values.
```

## Best Practices

- Use dark theme by default (`background: #1a1a2e`)
- Make widgets responsive (`100vw`/`100vh`, flexbox)
- Add a visible title/header inside the widget
- Wrap JS in try/catch for error handling
- Keep inline widgets under 30KB
- Include interaction instructions after the widget
- Explain what the widget shows before the widget block
