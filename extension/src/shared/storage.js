import { STORAGE_KEYS } from "./constants";

export const getResume = () =>
  new Promise((resolve) =>
    chrome.storage.local.get(STORAGE_KEYS.RESUME, (r) =>
      resolve(r[STORAGE_KEYS.RESUME] || null)
    )
  );

export const saveResume = (data) =>
  new Promise((resolve) =>
    chrome.storage.local.set({ [STORAGE_KEYS.RESUME]: data }, resolve)
  );

export const getApplications = () =>
  new Promise((resolve) =>
    chrome.storage.local.get(STORAGE_KEYS.APPLICATIONS, (r) =>
      resolve(r[STORAGE_KEYS.APPLICATIONS] || [])
    )
  );

export const addApplication = async (app) => {
  const apps = await getApplications();
  apps.unshift({ ...app, date: new Date().toLocaleDateString() });
  return new Promise((resolve) =>
    chrome.storage.local.set({ [STORAGE_KEYS.APPLICATIONS]: apps }, resolve)
  );
};
