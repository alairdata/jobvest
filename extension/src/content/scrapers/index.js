import { SITE_PATTERNS } from "../../shared/constants";
import { scrapeLinkedIn } from "./linkedin";
import { scrapeIndeed } from "./indeed";
import { scrapeGlassdoor } from "./glassdoor";
import { scrapeGeneric } from "./generic";

const scraperMap = {
  linkedin: scrapeLinkedIn,
  indeed: scrapeIndeed,
  glassdoor: scrapeGlassdoor,
};

export const detectSite = () => {
  const url = window.location.href;
  for (const { pattern, name } of SITE_PATTERNS) {
    if (pattern.test(url)) return name;
  }
  return null;
};

export const scrapeJobDescription = () => {
  const site = detectSite();
  const scraper = scraperMap[site] || scrapeGeneric;
  const result = scraper();

  // Validate — need at least some description text
  if (!result.description || result.description.length < 50) {
    return { ...result, success: false };
  }

  return { ...result, success: true };
};
