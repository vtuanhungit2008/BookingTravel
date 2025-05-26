import EmptyList from "@/components/home/EmptyList";
import Link from "next/link";
import { formatCurrency } from "@/utils/format";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IconButton } from "@/components/form/Buttons";
import { deleteRentalAction, fetchRentals } from "@/utils/action";
import FormContainer from "@/components/form/formcontanier";

export default async function RentalsPage() {
  const rentals = await fetchRentals();

  if (rentals.length === 0) {
    return (
      <EmptyList
        heading="No rentals to display."
        message="Don't hesitate to create a rental."
      />
    );
  }

  return (
    <section className="min-h-screen px-4 md:px-8 py-12 ">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Heading */}
        <div className="text-center">
          <h1 className=" text-3xl font-bold text-gray-800 mb-10">Your Rentals</h1>
          
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm p-6 overflow-x-auto">
          <h4 className="text-lg font-semibold text-gray-700 mb-4">
            Active Properties: {rentals.length}
          </h4>

          <Table>
            <TableCaption>A list of all your properties.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Property Name</TableHead>
                <TableHead>Nightly Rate</TableHead>
                <TableHead>Nights Booked</TableHead>
                <TableHead>Total Income</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rentals.map((rental) => {
                const { id: propertyId, name, price } = rental;
                const { totalNightsSum, orderTotalSum } = rental;

                return (
                  <TableRow key={propertyId} className="hover:bg-gray-50 transition">
                    <TableCell>
                      <Link
                        href={`/properties/${propertyId}`}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        {name}
                      </Link>
                    </TableCell>
                    <TableCell>{formatCurrency(price)}</TableCell>
                    <TableCell>{totalNightsSum || 0}</TableCell>
                    <TableCell>{formatCurrency(orderTotalSum)}</TableCell>
                    <TableCell className="flex justify-end items-center gap-2">
                      <Link href={`/rentals/${propertyId}/edit`}>
                        <IconButton actionType="edit" />
                      </Link>
                      <DeleteRental propertyId={propertyId} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
}

function DeleteRental({ propertyId }: { propertyId: string }) {
  const deleteRental = deleteRentalAction.bind(null, { propertyId });

  return (
    <FormContainer action={deleteRental}>
      <IconButton actionType="delete" />
    </FormContainer>
  );
}
