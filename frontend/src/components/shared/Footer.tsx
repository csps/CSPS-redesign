import React from "react";

const Footer = ({ withBackgroud = true }: { withBackgroud?: boolean }) => {
  return (
    <footer
      className="relative z-10 px-6 lg:px-16 py-12 lg:py-24 bg-[transparent]"
      style={{
        background: withBackgroud
          ? `linear-gradient(2deg, #000 -7.33%, #0A0422 49.9%, #0C042A 90.5%, #100536 108.96%, rgba(29, 10, 100, 0.11) 136.7%, rgba(32, 11, 108, 0.04) 174.4%, rgba(33, 12, 113, 0.00) 215.72%)`
          : "transparent",
      }}
    >
      <div className="max-w-6xl mx-auto">
        {/* CSPS Logo in Footer */}
        <div className="mb-12">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/908b2c69e5ddf7149bfed18e966c01f1a0b71f4d?width=750"
            alt="CSPS Footer Logo"
            className="w-60 lg:w-[375px] h-auto"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-8">
          {/* Information Column */}
          <div>
            <h4 className="text-white text-lg lg:text-2xl font-semibold mb-4 lg:mb-6">
              INFORMATION
            </h4>
            <ul className="space-y-2 lg:space-y-3">
              <li>
                <a
                  href="#"
                  className="text-white text-sm lg:text-xl hover:text-cs-gold transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white text-sm lg:text-xl hover:text-cs-gold transition-colors"
                >
                  FAQs
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white text-sm lg:text-xl hover:text-cs-gold transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white text-sm lg:text-xl hover:text-cs-gold transition-colors"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Location Column */}
          <div>
            <h4 className="text-white text-lg lg:text-2xl font-semibold mb-4 lg:mb-6">
              LOCATION
            </h4>
            <p className="text-white text-sm lg:text-xl leading-relaxed">
              University of Cebu
              <br />
              Main Campus 5th flr.
              <br />
              Osmeña Blvd Cor.
              <br />
              Sanciangko St. Cebu City
            </p>
          </div>

          {/* Accreditation Column */}
          <div>
            <h4 className="text-white text-lg lg:text-2xl font-semibold mb-4 lg:mb-6">
              ACCREDITATION
            </h4>
            <p className="text-white text-sm lg:text-xl leading-relaxed">
              Student Affairs
              <br />
              Office (SAO)
            </p>
          </div>

          {/* Others Column */}
          <div>
            <h4 className="text-white text-lg lg:text-2xl font-semibold mb-4 lg:mb-6">
              OTHERS
            </h4>
            <ul className="space-y-2 lg:space-y-3">
              <li>
                <a
                  href="#"
                  className="text-white text-sm lg:text-xl hover:text-cs-gold transition-colors"
                >
                  Forum
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white text-sm lg:text-xl hover:text-cs-gold transition-colors"
                >
                  Showcase
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white text-sm lg:text-xl hover:text-cs-gold transition-colors"
                >
                  Learning Materials
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white text-sm lg:text-xl hover:text-cs-gold transition-colors"
                >
                  Send Feedback
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media and Copyright */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="text-white hover:text-cs-gold transition-colors"
            >
              <svg
                className="w-10 h-10 lg:w-[59px] lg:h-[59px]"
                viewBox="0 0 59 60"
                fill="none"
              >
                <path
                  d="M54.0833 30C54.0833 16.43 43.07 5.41663 29.5 5.41663C15.93 5.41663 4.91663 16.43 4.91663 30C4.91663 41.8983 13.3733 51.8054 24.5833 54.0916V37.375H19.6666V30H24.5833V23.8541C24.5833 19.1095 28.4429 15.25 33.1875 15.25H39.3333V22.625H34.4166C33.0645 22.625 31.9583 23.7312 31.9583 25.0833V30H39.3333V37.375H31.9583V54.4604C44.3729 53.2312 54.0833 42.7587 54.0833 30Z"
                  fill="currentColor"
                />
              </svg>
            </a>
            <a
              href="#"
              className="text-white hover:text-cs-gold transition-colors"
            >
              <svg
                className="w-10 h-10 lg:w-[59px] lg:h-[59px]"
                viewBox="0 0 59 60"
                fill="none"
              >
                <path
                  d="M59 13.9151V48.1081C59 50.3304 57.2005 52.1299 54.9782 52.1299H45.5898V29.3362L29.5 41.4067L13.4102 29.3362V52.1324H4.02183C3.49347 52.1324 2.97029 52.0283 2.48218 51.826C1.99407 51.6237 1.55059 51.3273 1.1771 50.9535C0.803605 50.5798 0.50741 50.1362 0.305439 49.6479C0.103467 49.1597 -0.000322208 48.6364 7.51393e-07 48.1081V13.9151C7.51393e-07 8.94191 5.67629 6.10254 9.65388 9.08695L13.4102 11.9067L29.5 23.9722L45.5898 11.9017L49.3461 9.08695C53.3212 6.105 59 8.94191 59 13.9151Z"
                  fill="currentColor"
                />
              </svg>
            </a>
            <a
              href="#"
              className="text-white hover:text-cs-gold transition-colors"
            >
              <svg
                className="w-10 h-10 lg:w-[59px] lg:h-[59px]"
                viewBox="0 0 59 60"
                fill="none"
              >
                <path
                  d="M47.2336 13.7868C43.8783 12.2271 40.3344 11.122 36.6938 10.5C36.2299 11.3088 35.7151 12.4052 35.3532 13.2656C31.4817 12.692 27.5483 12.692 23.6768 13.2656C23.3149 12.4052 22.7709 11.3088 22.3338 10.5C18.6895 11.1131 15.1429 12.2186 11.7891 13.7868C5.11791 23.7529 3.3135 33.4854 4.21692 43.0852C8.12615 45.99 12.4928 48.2043 17.1319 49.6342C18.1735 48.2097 19.0963 46.7 19.8907 45.1207C18.368 44.5455 16.9279 43.8424 15.5339 43.0065C15.8958 42.746 16.2552 42.4583 16.5903 42.1707C24.9931 46.0598 34.0928 46.0598 42.3911 42.1707C42.753 42.4583 43.0881 42.746 43.4475 43.0065C42.056 43.8424 40.6134 44.5455 39.0932 45.1207C39.8868 46.7 40.8087 48.2097 41.8495 49.6342C46.4904 48.2087 50.8577 45.9941 54.7645 43.0852C55.8743 31.9735 53.0111 22.3172 47.236 13.7868M21.0467 37.1631C18.521 37.1631 16.4592 34.84 16.4592 31.9981C16.4592 29.1563 18.47 26.8307 21.0491 26.8307C23.5991 26.8307 25.6876 29.1538 25.6342 31.9981C25.6342 34.84 23.5991 37.1631 21.0467 37.1631ZM37.9833 37.1606C35.4576 37.1606 33.3934 34.8375 33.3934 31.9957C33.3934 29.1538 35.4042 26.8283 37.9833 26.8283C40.5333 26.8283 42.6218 29.1514 42.5708 31.9957C42.5708 34.8375 40.56 37.1582 37.9809 37.1582"
                  fill="currentColor"
                />
              </svg>
            </a>
            <a
              href="#"
              className="text-white hover:text-cs-gold transition-colors"
            >
              <svg
                className="w-10 h-10 lg:w-[59px] lg:h-[59px]"
                viewBox="0 0 59 60"
                fill="none"
              >
                <path
                  d="M28 4.5C12.8063 4.5 0.5 16.2075 0.5 30.6474C0.5 42.2024 8.37875 52.0012 19.3031 55.4548C20.6781 55.701 21.1823 54.8927 21.1823 54.1976C21.1823 53.5766 21.1594 51.9315 21.1479 49.7525C13.4983 51.3301 11.885 46.2444 11.885 46.2444C10.6337 43.2265 8.82563 42.4203 8.82563 42.4203C6.33458 40.7992 9.01813 40.8319 9.01813 40.8319C11.7796 41.0149 13.2302 43.5251 13.2302 43.5251C15.6823 47.5234 19.6675 46.3686 21.2396 45.6996C21.4871 44.0088 22.1952 42.8561 22.9813 42.2024C16.874 41.5487 10.455 39.3001 10.455 29.2812C10.455 26.4268 11.5206 24.0953 13.2852 22.265C12.9758 21.6048 12.0477 18.9465 13.5258 15.3447C13.5258 15.3447 15.829 14.643 21.0883 18.0248C23.2883 17.443 25.6258 17.1554 27.9633 17.1423C30.3008 17.1554 32.6383 17.443 34.8383 18.0248C40.0633 14.643 42.3665 15.3447 42.3665 15.3447C43.8446 18.9465 42.9165 21.6048 42.6415 22.265C44.3946 24.0953 45.4602 26.4268 45.4602 29.2812C45.4602 39.3262 39.0321 41.5378 32.9133 42.1806C33.8758 42.9651 34.7696 44.5688 34.7696 47.0179C34.7696 50.5173 34.7352 53.3282 34.7352 54.178C34.7352 54.8643 35.2165 55.6814 36.6258 55.42C47.6281 51.9903 55.5 42.185 55.5 30.6474C55.5 16.2075 43.1869 4.5 28 4.5Z"
                  fill="currentColor"
                />
              </svg>
            </a>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-2 lg:gap-4 text-white text-xs lg:text-sm">
            <span>Computing Society of the Philippines - Students</span>
            <span className="hidden lg:inline">•</span>
            <span>University of Cebu - Main Campus</span>
            <span className="hidden lg:inline">•</span>
            <span>© Copyright 2025</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
