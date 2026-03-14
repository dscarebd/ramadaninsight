import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { divisions, findDivision, findZilla, findUpazila } from '@/data/locations';
import { MapPin, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandInput, CommandList, CommandEmpty, CommandItem } from '@/components/ui/command';
import { cn } from '@/lib/utils';

interface LocationState {
  division: string;
  zilla: string;
  upazila: string;
}

interface Props {
  value: LocationState;
  onChange: (val: LocationState) => void;
}

interface SearchableSelectProps {
  value: string;
  onSelect: (val: string) => void;
  placeholder: string;
  searchPlaceholder: string;
  items: { id: string; labelBn: string; labelEn: string; label: string }[];
}

const bilingualFilter = (value: string, search: string): number => {
  if (!search || search.length === 0) return 1;
  const s = search.toLowerCase();
  const v = value.toLowerCase();

  // Exact substring match in either language
  if (v.includes(s)) return 1;

  // Fuzzy: check if search matches with 1 char tolerance
  const words = v.split(/\s+/);
  for (const word of words) {
    if (word.length < 2) continue;
    // Check if most of the search chars appear consecutively in word
    const minLen = Math.max(2, s.length - 1);
    for (let i = 0; i <= s.length - minLen; i++) {
      const sub = s.slice(i, i + minLen);
      if (word.includes(sub)) return 0.5;
    }
  }

  // Also check search words against value
  const searchWords = s.split(/\s+/).filter(w => w.length >= 2);
  for (const sw of searchWords) {
    if (v.includes(sw)) return 0.5;
    const subLen = Math.max(2, sw.length - 1);
    const sub = sw.slice(0, subLen);
    if (v.includes(sub)) return 0.3;
  }

  return 0;
};

const SearchableSelect = ({ value, onSelect, placeholder, searchPlaceholder, items }: SearchableSelectProps) => {
  const [open, setOpen] = useState(false);
  const selectedLabel = items.find(i => i.id === value)?.label;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="flex h-10 w-full items-center justify-between rounded-md border border-primary/30 bg-card px-3 py-2 text-sm"
        >
          <span className={cn("truncate", !selectedLabel && "text-muted-foreground")}>
            {selectedLabel || placeholder}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50 shrink-0 ml-2" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 bg-popover" align="start">
        <Command filter={bilingualFilter}>
          <CommandInput placeholder={searchPlaceholder} className="h-9" />
          <CommandList className="max-h-52">
            <CommandEmpty className="py-4 text-center text-sm text-muted-foreground">
              পাওয়া যায়নি / Not found
            </CommandEmpty>
            {items.map(item => (
              <CommandItem
                key={item.id}
                value={`${item.labelBn} ${item.labelEn}`}
                onSelect={() => {
                  onSelect(item.id);
                  setOpen(false);
                }}
                className="cursor-pointer"
              >
                <Check className={cn("mr-2 h-4 w-4 shrink-0", value === item.id ? "opacity-100" : "opacity-0")} />
                <span className="truncate">{item.label}</span>
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const LocationPicker = ({ value, onChange }: Props) => {
  const { lang, t } = useLanguage();
  const [expanded, setExpanded] = useState(!value.upazila);

  const selectedDivision = findDivision(value.division);
  const selectedZilla = value.division && value.zilla ? findZilla(value.division, value.zilla) : null;
  const selectedUpazila = value.division && value.zilla && value.upazila
    ? findUpazila(value.division, value.zilla, value.upazila)
    : null;

  const getDisplayName = () => {
    const parts: string[] = [];
    if (selectedUpazila) parts.push(lang === 'bn' ? selectedUpazila.nameBn : selectedUpazila.nameEn);
    if (selectedZilla) parts.push(lang === 'bn' ? selectedZilla.nameBn : selectedZilla.nameEn);
    if (selectedDivision) parts.push(lang === 'bn' ? selectedDivision.nameBn : selectedDivision.nameEn);
    return parts.join(', ');
  };

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
    if (newVal.upazila) setExpanded(false);
  };

  const divisionItems = divisions.map(d => ({ id: d.id, labelBn: d.nameBn, labelEn: d.nameEn, label: lang === 'bn' ? d.nameBn : d.nameEn }));
  const zillaItems = selectedDivision?.zillas.map(z => ({ id: z.id, labelBn: z.nameBn, labelEn: z.nameEn, label: lang === 'bn' ? z.nameBn : z.nameEn })) || [];
  const upazilaItems = selectedZilla?.upazilas.map(u => ({ id: u.id, labelBn: u.nameBn, labelEn: u.nameEn, label: lang === 'bn' ? u.nameBn : u.nameEn })) || [];

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

      <SearchableSelect
        value={value.division}
        onSelect={(val) => handleChange({ division: val, zilla: '', upazila: '' })}
        placeholder={t('বিভাগ নির্বাচন করুন', 'Select Division')}
        searchPlaceholder={t('বিভাগ খুঁজুন...', 'Search division...')}
        items={divisionItems}
      />

      {selectedDivision && (
        <SearchableSelect
          value={value.zilla}
          onSelect={(val) => handleChange({ ...value, zilla: val, upazila: '' })}
          placeholder={t('জেলা নির্বাচন করুন', 'Select Zilla')}
          searchPlaceholder={t('জেলা খুঁজুন...', 'Search zilla...')}
          items={zillaItems}
        />
      )}

      {selectedZilla && (
        <SearchableSelect
          value={value.upazila}
          onSelect={(val) => handleChange({ ...value, upazila: val })}
          placeholder={t('উপজেলা নির্বাচন করুন', 'Select Upazila')}
          searchPlaceholder={t('উপজেলা খুঁজুন...', 'Search upazila...')}
          items={upazilaItems}
        />
      )}
    </div>
  );
};

export default LocationPicker;
