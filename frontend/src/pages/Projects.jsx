import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Tag, AlertCircle } from 'lucide-react';
import api from '../utils/api';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = "Our Projects | Completed Servicing Works | G-TECH Innovation";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Browse completed projects by G-TECH Innovation Chennai. See our networking setups, HD CCTV camera deployments, and custom computer upgrades.");
    }
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError('');
      try {
        const url = selectedFilter === 'All' ? '/projects' : `/projects?category=${selectedFilter}`;
        const response = await api.get(url);
        setProjects(response.data);
      } catch (err) {
        console.error('Fetch projects error:', err);
        setError('Failed to retrieve project works. Please try reloading.');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [selectedFilter]);

  const filters = ['All', 'CCTV', 'Networking', 'Laptop', 'Desktop'];

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-semibold text-primary uppercase tracking-widest bg-red-50 px-3 py-1 rounded-full">Gallery</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-secondary mt-3 mb-4">Completed Projects</h1>
          <p className="text-base text-slate-500">
            A portfolio of laptop diagnostics, network configurations, and CCTV setups we have delivered for commercial hubs and private clients in Chennai.
          </p>
        </div>

        {/* Filter Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm ${
                selectedFilter === filter
                  ? 'bg-primary text-white shadow-primary/20 scale-103'
                  : 'bg-white text-secondary hover:bg-slate-100'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Error State */}
        {error && (
          <div className="max-w-md mx-auto p-4 bg-red-50 text-primary rounded-xl border border-red-100 flex items-center gap-2 justify-center mb-8">
            <AlertCircle size={18} />
            <span className="text-xs font-semibold">{error}</span>
          </div>
        )}

        {/* Grid Area */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="animate-pulse bg-white rounded-3xl h-96 border border-slate-100 shadow-sm"
              />
            ))}
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {projects.length > 0 ? (
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {projects.map((project) => (
                  <motion.div
                    layout
                    key={project.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg transition-shadow flex flex-col h-full group"
                  >
                    {/* Visual Banner */}
                    <div className="h-56 overflow-hidden relative">
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg py-1 px-2.5 flex items-center gap-1 shadow-sm text-[10px] font-bold text-secondary uppercase">
                        <Tag size={10} className="text-primary" />
                        {project.category}
                      </div>
                    </div>

                    {/* Metadata Details */}
                    <div className="p-6 flex-grow flex flex-col justify-between">
                      <div>
                        {/* Location / Date Badges */}
                        <div className="flex flex-wrap gap-x-4 gap-y-1 items-center text-[10px] text-slate-400 font-semibold mb-3 uppercase">
                          <div className="flex items-center gap-1">
                            <MapPin size={12} className="text-primary shrink-0" />
                            <span>{project.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar size={12} className="text-slate-400 shrink-0" />
                            <span>{new Date(project.completedDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="font-bold text-lg text-secondary mb-2 leading-snug group-hover:text-primary transition-colors">
                          {project.title}
                        </h3>

                        {/* Description */}
                        <p className="text-slate-500 text-xs leading-relaxed mb-4">
                          {project.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 text-slate-400"
              >
                <p className="text-sm font-semibold">No projects found in this category.</p>
                <p className="text-xs mt-1">Select another category or check back later.</p>
              </motion.div>
            )}
          </AnimatePresence>
        )}

      </div>
    </div>
  );
};

export default Projects;
