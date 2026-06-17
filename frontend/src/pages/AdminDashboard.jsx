import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Users, Briefcase, Settings, MessageSquare, Plus, Edit2, Trash2, CheckCircle2, 
  Clock, RefreshCw, LogOut, Check, X, Upload, Calendar, MapPin, Eye, AlertCircle
} from 'lucide-react';
import api from '../utils/api';

const AdminDashboard = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Navigation tabs
  const [activeTab, setActiveTab] = useState('leads'); // leads, services, projects, testimonials

  // Global states
  const [stats, setStats] = useState({
    totalContacts: 0,
    totalProjects: 0,
    totalServices: 0,
    totalTestimonials: 0,
    statusBreakdown: { submitted: 0, inProgress: 0, completed: 0 }
  });
  const [loadingStats, setLoadingStats] = useState(true);

  // Leads Module states
  const [leads, setLeads] = useState([]);
  const [loadingLeads, setLoadingLeads] = useState(false);

  // Services Module states
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceTitle, setServiceTitle] = useState('');
  const [serviceDesc, setServiceDesc] = useState('');
  const [serviceImageFile, setServiceImageFile] = useState(null);
  const [serviceImageUrl, setServiceImageUrl] = useState(''); // text fallback if no file
  const [submittingService, setSubmittingService] = useState(false);

  // Projects Module states
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [projectCategory, setProjectCategory] = useState('CCTV');
  const [projectLocation, setProjectLocation] = useState('');
  const [projectCompletedDate, setProjectCompletedDate] = useState('');
  const [projectImageFile, setProjectImageFile] = useState(null);
  const [projectImageUrl, setProjectImageUrl] = useState('');
  const [submittingProject, setSubmittingProject] = useState(false);

  // Testimonials Module states
  const [testimonials, setTestimonials] = useState([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(false);
  const [showTestimonialForm, setShowTestimonialForm] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [testName, setTestName] = useState('');
  const [testRating, setTestRating] = useState(5);
  const [testReview, setTestReview] = useState('');
  const [submittingTestimonial, setSubmittingTestimonial] = useState(false);

  // Message notifications
  const [notify, setNotify] = useState({ text: '', type: 'success' });

  const showNotification = (text, type = 'success') => {
    setNotify({ text, type });
    setTimeout(() => setNotify({ text: '', type: 'success' }), 3500);
  };

  useEffect(() => {
    document.title = "Admin Control Center | G-TECH Innovation";
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      fetchDashboardStats();
      loadActiveTabData();
    }
  }, [isAuthenticated, navigate, activeTab]);

  const fetchDashboardStats = async () => {
    setLoadingStats(true);
    try {
      const res = await api.get('/dashboard/stats');
      setStats(res.data);
    } catch (err) {
      console.error(err);
      showNotification('Failed to retrieve stats data.', 'error');
    } finally {
      setLoadingStats(false);
    }
  };

  const loadActiveTabData = () => {
    if (activeTab === 'leads') fetchLeads();
    if (activeTab === 'services') fetchServices();
    if (activeTab === 'projects') fetchProjects();
    if (activeTab === 'testimonials') fetchTestimonials();
  };

  // --- LEADS CONTROLLER ACTIONS ---
  const fetchLeads = async () => {
    setLoadingLeads(true);
    try {
      const res = await api.get('/contacts');
      setLeads(res.data);
    } catch (err) {
      console.error(err);
      showNotification('Error loading lead requests.', 'error');
    } finally {
      setLoadingLeads(false);
    }
  };

  const handleUpdateLeadStatus = async (id, currentStatus) => {
    const nextStatusMap = {
      'Submitted': 'Under Review',
      'Under Review': 'In Progress',
      'In Progress': 'Completed',
      'Completed': 'Submitted'
    };
    const newStatus = nextStatusMap[currentStatus] || 'Submitted';
    try {
      await api.put(`/contacts/${id}`, { status: newStatus });
      showNotification(`Ticket status updated to ${newStatus}`);
      fetchLeads();
      fetchDashboardStats();
    } catch (err) {
      console.error(err);
      showNotification('Failed to modify ticket status.', 'error');
    }
  };

  const handleDeleteLead = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this lead?')) return;
    try {
      await api.delete(`/contacts/${id}`);
      showNotification('Lead record deleted successfully.');
      fetchLeads();
      fetchDashboardStats();
    } catch (err) {
      console.error(err);
      showNotification('Could not delete lead record.', 'error');
    }
  };

  // --- SERVICES CONTROLLER ACTIONS ---
  const fetchServices = async () => {
    setLoadingServices(true);
    try {
      const res = await api.get('/services');
      setServices(res.data);
    } catch (err) {
      console.error(err);
      showNotification('Error loading service listings.', 'error');
    } finally {
      setLoadingServices(false);
    }
  };

  const handleOpenServiceCreate = () => {
    setEditingService(null);
    setServiceTitle('');
    setServiceDesc('');
    setServiceImageFile(null);
    setServiceImageUrl('');
    setShowServiceForm(true);
  };

  const handleOpenServiceEdit = (service) => {
    setEditingService(service);
    setServiceTitle(service.title);
    setServiceDesc(service.description);
    setServiceImageFile(null);
    setServiceImageUrl(service.imageUrl);
    setShowServiceForm(true);
  };

  const handleSubmitService = async (e) => {
    e.preventDefault();
    if (!serviceTitle.trim() || !serviceDesc.trim()) {
      showNotification('Title and description are required.', 'error');
      return;
    }

    setSubmittingService(true);
    const formData = new FormData();
    formData.append('title', serviceTitle.trim());
    formData.append('description', serviceDesc.trim());
    
    if (serviceImageFile) {
      formData.append('image', serviceImageFile);
    } else if (serviceImageUrl) {
      formData.append('imageUrl', serviceImageUrl);
    }

    try {
      if (editingService) {
        await api.put(`/services/${editingService.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showNotification('Service updated successfully.');
      } else {
        await api.post('/services', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showNotification('Service created successfully.');
      }
      setShowServiceForm(false);
      fetchServices();
      fetchDashboardStats();
    } catch (err) {
      console.error(err);
      showNotification('Failed to save service records.', 'error');
    } finally {
      setSubmittingService(false);
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Delete this service? This action is permanent.')) return;
    try {
      await api.delete(`/services/${id}`);
      showNotification('Service listing removed.');
      fetchServices();
      fetchDashboardStats();
    } catch (err) {
      console.error(err);
      showNotification('Could not delete service.', 'error');
    }
  };

  // --- PROJECTS CONTROLLER ACTIONS ---
  const fetchProjects = async () => {
    setLoadingProjects(true);
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (err) {
      console.error(err);
      showNotification('Error loading completed projects.', 'error');
    } finally {
      setLoadingProjects(false);
    }
  };

  const handleOpenProjectCreate = () => {
    setEditingProject(null);
    setProjectTitle('');
    setProjectDesc('');
    setProjectCategory('CCTV');
    setProjectLocation('');
    setProjectCompletedDate('');
    setProjectImageFile(null);
    setProjectImageUrl('');
    setShowProjectForm(true);
  };

  const handleOpenProjectEdit = (proj) => {
    setEditingProject(proj);
    setProjectTitle(proj.title);
    setProjectDesc(proj.description);
    setProjectCategory(proj.category);
    setProjectLocation(proj.location);
    setProjectCompletedDate(proj.completedDate);
    setProjectImageFile(null);
    setProjectImageUrl(proj.imageUrl);
    setShowProjectForm(true);
  };

  const handleSubmitProject = async (e) => {
    e.preventDefault();
    if (!projectTitle.trim() || !projectDesc.trim() || !projectLocation.trim() || !projectCompletedDate) {
      showNotification('All project details are required.', 'error');
      return;
    }

    setSubmittingProject(true);
    const formData = new FormData();
    formData.append('title', projectTitle.trim());
    formData.append('description', projectDesc.trim());
    formData.append('category', projectCategory);
    formData.append('location', projectLocation.trim());
    formData.append('completedDate', projectCompletedDate);

    if (projectImageFile) {
      formData.append('image', projectImageFile);
    } else if (projectImageUrl) {
      formData.append('imageUrl', projectImageUrl);
    }

    try {
      if (editingProject) {
        await api.put(`/projects/${editingProject.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showNotification('Project profile updated.');
      } else {
        await api.post('/projects', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showNotification('Project profile created.');
      }
      setShowProjectForm(false);
      fetchProjects();
      fetchDashboardStats();
    } catch (err) {
      console.error(err);
      showNotification('Failed to save project record.', 'error');
    } finally {
      setSubmittingProject(false);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Delete this project record?')) return;
    try {
      await api.delete(`/projects/${id}`);
      showNotification('Project record deleted.');
      fetchProjects();
      fetchDashboardStats();
    } catch (err) {
      console.error(err);
      showNotification('Could not delete project.', 'error');
    }
  };

  // --- TESTIMONIALS CONTROLLER ACTIONS ---
  const fetchTestimonials = async () => {
    setLoadingTestimonials(true);
    try {
      const res = await api.get('/testimonials');
      setTestimonials(res.data);
    } catch (err) {
      console.error(err);
      showNotification('Error loading review testimonials.', 'error');
    } finally {
      setLoadingTestimonials(false);
    }
  };

  const handleOpenTestimonialCreate = () => {
    setEditingTestimonial(null);
    setTestName('');
    setTestRating(5);
    setTestReview('');
    setShowTestimonialForm(true);
  };

  const handleOpenTestimonialEdit = (test) => {
    setEditingTestimonial(test);
    setTestName(test.customerName);
    setTestRating(test.rating);
    setTestReview(test.review);
    setShowTestimonialForm(true);
  };

  const handleSubmitTestimonial = async (e) => {
    e.preventDefault();
    if (!testName.trim() || !testReview.trim()) {
      showNotification('Name and review content are required.', 'error');
      return;
    }

    setSubmittingTestimonial(true);
    const data = {
      customerName: testName.trim(),
      rating: parseInt(testRating),
      review: testReview.trim()
    };

    try {
      if (editingTestimonial) {
        await api.put(`/testimonials/${editingTestimonial.id}`, data);
        showNotification('Testimonial review updated.');
      } else {
        await api.post('/testimonials', data);
        showNotification('Testimonial review created.');
      }
      setShowTestimonialForm(false);
      fetchTestimonials();
      fetchDashboardStats();
    } catch (err) {
      console.error(err);
      showNotification('Failed to save review.', 'error');
    } finally {
      setSubmittingTestimonial(false);
    }
  };

  const handleDeleteTestimonial = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await api.delete(`/testimonials/${id}`);
      showNotification('Review testimonial deleted.');
      fetchTestimonials();
      fetchDashboardStats();
    } catch (err) {
      console.error(err);
      showNotification('Could not delete review.', 'error');
    }
  };

  return (
    <div className="bg-slate-100 min-h-screen pb-16">
      
      {/* 1. Header Banner */}
      <header className="bg-secondary text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-xl tracking-tight">G-TECH Portal</span>
            <span className="bg-primary px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase">Console</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <span className="text-xs font-bold block">Administrator</span>
              <span className="text-[10px] text-slate-400 block">{user?.email || 'reach2gtech@gmail.com'}</span>
            </div>
            
            <button
              onClick={() => { logout(); navigate('/'); }}
              className="flex items-center gap-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white px-3.5 py-2 rounded-lg border border-slate-700 transition-colors"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Toast notifications */}
        {notify.text && (
          <div className={`fixed bottom-6 left-6 z-50 p-4 rounded-xl shadow-xl flex items-center gap-2 border text-xs font-bold transition-all ${
            notify.type === 'error' 
              ? 'bg-red-50 text-primary border-red-100' 
              : 'bg-green-50 text-green-700 border-green-100'
          }`}>
            {notify.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
            <span>{notify.text}</span>
          </div>
        )}

        {/* 2. Stats Grid */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Contacts', count: stats.totalContacts, icon: Users, color: 'text-blue-600 bg-blue-50 border-blue-100' },
            { label: 'Completed Projects', count: stats.totalProjects, icon: Briefcase, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
            { label: 'Catalog Services', count: stats.totalServices, icon: Settings, color: 'text-red-600 bg-red-50 border-red-100' },
            { label: 'Customer Reviews', count: stats.totalTestimonials, icon: MessageSquare, color: 'text-amber-600 bg-amber-50 border-amber-100' }
          ].map((card, idx) => {
            const Icon = card.icon;
            return (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">{card.label}</span>
                  <span className="text-2xl font-extrabold text-secondary mt-1 block">
                    {loadingStats ? '...' : card.count}
                  </span>
                </div>
                <div className={`p-3 rounded-xl border shrink-0 ${card.color}`}>
                  <Icon size={20} />
                </div>
              </div>
            );
          })}
        </section>

        {/* 3. Main Console Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sidebar Tabs */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-1.5">
            {[
              { id: 'leads', label: 'Lead Requests', icon: Users },
              { id: 'services', label: 'Manage Services', icon: Settings },
              { id: 'projects', label: 'Manage Projects', icon: Briefcase },
              { id: 'testimonials', label: 'Manage Testimonials', icon: MessageSquare }
            ].map((tab) => {
              const TabIcon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-primary text-white font-bold shadow-md shadow-primary/10'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <TabIcon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Module Content View */}
          <div className="lg:col-span-9 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 min-h-[500px]">
            
            {/* LEADS MODULE */}
            {activeTab === 'leads' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold text-secondary">Customer Lead Requests</h2>
                    <p className="text-[10px] text-slate-400">Incoming service tickets from contact form</p>
                  </div>
                  <button onClick={fetchLeads} className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 hover:text-secondary transition-colors" title="Reload leads">
                    <RefreshCw size={14} className={loadingLeads ? 'animate-spin' : ''} />
                  </button>
                </div>

                {loadingLeads ? (
                  <div className="space-y-3 py-6">
                    {[1, 2, 3].map((n) => <div key={n} className="animate-pulse bg-slate-50 rounded-xl h-16 border border-slate-100" />)}
                  </div>
                ) : leads.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400">
                          <th className="py-3 font-semibold">Date & Ticket ID</th>
                          <th className="py-3 font-semibold">Customer</th>
                          <th className="py-3 font-semibold">Service Needed</th>
                          <th className="py-3 font-semibold">Message Description</th>
                          <th className="py-3 font-semibold text-center">Status</th>
                          <th className="py-3 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leads.map((lead) => {
                          const statusColors = {
                            'Submitted': 'bg-amber-50 text-amber-700 border-amber-100',
                            'Under Review': 'bg-blue-50 text-blue-700 border-blue-100',
                            'In Progress': 'bg-purple-50 text-purple-700 border-purple-100',
                            'Completed': 'bg-green-50 text-green-700 border-green-100'
                          };
                          const badgeColor = statusColors[lead.status] || 'bg-slate-50 text-slate-600 border-slate-100';

                          return (
                            <tr key={lead.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                              <td className="py-4 pr-3">
                                <span className="font-semibold block">{new Date(lead.createdAt).toLocaleDateString()}</span>
                                <code className="text-[10px] text-slate-400 select-all block font-mono leading-none mt-1">{lead.id.substring(0, 8)}...</code>
                              </td>
                              <td className="py-4 pr-3">
                                <span className="font-bold text-secondary block">{lead.name}</span>
                                <span className="text-[10px] text-slate-400 block">{lead.phone}</span>
                                <span className="text-[10px] text-slate-400 block">{lead.email}</span>
                              </td>
                              <td className="py-4 pr-3 font-semibold text-secondary">
                                {lead.service}
                              </td>
                              <td className="py-4 pr-3 text-slate-500 max-w-xs truncate" title={lead.message}>
                                {lead.message}
                              </td>
                              <td className="py-4 text-center">
                                <button
                                  onClick={() => handleUpdateLeadStatus(lead.id, lead.status)}
                                  className={`px-2.5 py-1 rounded-full border text-[10px] font-bold transition-all hover:scale-103 shrink-0 ${badgeColor}`}
                                  title="Click to cycle status"
                                >
                                  {lead.status}
                                </button>
                              </td>
                              <td className="py-4 text-right space-x-1 shrink-0">
                                <button
                                  onClick={() => handleDeleteLead(lead.id)}
                                  className="p-1.5 border border-slate-200 hover:border-red-200 hover:bg-red-50 text-slate-400 hover:text-primary rounded-lg transition-colors inline-block"
                                  title="Delete lead record"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-400">
                    <p className="text-xs">No service leads submitted yet.</p>
                  </div>
                )}
              </div>
            )}

            {/* SERVICES MODULE */}
            {activeTab === 'services' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold text-secondary">Catalog Services</h2>
                    <p className="text-[10px] text-slate-400">Manage products/services database listings</p>
                  </div>
                  <button
                    onClick={handleOpenServiceCreate}
                    className="flex items-center gap-1 text-xs font-semibold bg-primary hover:bg-primary-dark text-white px-3 py-2 rounded-lg shadow-md transition-colors"
                  >
                    <Plus size={14} />
                    New Service
                  </button>
                </div>

                {loadingServices ? (
                  <div className="grid grid-cols-2 gap-4 py-6">
                    {[1, 2].map((n) => <div key={n} className="animate-pulse bg-slate-50 rounded-xl h-24 border border-slate-100" />)}
                  </div>
                ) : services.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {services.map((service) => (
                      <div key={service.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex gap-4 hover:shadow-sm transition-all group">
                        <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                          <img src={service.imageUrl} alt={service.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-grow flex flex-col justify-between">
                          <div>
                            <h3 className="font-bold text-sm text-secondary group-hover:text-primary transition-colors leading-snug">{service.title}</h3>
                            <p className="text-slate-500 text-[10px] leading-relaxed line-clamp-2 mt-1">{service.description}</p>
                          </div>
                          <div className="flex justify-end gap-1.5 mt-2">
                            <button
                              onClick={() => handleOpenServiceEdit(service)}
                              className="p-1 border border-slate-200 hover:border-slate-300 hover:bg-white text-slate-500 rounded-md transition-colors inline-block"
                              title="Edit service details"
                            >
                              <Edit2 size={11} />
                            </button>
                            <button
                              onClick={() => handleDeleteService(service.id)}
                              className="p-1 border border-slate-200 hover:border-red-200 hover:bg-red-50 text-slate-400 hover:text-primary rounded-md transition-colors inline-block"
                              title="Delete service"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-400">
                    <p className="text-xs">No service items cataloged yet.</p>
                  </div>
                )}

                {/* Service Form Modal */}
                {showServiceForm && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary/60 backdrop-blur-sm">
                    <motion.div
                      className="w-full max-w-md bg-white rounded-2xl border border-slate-100 shadow-2xl overflow-hidden"
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                    >
                      <div className="flex justify-between items-center bg-secondary text-white px-5 py-3.5">
                        <h3 className="font-bold text-sm">{editingService ? 'Edit Service Details' : 'Create New Service Listing'}</h3>
                        <button onClick={() => setShowServiceForm(false)} className="text-white/80 hover:text-white"><X size={18} /></button>
                      </div>
                      <form onSubmit={handleSubmitService} className="p-6 space-y-4">
                        <div>
                          <label className="block text-[10px] font-bold text-secondary mb-1 uppercase tracking-wider">Service Title *</label>
                          <input
                            type="text"
                            placeholder="e.g. Chip-level Laptop Servicing"
                            value={serviceTitle}
                            onChange={(e) => setServiceTitle(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-primary focus:outline-none"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-secondary mb-1 uppercase tracking-wider">Service Description *</label>
                          <textarea
                            rows={3}
                            placeholder="Specify detailed solutions offered, target problems resolved..."
                            value={serviceDesc}
                            onChange={(e) => setServiceDesc(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-primary focus:outline-none"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-secondary mb-1 uppercase tracking-wider">Service Image (File upload preferred) *</label>
                          <div className="flex gap-2">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => setServiceImageFile(e.target.files[0])}
                              className="w-full border border-slate-300 rounded-lg text-xs px-2 py-1 file:bg-slate-100 file:border-none file:text-xs file:py-1 file:px-2 file:rounded file:mr-2"
                            />
                          </div>
                          {editingService && !serviceImageFile && (
                            <span className="text-[10px] text-slate-400 mt-1 block">Current file: <a href={serviceImageUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline">Link</a></span>
                          )}
                        </div>

                        <div className="flex gap-2.5 pt-4">
                          <button
                            type="button"
                            onClick={() => setShowServiceForm(false)}
                            className="w-1/2 border border-slate-200 hover:bg-slate-50 text-slate-500 font-bold py-2 rounded-lg text-xs transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={submittingService}
                            className="w-1/2 bg-primary hover:bg-primary-dark text-white font-bold py-2 rounded-lg text-xs shadow-md transition-colors disabled:opacity-75"
                          >
                            {submittingService ? 'Saving...' : 'Save Service'}
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  </div>
                )}
              </div>
            )}

            {/* PROJECTS MODULE */}
            {activeTab === 'projects' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold text-secondary">Completed Project Works</h2>
                    <p className="text-[10px] text-slate-400">Configure finished setups gallery portfolio</p>
                  </div>
                  <button
                    onClick={handleOpenProjectCreate}
                    className="flex items-center gap-1 text-xs font-semibold bg-primary hover:bg-primary-dark text-white px-3 py-2 rounded-lg shadow-md transition-colors"
                  >
                    <Plus size={14} />
                    New Project
                  </button>
                </div>

                {loadingProjects ? (
                  <div className="grid grid-cols-2 gap-4 py-6">
                    {[1, 2].map((n) => <div key={n} className="animate-pulse bg-slate-50 rounded-xl h-24 border border-slate-100" />)}
                  </div>
                ) : projects.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {projects.map((proj) => (
                      <div key={proj.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex gap-4 hover:shadow-sm transition-all group">
                        <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                          <img src={proj.imageUrl} alt={proj.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-grow flex flex-col justify-between">
                          <div>
                            <span className="text-[9px] bg-slate-200 text-slate-800 font-bold px-1.5 py-0.5 rounded uppercase">{proj.category}</span>
                            <h3 className="font-bold text-sm text-secondary group-hover:text-primary transition-colors leading-snug mt-1">{proj.title}</h3>
                            <p className="text-slate-500 text-[10px] leading-relaxed line-clamp-1 mt-0.5">{proj.location} &bull; {new Date(proj.completedDate).toLocaleDateString()}</p>
                          </div>
                          <div className="flex justify-end gap-1.5 mt-2">
                            <button
                              onClick={() => handleOpenProjectEdit(proj)}
                              className="p-1 border border-slate-200 hover:border-slate-300 hover:bg-white text-slate-500 rounded-md transition-colors inline-block"
                              title="Edit project details"
                            >
                              <Edit2 size={11} />
                            </button>
                            <button
                              onClick={() => handleDeleteProject(proj.id)}
                              className="p-1 border border-slate-200 hover:border-red-200 hover:bg-red-50 text-slate-400 hover:text-primary rounded-md transition-colors inline-block"
                              title="Delete project"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-400">
                    <p className="text-xs">No project logs filed yet.</p>
                  </div>
                )}

                {/* Project Form Modal */}
                {showProjectForm && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary/60 backdrop-blur-sm">
                    <motion.div
                      className="w-full max-w-md bg-white rounded-2xl border border-slate-100 shadow-2xl overflow-hidden"
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                    >
                      <div className="flex justify-between items-center bg-secondary text-white px-5 py-3.5">
                        <h3 className="font-bold text-sm">{editingProject ? 'Edit Project Log' : 'Create New Project Log'}</h3>
                        <button onClick={() => setShowProjectForm(false)} className="text-white/80 hover:text-white"><X size={18} /></button>
                      </div>
                      <form onSubmit={handleSubmitProject} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                        <div>
                          <label className="block text-[10px] font-bold text-secondary mb-1 uppercase tracking-wider">Project Title *</label>
                          <input
                            type="text"
                            placeholder="e.g. 16 Camera Commercial Installation"
                            value={projectTitle}
                            onChange={(e) => setProjectTitle(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-primary focus:outline-none"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-secondary mb-1 uppercase tracking-wider">Description *</label>
                          <textarea
                            rows={3}
                            placeholder="Describe network wiring details, setup devices used, configuration outcomes..."
                            value={projectDesc}
                            onChange={(e) => setProjectDesc(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-primary focus:outline-none"
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-bold text-secondary mb-1 uppercase tracking-wider">Category *</label>
                            <select
                              value={projectCategory}
                              onChange={(e) => setProjectCategory(e.target.value)}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-primary focus:outline-none bg-white"
                            >
                              <option value="Laptop">Laptop Services</option>
                              <option value="Desktop">Desktop Services</option>
                              <option value="Networking">Networking Solutions</option>
                              <option value="CCTV">CCTV Installation</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-secondary mb-1 uppercase tracking-wider">Location *</label>
                            <input
                              type="text"
                              placeholder="e.g. Richie Street, Chennai"
                              value={projectLocation}
                              onChange={(e) => setProjectLocation(e.target.value)}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-primary focus:outline-none"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-secondary mb-1 uppercase tracking-wider">Completion Date *</label>
                          <input
                            type="date"
                            value={projectCompletedDate}
                            onChange={(e) => setProjectCompletedDate(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-primary focus:outline-none"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-secondary mb-1 uppercase tracking-wider">Project Image Banner *</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setProjectImageFile(e.target.files[0])}
                            className="w-full border border-slate-300 rounded-lg text-xs px-2 py-1 file:bg-slate-100 file:border-none file:text-xs file:py-1 file:px-2 file:rounded file:mr-2"
                          />
                          {editingProject && !projectImageFile && (
                            <span className="text-[10px] text-slate-400 mt-1 block">Current file: <a href={projectImageUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline">Link</a></span>
                          )}
                        </div>

                        <div className="flex gap-2.5 pt-4">
                          <button
                            type="button"
                            onClick={() => setShowProjectForm(false)}
                            className="w-1/2 border border-slate-200 hover:bg-slate-50 text-slate-500 font-bold py-2 rounded-lg text-xs transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={submittingProject}
                            className="w-1/2 bg-primary hover:bg-primary-dark text-white font-bold py-2 rounded-lg text-xs shadow-md transition-colors disabled:opacity-75"
                          >
                            {submittingProject ? 'Saving...' : 'Save Project'}
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  </div>
                )}
              </div>
            )}

            {/* TESTIMONIALS MODULE */}
            {activeTab === 'testimonials' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold text-secondary">Customer Reviews</h2>
                    <p className="text-[10px] text-slate-400">Moderate and manage public feedbacks feed</p>
                  </div>
                  <button
                    onClick={handleOpenTestimonialCreate}
                    className="flex items-center gap-1 text-xs font-semibold bg-primary hover:bg-primary-dark text-white px-3 py-2 rounded-lg shadow-md transition-colors"
                  >
                    <Plus size={14} />
                    New Testimonial
                  </button>
                </div>

                {loadingTestimonials ? (
                  <div className="space-y-3 py-6">
                    {[1, 2, 3].map((n) => <div key={n} className="animate-pulse bg-slate-50 rounded-xl h-16 border border-slate-100" />)}
                  </div>
                ) : testimonials.length > 0 ? (
                  <div className="space-y-3">
                    {testimonials.map((test) => (
                      <div key={test.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex justify-between items-start group">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-secondary">{test.customerName}</span>
                            <div className="flex gap-0.5 text-amber-500">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} size={10} fill={i < test.rating ? "currentColor" : "none"} className={i < test.rating ? 'text-amber-500' : 'text-slate-300'} />
                              ))}
                            </div>
                          </div>
                          <p className="text-slate-500 text-[10px] leading-relaxed italic mt-1.5">"{test.review}"</p>
                        </div>
                        <div className="flex gap-1 shrink-0 ml-4">
                          <button
                            onClick={() => handleOpenTestimonialEdit(test)}
                            className="p-1 border border-slate-200 hover:border-slate-300 hover:bg-white text-slate-500 rounded-md transition-colors inline-block"
                            title="Edit review"
                          >
                            <Edit2 size={11} />
                          </button>
                          <button
                            onClick={() => handleDeleteTestimonial(test.id)}
                            className="p-1 border border-slate-200 hover:border-red-200 hover:bg-red-50 text-slate-400 hover:text-primary rounded-md transition-colors inline-block"
                            title="Delete review"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-400">
                    <p className="text-xs">No client testimonials saved yet.</p>
                  </div>
                )}

                {/* Testimonial Form Modal */}
                {showTestimonialForm && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary/60 backdrop-blur-sm">
                    <motion.div
                      className="w-full max-w-md bg-white rounded-2xl border border-slate-100 shadow-2xl overflow-hidden"
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                    >
                      <div className="flex justify-between items-center bg-secondary text-white px-5 py-3.5">
                        <h3 className="font-bold text-sm">{editingTestimonial ? 'Edit Review Testimonial' : 'Create New Review Entry'}</h3>
                        <button onClick={() => setShowTestimonialForm(false)} className="text-white/80 hover:text-white"><X size={18} /></button>
                      </div>
                      <form onSubmit={handleSubmitTestimonial} className="p-6 space-y-4">
                        <div>
                          <label className="block text-[10px] font-bold text-secondary mb-1 uppercase tracking-wider">Customer Name *</label>
                          <input
                            type="text"
                            placeholder="e.g. Ramesh Babu (Chennai Steel)"
                            value={testName}
                            onChange={(e) => setTestName(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-primary focus:outline-none"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-secondary mb-1 uppercase tracking-wider">Rating (1 to 5 Stars) *</label>
                          <select
                            value={testRating}
                            onChange={(e) => setTestRating(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-primary focus:outline-none bg-white font-semibold text-amber-500"
                          >
                            <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                            <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                            <option value={3}>⭐⭐⭐ (3 Stars)</option>
                            <option value={2}>⭐⭐ (2 Stars)</option>
                            <option value={1}>⭐ (1 Star)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-secondary mb-1 uppercase tracking-wider">Review Content *</label>
                          <textarea
                            rows={3}
                            placeholder="Customer review comment..."
                            value={testReview}
                            onChange={(e) => setTestReview(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-primary focus:outline-none"
                            required
                          />
                        </div>

                        <div className="flex gap-2.5 pt-4">
                          <button
                            type="button"
                            onClick={() => setShowTestimonialForm(false)}
                            className="w-1/2 border border-slate-200 hover:bg-slate-50 text-slate-500 font-bold py-2 rounded-lg text-xs transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={submittingTestimonial}
                            className="w-1/2 bg-primary hover:bg-primary-dark text-white font-bold py-2 rounded-lg text-xs shadow-md transition-colors disabled:opacity-75"
                          >
                            {submittingTestimonial ? 'Saving...' : 'Save Review'}
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
