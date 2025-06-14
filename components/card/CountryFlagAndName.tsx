import { findProvinceByCode } from "@/utils/vietnamProvinces";


function CountryNameOnly({ countryCode }: { countryCode: string }) {
  if (!countryCode) {
    return <span className="text-sm text-muted-foreground">Unknown</span>;
  }

  const name =
    countryCode.length > 20
      ? `${countryCode.substring(0, 20)}...`
      : countryCode;

  return <span className="text-sm">{name}</span>;
}

export default CountryNameOnly;
