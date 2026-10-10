export function checkSeo(pages) {
  const errors = [];

  for (const page of pages) {
    const title = page.html.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim();
    const description = page.html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i)?.[1]?.trim();
    const headings = page.html.match(/<h1(?:\s[^>]*)?>/gi) ?? [];
    const images = page.html.match(/<img\s[^>]*>/gi) ?? [];

    if (!title) errors.push(`${page.url}: missing title`);
    if (!description) errors.push(`${page.url}: missing meta description`);
    if (headings.length !== 1) errors.push(`${page.url}: expected one h1, found ${headings.length}`);

    for (const image of images) {
      const alt = image.match(/\salt=["']([^"']*)["']/i);
      const decorative = /\saria-hidden=["']true["']/i.test(image) || /\srole=["'](?:none|presentation)["']/i.test(image);
      if (!alt) {
        errors.push(`${page.url}: image is missing an alt attribute`);
      } else if (!alt[1].trim() && !decorative) {
        errors.push(`${page.url}: image has empty alt text without explicit decorative semantics`);
      }
    }
  }

  return errors;
}
