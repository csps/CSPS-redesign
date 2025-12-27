import React from "react";
import FormInput from "./FormInput";
import FormTextArea from "./FormTextarea";

const ContactForm = () => {
  return (
    <form action="" method="post" className="w-full space-y-5">
      <div className="flex flex-col sm:flex-row gap-5 sm:gap-10 flex-wrap">
        <div className="flex flex-col gap-1 flex-1 min-w-[12rem]">
          <FormInput label="Name" id="name" placeholder="Your name"/>
        </div>
        <div className="flex flex-col gap-1 flex-1 min-w-[12rem]">
          <FormInput label="Email" id="email" type="email" placeholder="you@email.com"/>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <FormInput label="Subject" id="subject" placeholder="What is this about?"/>
      </div>

      <div className="flex flex-col gap-1">
        <FormTextArea label="Message" id="message" rows={11} placeholder="Write your message here..."/>
      </div>

      <div className="w-full flex justify-end mt-6">
        <button
          type="submit"
          className="bg-white text-black font-semibold px-10 py-3 rounded-xl hover:bg-gray-200 transition"
        >
          Send
        </button>
      </div>
    </form>
  );
};

export default ContactForm;
