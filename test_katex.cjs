const katex = require('katex');
try {
  katex.renderToString(String.raw`\begin{aligned} x^2 - x + 6 &= 0 \\ b^2 - 4ac &= (-1)^2 - 4(1)(6) \\ &= 1 - 24 \\ &= -23 \end{aligned}` + "\n\nSince discriminant < 0, there are no real roots.", {displayMode: true});
  console.log('success');
} catch (e) {
  console.error('Error:', e.message);
}
