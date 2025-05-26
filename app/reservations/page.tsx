import Link from 'next/link';
import EmptyList from '@/components/home/EmptyList';
import CountryFlagAndName from '@/components/card/CountryFlagAndName';
import { formatDate, formatCurrency } from '@/utils/format';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { fetchReservations } from '@/utils/action';
import Stats from '@/components/admin/Stats';

export default async function ReservationsPage() {
  const reservations = await fetchReservations();

  if (reservations.length === 0) {
    return <EmptyList />;
  }

  return (
    <section className="min-h-screen px-4 md:px-8 py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Your Reservations</h1>
          <p className="text-gray-500 mt-1">Overview of your recent bookings</p>
        </div>

        {/* Bảng đặt chỗ */}
        <div className="bg-white shadow-md rounded-xl overflow-x-auto p-6">
          <h4 className="text-lg font-semibold text-gray-700 mb-4">
            Total reservations: {reservations.length}
          </h4>
          <Table>
            <TableCaption>A list of your recent reservations</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Nights</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reservations.map((item) => {
                const { id, orderTotal, totalNights, checkIn, checkOut } = item;
                const { id: propertyId, name, country } = item.property;
                return (
                  <TableRow
                    key={id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <TableCell>
                      <Link
                        href={`/properties/${propertyId}`}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        {name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <CountryFlagAndName countryCode={country} />
                    </TableCell>
                    <TableCell>{totalNights}</TableCell>
                    <TableCell>{formatCurrency(orderTotal)}</TableCell>
                    <TableCell>{formatDate(checkIn)}</TableCell>
                    <TableCell>{formatDate(checkOut)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Stats component bên dưới */}
        <div className="mt-12">
          <Stats />
        </div>
      </div>
    </section>
  );
}
