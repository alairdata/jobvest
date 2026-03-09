export const scrapeGlassdoor = () => {
  const title =
    document.querySelector('[data-test="job-title"]')?.textContent?.trim() ||
    document.querySelector(".job-title")?.textContent?.trim() ||
    document.querySelector("h1")?.textContent?.trim() ||
    "";

  const company =
    document.querySelector('[data-test="employer-name"]')?.textContent?.trim() ||
    document.querySelector(".employer-name")?.textContent?.trim() ||
    "";

  const location =
    document.querySelector('[data-test="location"]')?.textContent?.trim() ||
    document.querySelector(".location")?.textContent?.trim() ||
    "";

  const descEl =
    document.querySelector(".jobDescriptionContent") ||
    document.querySelector('[class*="JobDesc"]') ||
    document.querySelector('[class*="jobDescription"]');

  const description = descEl?.innerText?.trim() || "";

  return { title, company, description, location, source: "glassdoor" };
};
