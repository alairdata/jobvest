export const scrapeIndeed = () => {
  const title =
    document.querySelector(".jobsearch-JobInfoHeader-title")?.textContent?.trim() ||
    document.querySelector('[data-testid="jobsearch-JobInfoHeader-title"]')?.textContent?.trim() ||
    document.querySelector("h1")?.textContent?.trim() ||
    "";

  const company =
    document.querySelector('[data-testid="inlineHeader-companyName"]')?.textContent?.trim() ||
    document.querySelector(".jobsearch-InlineCompanyRating-companyHeader")?.textContent?.trim() ||
    "";

  const location =
    document.querySelector('[data-testid="inlineHeader-companyLocation"]')?.textContent?.trim() ||
    document.querySelector('[data-testid="job-location"]')?.textContent?.trim() ||
    "";

  const descEl =
    document.querySelector("#jobDescriptionText") ||
    document.querySelector(".jobsearch-jobDescriptionText") ||
    document.querySelector('[class*="jobDescription"]');

  const description = descEl?.innerText?.trim() || "";

  return { title, company, description, location, source: "indeed" };
};
