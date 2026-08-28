import type { Publication } from "@/lib/types";

const sourceUrl = "https://omshreemadhavanandji.org/publication_book.php";
const cover = (file: string) => `https://omshreemadhavanandji.org/content/pub_book/${file}`;

export const sourceBooks: Publication[] = [
  { id: "book-ishavasyopnishad", slug: "ishavasyopnishad", kind: "book", titleGu: "Ishavasyopnishad", coverImageUrl: cover("ishavasyo_upnishad_l.jpg"), verified: true, sourceUrl },
  { id: "book-ishwar-swarup-varnanmala", slug: "ishwar-swarup-varnanmala", kind: "book", titleGu: "Ishwar Swarup Varnanmala", coverImageUrl: cover("ishwar_swarup_varnanmala_l.jpg"), verified: true, sourceUrl },
  { id: "book-madhavanandji-jivanlila-updesh", slug: "madhavanandji-jivanlila-updesh", kind: "book", titleGu: "Madhavanandji Jivanlila & Updesh", coverImageUrl: cover("jivanlila_updesh_l.jpg"), verified: true, sourceUrl },
  { id: "book-shree-sadguru-mahima", slug: "shree-sadguru-mahima", kind: "book", titleGu: "Shree Sadguru Mahima", coverImageUrl: cover("shree_sadguru_mahima_l.jpg"), verified: true, sourceUrl },
  { id: "book-shree-guru-gita-small", slug: "shree-guru-gita-small", kind: "book", titleGu: "Shree Guru Gita Small", coverImageUrl: cover("shree_guru_gita_small_l.jpg"), verified: true, sourceUrl },
  { id: "book-nirvan-smaranika", slug: "nirvan-smaranika", kind: "book", titleGu: "Nirvan Smaranika", coverImageUrl: cover("nirvan_smaranika_l.jpg"), verified: true, sourceUrl },
  { id: "book-guru-mahima", slug: "guru-mahima", kind: "book", titleGu: "Guru Mahima", coverImageUrl: cover("guru_mahima_l.jpg"), verified: true, sourceUrl },
];
