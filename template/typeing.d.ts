declare module "*.css";

declare module "*.png";

declare module "*.svg";

declare module "*.jpg";

declare module "*.stylus";

declare module "*.less";

declare interface MapLike <T = any> {
    [K: string]: T;
}
