import topCardsData from "@/data/top-cards.json";

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
  sourceProductSlug?: string;
};

const topCards = topCardsData as TopCard[];

export function getAllTopCards() {
  return [...topCards].sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title, "ja"));
}
