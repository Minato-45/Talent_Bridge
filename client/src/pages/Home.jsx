import { Link, useNavigate } from "react-router-dom";
import {
  HiSearch,
  HiLocationMarker,
  HiOfficeBuilding,
  HiBriefcase,
  HiUsers,
  HiLightningBolt,
  HiShieldCheck,
  HiTrendingUp,
  HiArrowRight,
  HiMail,
} from "react-icons/hi";
import { useState } from "react";

const Home = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.set("keyword", keyword);
    if (location) params.set("location", location);
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <div className="fade-in-animation">
      {/* Hero Section - Dark with network pattern */}
      <section className="bg-linear-to-b from-dark via-dark-light to-dark text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="hero-pattern absolute inset-0 opacity-40"></div>
        <div className="absolute top-20 right-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-teal-500/8 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl"></div>
        {/* Floating dots */}
        <div className="absolute top-32 left-[15%] w-3 h-3 bg-emerald-400/60 rounded-full animate-float"></div>
        <div className="absolute top-48 right-[20%] w-4 h-4 bg-emerald-400/40 rounded-full animate-float" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute bottom-40 left-[30%] w-2 h-2 bg-emerald-400/30 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-60 right-[35%] w-2 h-2 bg-emerald-400/50 rounded-full animate-float" style={{animationDelay: '1.5s'}}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 relative z-10">
          <div className="text-center max-w-3xl mx-auto slide-up-animation">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 backdrop-blur-sm border border-emerald-500/30 rounded-full px-4 py-2 mb-5 hover:bg-emerald-500/30 transition-all duration-300">
              <span className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse"></span>
              <span className="text-emerald-300 text-xs font-semibold">
                🚀 Over 48,000 jobs available now
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 leading-tight tracking-tight">
              Find your <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-300 via-emerald-400 to-teal-400">dream job</span> today
            </h1>
            <p className="text-base text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed font-light">
              Browse thousands of job openings from top companies. Your next career move starts here.
            </p>

            {/* Search Bar - Enhanced */}
            <form
              onSubmit={handleSearch}
              className="bg-white/95 backdrop-blur-sm rounded-2xl p-2 flex flex-col sm:flex-row gap-2 shadow-2xl shadow-emerald-500/20 max-w-3xl mx-auto mb-6 border border-white/20 hover:shadow-emerald-500/30 transition-all duration-300"
            >
              <div className="flex-1 flex items-center gap-3 px-4 rounded-lg focus-within:bg-white transition-all">
                <HiSearch className="text-emerald-500 text-base shrink-0" />
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Job title, keyword, or company"
                  className="w-full py-2 text-gray-800 outline-none text-sm bg-transparent placeholder-gray-400 font-medium"
                />
              </div>
              <div className="flex-1 flex items-center gap-3 px-4 border-t sm:border-t-0 sm:border-l border-gray-300 rounded-lg focus-within:bg-white transition-all">
                <HiLocationMarker className="text-emerald-500 text-base shrink-0" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, state, or remote"
                  className="w-full py-2 text-gray-800 outline-none text-sm bg-transparent placeholder-gray-400 font-medium"
                />
              </div>
              <button
                type="submit"
                className="bg-linear-to-r from-emerald-500 to-teal-600 text-white px-8 py-2 rounded-lg font-bold hover:shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 text-sm whitespace-nowrap flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
              >
                <HiSearch className="text-base" />
                Search
              </button>
            </form>

            {/* Popular tags */}
            <div className="flex flex-wrap gap-3 justify-center items-center">
              <span className="text-gray-400 text-sm font-semibold">Popular searches:</span>
              {[
                "Product Designer",
                "Full Stack Developer",
                "Marketing Manager",
                "Data Analyst",
                "UX Researcher",
              ].map((tag) => (
                <Link
                  key={tag}
                  to={`/jobs?keyword=${encodeURIComponent(tag)}`}
                  className="text-gray-300 hover:text-emerald-300 text-sm font-medium transition-all duration-300 px-4 py-2 rounded-full hover:bg-emerald-500/20 backdrop-blur-sm border border-gray-500/20 hover:border-emerald-500/50"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto mt-24">
            {[
              {
                icon: <HiOfficeBuilding className="text-3xl text-emerald-300" />,
                value: "12,000+",
                label: "Companies",
              },
              {
                icon: <HiBriefcase className="text-3xl text-emerald-300" />,
                value: "48,000+",
                label: "Active Jobs",
              },
              {
                icon: <HiUsers className="text-3xl text-emerald-300" />,
                value: "3.5M+",
                label: "Job Seekers",
              },
            ].map(({ icon, value, label }, idx) => (
              <div
                key={label}
                className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-emerald-500/30 hover:bg-white/10 transition-all duration-300"
                style={{animationDelay: `${idx * 0.1}s`}}
              >
                <div className="flex justify-center mb-3 transform group-hover:scale-110 transition-transform">{icon}</div>
                <p className="text-4xl font-bold text-white">{value}</p>
                <p className="text-gray-400 text-sm mt-2 font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <section className="py-20 bg-linear-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-20 left-0 w-96 h-96 bg-teal-100/30 rounded-full blur-3xl -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Why choose <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-600 to-teal-600">TalentBridge</span>?
            </h2>
            <p className="text-gray-600 text-sm max-w-2xl mx-auto">
              We connect top talent with amazing opportunities. Here's what makes us different.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <HiLightningBolt className="text-3xl text-emerald-500" />,
                title: "Instant Matches",
                desc: "AI-powered matching connects you with relevant opportunities in seconds.",
              },
              {
                icon: <HiShieldCheck className="text-3xl text-emerald-500" />,
                title: "Verified Companies",
                desc: "Every recruiter is vetted to ensure legitimate, quality job postings.",
              },
              {
                icon: <HiTrendingUp className="text-3xl text-emerald-500" />,
                title: "Career Growth",
                desc: "Access resources, salary insights, and tools to advance your career.",
              },
            ].map(({ icon, title, desc }, idx) => (
              <div
                key={title}
                className="feature-card group hover:border-emerald-300 hover:bg-linear-to-br hover:from-emerald-50 hover:to-white"
              >
                <div className="bg-linear-to-br from-emerald-100 to-teal-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
                  {icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-3 text-lg">{title}</h3>
                <p className="text-gray-600 text-base leading-relaxed font-light">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="py-20 bg-linear-to-r from-emerald-600 via-teal-600 to-emerald-600 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Never miss a perfect job opportunity
            </h2>
            <p className="text-emerald-100 text-sm">
              Get personalized job recommendations delivered to your inbox.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
            <div className="flex-1 flex items-center gap-3 bg-white/95 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-white/50 transition-all">
              <HiMail className="text-emerald-600 text-base shrink-0" />
              <input
                type="email"
                placeholder="Enter your email"
                className="outline-none text-base w-full bg-transparent text-gray-800 placeholder-gray-500 font-medium"
              />
            </div>
            <button className="bg-white text-emerald-600 px-10 py-4 rounded-2xl font-bold hover:shadow-lg hover:shadow-black/20 transition-all duration-300 text-base flex items-center justify-center gap-2 whitespace-nowrap hover:scale-105 active:scale-95">
              Subscribe <HiArrowRight className="text-lg" />
            </button>
          </div>

          <p className="text-center text-emerald-100 text-sm mt-4">
            No spam, ever. Unsubscribe at any time.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
