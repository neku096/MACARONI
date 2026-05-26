import freePosesData from "@/data/free-poses.json";

export type FreePoseGalleryImage = {
  src: string;
  alt: string;
};

export type FreePose = {
  title: string;
  slug: string;
  description: string;
  character: string;
  thumbnail: string;
  downloadUrl: string;
  tags: string[];
  sortOrder: number;
  published: boolean;
  noindex: boolean;
  gallery?: FreePoseGalleryImage[];
};

export const freePoseCharacterOptions = [
  "愛莉",
  "ショコラ",
  "エク",
  "イチゴ",
  "クマリ",
  "ルミナ",
  "ラシューシャ",
  "マヌカ",
  "真冬",
  "まよ",
  "ミルフィ",
  "ミルティナ",
  "萌",
  "プラム",
  "ラムネ",
  "りりか",
  "ルルネ",
  "セレスティア",
  "しなの",
  "しお",
] as const;

const freePoses = freePosesData as FreePose[];

export function getAllFreePoses() {
  return [...freePoses].sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title, "ja"));
}
