import EmptyList from "@/components/home/EmptyList";
import Link from "next/link";
import { formatDate, formatCurrency } from "@/utils/format";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { fetchBookings } from "@/utils/action";

import { FaSuitcaseRolling } from "react-icons/fa";
import { DeleteBooking } from "@/components/booking/DeleteBooking";


async function BookingsPage() {
  const bookings = await fetchBookings();

  if (bookings.length === 0) {
    return <EmptyList />;
  }

  return (
    <section className="min-h-screen py-10 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center justify-center gap-3">
            <FaSuitcaseRolling className="text-black-600" />
            Your Bookings
          </h1>
        </div>

        <div className="overflow-auto rounded-lg shadow-md bg-white p-4">
          <Table>
            <TableCaption className="text-sm text-gray-400 mt-2">
              A list of your recent bookings.
            </TableCaption>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="whitespace-nowrap">Property</TableHead>
                <TableHead className="whitespace-nowrap">Nights</TableHead>
                <TableHead className="whitespace-nowrap">Total</TableHead>
                <TableHead className="whitespace-nowrap">Check In</TableHead>
                <TableHead className="whitespace-nowrap">Check Out</TableHead>
                <TableHead className="whitespace-nowrap">Status</TableHead>
                <TableHead className="whitespace-nowrap">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {bookings.map((booking) => {
                const {
                  id,
                  orderTotal,
                  finalPaid,
                  totalNights,
                  checkIn,
                  checkOut,
                } = booking;
                const { id: propertyId, name } = booking.property;
                const startDate = formatDate(checkIn);
                const endDate = formatDate(checkOut);

                return (
                  <TableRow
                    key={id}
                    className="hover:bg-indigo-50 transition-colors duration-200"
                  >
                    <TableCell>
                      <Link
                        href={`/properties/${propertyId}`}
                        className="no-underline text-black-600 font-bold hover:text-indigo-800"
                      >
                        {name}
                      </Link>
                    </TableCell>

                    <TableCell>{totalNights}</TableCell>

                    <TableCell>
                      {finalPaid !== null && finalPaid !== orderTotal ? (
                        <>
                          <span className="line-through text-gray-400 mr-2">
                            {formatCurrency(orderTotal)}
                          </span>
                          <span className="text-green-600 font-semibold">
                            {formatCurrency(finalPaid)}
                          </span>
                        </>
                      ) : (
                        formatCurrency(orderTotal)
                      )}
                    </TableCell>

                    <TableCell>{startDate}</TableCell>
                    <TableCell>{endDate}</TableCell>
                    <TableCell className="text-green-600 font-semibold">
                      Complete
                    </TableCell>
                    <TableCell>
                    
                        <DeleteBooking bookingId={id} />
               
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
export default BookingsPage;


