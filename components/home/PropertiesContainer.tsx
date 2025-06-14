import { fetchProperties } from "@/utils/action";
import { PropertyCardProps } from "@/utils/types";
import EmptyList from "./EmptyList";
import PropertiesList from "./PropertiesList";

async function PropertiesContainer({
  category,
  search,
  location,
}: {
  category?: string;
  search?: string;
  location?: string;
}) {
  const properties: PropertyCardProps[] = await fetchProperties({
    category,
    search,
    location, // 👈 Thêm dòng này để lọc theo địa điểm
  });

  if (properties.length === 0) {
    return (
      <EmptyList
        heading="No results."
        message="Try changing or removing some of your filters."
        btnText="Clear Filters"
      />
    );
  }

  return <PropertiesList properties={properties} />;
}

export default PropertiesContainer;
