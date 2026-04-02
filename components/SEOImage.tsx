import Image from "next/image";

type Props = {
  src: string;
  city: string;
  neighborhood?: string;
  width?: number;
  height?: number;
};

export default function SEOImage({
  src,
  city,
  neighborhood,
  width = 1200,
  height = 800,
}: Props) {

  const cityName =
    city.charAt(0).toUpperCase() + city.slice(1);

  const altText = neighborhood
    ? `${neighborhood} ${cityName} Colorado homes and real estate`
    : `${cityName} Colorado real estate and homes`;

  return (
    <Image
      src={src}
      alt={altText}
      width={width}
      height={height}
      className="rounded-lg"
    />
  );
}