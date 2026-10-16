import company from "../data/company.json";
import companyEn from "../data/company-en.json";
import type { Locale } from "../i18n/ui";

export function makePageTitle(page?: string, lang: Locale = "zh") {
  if (lang === "en") {
    return page ? `${page} | ${companyEn.name}` : `${companyEn.name} | Steel Structure & Prefabricated Construction`;
  }
  return page ? `${page} | ${company.name}` : `${company.name}｜钢结构工程与装配式建筑`;
}
