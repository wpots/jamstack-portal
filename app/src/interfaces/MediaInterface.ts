interface ImageInterface {
  src: string;
  srcset?: [number];
  sizes?: string;
}

export default interface MediaInterface {
  landscape: ImageInterface;
  portrait?: ImageInterface;
  
}