import type {
  ProductImage,
  ProductMedia,
  ProductOption,
  ProductVariant,
} from "@/types/product";

export function isProductImage(media: ProductMedia): media is ProductImage {
  return !("mediaContentType" in media);
}

function isColourOption(option: ProductOption) {
  return /colou?r/i.test(option.name);
}

function sameIds(left: string[], right: string[]) {
  return (
    left.length === right.length &&
    left.every((id, index) => id === right[index])
  );
}

function mediaIdsForColour(
  colourOption: ProductOption,
  colour: string,
  variants: ProductVariant[],
  imageIds: Set<string>,
) {
  const matchingVariants = variants.filter((variant) =>
    variant.selectedOptions.some(
      ({ name, value }) => name === colourOption.name && value === colour,
    ),
  );
  if (matchingVariants.length === 0) return null;

  const associations = matchingVariants.map((variant) =>
    [
      ...new Set((variant.mediaIds ?? []).filter((id) => imageIds.has(id))),
    ].sort(),
  );
  const expected = associations[0];

  if (
    !expected?.length ||
    associations.some((association) => !sameIds(association, expected))
  ) {
    return null;
  }

  return expected;
}

export function imagesForSelections(
  images: ProductImage[],
  options: ProductOption[],
  variants: ProductVariant[],
  selections: Record<string, string>,
) {
  const colourOption = options.find(isColourOption);
  if (!colourOption) return images;

  const selectedColour = selections[colourOption.name];
  if (!selectedColour || !colourOption.values.includes(selectedColour)) {
    return images;
  }

  const imageIds = new Set(images.map((image) => image.id));
  const selectedMediaIds = mediaIdsForColour(
    colourOption,
    selectedColour,
    variants,
    imageIds,
  );
  if (!selectedMediaIds) return images;

  if (selectedMediaIds.length > 1) {
    const selectedIds = new Set(selectedMediaIds);
    return images.filter((image) => selectedIds.has(image.id));
  }

  const anchors = colourOption.values.map((colour) => {
    const mediaIds = mediaIdsForColour(
      colourOption,
      colour,
      variants,
      imageIds,
    );
    if (mediaIds?.length !== 1) return null;

    return {
      colour,
      index: images.findIndex((image) => image.id === mediaIds[0]),
    };
  });

  if (
    anchors.some((anchor) => !anchor || anchor.index < 0) ||
    new Set(anchors.map((anchor) => anchor?.index)).size !== anchors.length
  ) {
    return images;
  }

  const orderedAnchors = anchors
    .filter((anchor): anchor is NonNullable<typeof anchor> => anchor !== null)
    .sort((left, right) => left.index - right.index);
  if (orderedAnchors[0]?.index !== 0) return images;

  const selectedIndex = orderedAnchors.findIndex(
    (anchor) => anchor.colour === selectedColour,
  );
  if (selectedIndex < 0) return images;

  const start = orderedAnchors[selectedIndex]?.index;
  const end = orderedAnchors[selectedIndex + 1]?.index ?? images.length;
  return start === undefined ? images : images.slice(start, end);
}
