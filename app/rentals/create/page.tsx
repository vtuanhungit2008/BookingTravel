import AmenitiesInput from "@/components/form/amenitiesinput";
import CategoriesInput from "@/components/form/categories";
import CountriesInput from "@/components/form/contriesinput";
import CounterInput from "@/components/form/counterinput";
import FormContainer from "@/components/form/formcontanier";
import ImageInput from "@/components/form/imageinput";
import FormInput from "@/components/form/input";
import PriceInput from "@/components/form/priceinput";
import { SubmitButton } from "@/components/form/submitbtn";
import TextAreaInput from "@/components/form/textareainput";
import { createPropertyAction } from "@/utils/action";

export default function CreateProperty() {
  return (
    <section className="min-h-screen px-4 py-12 bg-gray-50">
      <div className="max-w-5xl mx-auto bg-white p-8 md:p-10 rounded-2xl shadow-md space-y-12">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Create Property</h1>
          <p className="text-gray-500 mt-2">Fill out the details to list a new rental property.</p>
        </div>

        <FormContainer action={createPropertyAction}>
          {/* General Info */}
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">📝 General Info</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <FormInput
                name="name"
                type="text"
                label="Name (max 20 characters)"
                defaultValue="Cabin in Latvia"
              />
              <FormInput
                name="tagline"
                type="text"
                label="Tagline (max 30 characters)"
                defaultValue="Dream Getaway Awaits You Here!"
              />
              <PriceInput />
              <CategoriesInput />
            </div>
          </div>

          {/* Location & Image */}
          <div className="grid md:grid-cols-2 gap-6 mt-10">
            <CountriesInput />
            <ImageInput />
          </div>

          {/* Accommodation Details */}
          <div className="mt-12">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">🏠 Accommodation Details</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <CounterInput detail="guests" />
              <CounterInput detail="bedrooms" />
              <CounterInput detail="beds" />
              <CounterInput detail="baths" />
            </div>
          </div>

          {/* Amenities */}
          <div className="mt-12">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">✨ Amenities</h2>
            <AmenitiesInput />
          </div>

          {/* Description */}
          <div className="mt-12">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">🖊️ Description</h2>
            <TextAreaInput
              name="description"
              labelText="Description (10 - 1000 words)"
            />
          </div>

          <SubmitButton text="Create Rental" className="mt-12 w-full" />
        </FormContainer>
      </div>
    </section>
  );
}
