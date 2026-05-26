import { readFileSync } from "node:fs";
import path from "node:path";

export type TopCard = {
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  category: string;
  tags: string[];
  sortOrder: number;
  published: boolean;
  openInNewTab: boolean;
};

const topCardsPath = path.join(process.cwd(), "data", "top-cards.json");

export function getAllTopCards() {
  const topCards = JSON.parse(readFileSync(topCardsPath, "utf8")) as TopCard[];
  return [...topCards].sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title, "ja"));
}
