function slugify(s) {
  return (
    s
      .toLowerCase()
      .trim()
      .normalize('NFKD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'page'
  );
}
export { slugify };
