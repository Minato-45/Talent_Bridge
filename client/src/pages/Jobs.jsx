import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getJobs } from "../api/axios";
import JobCard from "../components/JobCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { HiSearch, HiAdjustments, HiX } from "react-icons/hi";
import { sampleJobs } from "../data/sampleJobs";

const jobTypes = ["full-time", "part-time", "remote", "contract", "internship"];

const Jobs = () => {
  const [searchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const [filters, setFilters] = useState({
    keyword: searchParams.get("keyword") || "",
    jobType: searchParams.get("jobType") || "",
    location: searchParams.get("location") || "",
    salaryMin: searchParams.get("salaryMin") || "",
    salaryMax: searchParams.get("salaryMax") || "",
  });

  const applyLocalFilters = (filterData) => {
    setIsSearching(true);
    let filtered = [...sampleJobs];
    if (filterData.keyword) {
      const kw = filterData.keyword.toLowerCase();
      filtered = filtered.filter(
        (j) =>
          j.title.toLowerCase().includes(kw) ||
          j.company.toLowerCase().includes(kw) ||
          j.description.toLowerCase().includes(kw) ||
          j.skills.some((s) => s.toLowerCase().includes(kw)),
      );
    }
    if (filterData.jobType) {
      filtered = filtered.filter((j) => j.jobType === filterData.jobType);
    }
    if (filterData.location) {
      const loc = filterData.location.toLowerCase();
      filtered = filtered.filter((j) => j.location.toLowerCase().includes(loc));
    }
    if (filterData.salaryMin) {
      filtered = filtered.filter(
        (j) => j.salaryMax >= Number(filterData.salaryMin),
      );
    }
    if (filterData.salaryMax) {
      filtered = filtered.filter(
        (j) => j.salaryMin <= Number(filterData.salaryMax),
      );
    }
    setJobs(filtered);
    setTotal(filtered.length);
    setTotalPages(1);
    setIsSearching(false);
  };

  const fetchJobs = async () => {
    try {
      const params = { page, limit: 10 };
      if (filters.keyword) params.keyword = filters.keyword;
      if (filters.jobType) params.jobType = filters.jobType;
      if (filters.location) params.location = filters.location;
      if (filters.salaryMin) params.salaryMin = filters.salaryMin;
      if (filters.salaryMax) params.salaryMax = filters.salaryMax;

      const { data } = await getJobs(params);
      if (data.jobs && data.jobs.length > 0) {
        setJobs(data.jobs);
        setTotalPages(data.totalPages);
        setTotal(data.total);
      } else {
        applyLocalFilters(filters);
      }
    } catch {
      applyLocalFilters(filters);
    }
  };

  // Initialize with sample jobs on mount
  useEffect(() => {
    applyLocalFilters(filters);
    setLoading(false);
  }, []);

  // Apply filters in real-time whenever filters change
  useEffect(() => {
    setPage(1);
    applyLocalFilters(filters);
  }, [filters]);

  useEffect(() => {
    if (!loading) {
      fetchJobs();
    }
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchJobs();
  };

  const clearFilters = () => {
    setFilters({
      keyword: "",
      jobType: "",
      location: "",
      salaryMin: "",
      salaryMax: "",
    });
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Latest Opportunities
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {isSearching ? 'Searching...' : `Showing ${total} jobs`}
          </p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
        >
          <HiAdjustments /> Filters
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="flex gap-2 bg-white border border-gray-200 rounded-xl px-4">
          <HiSearch className="text-gray-400 mt-3" />
          <input
            type="text"
            placeholder="Search by job title, keyword, or company..."
            value={filters.keyword}
            onChange={(e) =>
              setFilters({ ...filters, keyword: e.target.value })
            }
            className="w-full py-3 outline-none text-sm bg-transparent"
          />
        </div>
        <p className="text-xs text-gray-400 mt-2">Results update as you type</p>
      </div>

      <div className="flex gap-6">
        {/* Filters Sidebar */}
        <aside
          className={`${showFilters ? "fixed inset-0 z-50 bg-black/40 lg:relative lg:bg-transparent" : "hidden"} lg:block lg:w-64 shrink-0`}
        >
          <div
            className={`${showFilters ? "absolute right-0 top-0 h-full w-80 bg-white p-6 shadow-xl lg:shadow-none lg:relative lg:w-auto lg:h-auto" : ""} bg-white rounded-xl border border-gray-100 p-5 sticky top-24 space-y-6`}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Filters</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="lg:hidden text-gray-400 hover:text-gray-600"
              >
                <HiX className="text-xl" />
              </button>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={filters.location}
                onChange={(e) =>
                  setFilters({ ...filters, location: e.target.value })
                }
                placeholder="City or remote"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
            </div>

            {/* Job Type checkboxes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Type
              </label>
              <div className="space-y-2">
                {jobTypes.map((type) => (
                  <label
                    key={type}
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    <input
                      type="radio"
                      name="jobType"
                      checked={filters.jobType === type}
                      onChange={() =>
                        setFilters({
                          ...filters,
                          jobType: filters.jobType === type ? "" : type,
                        })
                      }
                      className="w-4 h-4 text-emerald-500 border-gray-300 focus:ring-emerald-500 accent-emerald-500"
                    />
                    <span className="text-sm text-gray-600 capitalize group-hover:text-gray-900">
                      {type}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Salary Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Salary Range
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={filters.salaryMin}
                  onChange={(e) =>
                    setFilters({ ...filters, salaryMin: e.target.value })
                  }
                  placeholder="Min"
                  className="w-1/2 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <input
                  type="number"
                  value={filters.salaryMax}
                  onChange={(e) =>
                    setFilters({ ...filters, salaryMax: e.target.value })
                  }
                  placeholder="Max"
                  className="w-1/2 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={clearFilters}
                className="w-full bg-gray-50 text-gray-600 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors border border-gray-200"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </aside>

        {/* Job Listings - single column */}
        <div className="flex-1">
          {loading ? (
            <LoadingSpinner />
          ) : jobs.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">
                No jobs found matching your criteria.
              </p>
              <button
                onClick={clearFilters}
                className="mt-4 text-emerald-500 hover:text-emerald-600 font-medium text-sm"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {jobs.map((job) => (
                  <JobCard
                    key={job._id}
                    job={job}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-10">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const start = Math.max(
                      1,
                      Math.min(page - 2, totalPages - 4),
                    );
                    const pageNum = start + i;
                    if (pageNum > totalPages) return null;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                          page === pageNum
                            ? "bg-emerald-500 text-white"
                            : "border border-gray-200 hover:bg-gray-50 text-gray-600"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
