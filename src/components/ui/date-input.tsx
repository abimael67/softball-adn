import { Input } from "@/components/ui/input";

interface DateInputProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function DateInput({ id, value, onChange, placeholder = "dd/mm/yyyy" }: DateInputProps) {
  const displayValue = value
    ? new Date(value + "T00:00:00").toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;

    if (!input) {
      onChange("");
      return;
    }

    const parts = input.split("/");
    if (parts.length === 3) {
      const [day, month, year] = parts;
      if (day.length === 2 && month.length === 2 && year.length === 4) {
        const isoDate = `${year}-${month}-${day}`;
        onChange(isoDate);
      }
    }
  };

  return (
    <Input
      id={id}
      type="text"
      value={displayValue}
      onChange={handleChange}
      placeholder={placeholder}
      pattern="\d{2}/\d{2}/\d{4}"
    />
  );
}
