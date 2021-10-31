interface ImageInterface {
  src: string;
  srcset?: [number];
  sizes?: string;
  alt?: string;
}

export default interface MediaInterface {
  landscape: ImageInterface;
  portrait?: ImageInterface;
};
