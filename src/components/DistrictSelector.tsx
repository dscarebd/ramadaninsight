import { useLanguage } from '@/contexts/LanguageContext';
import { divisions, findDivision, findZilla } from '@/data/locations';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin } from 'lucide-react';

interface LocationState {
  division: string;
  zilla: string;
  upazila: string;
}

interface Props {
  value: LocationState;
  onChange: (val: LocationState) => void;
}

const LocationPicker = ({ value, onChange }: Props) => {
  const { lang, t } = useLanguage();

  const selectedDivision = findDivision(value.division);
  const selectedZilla = value.division && value.zilla ? findZilla(value.division, value.zilla) : null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-1">
        <MapPin className="h-4 w-4 text-primary" />
        <span className="text-xs font-medium text-muted-foreground">{t('অবস্থান নির্বাচন', 'Select Location')}</span>
      </div>

      {/* Division */}
      <Select
        value={value.division}
        onValueChange={(val) => onChange({ division: val, zilla: '', upazila: '' })}
      >
        <SelectTrigger className="w-full bg-card border-primary/30">
          <SelectValue placeholder={t('বিভাগ নির্বাচন করুন', 'Select Division')} />
        </SelectTrigger>
        <SelectContent className="max-h-60 bg-popover">
          {divisions.map(d => (
            <SelectItem key={d.id} value={d.id}>
              {lang === 'bn' ? d.nameBn : d.nameEn}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Zilla */}
      {selectedDivision && (
        <Select
          value={value.zilla}
          onValueChange={(val) => onChange({ ...value, zilla: val, upazila: '' })}
        >
          <SelectTrigger className="w-full bg-card border-primary/30">
            <SelectValue placeholder={t('জেলা নির্বাচন করুন', 'Select Zilla')} />
          </SelectTrigger>
          <SelectContent className="max-h-60 bg-popover">
            {selectedDivision.zillas.map(z => (
              <SelectItem key={z.id} value={z.id}>
                {lang === 'bn' ? z.nameBn : z.nameEn}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Upazila */}
      {selectedZilla && (
        <Select
          value={value.upazila}
          onValueChange={(val) => onChange({ ...value, upazila: val })}
        >
          <SelectTrigger className="w-full bg-card border-primary/30">
            <SelectValue placeholder={t('উপজেলা নির্বাচন করুন', 'Select Upazila')} />
          </SelectTrigger>
          <SelectContent className="max-h-60 bg-popover">
            {selectedZilla.upazilas.map(u => (
              <SelectItem key={u.id} value={u.id}>
                {lang === 'bn' ? u.nameBn : u.nameEn}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

export default LocationPicker;
