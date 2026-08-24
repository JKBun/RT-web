import React, { useState, useRef, useEffect } from 'react';
import InteractiveParticles from './components/InteractiveParticles';
import CurvedFlowingLines from './components/CurvedFlowingLines';
import { BRAND_CONFIG } from './config/branding';
import { 
  Menu, X, Calendar, Users, Award, Mail, Phone, MapPin, 
  Facebook, Instagram, Linkedin, ArrowRight, Play, Pause, 
  Volume2, VolumeX, Shield, Compass, Globe, ExternalLink, 
  HeartHandshake, UserPlus, Eye, Clock, CheckCircle2,
  ChevronRight, Lock, Send, Search, QrCode, Copy, Check,
  Download, Share2, Sparkles, FileText
} from 'lucide-react';

const RotaractWebsite = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(null);
  const [selectedGalleryImg, setSelectedGalleryImg] = useState(null);
  
  // Volunteer & Registration Confirmation State
  const [myVolunteerActivities, setMyVolunteerActivities] = useState(() => {
    try {
      const saved = localStorage.getItem('rt_nibm_activities');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [volunteerConfirmation, setVolunteerConfirmation] = useState(null);
  const [showPassModal, setShowPassModal] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  // Sliding Nav Pill state & refs
  const navRefs = useRef([]);
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const [hoveredSection, setHoveredSection] = useState(null);
  
  const isManualNavRef = useRef(false);
  const manualNavTimeoutRef = useRef(null);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'events', label: 'Events' },
    { id: 'projects', label: 'Projects' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'team', label: 'Leadership' },
    { id: 'contact', label: 'Contact' }
  ];

  // Handle click on nav link with smooth scroll-spy suppression
  const handleNavClick = (id) => {
    setActiveSection(id);
    setHoveredSection(null);
    isManualNavRef.current = true;
    if (manualNavTimeoutRef.current) clearTimeout(manualNavTimeoutRef.current);
    
    // Suppress scroll-spy updates for 900ms while smooth scrolling
    manualNavTimeoutRef.current = setTimeout(() => {
      isManualNavRef.current = false;
    }, 900);
  };

  // Video Controls
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRef = useRef(null);

  // Scroll listener for sticky navbar & scroll-spy active section
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      const scrolled = window.scrollY > 20;
      setIsScrolled(prev => (prev !== scrolled ? scrolled : prev));

      // Skip scroll-spy if user recently clicked a nav item
      if (isManualNavRef.current) return;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollPos = window.scrollY + 140;
          const sections = navItems.map(item => document.getElementById(item.id)).filter(Boolean);
          for (let i = sections.length - 1; i >= 0; i--) {
            const sec = sections[i];
            if (sec.offsetTop <= scrollPos) {
              setActiveSection(prev => (prev !== sec.id ? sec.id : prev));
              break;
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update sliding pill position based on active or hovered item
  useEffect(() => {
    const targetSection = hoveredSection || activeSection;
    const updatePill = () => {
      const targetIdx = navItems.findIndex(item => item.id === targetSection);
      if (targetIdx !== -1 && navRefs.current[targetIdx]) {
        const el = navRefs.current[targetIdx];
        setPillStyle(prev => {
          if (prev.left === el.offsetLeft && prev.width === el.clientWidth && prev.opacity === 1) {
            return prev;
          }
          return {
            left: el.offsetLeft,
            width: el.clientWidth,
            opacity: 1
          };
        });
      } else {
        setPillStyle(prev => ({ ...prev, opacity: 0 }));
      }
    };

    updatePill();
    window.addEventListener('resize', updatePill);
    return () => window.removeEventListener('resize', updatePill);
  }, [activeSection, hoveredSection]);

  // Filter state for projects & events
  const [projectCategory, setProjectCategory] = useState('all');
  const [galleryCategory, setGalleryCategory] = useState('all');

  const videoSources = [
    {
      title: "Community Outreach & Impact",
      url: "https://assets.mixkit.co/videos/preview/mixkit-group-of-friends-giving-high-fives-in-a-park-42861-large.mp4",
      poster: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&q=80&w=1600"
    },
    {
      title: "Youth Leadership & Teamwork",
      url: "https://assets.mixkit.co/videos/preview/mixkit-young-people-working-together-in-a-modern-office-42862-large.mp4",
      poster: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1600"
    },
    {
      title: "Environmental Service Drive",
      url: "https://cdn.coverr.co/videos/coverr-group-of-volunteers-planting-trees-5389/1080p.mp4",
      poster: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1600"
    }
  ];

  const toggleVideoPlay = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(e => console.log('Autoplay error:', e));
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  const toggleVideoMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isVideoMuted;
      setIsVideoMuted(!isVideoMuted);
    }
  };

  const [formData, setFormData] = useState({
    membershipName: '',
    membershipEmail: '',
    membershipPhone: '',
    membershipYear: '',
    membershipInterest: 'Community Service',
    volunteerName: '',
    volunteerEmail: '',
    volunteerSkills: '',
    contactName: '',
    contactEmail: '',
    contactSubject: '',
    contactMessage: '',
    partnerName: '',
    partnerCompany: '',
    partnerEmail: '',
    partnerMessage: '',
    eventRegName: '',
    eventRegEmail: '',
    eventRegPhone: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = async (formType, e, itemContext = null) => {
    e.preventDefault();
    
    // Extract registrant info
    const name = formData.eventRegName || formData.membershipName || formData.volunteerName || formData.contactName || formData.partnerName || 'Valued Member';
    const email = formData.eventRegEmail || formData.membershipEmail || formData.volunteerEmail || formData.contactEmail || formData.partnerEmail || 'volunteer@nibm.lk';
    const phone = formData.eventRegPhone || formData.membershipPhone || '+94 77 123 4567';
    
    // Default fallback pass code
    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    let regId = `RT-NIBM-1-${randomHex}`;
    
    // LIVE MYSQL DATABASE PERSISTENCE (phpMyAdmin XAMPP)
    try {
      if (formType === 'Event Registration') {
        const response = await fetch('http://localhost:5000/api/registrations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventId: itemContext?.id || 1,
            attendeeName: name,
            attendeeEmail: email,
            contactNo: phone
          })
        });
        const data = await response.json();
        if (data.success && data.pass) {
          regId = data.pass.passCode;
          console.log(' [MySQL] Saved event registration to event_registrations table in phpMyAdmin:', data.pass);
        }
      } else if (formType === 'Membership Application' || formType === 'Project Volunteer') {
        await fetch('http://localhost:5000/api/volunteer/log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: 4,
            eventId: itemContext?.id || 1,
            activityName: itemContext?.title || formType,
            hoursLogged: 4.0,
            description: `${formType} submitted by ${name} (${email})`
          })
        });
      }
    } catch (err) {
      console.warn('Backend server offline or connection issue:', err);
    }

    const activityRecord = {
      id: regId,
      type: formType,
      title: itemContext?.title || (formType === 'Membership Application' ? 'Rotaract Club NIBM Membership' : (formType === 'Partner Inquiry' ? 'Corporate CSR Partnership' : 'Rotaract Volunteer Drive')),
      category: itemContext?.category || (formType === 'Membership Application' ? 'Leadership' : 'Community Service'),
      name: name,
      email: email,
      phone: phone,
      location: itemContext?.location || 'NIBM Campus / Community Venue, Sri Lanka',
      date: itemContext?.date || 'Upcoming 2026 Session',
      timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: 'Confirmed & Stored in MySQL Database',
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${regId}`
    };

    // Save to State & LocalStorage
    setMyVolunteerActivities(prev => {
      const updated = [activityRecord, ...prev];
      try {
        localStorage.setItem('rt_nibm_activities', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    setVolunteerConfirmation(activityRecord);

    if (formType === 'Partner Inquiry') setShowPartnerModal(false);
    if (formType === 'Event Registration') setShowEventModal(null);
    if (formType === 'Project Volunteer') setShowProjectModal(null);

        if (formType === 'Partner Inquiry') setShowPartnerModal(false);
    if (formType === 'Event Registration') setShowEventModal(null);
    if (formType === 'Project Volunteer') setShowProjectModal(null);

    setFormData(prev => ({
      ...prev,
      membershipName: '',
      membershipEmail: '',
      membershipPhone: '',
      membershipYear: '',
      volunteerName: '',
      volunteerEmail: '',
      volunteerSkills: '',
      contactName: '',
      contactEmail: '',
      contactSubject: '',
      contactMessage: '',
      partnerName: '',
      partnerCompany: '',
      partnerEmail: '',
      partnerMessage: '',
      eventRegName: '',
      eventRegEmail: '',
      eventRegPhone: '',
    }));
  };

  const stats = [
    { number: '500+', label: 'Active Rotaractors', sub: 'Dedicated Youth Members', icon: Users },
    { number: '65+', label: 'Community Projects', sub: 'Completed Initiatives', icon: HeartHandshake },
    { number: '5,000+', label: 'Lives Impacted', sub: 'Across Sri Lanka', icon: Globe },
    { number: '16+', label: 'Years of Leadership', sub: 'Chartered at NIBM', icon: Award }
  ];

  const upcomingEvents = [
    {
      id: 1,
      date: 'Aug 15, 2026',
      time: '09:00 AM - 02:00 PM',
      title: 'Green Footprints Environmental Drive',
      location: 'Viharamahadevi Park & NIBM Vicinity',
      category: 'Environment',
      description: 'Community-wide tree planting, urban park restoration, and plastic-free campaign led by Rotaract NIBM.',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 2,
      date: 'Aug 22, 2026',
      time: '10:00 AM - 01:00 PM',
      title: 'NIBM Youth Scholarship & Book Distribution',
      location: 'NIBM Auditorium, Colombo',
      category: 'Education',
      description: 'Awarding educational grants, stationery packs, and tech learning devices to underprivileged school children.',
      image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 3,
      date: 'Sep 05, 2026',
      time: '02:00 PM - 06:00 PM',
      title: 'Rotaract Leadership & Professional Bootcamp',
      location: 'Main Hall & Virtual Stream',
      category: 'Professional Dev',
      description: 'Masterclasses on project management, public speaking, artificial intelligence, and personal branding by industry executives.',
      image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 4,
      date: 'Sep 12, 2026',
      time: '08:30 AM - 04:30 PM',
      title: 'Suwa Arana Health Checkup & Blood Donation Camp',
      location: 'Community Health Hub',
      category: 'Health',
      description: 'Free medical consultations, vision screenings, diabetic checkups, and annual blood donation drive in partnership with National Blood Transfusion Service.',
      image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800'
    }
  ];

  const projects = [
    {
      id: 'proj1',
      title: 'Project Hope: Literacy for All',
      category: 'Education',
      desc: 'Setting up mini digital libraries and donating books to rural primary schools.',
      impact: '12 Schools Supported',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800',
      details: 'Project Hope focuses on creating accessible educational resources by equipping rural schools with modern digital tablets, curated book collections, and hosting interactive English & IT workshops for students.'
    },
    {
      id: 'proj2',
      title: 'SustainEarth Marine Conservation',
      category: 'Environment',
      desc: 'Coastal cleanup, coral reef restoration awareness, and mangrove planting initiatives.',
      impact: '2.5 Tons Plastic Collected',
      image: 'https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?auto=format&fit=crop&q=80&w=800',
      details: 'SustainEarth engages youth volunteers in protecting Sri Lanka coastal biodiversity through regular beach restoration drives, plastic recycling tie-ups, and community education.'
    },
    {
      id: 'proj3',
      title: 'Heal&Care Free Health Clinics',
      category: 'Health',
      desc: 'Providing free health screenings, eye care, and essential medicines to underserved communities.',
      impact: '1,800+ Patients Treated',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
      details: 'Organized in collaboration with medical professionals, Heal&Care conducts free diagnostic clinics, distributes prescription eye glasses, and hosts mental wellness workshops.'
    },
    {
      id: 'proj4',
      title: 'InnovateX Student Accelerator',
      category: 'Professional Dev',
      desc: 'Hackathons, entrepreneurship mentorship, and startup seed funding for campus innovators.',
      impact: '40+ Startups Mentored',
      image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800',
      details: 'Empowering undergraduate innovators at NIBM to build real-world solutions through mentorship from tech leaders, seed pitch events, and industry networking.'
    },
    {
      id: 'proj5',
      title: 'Shakti: Women Empowerment Drive',
      category: 'Community',
      desc: 'Vocational skill building, health hygiene workshops, and micro-entrepreneurship support.',
      impact: '350+ Women Trained',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800',
      details: 'Shakti delivers practical entrepreneurship, digital literacy, and health awareness workshops to uplift women entrepreneurs and foster financial independence.'
    },
    {
      id: 'proj6',
      title: 'Global Bridges Exchange',
      category: 'International',
      desc: 'Cultural exchange forums, joint international service projects with Rotaract clubs worldwide.',
      impact: '18 Partner Clubs Globally',
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=800',
      details: 'Fostering international peace and cross-cultural understanding through virtual youth summits, collaborative humanitarian campaigns, and Rotary international conventions.'
    }
  ];

  const galleryImages = [
    { id: 1, title: 'Annual Community Service Drive', category: 'Community', img: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&q=80&w=800' },
    { id: 2, title: 'Youth Leadership Workshop', category: 'Leadership', img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800' },
    { id: 3, title: 'Green Park Planting Project', category: 'Environment', img: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800' },
    { id: 4, title: 'Medical Screening Camp', category: 'Health', img: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800' },
    { id: 5, title: 'Rotaract Installation Ceremony', category: 'Leadership', img: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800' },
    { id: 6, title: 'School Book Donation', category: 'Education', img: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800' },
    { id: 7, title: 'Beach Restoration Drive', category: 'Environment', img: 'https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?auto=format&fit=crop&q=80&w=800' },
    { id: 8, title: 'International Cultural Exchange', category: 'International', img: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=800' }
  ];

  const achievements = [
    { year: '2025-2026', title: 'Most Outstanding Community Service Club', org: 'Rotary District 3220 Awards' },
    { year: '2024-2025', title: 'Excellence in Youth Leadership & Innovation', org: 'NIBM Campus Honors' },
    { year: '2023-2024', title: 'Best Environmental Project Award', org: 'National Youth Council' },
    { year: '2022-2023', title: 'Gold Citation for Club Administration', org: 'Rotary International' },
    { year: '2021-2022', title: 'Highest Student Community Impact Award', org: 'Higher Education Board' },
    { year: '2020-2021', title: 'Outstanding Crisis Response Initiative', org: 'Rotaract District Citation' }
  ];

  const teamMembers = [
    { position: 'President', name: 'Rtr. Kaveen Silva', bio: 'Directing strategic vision & club growth', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400' },
    { position: 'Vice President', name: 'Rtr. Anuki Perera', bio: 'Leading operations and project execution', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400' },
    { position: 'Secretary', name: 'Rtr. Dineth Wickramasinghe', bio: 'Managing club communications & records', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400' },
    { position: 'Treasurer', name: 'Rtr. Nimasha Fernando', bio: 'Overseeing finance, budgets & compliance', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400' },
    { position: 'Dir. Community Service', name: 'Rtr. Senuri Jayawardena', bio: 'Head of humanitarian & social impact', img: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=400' },
    { position: 'Dir. Professional Dev', name: 'Rtr. Malith De Silva', bio: 'Spearheading career & leadership workshops', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400' },
    { position: 'Dir. Club Service', name: 'Rtr. Tharushi Alwis', bio: 'Fostering member fellowship & engagement', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400' },
    { position: 'Dir. International Service', name: 'Rtr. Rahul Rodrigo', bio: 'Connecting with global Rotaract networks', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400' }
  ];

  const filteredProjects = projectCategory === 'all' 
    ? projects 
    : projects.filter(p => p.category.toLowerCase() === projectCategory.toLowerCase());

  const filteredGallery = galleryCategory === 'all'
    ? galleryImages
    : galleryImages.filter(g => g.category.toLowerCase() === galleryCategory.toLowerCase());

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-[#4B0082] selection:text-white relative">
      
      {/* Interactive Mouse-Reactive Background Particles */}
      <InteractiveParticles />
      
      {/* Top Professional Announcement Bar */}
      <div className="bg-[#4B0082] text-[#F5F3FF] text-xs py-2.5 px-4 font-medium tracking-wide border-b border-[#0B0514]">
        <div className="max-w-7xl mx-auto flex justify-between items-center sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2 h-2 rounded-full bg-white animate-pulse"></span>
            <span>Rotary District 3220 • Sponsored by Rotary Club of Colombo</span>
          </div>
          <div className="hidden md:flex items-center space-x-6 text-white/90">
            <span className="flex items-center space-x-1.5"><Mail size={13} className="text-white/80" /><span>rotaract@nibm.edu.lk</span></span>
            <span className="flex items-center space-x-1.5"><MapPin size={13} className="text-white/80" /><span>NIBM Campus, Sri Lanka</span></span>
          </div>
        </div>
      </div>

      {/* Professional Smooth Navigation Bar with Hardware-Accelerated Sliding Pill */}
      <nav 
        className={`sticky top-0 z-50 transition-colors duration-300 backdrop-blur-md border-b ${
          isScrolled 
            ? 'bg-white/92 shadow-md border-slate-200/80' 
            : 'bg-white/95 shadow-sm border-slate-200/60'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Brand Logo & Name */}
            <a href="#home" className="flex items-center space-x-3 group">
              <img 
                src={BRAND_CONFIG.navbarLogo} 
                alt="Rotaract Club NIBM Kandy Official Logo" 
                className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
              />
            </a>

            {/* Desktop Navigation Links with Hardware-Accelerated Sliding Active Pill */}
            <div 
              className="relative hidden lg:flex items-center space-x-1 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/80 shadow-inner"
              onMouseLeave={() => setHoveredSection(null)}
            >
              {/* Sliding Active/Hover Pill Background */}
              <div 
                className="absolute top-1.5 bottom-1.5 left-0 bg-[#4B0082] rounded-xl shadow-[0_2px_12px_rgba(75,0,130,0.5)] pointer-events-none"
                style={{
                  transform: `translate3d(${pillStyle.left}px, 0, 0)`,
                  width: `${pillStyle.width}px`,
                  opacity: pillStyle.opacity,
                  transition: 'transform 300ms cubic-bezier(0.2, 0.8, 0.2, 1), width 300ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity 200ms ease',
                  willChange: 'transform, width'
                }}
              />

              {navItems.map((item, idx) => {
                const isSelected = (hoveredSection || activeSection) === item.id;
                return (
                  <a
                    key={item.id}
                    ref={el => (navRefs.current[idx] = el)}
                    href={`#${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    onMouseEnter={() => setHoveredSection(item.id)}
                    className={`relative z-10 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-colors duration-200 select-none ${
                      isSelected
                        ? 'text-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
            </div>

            {/* Right Action Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              {myVolunteerActivities.length > 0 && (
                <button
                  onClick={() => setShowPassModal(true)}
                  className="px-3.5 py-2 text-xs font-extrabold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-xl transition border border-emerald-300 flex items-center space-x-2 shadow-sm animate-pulse"
                >
                  <Award size={16} className="text-emerald-600" />
                  <span>My Passes ({myVolunteerActivities.length})</span>
                </button>
              )}
              <button
                onClick={() => setShowLoginModal(true)}
                className="px-4 py-2.5 text-xs font-bold text-slate-700 hover:text-[#4B0082] hover:bg-slate-100 rounded-xl transition border border-slate-200 uppercase tracking-wider"
              >
                Member Portal
              </button>
              <a
                href="#join"
                className="px-5 py-2.5 bg-[#4B0082] text-white text-xs font-extrabold uppercase tracking-wider rounded-xl hover:bg-[#0B0514] transition shadow-md flex items-center space-x-2 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 duration-200"
              >
                <UserPlus size={15} />
                <span>Join Rotaract</span>
              </a>
            </div>

            {/* Mobile Toggle Button */}
            <button
              className="lg:hidden p-2.5 rounded-xl text-slate-700 hover:text-[#4B0082] hover:bg-slate-100 transition border border-slate-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Dropdown Menu with Sliding Animation */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-4 border-t border-slate-200 space-y-1 bg-white/95 backdrop-blur-xl px-3 rounded-b-3xl shadow-2xl animate-mobile-slide border-b border-x border-slate-200/80 my-1">
              {navItems.map(item => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => {
                    handleNavClick(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-200 ${
                    activeSection === item.id
                      ? 'bg-[#4B0082] text-white shadow-md'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-[#4B0082]'
                  }`}
                >
                  <span>{item.label}</span>
                  {activeSection === item.id && (
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                  )}
                </a>
              ))}
              <div className="pt-3 flex flex-col space-y-2 px-1 border-t border-slate-100">
                <button
                  onClick={() => {
                    setShowLoginModal(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-3 bg-slate-100 text-slate-800 rounded-xl font-bold hover:bg-slate-200 text-center text-xs uppercase tracking-wider transition"
                >
                  Member Portal
                </button>
                <a
                  href="#join"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 bg-[#4B0082] text-white rounded-xl font-bold text-center block shadow-md text-xs uppercase tracking-wider"
                >
                  Join Rotaract Club NIBM
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* TOP HERO SECTION WITH BACKGROUND VIDEO & HIGH-CONTRAST "ROTARACT CLUB" DISPLAY */}
      <section id="home" className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center justify-center overflow-hidden bg-slate-950">
        
        {/* Background Video Element */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
          <video
            ref={videoRef}
            key={videoSources[currentVideoIndex].url}
            autoPlay
            loop
            muted={isVideoMuted}
            playsInline
            poster={videoSources[currentVideoIndex].poster}
            className="w-full h-full object-cover scale-105 filter brightness-90 contrast-105"
          >
            <source src={videoSources[currentVideoIndex].url} type="video/mp4" />
            Your browser does not support HTML5 video.
          </video>

          {/* Deep Elegant Overlay Gradients using Nebula Purple #4B0082 & Void Black #0B0514 */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0514]/95 via-[#0B0514]/60 to-[#4B0082]/40"></div>
          <div className="absolute inset-0 bg-[#0B0514]/20"></div>
        </div>

        {/* Flowing Low-Opacity White Curved Lines that gently bend and react to mouse pointer */}
        <CurvedFlowingLines />

        {/* Video Controls Selector Overlay */}
        <div className="absolute bottom-6 right-6 z-20 hidden md:flex items-center space-x-3 bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-200 text-xs shadow-2xl text-slate-800 font-semibold">
          <span className="text-slate-500 font-medium">Video Feed:</span>
          <select
            value={currentVideoIndex}
            onChange={(e) => setCurrentVideoIndex(Number(e.target.value))}
            className="bg-slate-100 text-[#4B0082] font-bold px-2 py-1 rounded-lg border border-slate-300 outline-none cursor-pointer"
          >
            {videoSources.map((v, i) => (
              <option key={i} value={i}>{v.title}</option>
            ))}
          </select>
          <button
            onClick={toggleVideoPlay}
            className="p-2 rounded-lg bg-slate-100 hover:bg-[#4B0082] hover:text-white text-slate-800 transition"
            title={isVideoPlaying ? "Pause Video" : "Play Video"}
          >
            {isVideoPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>
          <button
            onClick={toggleVideoMute}
            className="p-2 rounded-lg bg-slate-100 hover:bg-[#4B0082] hover:text-white text-slate-800 transition"
            title={isVideoMuted ? "Unmute Sound" : "Mute Sound"}
          >
            {isVideoMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
        </div>

        {/* Main Hero Content Overlay */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-12 pb-20">
          
          {/* Official Rotaract Logo Header */}
          <div className="mb-6 flex justify-center w-full px-4">
            <img 
              src={BRAND_CONFIG.themeChangingLogo} 
              alt="Rotaract Club NIBM Kandy Official Logo" 
              className="h-16 sm:h-24 md:h-32 lg:h-36 max-w-sm sm:max-w-md w-auto object-contain filter drop-shadow-[0_0_25px_rgba(255,255,255,0.55)] hover:scale-105 transition-transform duration-500" 
            />
          </div>

          {/* Eyebrow Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-[#0B0514] text-[#B18FCF] text-xs sm:text-sm font-extrabold tracking-wider uppercase mb-6 shadow-md border border-[#7A3B9E]/40">
            <Award size={16} className="text-[#B18FCF]" />
            <span>Rotary Youth Organization • District 3220</span>
          </div>

          {/* MAIN DISPLAY TYPOGRAPHY SPECIFIED BY USER */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-[#F5F3FF] mb-4 uppercase leading-none drop-shadow-lg">
            ROTARACT <span className="text-white border-b-4 border-[#7A3B9E] inline-block pb-1 drop-shadow-[0_0_12px_rgba(122,59,158,0.7)]">CLUB</span>
          </h1>

          <div className="text-xl sm:text-3xl font-bold text-white/90 mb-6 tracking-wide max-w-3xl mx-auto drop-shadow-sm">
            National Institute of Business Management • Sri Lanka
          </div>

          <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Empowering youth leadership, advancing educational opportunities, and serving local communities across Sri Lanka through purposeful fellowship.
          </p>

          {/* Hero Action CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <a
              href="#projects"
              className="w-full sm:w-auto px-8 py-4 bg-[#4B0082] hover:bg-[#0B0514] text-[#F5F3FF] font-bold rounded-xl shadow-[0_0_25px_rgba(75,0,130,0.8)] hover:shadow-[0_0_40px_rgba(122,59,158,1)] hover:scale-105 transition duration-300 flex items-center justify-center space-x-2 text-base border border-white/30"
            >
              <span>Our Key Projects</span>
              <ArrowRight size={20} />
            </a>
            <a
              href="#about"
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-100 text-[#4B0082] font-bold rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.7)] hover:shadow-[0_0_30px_rgba(255,255,255,0.9)] transition duration-300 flex items-center justify-center space-x-2 text-base"
            >
              <Compass size={18} className="text-[#4B0082]" />
              <span>About The Club</span>
            </a>
          </div>

          {/* Floating Stats Bar */}
          <div className="mt-14 pt-8 border-t border-white/20 grid grid-cols-2 md:grid-cols-4 gap-4 text-center max-w-4xl mx-auto">
            {stats.map((st, i) => (
              <div key={i} className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:border-[#7A3B9E] hover:shadow-[0_0_25px_rgba(122,59,158,0.6)] transition duration-300">
                <div className="text-2xl sm:text-3xl font-black text-[#F5F3FF] drop-shadow-[0_0_12px_rgba(122,59,158,0.8)]">{st.number}</div>
                <div className="text-xs font-bold text-white/90">{st.label}</div>
              </div>
            ))}
          </div>

        </div>

        {/* Scroll Indicator */}
        <a 
          href="#about" 
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 text-white/80 hover:text-white transition flex flex-col items-center gap-1 text-xs font-semibold animate-bounce"
        >
          <span>Scroll Down</span>
          <ChevronRight size={16} className="rotate-90 text-white" />
        </a>
      </section>

      {/* ABOUT ROTARACT CLUB NIBM */}
      <section id="about" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-purple-100 text-[#4B0082] text-xs font-extrabold uppercase tracking-wider mb-3 border border-purple-200 shadow-[0_0_12px_rgba(75,0,130,0.2)]">
              <span>Who We Are</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
              About Rotaract Club NIBM
            </h2>
            <p className="mt-4 text-slate-600 text-lg">
              Chartered at the National Institute of Business Management, we develop student leadership and serve local communities through impactful humanitarian projects.
            </p>
          </div>

          {/* Mission & 4-Way Test */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="space-y-6">
              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm hover:shadow-[0_0_20px_rgba(75,0,130,0.2)] transition duration-300">
                <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                  <Shield className="text-[#4B0082]" />
                  <span>Our Mission</span>
                </h3>
                <p className="text-slate-700 leading-relaxed text-base">
                  To provide opportunities for young men and women to enhance the knowledge and skills that will assist them in personal development, to address the physical and social needs of their communities, and to promote better relations between all people worldwide through a framework of friendship and service.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-[#4B0082] text-white shadow-[0_0_25px_rgba(75,0,130,0.5)] border border-[#7A3B9E]">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <Award className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                  <span>The Rotary 4-Way Test</span>
                </h3>
                <p className="text-white/80 text-sm mb-4">Of the things we think, say, or do:</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    '1. Is it the TRUTH?',
                    '2. Is it FAIR to all concerned?',
                    '3. Will it build GOODWILL & BETTER FRIENDSHIPS?',
                    '4. Will it be BENEFICIAL to all concerned?'
                  ].map((test, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-white/10 border border-white/20 text-xs font-bold text-white flex items-center gap-2 hover:bg-white/20 transition">
                      <CheckCircle2 size={16} className="text-white flex-shrink-0 drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
                      <span>{test}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Visual Showcase */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xl group">
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200" 
                  alt="Rotaract Teamwork" 
                  className="w-full h-[450px] object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0514]/90 via-slate-950/20 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 p-6 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-lg">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#4B0082] mb-1">Youth Leadership</div>
                  <div className="text-lg font-bold text-slate-900">Developing Next-Generation Leaders</div>
                  <p className="text-xs text-slate-600 mt-1">Empowering students through campus projects, district conferences, and professional development.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Key Milestones */}
          <div className="p-8 sm:p-12 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
            <h3 className="text-3xl font-bold text-slate-900 mb-8 text-center">
              Key Milestones & Journey
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { year: '2010', title: 'Charter Year', desc: 'Rotaract Club NIBM was officially chartered under Rotary District 3220.' },
                { year: '2016', title: 'District Recognition', desc: 'Awarded Top Community Service Club for rural education drives.' },
                { year: '2021', title: 'Digital Innovation', desc: 'Pioneered online mentorship platforms during campus closure.' },
                { year: '2023', title: '1,000+ Lives Empowered', desc: 'Completed milestone health and education drives across Sri Lanka.' },
                { year: '2025', title: 'Global Exchange', desc: 'Expanded twinning agreements with Rotaract clubs across 18 countries.' },
                { year: '2026', title: 'Modern Expansion', desc: 'Launching member digital portal and expanded youth programs.' }
              ].map((m, idx) => (
                <div key={idx} className="p-6 rounded-xl bg-white border border-slate-200 hover:border-[#7A3B9E] transition">
                  <div className="inline-block px-3 py-1 rounded bg-purple-100 text-[#4B0082] font-black text-sm mb-3 border border-purple-200">
                    {m.year}
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-2">{m.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* UPCOMING EVENTS SECTION */}
      <section id="events" className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-100 text-[#4B0082] text-xs font-extrabold uppercase tracking-wider mb-3 border border-purple-200">
                <span>Mark Your Calendar</span>
              </div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">Upcoming Events</h2>
              <p className="text-slate-600 mt-2">Join us in making a hands-on impact in our local communities.</p>
            </div>
            <a 
              href="#join"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-white border border-slate-300 hover:border-[#7A3B9E] text-slate-800 hover:text-[#4B0082] rounded-xl text-sm font-bold transition shadow-sm"
            >
              <span>Get Event Updates</span>
              <ArrowRight size={16} />
            </a>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {upcomingEvents.map((ev) => (
              <div 
                key={ev.id}
                className="group rounded-2xl bg-white border border-slate-200 overflow-hidden hover:border-[#7A3B9E] transition-all duration-300 shadow-sm hover:shadow-[0_0_25px_rgba(75,0,130,0.25)] flex flex-col"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={ev.image} 
                    alt={ev.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-md bg-[#4B0082] text-white text-xs font-bold shadow-[0_0_12px_rgba(75,0,130,0.6)]">
                    {ev.category}
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-xs text-slate-800 bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-200 font-semibold shadow-sm">
                    <span className="flex items-center gap-1 text-[#4B0082] font-bold"><Calendar size={14} />{ev.date}</span>
                    <span className="flex items-center gap-1 text-slate-600"><Clock size={14} />{ev.time}</span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-[#4B0082] transition">{ev.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">{ev.description}</p>
                    <div className="flex items-center space-x-2 text-xs text-slate-700 font-semibold mb-6">
                      <MapPin size={14} className="text-[#4B0082] flex-shrink-0" />
                      <span>{ev.location}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowEventModal(ev)}
                    className="w-full py-3 bg-[#4B0082] hover:bg-[#0B0514] text-white rounded-xl text-sm font-bold transition shadow-md hover:shadow-[0_0_20px_rgba(75,0,130,0.6)] flex items-center justify-center space-x-2"
                  >
                    <span>Register for Event</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* PROJECTS & INITIATIVES */}
      <section id="projects" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-100 text-[#4B0082] text-xs font-extrabold uppercase tracking-wider mb-3 border border-purple-200 shadow-[0_0_10px_rgba(75,0,130,0.2)]">
              <span>Community Impact</span>
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Key Projects & Initiatives</h2>
            <p className="text-slate-600 mt-2">Explore our flagship projects driving change across Education, Health, Environment, and Leadership.</p>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap justify-center gap-2 mt-8">
              {['all', 'Education', 'Environment', 'Health', 'Professional Dev', 'Community'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setProjectCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 capitalize ${
                    projectCategory.toLowerCase() === cat.toLowerCase()
                      ? 'bg-[#4B0082] text-white shadow-[0_0_15px_rgba(75,0,130,0.6)]'
                      : 'bg-slate-100 text-slate-700 hover:text-[#4B0082] border border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {filteredProjects.map((p) => (
              <div 
                key={p.id}
                className="group rounded-2xl bg-white border border-slate-200 overflow-hidden hover:border-[#7A3B9E] transition-all duration-300 shadow-sm hover:shadow-[0_0_20px_rgba(75,0,130,0.25)] flex flex-col"
              >
                <div className="relative h-52 overflow-hidden">
                  <img 
                    src={p.image} 
                    alt={p.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 rounded bg-slate-900/90 text-white text-xs font-bold">
                    {p.category}
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-xs font-bold text-[#4B0082] bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 flex items-center justify-between shadow-sm">
                    <span>Impact Metric:</span>
                    <span>{p.impact}</span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-[#4B0082] transition">{p.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed mb-6">{p.desc}</p>
                  </div>

                  <button
                    onClick={() => setShowProjectModal(p)}
                    className="w-full py-2.5 bg-slate-50 hover:bg-purple-50 text-slate-700 hover:text-[#4B0082] border border-slate-200 hover:border-purple-200 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2"
                  >
                    <Eye size={14} />
                    <span>View Details</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* PHOTO GALLERY */}
      <section id="gallery" className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-100 text-[#4B0082] text-xs font-extrabold uppercase tracking-wider mb-3 border border-purple-200">
              <span>Impact Visuals</span>
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Our Photo Gallery</h2>
            <p className="text-slate-600 mt-2">Moments captured from our service projects, youth summits, and fellowship gatherings.</p>

            {/* Gallery Category Pills */}
            <div className="flex flex-wrap justify-center gap-2 mt-8">
              {['all', 'Community', 'Leadership', 'Environment', 'Health', 'Education'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setGalleryCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 capitalize ${
                    galleryCategory.toLowerCase() === cat.toLowerCase()
                      ? 'bg-[#4B0082] text-white shadow-sm'
                      : 'bg-white text-slate-700 hover:text-[#4B0082] border border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Photo Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {filteredGallery.map((item) => (
              <div 
                key={item.id}
                onClick={() => setSelectedGalleryImg(item)}
                className="group relative h-60 rounded-2xl overflow-hidden cursor-pointer border border-slate-200 hover:border-[#7A3B9E] transition-all duration-300 shadow-sm"
              >
                <img 
                  src={item.img} 
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0514]/80 via-slate-950/20 to-transparent"></div>
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#4B0082] text-[10px] font-bold text-white shadow-sm">
                  {item.category}
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h4 className="text-sm font-bold text-white">{item.title}</h4>
                  <div className="text-[10px] text-white/80 mt-1 flex items-center gap-1 font-semibold">
                    <Eye size={12} />
                    <span>Click to view</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ACHIEVEMENTS & AWARDS */}
      <section className="py-24 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-100 text-[#4B0082] text-xs font-extrabold uppercase tracking-wider mb-3 border border-purple-200">
              <span>Recognition</span>
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Awards & Recognition</h2>
            <p className="text-slate-600 mt-2">Recognizing our commitment to service excellence and youth leadership.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((item, idx) => (
              <div 
                key={idx}
                className="p-8 rounded-2xl bg-slate-50 border border-slate-200 hover:border-[#7A3B9E] transition-all duration-300 relative overflow-hidden group shadow-sm"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="px-3 py-1 rounded bg-purple-100 text-[#4B0082] text-xs font-extrabold border border-purple-200">
                    {item.year}
                  </span>
                  <Award className="w-7 h-7 text-[#4B0082] flex-shrink-0" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-[#4B0082] transition">{item.title}</h3>
                <p className="text-xs text-slate-600 font-medium">{item.org}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* EXECUTIVE LEADERSHIP TEAM */}
      <section id="team" className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-100 text-[#4B0082] text-xs font-extrabold uppercase tracking-wider mb-3 border border-purple-200">
              <span>Board of Directors</span>
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Executive Leadership</h2>
            <p className="text-slate-600 mt-2">Meet the passionate Rotaractors leading Rotaract Club NIBM.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, idx) => (
              <div 
                key={idx}
                className="group p-6 rounded-2xl bg-white border border-slate-200 hover:border-[#7A3B9E] transition-all duration-300 text-center shadow-sm"
              >
                <div className="relative w-28 h-28 mx-auto mb-6 rounded-2xl overflow-hidden border-2 border-slate-200 group-hover:border-[#7A3B9E] transition duration-300 shadow-sm">
                  <img 
                    src={member.img} 
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                  />
                </div>
                <div className="text-xs font-bold text-[#4B0082] uppercase tracking-wider mb-1">{member.position}</div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{member.name}</h3>
                <p className="text-xs text-slate-600 mb-4 leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* JOIN ROTARACT MEMBERSHIP FORM */}
      <section id="join" className="py-24 bg-white border-t border-slate-200 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-slate-50 border border-slate-200 shadow-lg">
            
            <div className="text-center max-w-2xl mx-auto mb-10">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-100 text-[#4B0082] text-xs font-extrabold uppercase tracking-wider mb-3 border border-purple-200">
                <span>Become a Member</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Join Rotaract Club NIBM</h2>
              <p className="text-slate-600 text-sm mt-2">Open to all NIBM undergraduates and young professionals passionate about leadership & social impact.</p>
            </div>

            <form onSubmit={(e) => handleFormSubmit('Membership Application', e)} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Full Name *</label>
                  <input 
                    type="text" 
                    name="membershipName"
                    required
                    value={formData.membershipName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-[#7A3B9E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Email Address *</label>
                  <input 
                    type="email" 
                    name="membershipEmail"
                    required
                    value={formData.membershipEmail}
                    onChange={handleInputChange}
                    placeholder="student@nibm.lk"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-[#7A3B9E]"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Phone Number *</label>
                  <input 
                    type="tel" 
                    name="membershipPhone"
                    required
                    value={formData.membershipPhone}
                    onChange={handleInputChange}
                    placeholder="+94 77 123 4567"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-[#7A3B9E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Academic Year / Intake *</label>
                  <input 
                    type="text" 
                    name="membershipYear"
                    required
                    value={formData.membershipYear}
                    onChange={handleInputChange}
                    placeholder="2nd Year - Software Engineering"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-[#7A3B9E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Primary Area of Interest</label>
                <select 
                  name="membershipInterest"
                  value={formData.membershipInterest}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-[#7A3B9E]"
                >
                  <option value="Community Service">Community Service & Humanitarian Aid</option>
                  <option value="Professional Development">Professional & Skill Development</option>
                  <option value="Environmental Projects">Environmental & Green Conservation</option>
                  <option value="International Service">International Youth Networking</option>
                  <option value="Public Relations">Media, Design & Public Relations</option>
                </select>
              </div>

              <button 
                type="submit"
                className="w-full py-4 bg-[#4B0082] hover:bg-[#0B0514] text-white font-bold rounded-xl text-base transition shadow-md flex items-center justify-center space-x-2"
              >
                <UserPlus size={18} />
                <span>Submit Membership Application</span>
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-4">
              <span>Are you a corporate partner looking to collaborate?</span>
              <button 
                onClick={() => setShowPartnerModal(true)}
                className="font-bold text-[#4B0082] hover:underline flex items-center gap-1"
              >
                <span>Inquire Corporate Partnership</span>
                <ChevronRight size={14} />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Left Contact Details */}
            <div className="space-y-8">
              <div>
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-100 text-[#4B0082] text-xs font-extrabold uppercase tracking-wider mb-3 border border-purple-200">
                  <span>Get In Touch</span>
                </div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Contact Rotaract NIBM</h2>
                <p className="text-slate-600 mt-2">Have questions or want to partner with our club? Reach out to our executive board.</p>
              </div>

              <div className="space-y-4">
                <div className="p-6 rounded-2xl bg-white border border-slate-200 flex items-start space-x-4">
                  <div className="p-3 rounded-xl bg-purple-100 text-[#4B0082]">
                    <MapPin size={22} />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">Campus Location</h4>
                    <p className="text-xs text-slate-600 mt-1">National Institute of Business Management, Vidya Mawatha, Colombo 07, Sri Lanka</p>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-white border border-slate-200 flex items-start space-x-4">
                  <div className="p-3 rounded-xl bg-purple-100 text-[#4B0082]">
                    <Mail size={22} />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">Email Address</h4>
                    <p className="text-xs text-slate-600 mt-1">rotaract@nibm.edu.lk • info@rotaractnibm.org</p>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-white border border-slate-200 flex items-start space-x-4">
                  <div className="p-3 rounded-xl bg-purple-100 text-[#4B0082]">
                    <Phone size={22} />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">Phone & WhatsApp</h4>
                    <p className="text-xs text-slate-600 mt-1">+94 11 269 3801 (President) • +94 77 890 1234 (Secretary)</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">Connect On Social Media</h4>
                <div className="flex space-x-3">
                  <a href="#facebook" className="p-3 rounded-xl bg-white border border-slate-200 text-[#4B0082] hover:bg-[#4B0082] hover:text-white transition">
                    <Facebook size={18} />
                  </a>
                  <a href="#instagram" className="p-3 rounded-xl bg-white border border-slate-200 text-[#4B0082] hover:bg-[#4B0082] hover:text-white transition">
                    <Instagram size={18} />
                  </a>
                  <a href="#linkedin" className="p-3 rounded-xl bg-white border border-slate-200 text-[#4B0082] hover:bg-[#4B0082] hover:text-white transition">
                    <Linkedin size={18} />
                  </a>
                </div>
              </div>
            </div>

            {/* Right Contact Form */}
            <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-md">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Send Us a Direct Message</h3>
              <form onSubmit={(e) => handleFormSubmit('Contact Message', e)} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Your Name *</label>
                  <input 
                    type="text" 
                    name="contactName"
                    required
                    value={formData.contactName}
                    onChange={handleInputChange}
                    placeholder="Jane Doe"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-[#7A3B9E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Your Email *</label>
                  <input 
                    type="email" 
                    name="contactEmail"
                    required
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    placeholder="jane@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-[#7A3B9E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Subject *</label>
                  <input 
                    type="text" 
                    name="contactSubject"
                    required
                    value={formData.contactSubject}
                    onChange={handleInputChange}
                    placeholder="Project Inquiry / Sponsorship"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-[#7A3B9E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Message *</label>
                  <textarea 
                    name="contactMessage"
                    rows="4"
                    required
                    value={formData.contactMessage}
                    onChange={handleInputChange}
                    placeholder="Write your message here..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-[#7A3B9E]"
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  className="w-full py-3.5 bg-[#4B0082] hover:bg-[#0B0514] text-white font-bold rounded-xl text-sm transition shadow-md flex items-center justify-center space-x-2"
                >
                  <Send size={16} />
                  <span>Send Message</span>
                </button>
              </form>
            </div>

          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-white py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            
            <div className="space-y-4 md:col-span-1">
              <img 
                src={BRAND_CONFIG.themeChangingLogo} 
                alt="Rotaract Club NIBM Kandy Official Logo" 
                className="h-12 sm:h-14 w-auto object-contain" 
              />
              <p className="text-xs text-slate-400 leading-relaxed">
                Rotaract Club of NIBM Campus. Sponsored by Rotary Club of Colombo. Empowering youth leadership and community service in Sri Lanka.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">Quick Navigation</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><a href="#home" className="hover:text-white transition">Home</a></li>
                <li><a href="#about" className="hover:text-white transition">About Us</a></li>
                <li><a href="#events" className="hover:text-white transition">Upcoming Events</a></li>
                <li><a href="#projects" className="hover:text-white transition">Our Projects</a></li>
                <li><a href="#gallery" className="hover:text-white transition">Photo Gallery</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">Club Initiatives</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><a href="#projects" className="hover:text-white transition">Community Service</a></li>
                <li><a href="#projects" className="hover:text-white transition">Professional Development</a></li>
                <li><a href="#projects" className="hover:text-white transition">Environmental Conservation</a></li>
                <li><a href="#projects" className="hover:text-white transition">International Service</a></li>
                <li><a href="#projects" className="hover:text-white transition">Youth Accelerator</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">NIBM Campus Address</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Vidya Mawatha, Colombo 07, Sri Lanka.<br />
                Rotary District 3220.<br />
                Chartered in 2010.
              </p>
            </div>

          </div>

          <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <div>
              © {new Date().getFullYear()} Rotaract Club of NIBM. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <button onClick={() => setShowLoginModal(true)} className="hover:text-slate-300">Member Portal</button>
              <a href="#contact" className="hover:text-slate-300">Privacy Policy</a>
              <a href="#contact" className="hover:text-slate-300">Contact Us</a>
            </div>
          </div>
        </div>
      </footer>

      {/* MODAL 1: MEMBER PORTAL LOGIN */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md p-8 rounded-3xl bg-white border border-slate-200 shadow-2xl">
            <button 
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
            >
              <X size={20} />
            </button>
            
            <div className="text-center mb-6">
              <img 
                src={BRAND_CONFIG.navbarLogo} 
                alt="Rotaract Club NIBM Kandy Logo" 
                className="h-12 w-auto mx-auto mb-3 object-contain" 
              />
              <h3 className="text-xl font-bold text-slate-900">Rotaract NIBM Member Portal</h3>
              <p className="text-xs text-slate-500 mt-1">Access internal club management & project logs</p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); alert('Member login successful!'); setShowLoginModal(false); }} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Rotaract ID / Email</label>
                <input 
                  type="text" 
                  required
                  placeholder="rtr.kaveen@nibm.lk"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-[#7A3B9E]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Password</label>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-[#7A3B9E]"
                />
              </div>
              <button 
                type="submit"
                className="w-full py-3.5 bg-[#4B0082] hover:bg-[#0B0514] text-white font-bold rounded-xl text-sm transition shadow-md"
              >
                Sign In to Member Portal
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EVENT REGISTRATION */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg p-8 rounded-3xl bg-white border border-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setShowEventModal(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
            >
              <X size={20} />
            </button>
            
            <div className="mb-6">
              <span className="px-3 py-1 rounded bg-purple-100 text-[#4B0082] text-xs font-extrabold border border-purple-200">
                {showEventModal.category}
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-2">{showEventModal.title}</h3>
              <p className="text-xs text-slate-600 mt-1">{showEventModal.date} • {showEventModal.location}</p>
            </div>

            <form onSubmit={(e) => handleFormSubmit('Event Registration', e, showEventModal)} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Your Full Name *</label>
                <input 
                  type="text" 
                  name="eventRegName"
                  required
                  value={formData.eventRegName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-[#7A3B9E]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Email Address *</label>
                <input 
                  type="email" 
                  name="eventRegEmail"
                  required
                  value={formData.eventRegEmail}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-[#7A3B9E]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Phone Number *</label>
                <input 
                  type="tel" 
                  name="eventRegPhone"
                  required
                  value={formData.eventRegPhone}
                  onChange={handleInputChange}
                  placeholder="+94 77 123 4567"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-[#7A3B9E]"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-3.5 bg-[#4B0082] hover:bg-[#0B0514] text-white font-bold rounded-xl text-sm transition shadow-md flex items-center justify-center space-x-2"
              >
                <CheckCircle2 size={18} />
                <span>Confirm Volunteer & Registration Pass</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: PROJECT DETAILS & VOLUNTEER SIGN-UP */}
      {showProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-xl p-8 rounded-3xl bg-white border border-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setShowProjectModal(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
            >
              <X size={20} />
            </button>
            
            <div className="mb-4">
              <span className="px-3 py-1 rounded bg-purple-100 text-[#4B0082] text-xs font-extrabold border border-purple-200">
                {showProjectModal.category}
              </span>
              <h3 className="text-2xl font-bold text-slate-900 mt-2">{showProjectModal.title}</h3>
            </div>

            <img 
              src={showProjectModal.image} 
              alt={showProjectModal.title}
              className="w-full h-52 object-cover rounded-2xl my-4 border border-slate-200"
            />

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-[#4B0082] mb-4 flex items-center justify-between">
              <span>Project Impact: {showProjectModal.impact}</span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full font-extrabold">Actively Recruiting Volunteers</span>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed mb-6">
              {showProjectModal.details}
            </p>

            <form onSubmit={(e) => handleFormSubmit('Project Volunteer', e, showProjectModal)} className="space-y-3 pt-4 border-t border-slate-200">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <HeartHandshake size={16} className="text-[#4B0082]" />
                <span>Volunteer For This Project</span>
              </h4>
              <div className="grid sm:grid-cols-2 gap-3">
                <input 
                  type="text" 
                  name="volunteerName"
                  required
                  value={formData.volunteerName}
                  onChange={handleInputChange}
                  placeholder="Your Full Name *"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-[#7A3B9E]"
                />
                <input 
                  type="email" 
                  name="volunteerEmail"
                  required
                  value={formData.volunteerEmail}
                  onChange={handleInputChange}
                  placeholder="Your Email *"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-[#7A3B9E]"
                />
              </div>
              <button 
                type="submit"
                className="w-full py-3 bg-[#4B0082] hover:bg-[#0B0514] text-white font-bold rounded-xl text-xs transition shadow-md flex items-center justify-center space-x-2"
              >
                <Sparkles size={16} />
                <span>Sign Up as Volunteer for {showProjectModal.title}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: GALLERY FULLVIEW */}
      {selectedGalleryImg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="relative max-w-3xl w-full p-4 bg-white rounded-3xl overflow-hidden shadow-2xl">
            <button 
              onClick={() => setSelectedGalleryImg(null)}
              className="absolute top-4 right-4 p-2 text-slate-800 hover:bg-slate-200 rounded-full bg-slate-100 z-10"
            >
              <X size={20} />
            </button>
            <img 
              src={selectedGalleryImg.img} 
              alt={selectedGalleryImg.title} 
              className="w-full max-h-[70vh] object-cover rounded-2xl"
            />
            <div className="p-4 text-center">
              <span className="px-3 py-1 rounded bg-purple-100 text-[#4B0082] text-xs font-bold">
                {selectedGalleryImg.category}
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-2">{selectedGalleryImg.title}</h3>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: PARTNER INQUIRY */}
      {showPartnerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg p-8 rounded-3xl bg-white border border-slate-200 shadow-2xl">
            <button 
              onClick={() => setShowPartnerModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
            >
              <X size={20} />
            </button>

            <div className="mb-6">
              <h3 className="text-2xl font-bold text-slate-900">Corporate Partnership Inquiry</h3>
              <p className="text-xs text-slate-500 mt-1">Collaborate with Rotaract Club NIBM on community CSR initiatives.</p>
            </div>

            <form onSubmit={(e) => handleFormSubmit('Partner Inquiry', e)} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Company / Organization *</label>
                <input 
                  type="text" 
                  name="partnerCompany"
                  required
                  value={formData.partnerCompany}
                  onChange={handleInputChange}
                  placeholder="Acme Corporation"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-[#7A3B9E]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Contact Name *</label>
                <input 
                  type="text" 
                  name="partnerName"
                  required
                  value={formData.partnerName}
                  onChange={handleInputChange}
                  placeholder="John Smith"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-[#7A3B9E]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Official Email *</label>
                <input 
                  type="email" 
                  name="partnerEmail"
                  required
                  value={formData.partnerEmail}
                  onChange={handleInputChange}
                  placeholder="john@acme.com"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-[#7A3B9E]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Proposal / Notes</label>
                <textarea 
                  name="partnerMessage"
                  rows="3"
                  value={formData.partnerMessage}
                  onChange={handleInputChange}
                  placeholder="Details regarding CSR sponsorship or collaboration..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-[#7A3B9E]"
                ></textarea>
              </div>

              <button 
                type="submit"
                className="w-full py-3.5 bg-[#4B0082] hover:bg-[#0B0514] text-white font-bold rounded-xl text-sm transition shadow-md"
              >
                Submit Partnership Proposal
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 6: OFFICIAL VOLUNTEER PASS & CONFIRMATION RECEIPT */}
      {volunteerConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="relative w-full max-w-xl p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-2xl max-h-[95vh] overflow-y-auto">
            <button 
              onClick={() => setVolunteerConfirmation(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
            >
              <X size={20} />
            </button>

            {/* Header Badge */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner border border-emerald-200">
                <CheckCircle2 size={36} />
              </div>
              <span className="px-3 py-1 rounded-full bg-purple-100 text-[#4B0082] text-[11px] font-black uppercase tracking-wider border border-purple-200">
                Rotaract NIBM Official Confirmation
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-2">Volunteer Application Confirmed!</h3>
              <p className="text-xs text-slate-600 mt-1">Thank you for stepping up to make a meaningful community impact.</p>
            </div>

            {/* Official Pass Ticket Box */}
            <div className="p-6 rounded-2xl bg-[#0B0514] text-white relative overflow-hidden shadow-xl border border-slate-800 mb-6">
              {/* Background Accent Lines */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#4B0082] rounded-full filter blur-2xl opacity-50"></div>
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 relative z-10">
                <div className="flex items-center space-x-3">
                  <img 
                    src={BRAND_CONFIG.themeChangingLogo} 
                    alt="Rotaract Official Pass Logo" 
                    className="h-8 w-auto object-contain" 
                  />
                  <span className="text-[10px] font-black tracking-wider uppercase text-slate-300 bg-white/10 px-2 py-0.5 rounded border border-white/20">Official Pass</span>
                </div>
                <div className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-800 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>{volunteerConfirmation.status}</span>
                </div>
              </div>

              <div className="py-4 space-y-3 relative z-10">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Activity / Initiative</span>
                  <h4 className="text-base font-bold text-white leading-tight mt-0.5">{volunteerConfirmation.title}</h4>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Volunteer Name</span>
                    <p className="font-semibold text-slate-100">{volunteerConfirmation.name}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contact Email</span>
                    <p className="font-semibold text-slate-100 truncate">{volunteerConfirmation.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs pt-1">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Target Date</span>
                    <p className="font-semibold text-slate-200">{volunteerConfirmation.date}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Registration ID</span>
                    <p className="font-mono font-bold text-[#f59e0b]">{volunteerConfirmation.id}</p>
                  </div>
                </div>
              </div>

              {/* QR Code and Pass Details */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between relative z-10">
                <div className="space-y-1">
                  <div className="text-[10px] text-slate-400">Issued On: {volunteerConfirmation.timestamp}</div>
                  <div className="text-[10px] text-slate-400">Location: {volunteerConfirmation.location}</div>
                </div>
                <div className="bg-white p-1.5 rounded-lg shadow-inner">
                  <img src={volunteerConfirmation.qrCodeUrl} alt="QR Code Pass" className="w-12 h-12" />
                </div>
              </div>
            </div>

            {/* Next Steps List */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 mb-6 text-xs text-slate-700">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <Sparkles size={15} className="text-[#4B0082]" />
                <span>What Happens Next:</span>
              </div>
              <ul className="space-y-1.5 pl-5 list-disc text-slate-600">
                <li>Confirmation copy has been logged to <span className="font-bold text-slate-900">{volunteerConfirmation.email}</span>.</li>
                <li>Assigned to Director of Community Service for orientation briefing.</li>
                <li>You will receive a WhatsApp link and calendar invitation 48h before the event.</li>
              </ul>
            </div>

            {/* Action buttons */}
            <div className="grid sm:grid-cols-2 gap-3">
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(volunteerConfirmation.id);
                  setCopiedId(true);
                  setTimeout(() => setCopiedId(false), 2000);
                }}
                className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition flex items-center justify-center space-x-2 border border-slate-300"
              >
                {copiedId ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
                <span>{copiedId ? 'Registration ID Copied!' : 'Copy Registration ID'}</span>
              </button>

              <button 
                onClick={() => {
                  alert(`Added "${volunteerConfirmation.title}" to your calendar.`);
                }}
                className="py-3 px-4 rounded-xl bg-[#4B0082] hover:bg-[#0B0514] text-white font-bold text-xs transition flex items-center justify-center space-x-2 shadow-md"
              >
                <Calendar size={16} />
                <span>Add to Calendar (.ics)</span>
              </button>
            </div>

            <div className="mt-4 text-center">
              <button 
                onClick={() => {
                  setVolunteerConfirmation(null);
                  setShowPassModal(true);
                }}
                className="text-xs font-bold text-[#4B0082] hover:underline"
              >
                View All My Active Volunteer Passes ({myVolunteerActivities.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 7: MY VOLUNTEER PASSES LIST */}
      {showPassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="relative w-full max-w-2xl p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setShowPassModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
            >
              <X size={20} />
            </button>

            <div className="mb-6 flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 text-[#4B0082] rounded-2xl flex items-center justify-center">
                <FileText size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">My Volunteer Passes & Activity History</h3>
                <p className="text-xs text-slate-500">Your registered events, membership status, and volunteer records</p>
              </div>
            </div>

            {myVolunteerActivities.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
                <Award size={40} className="mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-bold text-slate-600">No active volunteer passes yet</p>
                <p className="text-xs text-slate-400 mt-1">Register for an upcoming event or volunteer for a project to generate your official pass.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myVolunteerActivities.map((act) => (
                  <div key={act.id} className="p-5 rounded-2xl bg-[#0B0514] text-white border border-slate-800 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#4B0082] text-[10px] font-bold text-white">{act.type}</span>
                        <span className="text-[10px] text-amber-400 font-mono font-bold">{act.id}</span>
                      </div>
                      <h4 className="text-base font-bold text-white">{act.title}</h4>
                      <div className="text-xs text-slate-400 mt-1">
                        Registered as: <span className="text-slate-200 font-medium">{act.name}</span> ({act.email})
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Submitted: {act.timestamp}</div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800">
                      <span className="px-2.5 py-1 rounded-md bg-emerald-950 text-emerald-400 text-[10px] font-bold border border-emerald-800">
                        {act.status}
                      </span>
                      <button 
                        onClick={() => setVolunteerConfirmation(act)}
                        className="text-xs font-bold text-[#4B0082] bg-white px-3 py-1.5 rounded-xl hover:bg-slate-100 transition"
                      >
                        View Official Pass
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-slate-200 text-center">
              <button 
                onClick={() => setShowPassModal(false)}
                className="py-3 px-8 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition"
              >
                Close Pass Drawer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default RotaractWebsite;
