import company from "../data/company.json";

export function makePageTitle(page?: string) {
  return page ? `${page} | ${company.name}` : `${company.name}｜钢结构工程与装配式建筑`;
}
