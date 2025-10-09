import React from "react";
import Navbar from "../../components/Navbar";
import JAVALOGO from "../../assets/logos/java.png";
import PYTHONLOGO from "../../assets/logos/python.png";
import PHPLOGO from "../../assets/logos/php.png";
import CSHARPLOGO from "../../assets/logos/csharp.png";
import DATASTRUCTURESLOGO from "../../assets/logos/datastructures.png";
import ALGORITHMSLOGO from "../../assets/logos/algorithms.png";
import MYSQLLOGO from "../../assets/logos/mysql.png";
import GENMATHLOGO from "../../assets/logos/genmath.png";
import DISCRETELOGO from "../../assets/logos/discretemath.png";
import DIFFCALLOGO from "../../assets/logos/diffcal.png";
import INTCALLOGO from "../../assets/logos/intcal.png";
import CSPSLOGO from "../../assets/logos/BIGLOGOCSPS.png";
const Index = () => {
  const TOPICS = [
    {
      title: "Programming Languages",
      contents: [
        {
          logo: JAVALOGO,
          name: "Java",
          desc: "Java is a high-level, object-oriented, platform-independent programming language.",
        },
        {
          logo: PYTHONLOGO,
          name: "Python",
          desc: "Python is a high-level, interpreted, and easy-to-read programming language.",
        },
        {
          logo: PHPLOGO,
          name: "Php",
          desc: "PHP is a server-side scripting language mainly used for web development.",
        },
        {
          logo: CSHARPLOGO,
          name: "C#",
          desc: "C# is a modern, object-oriented programming language developed by Microsoft for .NET applications.",
        },
      ],
    },
    {
      title: "CS Core Topics",
      contents: [
        {
          logo: DATASTRUCTURESLOGO,
          name: "Data Structures",
          desc: "A data structure is a way of organizing and storing data for efficient use.",
        },
        {
          logo: ALGORITHMSLOGO,
          name: "Algorithms",
          desc: "An algorithm is a step-by-step procedure for solving a problem or performing a task.",
        },
        {
          logo: MYSQLLOGO,
          name: "MySQL",
          desc: "MySQL is an open-source relational database management system.",
        },
        {
          logo: MYSQLLOGO,
          name: "SQL Server",
          desc: "MySQL Server is a software system that manages and provides access to MySQL databases.",
        },
      ],
    },
    {
      title: "Mathematics",
      contents: [
        {
          logo: GENMATHLOGO,
          name: "GenMath",
          desc: "GenMath is a foundation subject that develops skills in algebra, functions, logic, and problem-solving for real-life applications.",
        },
        {
          logo: DISCRETELOGO,
          name: "Discrete Math",
          desc: "Discrete Math is the study of mathematical structures that are countable or distinct.",
        },
        {
          logo: DIFFCALLOGO,
          name: "DiffCal",
          desc: "Differential Calculus is the branch of mathematics that studies rates of change and slopes of curves.",
        },
        {
          logo: INTCALLOGO,
          name: "IntCal",
          desc: "Integral Calculus is the branch of mathematics that studies areas, accumulations, and antiderivatives.",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#41169C] via-[#20113F] to-black flex justify-center">
      <div className="relative  w-full max-w-[90rem] p-6 text-white">
        <Navbar />

        <img
          src={CSPSLOGO}
          className="
                absolute
                w-[90%] h-screen
                md:object-contain
                top-90
                opacity-80
                md:w-[80%] md:h-auto xl:left-60 xl:top-47 
            "
        />
        <div className="space-y-10 py-30">
          {TOPICS.map((topic, index) => (
            <div key={index}>
              <p className="text-2xl font-semibold mb-5">{topic.title}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-0 xl:gap-30 ">
                {topic.contents.map((content, index) => (
                  <div
                    className=" sm:w-[16rem] sm:h-[20rem]
                    bg-gradient-to-b from-white/10 to-white/5   
                    shadow-[0px_0px_33px_5px_rgba(52,_21,_168,_0.2)]    
                    rounded-2xl    
                    border-b-2
                    border-t-2
                  border-gray-700 p-6 
                  text-white 
                    flex flex-col justify-between "
                    key={index}
                  >
                    <img src={content.logo} alt={content.name} />
                    <p className="font-semibold">{content.name}</p>
                    <p className="text-xs">{content.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
