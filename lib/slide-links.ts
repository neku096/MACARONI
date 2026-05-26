import slideLinksData from "@/data/slide-links.json";

export type SlideLink = {
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

const slideLinks = slideLinksData as SlideLink[];

export function getAllSlideLinks() {
  return [...slideLinks].sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title, "ja"));
}
