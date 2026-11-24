// Licensed scene photography: credits (photo-credits.ts) + optimised image
// files (src/assets/scenes, static imports for next/image).
import type { StaticImageData } from "next/image";
import alpine from "@/assets/scenes/alpine.jpg";
import forest from "@/assets/scenes/forest.jpg";
import hero from "@/assets/scenes/hero.jpg";
import viewpoint from "@/assets/scenes/viewpoint.jpg";
import village from "@/assets/scenes/village.jpg";
import amadablam from "@/assets/scenes/amadablam.jpg";
import chitwan from "@/assets/scenes/chitwan.jpg";
import abc from "@/assets/scenes/abc.jpg";
import everest from "@/assets/scenes/everest.jpg";
import kalapatthar from "@/assets/scenes/kalapatthar.jpg";
import mardi from "@/assets/scenes/mardi.jpg";
import namche from "@/assets/scenes/namche.jpg";
import pumori from "@/assets/scenes/pumori.jpg";
import tengboche from "@/assets/scenes/tengboche.jpg";
import kathmandu from "@/assets/scenes/kathmandu.jpg";
import lumbini from "@/assets/scenes/lumbini.jpg";
import panorama from "@/assets/scenes/panorama.jpg";
import pokhara from "@/assets/scenes/pokhara.jpg";
import sarangkot from "@/assets/scenes/sarangkot.jpg";
import paragliding from "@/assets/scenes/paragliding.jpg";
import skyfishtail from "@/assets/scenes/skyfishtail.jpg";
import rafting from "@/assets/scenes/rafting.jpg";
import climbing from "@/assets/scenes/climbing.jpg";
import bhaktapur from "@/assets/scenes/bhaktapur.jpg";
import egret from "@/assets/scenes/egret.jpg";
import rhino from "@/assets/scenes/rhino.jpg";
import lumbinipool from "@/assets/scenes/lumbinipool.jpg";
import rafting2 from "@/assets/scenes/rafting2.jpg";
import lumbinithai from "@/assets/scenes/lumbinithai.jpg";
import { photoCredits, type PhotoCredit, type PhotoKey } from "./photo-credits";

export type { PhotoKey };
export type Photo = PhotoCredit & { src: StaticImageData };

const files: Record<PhotoKey, StaticImageData> = { alpine, forest, hero, viewpoint, village, amadablam, chitwan, abc, everest, kalapatthar, mardi, namche, pumori, tengboche, kathmandu, lumbini, panorama, pokhara, sarangkot, paragliding, skyfishtail, rafting, climbing, bhaktapur, egret, rhino, lumbinipool, rafting2, lumbinithai };

export const photos = Object.fromEntries(Object.entries(photoCredits).map(([k, c]) => [k, { ...c, src: files[k as PhotoKey] }])) as Record<PhotoKey, Photo>;
