export const scrapeGeneric = () => {
  const title = document.querySelector("h1")?.textContent?.trim() || document.title || "";

  // Try to find company from meta tags
  const company =
    document.querySelector('meta[property="og:site_name"]')?.content ||
    document.querySelector('meta[name="author"]')?.content ||
    "";

  // Find the largest text block on the page as the job description
  const blocks = Array.from(document.querySelectorAll("article, main, [role='main'], .content, .description, section"))
    .map((el) => ({ el, len: el.innerText?.length || 0 }))
    .sort((a, b) => b.len - a.len);

  const description = blocks[0]?.el?.innerText?.trim() || document.body.innerText.slice(0, 5000);

  const location = "";

  return { title, company, description, location, source: "generic" };
};
