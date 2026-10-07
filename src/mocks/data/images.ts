import authHero from '@/assets/images/auth-hero.webp';
import banhMi from '@/assets/images/banh-mi.webp';
import catBanhMi from '@/assets/images/cat-banh-mi.webp';
import catBun from '@/assets/images/cat-bun.webp';
import catCom from '@/assets/images/cat-com.webp';
import catHuTieu from '@/assets/images/cat-hu-tieu.webp';
import catPho from '@/assets/images/cat-pho.webp';
import comTam from '@/assets/images/com-tam.webp';
import phoBo from '@/assets/images/pho-bo.webp';

/** Mock CDN. A real backend returns absolute image URLs instead. */
export const mockImages = {
  authHero,
  banhMi,
  bun: catBun,
  comTam,
  huTieu: catHuTieu,
  phoBo,
  categories: {
    com: catCom,
    huTieu: catHuTieu,
    pho: catPho,
    bun: catBun,
    banhMi: catBanhMi,
  },
};

const KEYWORD_IMAGES: Array<[RegExp, string]> = [
  [/phở|pho/i, phoBo],
  [/bánh mì|banh mi/i, banhMi],
  [/hủ tiếu|hu tieu/i, catHuTieu],
  [/bún|bun/i, catBun],
  [/cơm|com/i, comTam],
];

/** Picks a stock photo for a dish name, like a real image service might. */
export function guessDishImage(name: string): string {
  return KEYWORD_IMAGES.find(([pattern]) => pattern.test(name))?.[1] ?? comTam;
}
