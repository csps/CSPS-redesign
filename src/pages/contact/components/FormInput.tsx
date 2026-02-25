type ForminpoutProps = {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
};

const FormInput = ({
  label,
  id,
  type = "text",
  placeholder,
}: ForminpoutProps) => {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        id={id}
        className="bg-purple-900/40 rounded-xl py-4 px-5 text-white placeholder-purple-300/80 focus:outline-none focus:bg-purple-800/50"
        placeholder={placeholder}
      />
    </div>
  );
};

export default FormInput;
