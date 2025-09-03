type InputProps = {
  id: string;
  label: string;
  type?: 'text' | 'number' | 'email' | 'tel' | 'date' | 'datetime-local';
  value: string | number;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  className?: string;
};

export const Input = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  required = false,
  placeholder,
  className = '',
}: InputProps) => {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};
