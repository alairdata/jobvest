export const scrapeLinkedIn = () => {
  const title =
    document.querySelector(".job-details-jobs-unified-top-card__job-title h1")?.textContent?.trim() ||
    document.querySelector(".jobs-unified-top-card__job-title")?.textContent?.trim() ||
    document.querySelector("h1")?.textContent?.trim() ||
    "";

  const company =
    document.querySelector(".job-details-jobs-unified-top-card__company-name a")?.textContent?.trim() ||
    document.querySelector(".jobs-unified-top-card__company-name a")?.textContent?.trim() ||
    "";

  const location =
    document.querySelector(".job-details-jobs-unified-top-card__bullet")?.textContent?.trim() ||
    document.querySelector(".jobs-unified-top-card__bullet")?.textContent?.trim() ||
    "";

  const descEl =
    document.querySelector(".jobs-description__content") ||
    document.querySelector(".jobs-description-content__text") ||
    document.querySelector("#job-details") ||
    document.querySelector('[class*="description"]');

  const description = descEl?.innerText?.trim() || "";

  return { title, company, description, location, source: "linkedin" };
};
