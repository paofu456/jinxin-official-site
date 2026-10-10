export function checkOutputSafety(pages) {
  const errors = [];

  for (const page of pages) {
    const source = page.html.toLowerCase();
    if (source.includes("materials/") || source.includes("materials\\")) {
      errors.push(`${page.url}: private materials path leaked into HTML`);
    }
    if (source.includes("notes/") || source.includes("notes\\")) {
      errors.push(`${page.url}: private notes path leaked into HTML`);
    }
    if (/<link\s+rel=["']canonical["'][^>]+(?:localhost|127\.0\.0\.1)/i.test(page.html)) {
      errors.push(`${page.url}: localhost canonical URL emitted`);
    }
  }

  return errors;
}
