type FormTextAreaProps = {
  label: string;
  id: string;
  placeholder?: string;
  rows?: number;
};

const FormTextArea = ({ label, id, placeholder, rows }: FormTextAreaProps) => {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id}>{label}</label>
      <textarea
        id={id}
        rows={rows}
        className="bg-purple-900/40 rounded-xl py-3 px-5 text-white placeholder-purple-300/80 focus:outline-none focus:bg-purple-800/50 resize-none"
        placeholder={placeholder}
      />
    </div>
  );
};

export default FormTextArea;
