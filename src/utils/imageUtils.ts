import { GameImageSize, type GameImageSizeType } from "../types";

export const getGameImageUrl = (
  imageId: string,
  imageSize: GameImageSizeType = GameImageSize.CoverBig,
) => {
  if (!imageId) return "/placeholder-image.jpg";
  return `https://images.igdb.com/igdb/image/upload/t_${imageSize}/${imageId}.jpg`;
};
