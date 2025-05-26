import AmenitiesInput from "@/components/form/amenitiesinput";
import CategoriesInput from "@/components/form/categories";
import CountriesInput from "@/components/form/contriesinput";
import CounterInput from "@/components/form/counterinput";
import FormContainer from "@/components/form/formcontanier";
import ImageInputContainer from "@/components/form/imageinputcontainer";
import FormInput from "@/components/form/input";
import PriceInput from "@/components/form/priceinput";
import { SubmitButton } from "@/components/form/submitbtn";
import TextAreaInput from "@/components/form/textareainput";
import {
  fetchRentalDetails,
  updatePropertyAction,
  updatePropertyImageAction,
} from "@/utils/action";
import { Amenity } from "@/utils/amenities";
import { redirect } from "next/navigation";

export default async function EditRentalPage({ params }: { params: { id: string } }) {
  const property = await fetchRentalDetails(params.id);

  if (!property) redirect("/");

  const defaultAmenities: Amenity[] = JSON.parse(property.amenities);

  return (
    <section className="min-h-screen px-4 py-12 bg-gray-50">
      <div className="max-w-5xl mx-auto bg-white p-8 md:p-10 rounded-2xl shadow-md space-y-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Edit Property</h1>
          <p className="text-gray-500 mt-1">Update your listing details</p>
        </div>

        {/* Ảnh đại diện */}
        <ImageInputContainer
          name={property.name}
          text="Update Image"
          action={updatePropertyImageAction}
          image={property.image}
           className="h-40 w-40 rounded-xl object-cover border shadow"
        >
          <input type="hidden" name="id" value={property.id} />
        </ImageInputContainer>

        {/* Form chỉnh sửa */}
        <FormContainer action={updatePropertyAction}>
          <input type="hidden" name="id" value={property.id} />

          {/* General Info */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-700">📝 General Info</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <FormInput
                name="name"
                type="text"
                label="Name (max 20 characters)"
                defaultValue={property.name}
              />
              <FormInput
                name="tagline"
                type="text"
                label="Tagline (max 30 characters)"
                defaultValue={property.tagline}
              />
              <PriceInput defaultValue={property.price} />
              <CategoriesInput defaultValue={property.category} />
              <CountriesInput defaultValue={property.country} />
            </div>
          </div>

          {/* Description */}
          <div className="mt-10">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">📖 Description</h2>
            <TextAreaInput
              name="description"
              labelText="Description (10 - 100 words)"
              defaultValue={property.description}
            />
          </div>

          {/* Accommodation Details */}
          <div className="mt-10 space-y-4">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">🏠 Accommodation</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <CounterInput detail="guests" defaultValue={property.guests} />
              <CounterInput detail="bedrooms" defaultValue={property.bedrooms} />
              <CounterInput detail="beds" defaultValue={property.beds} />
              <CounterInput detail="baths" defaultValue={property.baths} />
            </div>
          </div>

          {/* Amenities */}
          <div className="mt-10">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">✨ Amenities</h2>
            <AmenitiesInput defaultValue={defaultAmenities} />
          </div>

          <SubmitButton text="Update Property" className="mt-12 w-full" />
        </FormContainer>
      </div>
    </section>
  );
}
