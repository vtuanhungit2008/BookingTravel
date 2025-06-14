import { Label } from '@/components/ui/label';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { vietnamProvinces } from '@/utils/vietnamProvinces';
const name = 'country';
function CountriesInput({ defaultValue }: { defaultValue?: string }) {
  return (
   <div className='mb-2'>
      <Label htmlFor={name} className='capitalize'>
        Province / Tỉnh thành
      </Label>
      <Select
        defaultValue={defaultValue || vietnamProvinces[0].code}
        name={name}
        required
      >
        <SelectTrigger id={name}>
          <SelectValue placeholder="Chọn tỉnh thành" />
        </SelectTrigger>
        <SelectContent>
          {vietnamProvinces.map((item) => (
            <SelectItem key={item.code} value={item.code}>
              {item.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
export default CountriesInput;