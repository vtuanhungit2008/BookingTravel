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
  console.log(property);
  
  if (!property) redirect("/");

  let defaultAmenities: Amenity[] = [];
  try {
    defaultAmenities = JSON.parse(property.amenities ?? "[]");
  } catch (error) {
    console.warn("Lỗi phân tích amenities:", error);
  }

  return (
    <section className="min-h-screen px-4 py-12 bg-gray-50">
      <div className="max-w-5xl mx-auto bg-white p-8 md:p-10 rounded-2xl shadow-md space-y-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Chỉnh sửa địa điểm</h1>
          <p className="text-gray-500 mt-1">Cập nhật chi tiết địa điểm của bạn</p>
        </div>

        {/* Image Upload */}
        <ImageInputContainer
          name={property.name}
          text="Cập nhật ảnh"
          action={updatePropertyImageAction}
          image={property.image}
          className="h-40 w-40 rounded-xl object-cover border shadow"
        >
          <input type="hidden" name="id" value={property.id} />
        </ImageInputContainer>

        {/* Main Form */}
        <FormContainer action={updatePropertyAction}>
          <input type="hidden" name="id" value={property.id} />

          {/* General Info */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-700">📝 Thông tin chung</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <FormInput
                name="name"
                type="text"
                label="Tên địa điểm (tối đa 20 ký tự)"
                defaultValue={property.name}
              />
              <FormInput
                name="tagline"
                type="text"
                label="Mô tả ngắn (tối đa 30 ký tự)"
                defaultValue={property.tagline}
              />
              <PriceInput defaultValue={property.price} />
              <CategoriesInput defaultValue={property.category} />
              <CountriesInput defaultValue={property.country} />
            </div>
          </div>

          {/* Description */}
          <div className="mt-10">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">📖 Mô tả</h2>
            <TextAreaInput
              name="description"
              labelText="Mô tả (tối thiểu 10 từ, tối đa 100 từ)"
              defaultValue={property.description}
            />
          </div>

          {/* Accommodation */}
          <div className="mt-10 space-y-4">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">🏠 Chi tiết chỗ ở</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <CounterInput detail="guests" defaultValue={property.guests} />
              <CounterInput detail="bedrooms" defaultValue={property.bedrooms} />
              <CounterInput detail="beds" defaultValue={property.beds} />
              <CounterInput detail="baths" defaultValue={property.baths} />
            </div>
          </div>

          {/* Amenities */}
          <div className="mt-10">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">✨ Tiện nghi</h2>
            <AmenitiesInput defaultValue={defaultAmenities} />
          </div>

          {/* Submit */}
          <SubmitButton text="Cập nhật địa điểm" className="mt-12 w-full" />
        </FormContainer>
      </div>
    </section>
  );
}
