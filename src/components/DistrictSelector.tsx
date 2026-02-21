import { useLanguage } from '@/contexts/LanguageContext';
import { districts } from '@/data/districts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin } from 'lucide-react';

interface Props {
  value: string;
  onChange: (val: string) => void;
}

const DistrictSelector = ({ value, onChange }: Props) => {
  const { lang, t } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <MapPin className="h-4 w-4 text-primary" />
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full bg-card border-primary/30">
          <SelectValue placeholder={t('জেলা নির্বাচন করুন', 'Select District')} />
        </SelectTrigger>
        <SelectContent className="max-h-60">
          {districts.map(d => (
            <SelectItem key={d.id} value={d.id}>
              {lang === 'bn' ? d.nameBn : d.nameEn}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default DistrictSelector;
