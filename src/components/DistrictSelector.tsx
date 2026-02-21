import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { divisions, findDivision, findZilla, findUpazila } from '@/data/locations';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, ChevronDown, ChevronUp } from 'lucide-react';

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
  const [expanded, setExpanded] = useState(!value.upazila);

  const selectedDivision = findDivision(value.division);
  const selectedZilla = value.division && value.zilla ? findZilla(value.division, value.zilla) : null;
  const selectedUpazila = value.division && value.zilla && value.upazila
    ? findUpazila(value.division, value.zilla, value.upazila)
    : null;

  // Build display name from most specific selection
  const getDisplayName = () => {
    const parts: string[] = [];
    if (selectedUpazila) parts.push(lang === 'bn' ? selectedUpazila.nameBn : selectedUpazila.nameEn);
    if (selectedZilla) parts.push(lang === 'bn' ? selectedZilla.nameBn : selectedZilla.nameEn);
    if (selectedDivision) parts.push(lang === 'bn' ? selectedDivision.nameBn : selectedDivision.nameEn);
    return parts.join(', ');
  };

  // If fully selected and collapsed, show summary
  if (!expanded && value.upazila) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="flex items-center gap-2 w-full rounded-lg border border-primary/30 bg-card px-3 py-2.5 text-left"
      >
        <MapPin className="h-4 w-4 text-primary shrink-0" />
        <span className="text-sm font-medium truncate flex-1">{getDisplayName()}</span>
        <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
      </button>
    );
  }

  const handleChange = (newVal: LocationState) => {
    onChange(newVal);
    // Auto-collapse when upazila is selected
    if (newVal.upazila) {
      setExpanded(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          <span className="text-xs font-medium text-muted-foreground">{t('অবস্থান নির্বাচন', 'Select Location')}</span>
        </div>
        {value.upazila && (
          <button onClick={() => setExpanded(false)} className="text-muted-foreground">
            <ChevronUp className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Division */}
      <Select
        value={value.division}
        onValueChange={(val) => handleChange({ division: val, zilla: '', upazila: '' })}
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
          onValueChange={(val) => handleChange({ ...value, zilla: val, upazila: '' })}
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
          onValueChange={(val) => handleChange({ ...value, upazila: val })}
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
