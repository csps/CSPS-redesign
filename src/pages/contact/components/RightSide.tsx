import ContactForm from "./ContactForm";

const RightSide = () => {
  return (
    <div className="flex-1 space-y-5">
      <div>
        <p className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-snug">
          Don't Hesitate to Contact Us
        </p>
        <p className="text-base sm:text-lg max-w-xl text-gray-100 mt-2">
          Whether you have a question, feedback, or just want to say hello, we'd
          love to hear from you.
        </p>
      </div>

      <ContactForm />
    </div>
  );
};

export default RightSide;
