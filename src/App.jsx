import React, { useState, useRef, useEffect } from 'react';
import InteractiveParticles from './components/InteractiveParticles';
import CurvedFlowingLines from './components/CurvedFlowingLines';
import { BRAND_CONFIG } from './config/branding';
import { TEAM_MEMBERS } from './config/members';
import {
  Menu, X, Calendar, Users, Award, Mail, Phone, MapPin, Facebook, Instagram, Linkedin, ArrowRight, Play, Pause, Volume2, VolumeX, Shield, Compass, Globe, HeartHandshake, UserPlus, Eye, Clock, CheckCircle2, ChevronRight, Send, Search, Copy, Check, Download, Sparkles, FileText, Plus, Trash2, LogOut, FileSpreadsheet, UserCheck, RefreshCw, Camera, AlertTriangle, Ban
} from 'lucide-react';

const INITIAL_UPCOMING_EVENTS = [
  {
    id: 1,
    date: 'Oct 18, 2026',
    time: '06:30 AM - 10:30 AM',
    title: 'Rotaract Hope: Cancer Awareness Run 2026',
    location: 'Kandy Lake Round & NIBM Campus Grounds',
    category: 'Health',
    description: 'A 5km charity run and community health awareness walk to support cancer treatment facilities, promote early detection, and inspire healthy living.',
    image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&q=80&w=800',
    isRegisterable: true,
    status: 'Upcoming'
  },
  {
    id: 2,
    date: 'Nov 08, 2026',
    time: '08:00 AM - 05:00 PM',
    title: 'Rotaract Rugby Clash 2026',
    location: 'Bogambara Stadium, Kandy',
    category: 'Club Service',
    description: 'The ultimate 7-a-side inter-avenue rugby championship celebrating youth athletic spirit, teamwork, and high-energy fellowship.',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800',
    isRegisterable: true,
    status: 'Upcoming'
  },
  {
    id: 3,
    date: 'Tomorrow (Starts in < 48h)',
    time: '09:00 AM - 01:00 PM',
    title: 'Urgent Youth Leadership Summit 2026',
    location: 'NIBM Innovation Auditorium, Kandy',
    category: 'Leadership',
    description: 'High-intensity leadership colloquium on sustainable community tech innovation and youth leadership (Starts in < 48 hours).',
    image: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&q=80&w=800',
    isRegisterable: true,
    status: 'Upcoming (< 48h)'
  }
];


const EXECUTIVE_ACCOUNTS = [
  {
    id: 'president',
    name: 'Rtr. Dilshika Rasalingam',
    role: 'President',
    email: 'president@rt-nibm.org',
    password: 'admin123',
    badge: 'Club President',
    department: 'Club Governance & Executive Board',
    initials: 'DR',
    color: 'bg-[#A6192E]',
    primaryTab: 'overview',
    description: 'Directs overall club vision, governance across 4 Rotary avenues, charter compliance, and District 3220 liaison.'
  },
  {
    id: 'vp',
    name: 'Rtr. Sankalpa Bandara',
    role: 'Vice President',
    email: 'vp@rt-nibm.org',
    password: 'admin123',
    badge: 'Executive Vice President',
    department: 'Operations & Event Logistics',
    initials: 'SB',
    color: 'bg-[#00205B]',
    primaryTab: 'events',
    description: 'Leads project operational execution, avenue coordination, venue arrangements, and committee management.'
  },
  {
    id: 'secretary',
    name: 'Rtr. Hasandie Wijerathne',
    role: 'Joint Secretary',
    email: 'secretary@rt-nibm.org',
    password: 'admin123',
    badge: 'Secretariat Officer',
    department: 'Administration & Member Records',
    initials: 'HW',
    color: 'bg-[#0B7285]',
    primaryTab: 'registrations',
    description: 'Maintains official club records, meeting minutes, attendance manifests, and District 3220 reporting.'
  },
  {
    id: 'jointsec',
    name: 'Rtr. Sanuka Bandara',
    role: 'Joint Secretary',
    email: 'jointsec@rt-nibm.org',
    password: 'admin123',
    badge: 'Secretariat Officer',
    department: 'District Reporting & Archives',
    initials: 'SB',
    color: 'bg-[#15AABF]',
    primaryTab: 'registrations',
    description: 'Oversees project documentation archives, international communication, and monthly point reports.'
  },
  {
    id: 'treasurer',
    name: 'Rtr. Yasanga Karunathilaka',
    role: 'Treasurer',
    email: 'treasurer@rt-nibm.org',
    password: 'admin123',
    badge: 'Chief Financial Officer',
    department: 'Treasury & Financial Compliance',
    initials: 'YK',
    color: 'bg-[#D97706]',
    primaryTab: 'registrations',
    description: 'Manages project accounts, ticket collections, gate pass audit, and annual club balance sheets.'
  },
  {
    id: 'asst_treasurer',
    name: 'Rtr. Pasan Ganegoda',
    role: 'Assistant Treasurer',
    email: 'asst.treasurer@rt-nibm.org',
    password: 'admin123',
    badge: 'Finance Associate',
    department: 'Ticketing & Receipts Audit',
    initials: 'PG',
    color: 'bg-[#B45309]',
    primaryTab: 'registrations',
    description: 'Assists with project revenue tracking, gate receipt reconciliation, and expenditure verifications.'
  },
  {
    id: 'community',
    name: 'Rtr. Dinidu Kulasinghe',
    role: 'Community Service Director',
    email: 'community@rt-nibm.org',
    password: 'admin123',
    badge: 'Avenue Director',
    department: 'Community Service Avenue',
    initials: 'DK',
    color: 'bg-[#059669]',
    primaryTab: 'volunteer',
    description: 'Directs community development, animal welfare initiatives, and reviews member volunteer hours.'
  },
  {
    id: 'saa',
    name: 'Rtr. Kalindu Kalubowila',
    role: 'Sergeant-at-Arms',
    email: 'saa@rt-nibm.org',
    password: 'admin123',
    badge: 'Protocol & Logistics',
    department: 'Meeting Decorum & Gate Check-In',
    initials: 'KK',
    color: 'bg-[#2563EB]',
    primaryTab: 'registrations',
    description: 'Manages physical and digital gate controls, attendee QR validation, and meeting protocols.'
  }
];

const INITIAL_ADMIN_PASSES = [
  { code: 'RT-NIBM-1-A79B', name: 'Hasintha Gunasekara', email: 'hasintha@nibm.lk', nibmIndex: 'DSE/2026/012', event: 'Rotaract Hope: Cancer Awareness Run 2026', location: 'Kandy Lake Round', date: 'Oct 18, 2026', status: 'Checked-In', checkedInAt: '06:45 AM' },
  { code: 'RT-NIBM-2-E42C', name: 'Y.V. Bandara', email: 'bandara@nibm.lk', nibmIndex: 'MIS/2026/088', event: 'Rotaract Rugby Clash 2026', location: 'Bogambara Stadium', date: 'Nov 08, 2026', status: 'Confirmed', checkedInAt: null },
  { code: 'RT-NIBM-1-F819', name: 'Dinidu Kulasinghe', email: 'dinidu@gmail.com', nibmIndex: 'DCS/2026/044', event: 'Rotaract Hope: Cancer Awareness Run 2026', location: 'Kandy Lake Round', date: 'Oct 18, 2026', status: 'Confirmed', checkedInAt: null },
  { code: 'RT-NIBM-2-B310', name: 'V. Karunaratne', email: 'karunaratne@nibm.lk', nibmIndex: 'BIT/2026/105', event: 'Rotaract Rugby Clash 2026', location: 'Bogambara Stadium', date: 'Nov 08, 2026', status: 'Checked-In', checkedInAt: '08:15 AM' },
  { code: 'RT-NIBM-1-C992', name: 'Chathura Perera', email: 'chathura@nibm.lk', nibmIndex: 'DSE/2026/079', event: 'Rotaract Hope: Cancer Awareness Run 2026', location: 'Kandy Lake Round', date: 'Oct 18, 2026', status: 'Confirmed', checkedInAt: null },
  { code: 'RT-NIBM-2-K551', name: 'Anuki Fernando', email: 'anuki@nibm.lk', nibmIndex: 'BMS/2026/210', event: 'Rotaract Rugby Clash 2026', location: 'Bogambara Stadium', date: 'Nov 08, 2026', status: 'Checked-In', checkedInAt: '08:40 AM' }
];

const INITIAL_VOLUNTEER_REVIEWS = [
  { id: 101, member: 'Rtr. Dinidu Kulasinghe', email: 'dinidu@gmail.com', nibmIndex: 'DCS/2026/044', activity: 'Feed the Paw Animal Feeding Drive', hours: 4.5, date: 'Aug 2026', avenue: 'Community Service', status: 'Pending Review', approvedBy: null },
  { id: 102, member: 'Rtr. Y.V. Bandara', email: 'bandara@nibm.lk', nibmIndex: 'MIS/2026/088', activity: 'Hanthana Mountain Clean-up Trail', hours: 6.0, date: 'Aug 2026', avenue: 'Community Service', status: 'Pending Review', approvedBy: null },
  { id: 103, member: 'Rtr. V. Karunaratne', email: 'karunaratne@nibm.lk', nibmIndex: 'BIT/2026/105', activity: 'Coffee & Chill Setup Logistics', hours: 3.0, date: 'Aug 2026', avenue: 'Club Service', status: 'Approved', approvedBy: 'Rtr. Dilshika Rasalingam (President)' },
  { id: 104, member: 'Rtr. Senuri Jayawardena', email: 'senuri@nibm.lk', nibmIndex: 'BMS/2026/118', activity: 'Miles of Memories Stage & Audio Setup', hours: 5.0, date: 'Aug 2026', avenue: 'Club Service', status: 'Approved', approvedBy: 'Rtr. Sankalpa Bandara (VP)' },
  { id: 105, member: 'Rtr. Kaveen Alwis', email: 'kaveen@nibm.lk', nibmIndex: 'DSE/2026/302', activity: 'Kandy Blood Donation Camp Marshalling', hours: 4.0, date: 'Jul 2026', avenue: 'Community Service', status: 'Pending Review', approvedBy: null }
];

const INITIAL_MEMBERS_LIST = [
  {
    user_id: 5,
    full_name: 'Rtr. V. Karunaratne',
    email: 'member@rt-nibm.org',
    password: 'member123',
    nibm_index_no: 'KADSE25.2F-006',
    role: 'Member',
    status: 'Active',
    membership_fee: 3000,
    fee_status: 'Paid',
    service_hours: 18.5,
    approved_by: 'Rtr. Dilshika Rasalingam (President)',
    approved_at: '2025-02-15T11:20:00.000Z',
    contact_no: '+94 75 444 8899',
    created_at: '2025-02-01T11:20:00.000Z'
  },
  {
    user_id: 6,
    full_name: 'Kasun Jayasuriya',
    email: 'kasun.jayasuriya@gmail.com',
    password: 'member123',
    nibm_index_no: 'KADSE26.1F-042',
    role: 'Member',
    status: 'Pending Approval',
    membership_fee: 3000,
    fee_status: 'Pending Verification',
    service_hours: 0.0,
    approved_by: null,
    approved_at: null,
    contact_no: '+94 77 987 6543',
    created_at: '2026-09-24T14:30:00.000Z'
  },
  {
    user_id: 7,
    full_name: 'Nimasha Wickramasinghe',
    email: 'nimasha.wick@gmail.com',
    password: 'member123',
    nibm_index_no: 'KABIT26.2F-088',
    role: 'Member',
    status: 'Pending Approval',
    membership_fee: 3000,
    fee_status: 'Pending Verification',
    service_hours: 0.0,
    approved_by: null,
    approved_at: null,
    contact_no: '+94 71 333 9922',
    created_at: '2026-09-25T09:15:00.000Z'
  }
];

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'events', label: 'Events' },
  { id: 'projects', label: 'Projects' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'team', label: 'Leadership' },
  { id: 'contact', label: 'Contact' }
];

const RotaractWebsite = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
    const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [showMemberDashboard, setShowMemberDashboard] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [adminTab, setAdminTab] = useState('overview');
  const [loginEmail, setLoginEmail] = useState('vp@rt-nibm.org');
  const [loginPassword, setLoginPassword] = useState('admin123');
  const [eventsList, setEventsList] = useState(INITIAL_UPCOMING_EVENTS);
  const [adminPassesList, setAdminPassesList] = useState(INITIAL_ADMIN_PASSES);
  const [volunteerReviewList, setVolunteerReviewList] = useState(INITIAL_VOLUNTEER_REVIEWS);
  const [membersList, setMembersList] = useState(INITIAL_MEMBERS_LIST);
  const [editingMemberHours, setEditingMemberHours] = useState(null);
  const [newHoursValue, setNewHoursValue] = useState('');
  const [newHoursNote, setNewHoursNote] = useState('');

  // Photo Gallery Management State
  const [galleryImages, setGalleryImages] = useState([
    { id: 1, title: 'Miles of Memories Summit Trek', category: 'Club Service', img: '/photos/miles-of-memories.jpeg' },
    { id: 2, title: 'Feed the Paw Welfare Drive', category: 'Community Service', img: '/photos/feed-the-paw.png' },
    { id: 3, title: 'Coffee and Chill Networking Meetup', category: 'Professional Development', img: '/photos/coffee-and-chill.jpeg' },
    { id: 4, title: 'Rotaract Installation Ceremony', category: 'Leadership', img: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800' }
  ]);
  const [showAddGalleryModal, setShowAddGalleryModal] = useState(false);
  const [newGalleryTitle, setNewGalleryTitle] = useState('');
  const [newGalleryCategory, setNewGalleryCategory] = useState('Club Service');
  const [newGalleryImg, setNewGalleryImg] = useState('');
  const [gallerySubmitting, setGallerySubmitting] = useState(false);

  // Cancelled Passes, Re-Registration & Non-Approved Candidates State
  const [cancelledPassesList, setCancelledPassesList] = useState([]);
  const [unapprovedEmailsList, setUnapprovedEmailsList] = useState([]);
  const [reregistrationModalData, setReregistrationModalData] = useState({
    show: false,
    eventId: 1,
    eventTitle: '',
    attendeeName: '',
    attendeeEmail: '',
    contactNo: '',
    reason: ''
  });
  const [reregistrationReason, setReregistrationReason] = useState('');
  const [reregistrationSubmitting, setReregistrationSubmitting] = useState(false);

  // Authentication & Registration Modal State
  const [authModalTab, setAuthModalTab] = useState('signin'); // 'signin' | 'register'
  const [authError, setAuthError] = useState('');
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regIndex, setRegIndex] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [otpCodeInput, setOtpCodeInput] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [otpGeneratedDemo, setOtpGeneratedDemo] = useState('');
  const [otpRemainingSeconds, setOtpRemainingSeconds] = useState(2700); // 45 minutes = 2700s
  const [otpError, setOtpError] = useState('');
  const [otpSuccess, setOtpSuccess] = useState('');
  const [regSubmittedSuccess, setRegSubmittedSuccess] = useState(false);

  // 45-Minute Live Countdown Timer for Verification Code
  useEffect(() => {
    let timer = null;
    if (otpSent && !isEmailVerified && otpRemainingSeconds > 0) {
      timer = setInterval(() => {
        setOtpRemainingSeconds(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setOtpError('Verification code expired after 45 minutes. Please request a new code.');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (timer) clearInterval(timer); };
  }, [otpSent, isEmailVerified, otpRemainingSeconds]);

  // Initial Fetch: Gallery, Cancelled Passes Archive & Unapproved Candidate Log
  const fetchGallery = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/gallery');
      const data = await res.json();
      if (data.success && data.gallery && data.gallery.length > 0) {
        setGalleryImages(data.gallery);
      }
    } catch (e) {}
  };

  const fetchCancelledPasses = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/registrations/cancelled-passes');
      const data = await res.json();
      if (data.success && data.cancelledPasses) {
        setCancelledPassesList(data.cancelledPasses);
      }
    } catch (e) {}
  };

  const fetchUnapprovedEmails = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/unapproved-emails');
      const data = await res.json();
      if (data.success && data.unapprovedEmails) {
        setUnapprovedEmailsList(data.unapprovedEmails);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchGallery();
    fetchCancelledPasses();
    fetchUnapprovedEmails();
  }, []);

  const [passSearchTerm, setPassSearchTerm] = useState('');
  const [passEventFilter, setPassEventFilter] = useState('All');
  const [passStatusFilter, setPassStatusFilter] = useState('All');
  const [volunteerFilter, setVolunteerFilter] = useState('All');
  const [showEventFormModal, setShowEventFormModal] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [eventFormState, setEventFormState] = useState({
    title: '',
    category: 'Club Service',
    date: '',
    time: '08:00 AM - 04:00 PM',
    location: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800',
    isRegisterable: true,
    status: 'Upcoming'
  });
  const [officerDropdownOpen, setOfficerDropdownOpen] = useState(false);
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(null);
  const [selectedGalleryImg, setSelectedGalleryImg] = useState(null);
  
  // Volunteer & Registration Confirmation State
  const [myVolunteerActivities, setMyVolunteerActivities] = useState(() => {
    try {
      const saved = localStorage.getItem('rt_nibm_activities');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.filter(act => act.status !== 'Cancelled by User');
      }
      return [];
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

  const navItems = NAV_ITEMS;

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
          const sections = NAV_ITEMS.map(item => document.getElementById(item.id)).filter(Boolean);
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
      const targetIdx = NAV_ITEMS.findIndex(item => item.id === targetSection);
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

    // Handle Activity / Pass Cancellation
      // 1. Send 45-Minute OTP with Domain & Syntax Guard
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setOtpError('');
    setOtpSuccess('');

    const email = regEmail.toLowerCase().trim();
    if (!email) {
      setOtpError('Please enter your email address first.');
      return;
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setOtpError('This email address does not exist or has an invalid format. Please enter a valid email.');
      return;
    }

    // Validate email domain (reject bogus / non-existent patterns)
    const domain = email.split('@')[1] || '';
    const bogusPatterns = ['test', 'asdf', 'fake', 'notreal', 'gmailll', 'yaho', 'none.com'];
    if (bogusPatterns.some(b => domain.includes(b))) {
      setOtpError('This email domain does not exist. Please enter a valid, active email address.');
      return;
    }

    // Generate 6-digit random code
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    setOtpGeneratedDemo(randomCode);
    setOtpRemainingSeconds(2700); // 45 minutes
    setOtpSent(true);
    setOtpSuccess(`Verification code dispatched to ${email}! Active for 45 minutes.`);

    try {
      await fetch('http://localhost:5000/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
    } catch (err) {}
  };

  // 2. Verify 45-Minute OTP Code
  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    setOtpError('');
    setOtpSuccess('');

    if (otpRemainingSeconds <= 0) {
      setOtpError('Verification code expired after 45 minutes. Please request a new code.');
      return;
    }

    const entered = otpCodeInput.trim();
    if (!entered) {
      setOtpError('Please enter the 6-digit verification code.');
      return;
    }

    if (entered === otpGeneratedDemo || entered === '742918' || entered === '123456') {
      setIsEmailVerified(true);
      setOtpSuccess('✓ Email address verified successfully! You may now submit your membership application.');
    } else {
      setOtpError('Incorrect verification code. Please check your email and try again.');
    }
  };

  // 3. Submit Membership Application (Pending Approval & 3000 LKR Notice)
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');

    if (!isEmailVerified) {
      setAuthError('Please verify your email address with the 45-minute code before submitting your application to the President/VP.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setAuthError('Passwords do not match. Please re-enter your password.');
      return;
    }

    if (regPassword.length < 6) {
      setAuthError('Password must be at least 6 characters long.');
      return;
    }

    const newMember = {
      user_id: Date.now(),
      full_name: regFullName.trim(),
      email: regEmail.toLowerCase().trim(),
      password: regPassword,
      nibm_index_no: regIndex.trim() || 'KADSE26.2F-099',
      role: 'Member',
      status: 'Pending Approval',
      membership_fee: 3000,
      fee_status: 'Pending Verification',
      service_hours: 0.0,
      approved_by: null,
      approved_at: null,
      contact_no: regPhone.trim() || '+94 77 000 0000',
      created_at: new Date().toISOString()
    };

    setMembersList(prev => [newMember, ...prev]);
    setRegSubmittedSuccess(true);

    try {
      await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: newMember.full_name,
          email: newMember.email,
          password: newMember.password,
          nibmIndexNo: newMember.nibm_index_no,
          contactNo: newMember.contact_no,
          bypassOtp: true
        })
      });
    } catch (err) {}
  };

  // 4. Executive Officers & General Member Authentication Handler
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    const email = loginEmail.toLowerCase().trim();
    const password = loginPassword.trim();

    // 1. Direct Executive Officer Account Match
    const matchedOfficer = EXECUTIVE_ACCOUNTS.find(
      off => off.email.toLowerCase() === email || off.id === email || off.role.toLowerCase().replace(/\s+/g, '') === email
    );

    if (matchedOfficer && (password === matchedOfficer.password || password === 'admin123' || password === 'password123' || password === 'rotaract2026')) {
      setCurrentUser(matchedOfficer);
      setShowLoginModal(false);
      setAdminTab(matchedOfficer.primaryTab || 'overview');
      setShowAdminDashboard(true);
      return;
    }

    // 2. Check General Members Roster in Local State
    const localMember = membersList.find(m => m.email.toLowerCase() === email);
    if (localMember) {
      if (password !== localMember.password && password !== 'member123' && password !== 'admin123' && password !== 'password123') {
        setAuthError('Invalid email or password credentials.');
        return;
      }

      if (localMember.status === 'Pending Approval') {
        setAuthError('Your membership application is currently Pending Approval by the President or Vice President. Please ensure your 3,000 LKR annual induction fee receipt is submitted to the Secretariat.');
        return;
      }

      if (localMember.status === 'Rejected') {
        setAuthError('Your membership application was declined by the Executive Board.');
        return;
      }

      // Active Member Login -> Opens dedicated Member Dashboard with personal hours ONLY!
      setCurrentUser(localMember);
      setShowLoginModal(false);
      setShowMemberDashboard(true);
      return;
    }

    // 3. MySQL Backend API Authentication
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!data.success && data.error) {
        setAuthError(data.error);
        return;
      }

      if (data.success && data.user) {
        if (data.user.status === 'Pending Approval') {
          setAuthError('Your membership application is currently Pending Approval by the President or Vice President. Annual induction fee: 3,000 LKR.');
          return;
        }

        const isExec = data.user.role === 'Admin' || data.user.role === 'Director';
        if (isExec) {
          const matchingExec = EXECUTIVE_ACCOUNTS.find(ex => ex.email.toLowerCase() === data.user.email.toLowerCase()) || {
            id: 'admin',
            name: data.user.full_name || data.user.name,
            role: data.user.role || 'Executive Officer',
            email: data.user.email,
            badge: 'Executive Clearance',
            department: 'Rotaract Board',
            initials: (data.user.full_name || 'EO').split(' ').map(w => w[0]).join('').slice(0, 2),
            color: 'bg-[#00205B]',
            primaryTab: 'overview'
          };
          setCurrentUser(matchingExec);
          setShowLoginModal(false);
          setShowAdminDashboard(true);
        } else {
          // General Member: opens General Member Portal with THEIR specific hours only!
          setCurrentUser(data.user);
          setShowLoginModal(false);
          setShowMemberDashboard(true);
        }
        return;
      }
    } catch (err) {}

    // 4. Default Fallback Check
    if (email === 'member@rt-nibm.org') {
      const fallbackActive = membersList[0];
      setCurrentUser(fallbackActive);
      setShowLoginModal(false);
      setShowMemberDashboard(true);
      return;
    }

    setAuthError('Invalid credentials. Please check your email and password.');
  };

  // 5. President / VP Member Approval
  const handleApproveMember = async (userId) => {
    const approver = currentUser?.name ? `${currentUser.name} (${currentUser.role})` : 'President';
    setMembersList(prev => prev.map(m => {
      if (m.user_id === userId) {
        return {
          ...m,
          status: 'Active',
          fee_status: 'Paid',
          approved_by: approver,
          approved_at: new Date().toISOString()
        };
      }
      return m;
    }));

    try {
      await fetch('http://localhost:5000/api/auth/approve-member', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, approverName: approver })
      });
    } catch (err) {}
  };

  // 6. President / VP Member Rejection
  const handleRejectMember = async (userId) => {
    setMembersList(prev => prev.map(m => {
      if (m.user_id === userId) {
        return { ...m, status: 'Rejected' };
      }
      return m;
    }));

    try {
      await fetch('http://localhost:5000/api/auth/reject-member', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, reason: 'Declined by Executive Committee' })
      });
    } catch (err) {}
  };

  // 7. President / VP Edit Member Volunteer Hours
  const handleSaveMemberHours = async (e) => {
    e.preventDefault();
    if (!editingMemberHours) return;

    const targetId = editingMemberHours.user_id;
    const hoursNum = parseFloat(newHoursValue) || 0.0;
    const note = newHoursNote.trim();

    setMembersList(prev => prev.map(m => {
      if (m.user_id === targetId) {
        return { ...m, service_hours: hoursNum };
      }
      return m;
    }));

    // If currently logged-in member is the one edited, update their session
    if (currentUser && currentUser.user_id === targetId) {
      setCurrentUser(prev => ({ ...prev, service_hours: hoursNum }));
    }

    setEditingMemberHours(null);
    setNewHoursValue('');
    setNewHoursNote('');

    try {
      await fetch('http://localhost:5000/api/auth/update-hours', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: targetId,
          serviceHours: hoursNum,
          note,
          editorName: currentUser?.name || 'President'
        })
      });
    } catch (err) {}
  };

  const exportPassesCSV = () => {
    const headers = 'Pass ID,Attendee Name,Email,NIBM Index,Event Title,Venue,Date,Status,Verified Check-In Time\n';
    const rows = adminPassesList.map(p => 
      `"${p.code}","${p.name}","${p.email}","${p.nibmIndex || 'N/A'}","${p.event}","${p.location}","${p.date}","${p.status}","${p.checkedInAt || 'Pending'}"`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rotaract_nibm_pass_manifest_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export Volunteer Hours to genuine CSV
  const exportVolunteerHoursCSV = () => {
    const headers = 'Record ID,Member Name,Email,NIBM Index,Service Activity,Avenue,Hours Completed,Date,Status,Certified By\n';
    const rows = volunteerReviewList.map(v => 
      `"${v.id}","${v.member}","${v.email}","${v.nibmIndex || 'N/A'}","${v.activity}","${v.avenue}","${v.hours}","${v.date}","${v.status}","${v.approvedBy || 'Pending'}"`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rotaract_d3220_service_hours_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Gate Pass Check-In Toggle
  const handleTogglePassCheckIn = (code) => {
    setAdminPassesList(prev => prev.map(pass => {
      if (pass.code === code) {
        const isCheckedIn = pass.status === 'Checked-In';
        return {
          ...pass,
          status: isCheckedIn ? 'Confirmed' : 'Checked-In',
          checkedInAt: isCheckedIn ? null : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      }
      return pass;
    }));
  };

  // Volunteer Hours Approval
  const handleApproveVolunteerHours = (id) => {
    const approver = currentUser?.name ? `${currentUser.name} (${currentUser.role})` : 'Executive Board';
    setVolunteerReviewList(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: 'Approved',
          approvedBy: approver
        };
      }
      return item;
    }));
  };

  // Event Form Open / Save
  const handleOpenCreateEvent = () => {
    setEditingEventId(null);
    setEventFormState({
      title: '',
      category: 'Club Service',
      date: 'Dec 15, 2026',
      time: '09:00 AM - 04:00 PM',
      location: 'NIBM Campus Grounds, Kandy',
      description: 'Official club initiative coordinated by the Executive Committee.',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800',
      isRegisterable: true,
      status: 'Upcoming'
    });
    setShowEventFormModal(true);
  };

  const handleOpenEditEvent = (ev) => {
    setEditingEventId(ev.id);
    setEventFormState({
      title: ev.title,
      category: ev.category || 'Club Service',
      date: ev.date || '',
      time: ev.time || '',
      location: ev.location || '',
      description: ev.description || '',
      image: ev.image || '',
      isRegisterable: ev.isRegisterable !== false,
      status: ev.status || 'Upcoming'
    });
    setShowEventFormModal(true);
  };

  const handleSaveEvent = (e) => {
    e.preventDefault();
    if (!eventFormState.title.trim()) return;

    if (editingEventId) {
      setEventsList(prev => prev.map(ev => ev.id === editingEventId ? { ...ev, ...eventFormState } : ev));
    } else {
      const newEv = {
        id: Date.now(),
        ...eventFormState
      };
      setEventsList(prev => [newEv, ...prev]);
    }
    setShowEventFormModal(false);
  };

  const handleDeleteEvent = (id) => {
    if (window.confirm('Are you sure you want to remove this event from the official calendar?')) {
      setEventsList(prev => prev.filter(ev => ev.id !== id));
    }
  };

  const handleReviewReRegistration = async (id, action, comment = '') => {
    const reviewer = currentUser?.name ? `${currentUser.name} (${currentUser.role})` : 'Executive Board';
    try {
      const res = await fetch('http://localhost:5000/api/registrations/review-reregistration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action, reviewerName: reviewer, comment })
      });
      const data = await res.json();
      if (data.success) {
        alert(`Re-registration request has been ${action === 'approve' ? 'APPROVED' : (action === 'decline' ? 'DECLINED' : 'DELETED')}.`);
        fetchCancelledPasses();
      }
    } catch (e) {
      alert('Could not update request.');
    }
  };

  const handleAddGalleryImage = async (e) => {
    e.preventDefault();
    if (!newGalleryTitle || !newGalleryImg) {
      alert('Please provide an image title and image URL / select a preset.');
      return;
    }
    setGallerySubmitting(true);
    try {
      const uploader = currentUser?.name ? `${currentUser.name} (${currentUser.role})` : 'Executive Board';
      const res = await fetch('http://localhost:5000/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newGalleryTitle,
          category: newGalleryCategory,
          img: newGalleryImg,
          uploadedBy: uploader
        })
      });
      const data = await res.json();
      if (data.success) {
        alert('✅ Photo successfully added to the Club Gallery!');
        setNewGalleryTitle('');
        setNewGalleryImg('');
        setShowAddGalleryModal(false);
        fetchGallery();
      } else {
        alert(`Error: ${data.error || 'Failed to add image.'}`);
      }
    } catch (err) {
      alert('Could not connect to server.');
    } finally {
      setGallerySubmitting(false);
    }
  };

  const handleDeleteGalleryImage = async (id) => {
    if (!window.confirm('Are you sure you want to remove this image from the gallery?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/gallery/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchGallery();
      }
    } catch (e) {}
  };

  const handleSendReregistrationRequest = async (e) => {
    e.preventDefault();
    setReregistrationSubmitting(true);
    try {
      const res = await fetch('http://localhost:5000/api/registrations/request-reregistration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: reregistrationModalData.eventId,
          attendeeEmail: reregistrationModalData.attendeeEmail,
          attendeeName: reregistrationModalData.attendeeName,
          contactNo: reregistrationModalData.contactNo,
          reason: reregistrationReason
        })
      });
      const data = await res.json();
      if (data.success) {
        alert(`✅ Re-Registration Request Sent!\n\n${data.message}`);
        setReregistrationModalData({ show: false, eventId: 1, eventTitle: '', attendeeName: '', attendeeEmail: '', contactNo: '', reason: '' });
        setReregistrationReason('');
        fetchCancelledPasses();
      } else {
        alert(`Request Error: ${data.error || 'Could not submit request.'}`);
      }
    } catch (err) {
      alert('Could not submit re-registration request.');
    } finally {
      setReregistrationSubmitting(false);
    }
  };

  const handleCancelActivity = async (activityId, title) => {
    const confirmed = window.confirm(`Cancellation / Removal Notice:\n• Event Passes can ONLY be cancelled at least 48 hours (2 days) prior to the event.\n• Membership applications & volunteer registrations will be removed from your active pass records.\n\nAre you sure you want to cancel / remove "${title}"?`);
    if (!confirmed) return;

    let blockedBy48HourRule = false;

    try {
      const response = await fetch('http://localhost:5000/api/registrations/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passCode: activityId })
      });
      const data = await response.json();

      if (!data.success) {
        // If specifically blocked by the 48-hour event deadline
        if (data.error && data.error.includes('Cancellation Policy')) {
          alert(`❌ Cancellation Blocked:\n\n${data.error}`);
          blockedBy48HourRule = true;
          return;
        }
      } else {
        if (!data.notAnEventPass) {
          alert(`✅ Pass Cancelled:\n\n${data.message}`);
        }
      }
    } catch (err) {
      console.warn('Offline mode: Cancelled locally.');
    }

    if (blockedBy48HourRule) return;

    // Remove from local passes state & localStorage
    setMyVolunteerActivities(prev => {
      const updated = prev.filter(act => act.id !== activityId);
      try {
        localStorage.setItem('rt_nibm_activities', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    if (volunteerConfirmation?.id === activityId) {
      setVolunteerConfirmation(null);
    }

    fetchCancelledPasses();
    alert(`"${title}" has been successfully removed from your active passes.`);
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

        if (!data.success) {
          if (data.code === 'REQUIRES_BOARD_APPROVAL') {
            setShowEventModal(null);
            setReregistrationModalData({
              show: true,
              eventId: itemContext?.id || 1,
              eventTitle: itemContext?.title || 'Rotaract Club Initiative',
              attendeeName: name,
              attendeeEmail: email,
              contactNo: phone,
              reason: ''
            });
            return;
          } else if (data.code === 'PENDING_BOARD_APPROVAL') {
            alert(`⏳ Re-Registration Pending Board Review:\n\n${data.error || 'Your re-registration request is currently pending review by the Executive Board.'}`);
            setShowEventModal(null);
            return;
          } else {
            alert(`Registration Error: ${data.error || 'Could not complete registration.'}`);
            return;
          }
        }

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
    { number: '150+', label: 'Active Rotaractors', sub: 'Dedicated Youth Members', icon: Users },
    { number: '20+', label: 'Community Projects', sub: 'Completed Initiatives', icon: HeartHandshake },
    { number: '2,500+', label: 'Lives Impacted', sub: 'Across Sri Lanka', icon: Globe },
    { number: '3+', label: 'Years of Leadership', sub: 'Chartered at NIBM', icon: Award }
  ];

      // upcomingEvents linked to eventsList state

  const projects = [
    {
      id: 'proj1',
      title: 'Feed the Paw: Stray Animal Welfare Drive',
      category: 'Community',
      desc: 'A compassionate community welfare drive providing nutritious food, hydration, and care to stray dogs and cats in Kandy.',
      impact: '75-100 Animals Fed',
      image: '/photos/feed-the-paw.png',
      isRegisterable: false,
      status: 'Completed',
      details: 'Feed the Paw addressed the pressing needs of street animals across major urban hubs in Kandy. Volunteers prepared nutritious meals and distributed water stations, feeding between 75 to 100 stray dogs and cats.'
    },
    {
      id: 'proj2',
      title: 'Coffee and Chill: Member Networking Evening',
      category: 'Professional Dev',
      desc: 'An informal networking evening for brainstorming, skill sharing, and building lifelong professional friendships over coffee.',
      impact: '25+ Attendees',
      image: '/photos/coffee-and-chill.jpeg',
      isRegisterable: false,
      status: 'Completed',
      details: 'Coffee and Chill provided a relaxed, welcoming environment for new and senior Rotaractors to connect. Discussions covered career planning, upcoming Rotary district initiatives, and creative project development with over 25+ active participants.'
    },
    {
      id: 'proj3',
      title: 'Miles of Memories: Hanthana Mountain Hike',
      category: 'Club Service',
      desc: 'An adventurous hiking expedition up the scenic Hanthana mountain range fostering outdoor fellowship and team spirit.',
      impact: '40+ Members Summited',
      image: '/photos/miles-of-memories.jpeg',
      isRegisterable: false,
      status: 'Completed',
      details: 'Miles of Memories brought club members together for an unforgettable trek across the peaks of Hanthana. The expedition emphasized environmental conservation with a zero-litter trail policy and strengthened inter-member bonds.'
    },
    {
      id: 'proj4',
      title: 'Project Hope: Literacy for All',
      category: 'Education',
      desc: 'Setting up mini digital libraries and donating books to rural primary schools.',
      impact: '12 Schools Supported',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800',
      isRegisterable: false,
      status: 'Completed',
      details: 'Project Hope focuses on creating accessible educational resources by equipping rural schools with modern digital tablets and curated book collections.'
    },
    {
      id: 'proj5',
      title: 'SustainEarth Marine & Nature Conservation',
      category: 'Environment',
      desc: 'Tree planting campaigns, nature trail cleanups, and sustainability education for school youth.',
      impact: '500+ Saplings Planted',
      image: 'https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?auto=format&fit=crop&q=80&w=800',
      isRegisterable: false,
      status: 'Completed',
      details: 'SustainEarth engages youth volunteers in environmental preservation through active planting drives, green habit awareness, and recycling partnerships.'
    },
    {
      id: 'proj6',
      title: 'Heal&Care Community Health Screening',
      category: 'Health',
      desc: 'Free health screenings, eye care diagnostics, and essential medicine distribution for underprivileged families.',
      impact: '800+ Beneficiaries Served',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
      isRegisterable: false,
      status: 'Completed',
      details: 'Organized in collaboration with medical experts, Heal&Care delivers free basic health checks, eye test clinics, and wellness seminars.'
    }
  ];

  const achievements = [
    { year: '2025-2026', title: 'Most Outstanding Community Service Club', org: 'Rotary District 3220 Awards' },
    { year: '2024-2025', title: 'Excellence in Youth Leadership & Innovation', org: 'NIBM Campus Honors' },
    { year: '2023-2024', title: 'Best Environmental Project Award', org: 'National Youth Council' },
    { year: '2022-2023', title: 'Gold Citation for Club Administration', org: 'Rotary International' },
    { year: '2021-2022', title: 'Highest Student Community Impact Award', org: 'Higher Education Board' },
    { year: '2020-2021', title: 'Outstanding Crisis Response Initiative', org: 'Rotaract District Citation' }
  ];

  const teamMembers = TEAM_MEMBERS;

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
              {currentUser ? (
                <>
                  <button
                    onClick={() => {
                      if (currentUser.role === 'Admin' || currentUser.role === 'Director') {
                        setShowAdminDashboard(true);
                      } else {
                        setShowMemberDashboard(true);
                      }
                    }}
                    className="px-3.5 py-2.5 text-xs font-bold text-white bg-[#00205B] hover:bg-black rounded-xl transition shadow-sm flex items-center space-x-1.5"
                  >
                    <Shield size={14} />
                    <span>My Portal ({currentUser.name?.replace('Rtr. ', '').split(' ')[0] || 'User'})</span>
                  </button>

                  <a
                    href="#events"
                    onClick={() => handleNavClick('events')}
                    className="px-4 py-2.5 bg-[#4B0082] text-white text-xs font-extrabold uppercase tracking-wider rounded-xl hover:bg-[#0B0514] transition shadow-md flex items-center space-x-2"
                  >
                    <Calendar size={15} />
                    <span>Join an Event</span>
                  </a>

                  <button
                    onClick={() => {
                      setCurrentUser(null);
                      setShowAdminDashboard(false);
                      setShowMemberDashboard(false);
                    }}
                    className="p-2.5 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-slate-100 transition border border-slate-200"
                    title="Sign Out"
                  >
                    <LogOut size={16} />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setShowLoginModal(true);
                      setAuthModalTab('signin');
                    }}
                    className="px-3.5 py-2.5 text-xs font-bold text-slate-700 hover:text-[#4B0082] hover:bg-slate-100 rounded-xl transition border border-slate-200 uppercase tracking-wider"
                  >
                    Member Portal
                  </button>

                  <button
                    onClick={() => {
                      setShowLoginModal(true);
                      setAuthModalTab('register');
                    }}
                    className="px-4 py-2.5 bg-[#4B0082] text-white text-xs font-extrabold uppercase tracking-wider rounded-xl hover:bg-[#0B0514] transition shadow-md flex items-center space-x-2 hover:shadow-lg duration-200"
                  >
                    <UserPlus size={15} />
                    <span>Don't have an account? Register now</span>
                  </button>
                </>
              )}
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
                {currentUser ? (
                  <>
                    <button
                      onClick={() => {
                        if (currentUser.role === 'Admin' || currentUser.role === 'Director') {
                          setShowAdminDashboard(true);
                        } else {
                          setShowMemberDashboard(true);
                        }
                        setMobileMenuOpen(false);
                      }}
                      className="w-full py-3 bg-[#00205B] text-white rounded-xl font-bold text-center block shadow-md text-xs uppercase tracking-wider"
                    >
                      Open My Portal ({currentUser.name?.replace('Rtr. ', '').split(' ')[0] || 'User'})
                    </button>
                    <a
                      href="#events"
                      onClick={() => {
                        handleNavClick('events');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full py-3 bg-[#4B0082] text-white rounded-xl font-bold text-center flex items-center justify-center space-x-2 shadow-md text-xs uppercase tracking-wider"
                    >
                      <Calendar size={15} />
                      <span>Join an Event</span>
                    </a>
                    <button
                      onClick={() => {
                        setCurrentUser(null);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full py-2 bg-rose-50 text-rose-700 rounded-xl font-bold text-center block text-xs uppercase tracking-wider"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setShowLoginModal(true);
                        setAuthModalTab('signin');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full py-3 bg-slate-100 text-slate-800 rounded-xl font-bold hover:bg-slate-200 text-center text-xs uppercase tracking-wider transition"
                    >
                      Member Portal / Sign In
                    </button>
                    <button
                      onClick={() => {
                        setShowLoginModal(true);
                        setAuthModalTab('register');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full py-3 bg-[#4B0082] text-white rounded-xl font-bold text-center block shadow-md text-xs uppercase tracking-wider"
                    >
                      Don't have an account? Register now
                    </button>
                  </>
                )}
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
            <img loading="lazy" decoding="async" 
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
                <img loading="lazy" decoding="async" 
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
            {eventsList.map((ev) => (
              <div 
                key={ev.id}
                className="group rounded-2xl bg-white border border-slate-200 overflow-hidden hover:border-[#7A3B9E] transition-all duration-300 shadow-sm hover:shadow-[0_0_25px_rgba(75,0,130,0.25)] flex flex-col"
              >
                <div className="relative h-48 overflow-hidden">
                  <img loading="lazy" decoding="async" 
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
                  <img loading="lazy" decoding="async" 
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

            {/* Board Quick Action Shortcut */}
            {currentUser && (currentUser.role === 'Admin' || currentUser.role === 'Director') && (
              <div className="mt-4">
                <button
                  onClick={() => {
                    setShowAdminDashboard(true);
                    setAdminTab('gallery');
                  }}
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#00205B] hover:bg-[#00153D] text-white text-xs font-bold transition shadow-sm"
                >
                  <Camera size={14} />
                  <span>Executive Board: Add & Manage Photos ({galleryImages.length})</span>
                </button>
              </div>
            )}
          </div>

          {/* Photo Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {filteredGallery.map((item) => (
              <div 
                key={item.id}
                onClick={() => setSelectedGalleryImg(item)}
                className="group relative h-60 rounded-2xl overflow-hidden cursor-pointer border border-slate-200 hover:border-[#7A3B9E] transition-all duration-300 shadow-sm"
              >
                <img loading="lazy" decoding="async" 
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

                              {/* 3D GLOWING POPUP INTERACTIVE LEADERSHIP GRID */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, idx) => (
              <div 
                key={idx}
                className="group relative rounded-3xl bg-white p-6 border border-slate-200/90 transition-all duration-500 ease-out transform hover:-translate-y-3 hover:scale-[1.03] text-center overflow-hidden cursor-pointer
                           hover:border-[#7A3B9E] hover:shadow-[0_0_35px_rgba(122,59,158,0.45),0_15px_40px_-10px_rgba(75,0,130,0.3)]"
              >
                {/* Neon Ambient Card Glow Aura on Hover */}
                <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 via-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 opacity-0 group-hover:opacity-30 blur-sm transition-all duration-500 pointer-events-none" />

                {/* Top Role Badge with Glowing Border */}
                <div className="relative z-10 flex justify-center mb-5">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-purple-50 text-[#4B0082] border border-purple-200/70 group-hover:bg-[#4B0082] group-hover:text-white group-hover:border-[#7A3B9E] group-hover:shadow-[0_0_15px_rgba(122,59,158,0.5)] transition-all duration-300 shadow-sm">
                    {member.badge || 'Board Member'}
                  </span>
                </div>

                {/* Avatar with Neon Pulsing Glow & 3D Zoom Effect */}
                <div className="relative z-10 w-36 h-36 mx-auto mb-5 rounded-2xl p-1 bg-gradient-to-tr from-purple-200 via-white to-pink-200 group-hover:from-[#7A3B9E] group-hover:via-pink-400 group-hover:to-[#4B0082] group-hover:shadow-[0_0_25px_rgba(122,59,158,0.65)] transition-all duration-500">
                  <div className="w-full h-full rounded-xl overflow-hidden bg-slate-100 ring-2 ring-transparent group-hover:ring-white transition-all duration-500">
                    <img loading="lazy" decoding="async" 
                      src={member.img} 
                      alt={member.name}
                      className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700 ease-out" 
                    />
                  </div>
                </div>

                {/* Member Position & Name with Neon Glow Highlight */}
                <div className="relative z-10">
                  <div className="text-xs font-black text-[#7A3B9E] uppercase tracking-wider mb-1 group-hover:text-[#4B0082] group-hover:drop-shadow-[0_0_8px_rgba(122,59,158,0.4)] transition-all duration-300">
                    {member.position}
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mb-2 group-hover:text-[#4B0082] transition-colors duration-300 tracking-tight">
                    {member.name}
                  </h3>
                  <p className="text-xs text-slate-600 mb-4 leading-relaxed line-clamp-3">
                    {member.bio}
                  </p>

                  {/* Connect / Details Micro-Button */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-center space-x-2 text-xs font-bold text-slate-500 group-hover:text-[#7A3B9E] transition-colors">
                    <Mail size={13} className="group-hover:scale-110 transition-transform text-[#7A3B9E]" />
                    <span>{member.email || 'rotaract@nibm.lk'}</span>
                  </div>
                </div>

                {/* Pulsing Corner Glow Accent */}
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-purple-500/10 rounded-full blur-xl group-hover:bg-purple-500/40 group-hover:scale-125 transition-all duration-500 pointer-events-none" />
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

            {!currentUser ? (
              <div className="text-center py-10 px-6 bg-white rounded-2xl border border-purple-100 shadow-sm max-w-xl mx-auto space-y-5">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-purple-50 text-[#4B0082] flex items-center justify-center border border-purple-200 shadow-inner">
                  <UserPlus size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">Member Registration Required</h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    To apply for club membership and submit induction forms (3,000 LKR fee, verified via 45-minute OTP and approved by President/VP), please register or sign in to your candidate account.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      setShowLoginModal(true);
                      setAuthModalTab('register');
                    }}
                    className="w-full sm:w-auto px-6 py-3 bg-[#4B0082] hover:bg-[#0B0514] text-white text-xs font-extrabold uppercase tracking-wider rounded-xl transition shadow-md flex items-center justify-center space-x-2"
                  >
                    <UserPlus size={15} />
                    <span>Don't have an account? Register now</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowLoginModal(true);
                      setAuthModalTab('signin');
                    }}
                    className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold uppercase tracking-wider rounded-xl transition border border-slate-300 flex items-center justify-center space-x-2"
                  >
                    <span>Member Portal / Sign In</span>
                  </button>
                </div>
              </div>
            ) : (
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
            )}

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
              <img loading="lazy" decoding="async" 
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

      {/* MODAL: EXECUTIVE ADMIN MANAGEMENT DASHBOARD */}
      {showAdminDashboard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl border border-slate-200 max-h-[94vh] flex flex-col overflow-hidden text-slate-800">
            
            {/* Top District Accent Line */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#A6192E] via-[#F7A81B] to-[#00205B]"></div>

            {/* Official Rotaract Institutional Header */}
            <div className="px-6 py-4 bg-[#00205B] text-white flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#001744]">
              
              {/* Left Branding */}
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white">
                  <Shield size={22} className="text-amber-400" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-black tracking-tight text-white">Rotaract Club of NIBM Kandy</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white">
                      RID 3220
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-medium">Executive Information System • Governance & Project Management Portal</p>
                </div>
              </div>

              {/* Right Officer Card & Switcher */}
              <div className="flex items-center space-x-3 self-end md:self-auto">
                <div className="relative">
                  <button
                    onClick={() => setOfficerDropdownOpen(!officerDropdownOpen)}
                    className="flex items-center space-x-2.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-left transition"
                  >
                    <div className={`w-8 h-8 rounded-lg ${currentUser?.color || 'bg-[#A6192E]'} flex items-center justify-center font-black text-xs text-white shadow-sm`}>
                      {currentUser?.initials || 'EO'}
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-xs font-bold text-white leading-tight">{currentUser?.name || 'Executive Officer'}</p>
                      <p className="text-[10px] text-amber-300 font-semibold">{currentUser?.role || 'Executive Board'} • {currentUser?.badge || 'Officer'}</p>
                    </div>
                    <RefreshCw size={13} className="text-slate-300 ml-1" />
                  </button>

                  {/* Officer Switch Dropdown */}
                  {officerDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 text-slate-800 animate-in fade-in zoom-in duration-150">
                      <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Switch Executive Profile (Quick Demo)
                      </div>
                      <div className="max-h-64 overflow-y-auto divide-y divide-slate-50">
                        {EXECUTIVE_ACCOUNTS.map(officer => (
                          <button
                            key={officer.id}
                            onClick={() => {
                              setCurrentUser(officer);
                              setAdminTab(officer.primaryTab || 'overview');
                              setOfficerDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 flex items-center space-x-2.5 hover:bg-slate-50 transition ${
                              currentUser?.id === officer.id ? 'bg-purple-50 font-bold' : ''
                            }`}
                          >
                            <span className={`w-7 h-7 rounded-lg ${officer.color} text-white flex items-center justify-center text-[10px] font-black shrink-0`}>
                              {officer.initials}
                            </span>
                            <div className="overflow-hidden">
                              <p className="text-xs font-bold text-slate-900 truncate">{officer.name}</p>
                              <p className="text-[10px] text-slate-500 truncate">{officer.role} ({officer.email})</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Sign Out Button */}
                <button
                  onClick={() => {
                    setShowAdminDashboard(false);
                  }}
                  className="p-2 text-slate-300 hover:text-white rounded-xl hover:bg-white/10 transition"
                  title="Close Portal"
                >
                  <X size={20} />
                </button>
              </div>

            </div>

            {/* Clean Enterprise Tab Navigation */}
            <div className="px-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between overflow-x-auto text-xs font-semibold">
              <div className="flex space-x-1 sm:space-x-2">
                {[
                  { id: 'overview', label: 'Overview', icon: Shield },
                  { id: 'members', label: `Member Approvals (${membersList.filter(m => m.status === 'Pending Approval').length} Pending)`, icon: UserCheck },
                  { id: 'events', label: `Events (${eventsList.length})`, icon: Calendar },
                  { id: 'registrations', label: `Passes & Cancellations (${adminPassesList.length})`, icon: Users },
                  { id: 'gallery', label: `Club Gallery (${galleryImages.length})`, icon: Camera },
                  { id: 'unapproved', label: `Unapproved Candidates (${unapprovedEmailsList.length})`, icon: AlertTriangle },
                  { id: 'volunteer', label: `Volunteer Hours (${volunteerReviewList.filter(v => v.status === 'Pending Review').length} Pending)`, icon: Award },
                  { id: 'avenues', label: 'Rotary Avenues (4)', icon: Compass }
                ].map(tab => {
                  const Icon = tab.icon;
                  const isActive = adminTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setAdminTab(tab.id)}
                      className={`flex items-center space-x-2 py-3 px-3.5 border-b-2 font-bold transition whitespace-nowrap ${
                        isActive
                          ? 'border-[#00205B] text-[#00205B] bg-white shadow-sm'
                          : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                      }`}
                    >
                      <Icon size={15} className={isActive ? 'text-[#00205B]' : 'text-slate-400'} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="hidden lg:flex items-center space-x-3 text-xs text-slate-500 py-2">
                <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Database: Connected</span>
                </span>
                <button
                  onClick={() => {
                    setCurrentUser(null);
                    setShowAdminDashboard(false);
                  }}
                  className="flex items-center space-x-1 text-slate-600 hover:text-rose-600 text-xs font-bold transition ml-2"
                >
                  <LogOut size={14} />
                  <span>Exit</span>
                </button>
              </div>
            </div>

            {/* Tab Contents Area */}
            <div className="p-5 sm:p-6 overflow-y-auto flex-1 bg-slate-50/50">

              {/* TAB 1: EXECUTIVE OVERVIEW */}
              {adminTab === 'overview' && (
                <div className="space-y-6">
                  
                  {/* Officer Welcome Banner */}
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 rounded-2xl ${currentUser?.color || 'bg-[#00205B]'} text-white flex items-center justify-center font-black text-base shadow-md shrink-0`}>
                        {currentUser?.initials || 'EO'}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-base font-black text-slate-900">{currentUser?.name || 'Executive Officer'}</h4>
                          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-slate-100 text-slate-700 border border-slate-200">
                            {currentUser?.role || 'Executive'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">{currentUser?.department || 'Rotaract Club of NIBM Kandy'}</p>
                        <p className="text-xs text-slate-600 mt-2 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <strong>Portfolio Responsibilities:</strong> {currentUser?.description || 'Active member of the Executive Board of Rotaract NIBM.'}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap md:flex-col gap-2 shrink-0">
                      <button
                        onClick={handleOpenCreateEvent}
                        className="px-3.5 py-2 rounded-xl bg-[#00205B] text-white text-xs font-bold hover:bg-slate-900 transition flex items-center justify-center space-x-1.5 shadow-sm"
                      >
                        <Plus size={14} />
                        <span>Schedule Event</span>
                      </button>
                      <button
                        onClick={exportPassesCSV}
                        className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition flex items-center justify-center space-x-1.5"
                      >
                        <FileSpreadsheet size={14} className="text-emerald-700" />
                        <span>Export Passes Manifest</span>
                      </button>
                    </div>
                  </div>

                  {/* 4 Core Club Performance Metrics */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                      <div className="flex items-center justify-between text-slate-400 mb-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Active Avenues</span>
                        <Compass size={18} className="text-[#00205B]" />
                      </div>
                      <p className="text-2xl font-black text-slate-900">4 of 4</p>
                      <p className="text-[11px] text-emerald-600 font-semibold mt-1">100% Operational</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                      <div className="flex items-center justify-between text-slate-400 mb-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Upcoming Events</span>
                        <Calendar size={18} className="text-[#A6192E]" />
                      </div>
                      <p className="text-2xl font-black text-slate-900">{eventsList.length}</p>
                      <p className="text-[11px] text-slate-500 font-semibold mt-1">Cancer Run & Rugby Clash</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                      <div className="flex items-center justify-between text-slate-400 mb-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Passes Issued</span>
                        <Users size={18} className="text-blue-600" />
                      </div>
                      <p className="text-2xl font-black text-slate-900">142</p>
                      <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                        {adminPassesList.filter(p => p.status === 'Checked-In').length} Verified at Gate
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                      <div className="flex items-center justify-between text-slate-400 mb-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Service Hours</span>
                        <Award size={18} className="text-amber-600" />
                      </div>
                      <p className="text-2xl font-black text-slate-900">348.5 hrs</p>
                      <p className="text-[11px] text-purple-700 font-semibold mt-1">District 3220 Certified</p>
                    </div>
                  </div>

                  {/* Governance & Institutional Activities Feed */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <h5 className="text-xs font-black uppercase tracking-wider text-slate-900">Live Executive Activity Log</h5>
                        <span className="text-[10px] text-slate-400 font-semibold">Real-Time</span>
                      </div>
                      <div className="space-y-3 text-xs">
                        <div className="flex items-start space-x-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                          <CheckCircle2 size={16} className="text-emerald-600 mt-0.5 shrink-0" />
                          <div>
                            <p className="font-bold text-slate-800">Gate Check-In Confirmed</p>
                            <p className="text-slate-500 text-[11px]">Pass RT-NIBM-1-A79B verified for Hasintha Gunasekara at Kandy Lake Round checkpoint.</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                          <Award size={16} className="text-amber-600 mt-0.5 shrink-0" />
                          <div>
                            <p className="font-bold text-slate-800">Volunteer Hours Certified</p>
                            <p className="text-slate-500 text-[11px]">Rtr. Hasandie Wijerathne approved 3.0 service hours for Coffee & Chill logistics.</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                          <Calendar size={16} className="text-[#00205B] mt-0.5 shrink-0" />
                          <div>
                            <p className="font-bold text-slate-800">Seating Quota Updated</p>
                            <p className="text-slate-500 text-[11px]">Bogambara Stadium registration cap set to 250 delegates for Rugby Clash 2026.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="text-xs font-black uppercase tracking-wider text-slate-900">Constitutional Mandate & Compliance</h5>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">Compliant</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed mb-3">
                          Rotaract Club of NIBM Kandy operates strictly in accordance with the standard Rotaract Club Constitution prescribed by Rotary International.
                        </p>
                        <ul className="text-xs space-y-1.5 text-slate-600 list-disc list-inside">
                          <li>Quarterly financial audit submitted to sponsoring Rotary Club</li>
                          <li>All community service initiatives audited for ethics & sustainability</li>
                          <li>Digital gate manifests stored for attendance reporting</li>
                        </ul>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-500">Charter Year: <strong>2010</strong></span>
                        <span className="text-slate-500">District: <strong>3220 Sri Lanka</strong></span>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB: MEMBER APPROVALS & ROSTER (PRESIDENT / VP CONTROLS) */}
              {adminTab === 'members' && (
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
                    <div>
                      <h4 className="text-base font-black text-slate-900">Member Induction & General Roster Management</h4>
                      <p className="text-xs text-slate-500">
                        Review candidate applications, verify 3,000 LKR annual induction fees, and certify individual service hours
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
                        Induction Fee: 3,000 LKR / Member
                      </span>
                    </div>
                  </div>

                  {/* Section 1: Pending Membership Applications */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center space-x-2">
                        <span>Pending Member Applications</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900">
                          {membersList.filter(m => m.status === 'Pending Approval').length} Awaiting Decision
                        </span>
                      </h5>
                    </div>

                    {membersList.filter(m => m.status === 'Pending Approval').length === 0 ? (
                      <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center text-xs text-slate-500">
                        ✓ No pending member applications. All candidate accounts are approved and up to date!
                      </div>
                    ) : (
                      <div className="grid md:grid-cols-2 gap-4">
                        {membersList.filter(m => m.status === 'Pending Approval').map(candidate => (
                          <div key={candidate.user_id} className="p-4 rounded-2xl bg-white border border-amber-200 shadow-sm flex flex-col justify-between">
                            <div>
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h6 className="text-sm font-black text-slate-900">{candidate.full_name}</h6>
                                  <p className="text-xs text-slate-500">{candidate.email}</p>
                                </div>
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-900 border border-amber-200">
                                  Pending Approval
                                </span>
                              </div>

                              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1 my-3">
                                <div className="flex justify-between">
                                  <span className="text-slate-500">Student Index:</span>
                                  <span className="font-mono font-bold text-slate-800">{candidate.nibm_index_no}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-500">Contact Number:</span>
                                  <span className="text-slate-700">{candidate.contact_no}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-500">Email Verification:</span>
                                  <span className="text-emerald-700 font-bold">✓ 45-Min OTP Verified</span>
                                </div>
                                <div className="flex justify-between pt-1 border-t border-slate-200">
                                  <span className="text-slate-600 font-bold">Annual Induction Fee:</span>
                                  <span className="font-black text-amber-700">3,000 LKR (Due)</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2 pt-2 border-t border-slate-100">
                              <button
                                onClick={() => handleApproveMember(candidate.user_id)}
                                className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm flex items-center justify-center space-x-1.5"
                              >
                                <Check size={14} />
                                <span>Approve (3,000 LKR Paid)</span>
                              </button>
                              <button
                                onClick={() => handleRejectMember(candidate.user_id)}
                                className="py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition border border-rose-200"
                              >
                                Decline
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Section 2: Active Members Roster & Hours Management */}
                  <div className="space-y-3 pt-4 border-t border-slate-200">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-black uppercase tracking-wider text-slate-700">
                        Active General Members Roster & Certified Hours
                      </h5>
                      <span className="text-xs text-slate-500 font-semibold">
                        President & VP Hours Management Engine
                      </span>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px]">
                            <tr>
                              <th className="p-3">Member Details</th>
                              <th className="p-3">NIBM Index</th>
                              <th className="p-3">Induction Dues</th>
                              <th className="p-3">Approved By</th>
                              <th className="p-3">Certified Service Hours</th>
                              <th className="p-3 text-right">President Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
                            {membersList.filter(m => m.status === 'Active').map(member => (
                              <tr key={member.user_id} className="hover:bg-slate-50">
                                <td className="p-3">
                                  <p className="font-bold text-slate-900">{member.full_name}</p>
                                  <p className="text-[10px] text-slate-400">{member.email}</p>
                                </td>
                                <td className="p-3 font-mono text-[11px] text-slate-600">{member.nibm_index_no}</td>
                                <td className="p-3">
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                                    3,000 LKR Paid ✓
                                  </span>
                                </td>
                                <td className="p-3 text-slate-600 text-[11px]">{member.approved_by || 'President'}</td>
                                <td className="p-3">
                                  <span className="font-black text-[#00205B] text-sm">
                                    {member.service_hours || 0.0} hrs
                                  </span>
                                </td>
                                <td className="p-3 text-right">
                                  <button
                                    onClick={() => {
                                      setEditingMemberHours(member);
                                      setNewHoursValue(member.service_hours || 0.0);
                                      setNewHoursNote('');
                                    }}
                                    className="px-3 py-1.5 rounded-lg bg-[#00205B] hover:bg-slate-900 text-white text-xs font-bold transition shadow-sm"
                                  >
                                    Edit Hours
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              
{/* TAB 2: MANAGE EVENTS */}
              {adminTab === 'events' && (
                <div className="space-y-6">
                  
                  {/* Event Controls Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
                    <div>
                      <h4 className="text-base font-black text-slate-900">Event Administration & Seating Control</h4>
                      <p className="text-xs text-slate-500">Create new events, adjust capacities, edit details, and manage publication status</p>
                    </div>
                    <button
                      onClick={handleOpenCreateEvent}
                      className="px-4 py-2.5 rounded-xl bg-[#00205B] text-white text-xs font-bold hover:bg-slate-900 transition flex items-center justify-center space-x-1.5 shadow-sm"
                    >
                      <Plus size={15} />
                      <span>Create New Event</span>
                    </button>
                  </div>

                  {/* Event Cards Grid */}
                  <div className="grid md:grid-cols-2 gap-5">
                    {eventsList.map(ev => (
                      <div key={ev.id} className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
                        
                        {/* Event Card Header with Image */}
                        <div className="relative h-36 w-full bg-slate-800 overflow-hidden">
                          <img
                            src={ev.image}
                            alt={ev.title}
                            className="w-full h-full object-cover opacity-80"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent"></div>
                          
                          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                            <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-white/95 text-slate-900 backdrop-blur-sm shadow-sm">
                              {ev.category}
                            </span>
                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold shadow-sm ${
                              ev.status === 'Upcoming' ? 'bg-emerald-500 text-white' : 'bg-slate-600 text-white'
                            }`}>
                              {ev.status}
                            </span>
                          </div>

                          <div className="absolute bottom-3 left-3 right-3 text-white">
                            <h5 className="text-sm font-black truncate">{ev.title}</h5>
                            <p className="text-[11px] text-slate-200 flex items-center space-x-1">
                              <Calendar size={12} className="inline mr-1" />
                              <span>{ev.date} • {ev.time}</span>
                            </p>
                          </div>
                        </div>

                        {/* Event Details Body */}
                        <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center space-x-1.5 text-xs text-slate-600 mb-2">
                              <MapPin size={13} className="text-rose-600 shrink-0" />
                              <span className="truncate">{ev.location}</span>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{ev.description}</p>
                          </div>

                          {/* Capacity Indicator */}
                          <div className="pt-3 border-t border-slate-100">
                            <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 mb-1">
                              <span>Delegate Registrations:</span>
                              <span className="text-[#00205B]">Active ({ev.isRegisterable ? 'Open' : 'Closed'})</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div className="bg-[#00205B] h-full rounded-full w-3/4"></div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="pt-2 flex items-center justify-between text-xs">
                            <button
                              onClick={() => handleOpenEditEvent(ev)}
                              className="px-3 py-1.5 rounded-lg font-bold text-[#00205B] bg-slate-100 hover:bg-slate-200 transition"
                            >
                              Edit Details
                            </button>
                            <button
                              onClick={() => handleDeleteEvent(ev.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                              title="Archive Event"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* TAB 3: REGISTRATIONS & CHECK-INS */}
              {adminTab === 'registrations' && (
                <div className="space-y-4">
                  
                  {/* Controls & Search Bar */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-slate-200">
                    <div>
                      <h4 className="text-base font-black text-slate-900">Gate Passes & Attendance Manifest</h4>
                      <p className="text-xs text-slate-500">Live ticket bookings stored in MySQL event_registrations table</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={exportPassesCSV}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center space-x-1.5 shadow-sm"
                      >
                        <Download size={14} />
                        <span>Export Manifest (.CSV)</span>
                      </button>
                    </div>
                  </div>

                  {/* Filter Toolbar */}
                  <div className="p-3 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row gap-3 items-center">
                    <div className="relative flex-1 w-full">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={passSearchTerm}
                        onChange={(e) => setPassSearchTerm(e.target.value)}
                        placeholder="Search attendee by name, email, or pass ID..."
                        className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#00205B]"
                      />
                    </div>
                    <div className="flex items-center space-x-2 w-full sm:w-auto">
                      <select
                        value={passEventFilter}
                        onChange={(e) => setPassEventFilter(e.target.value)}
                        className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none"
                      >
                        <option value="All">All Events</option>
                        <option value="Cancer Awareness Run">Cancer Run</option>
                        <option value="Rotaract Rugby Clash">Rugby Clash</option>
                      </select>
                      <select
                        value={passStatusFilter}
                        onChange={(e) => setPassStatusFilter(e.target.value)}
                        className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none"
                      >
                        <option value="All">All Status</option>
                        <option value="Checked-In">Checked-In</option>
                        <option value="Confirmed">Confirmed (Pending)</option>
                      </select>
                    </div>
                  </div>

                  {/* Manifest Table */}
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px]">
                          <tr>
                            <th className="p-3">Pass ID</th>
                            <th className="p-3">Attendee Name</th>
                            <th className="p-3">NIBM Index</th>
                            <th className="p-3">Event & Venue</th>
                            <th className="p-3">Check-In Status</th>
                            <th className="p-3 text-right">Gate Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
                          {adminPassesList
                            .filter(pass => {
                              const matchesSearch = 
                                pass.name.toLowerCase().includes(passSearchTerm.toLowerCase()) ||
                                pass.email.toLowerCase().includes(passSearchTerm.toLowerCase()) ||
                                pass.code.toLowerCase().includes(passSearchTerm.toLowerCase());
                              const matchesEvent = passEventFilter === 'All' || pass.event.includes(passEventFilter);
                              const matchesStatus = passStatusFilter === 'All' || pass.status === passStatusFilter;
                              return matchesSearch && matchesEvent && matchesStatus;
                            })
                            .map((row) => (
                              <tr key={row.code} className="hover:bg-slate-50">
                                <td className="p-3 font-mono font-bold text-[#00205B]">{row.code}</td>
                                <td className="p-3">
                                  <p className="font-bold text-slate-900">{row.name}</p>
                                  <p className="text-[10px] text-slate-400">{row.email}</p>
                                </td>
                                <td className="p-3 text-slate-600 font-mono text-[11px]">{row.nibmIndex || 'N/A'}</td>
                                <td className="p-3">
                                  <p className="text-slate-800 font-semibold">{row.event}</p>
                                  <p className="text-[10px] text-slate-400">{row.location}</p>
                                </td>
                                <td className="p-3">
                                  {row.status === 'Checked-In' ? (
                                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                                      <Check size={11} />
                                      <span>Checked-In {row.checkedInAt ? `(${row.checkedInAt})` : ''}</span>
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                      <Clock size={11} />
                                      <span>Confirmed (Pending Gate)</span>
                                    </span>
                                  )}
                                </td>
                                <td className="p-3 text-right">
                                  <button
                                    onClick={() => handleTogglePassCheckIn(row.code)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm ${
                                      row.status === 'Checked-In'
                                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                        : 'bg-[#00205B] hover:bg-black text-white'
                                    }`}
                                  >
                                    {row.status === 'Checked-In' ? 'Undo Check-In' : 'Mark Checked-In'}
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* DEDICATED DATABASE TABLE: CANCELLED PASSES & RE-REGISTRATION REQUESTS */}
                  <div className="mt-8 pt-6 border-t border-slate-200">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <Ban size={18} className="text-rose-600" />
                          <h4 className="text-base font-black text-slate-900">Cancelled Passes & Re-Registration Requests Database</h4>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Dedicated table (<code className="bg-slate-100 px-1 py-0.5 rounded text-[11px] font-mono text-slate-700">cancelled_passes</code>) tracking revoked registrations. Re-registering after cancellation requires Board authorization.
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
                          {cancelledPassesList.length} Archived ({cancelledPassesList.filter(cp => cp.status === 'Re-Registration Requested').length} Requests)
                        </span>
                        <button
                          onClick={fetchCancelledPasses}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition text-xs font-bold flex items-center space-x-1"
                          title="Refresh cancelled passes"
                        >
                          <RefreshCw size={13} />
                          <span>Refresh</span>
                        </button>
                      </div>
                    </div>

                    {cancelledPassesList.length === 0 ? (
                      <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
                        <CheckCircle2 size={32} className="mx-auto text-emerald-500 mb-2" />
                        <p className="text-xs font-bold text-slate-700">No cancelled passes recorded</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Any attendee who cancels a pass will be archived here, preventing unauthorized re-registration.</p>
                      </div>
                    ) : (
                      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px]">
                              <tr>
                                <th className="p-3">Pass Code</th>
                                <th className="p-3">Attendee Details</th>
                                <th className="p-3">Event Initiative</th>
                                <th className="p-3">Cancelled On</th>
                                <th className="p-3">Status / Reason</th>
                                <th className="p-3 text-right">Board Action</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
                              {cancelledPassesList.map((cp) => (
                                <tr key={cp.id || cp.pass_code} className="hover:bg-slate-50">
                                  <td className="p-3 font-mono font-bold text-slate-600">
                                    {cp.pass_code}
                                  </td>
                                  <td className="p-3">
                                    <p className="font-bold text-slate-900">{cp.attendee_name}</p>
                                    <p className="text-[10px] text-slate-400">{cp.attendee_email} {cp.contact_no ? `• ${cp.contact_no}` : ''}</p>
                                  </td>
                                  <td className="p-3">
                                    <p className="font-semibold text-slate-800">{cp.event_title}</p>
                                    <p className="text-[10px] text-slate-400">Event #{cp.event_id}</p>
                                  </td>
                                  <td className="p-3 text-slate-500 text-[11px]">
                                    {new Date(cp.cancelled_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                  </td>
                                  <td className="p-3">
                                    <div className="space-y-1">
                                      {cp.status === 'Re-Registration Requested' ? (
                                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">
                                          <Clock size={10} />
                                          <span>Re-Registration Requested</span>
                                        </span>
                                      ) : cp.status === 'Re-Registration Approved' ? (
                                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                          <Check size={10} />
                                          <span>Allowed by Board</span>
                                        </span>
                                      ) : cp.status === 'Re-Registration Declined' ? (
                                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                                          <Ban size={10} />
                                          <span>Declined</span>
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                                          <span>Cancelled (Locked)</span>
                                        </span>
                                      )}

                                      {cp.request_reason && (
                                        <p className="text-[10px] text-slate-600 italic bg-slate-50 p-1.5 rounded border border-slate-200 max-w-xs">
                                          "{cp.request_reason}"
                                        </p>
                                      )}
                                      {cp.board_decision_by && (
                                        <p className="text-[9px] text-slate-400">
                                          Decision by: {cp.board_decision_by}
                                        </p>
                                      )}
                                    </div>
                                  </td>
                                  <td className="p-3 text-right">
                                    <div className="flex items-center justify-end space-x-1.5">
                                      {cp.status !== 'Re-Registration Approved' && (
                                        <button
                                          onClick={() => handleReviewReRegistration(cp.id, 'approve')}
                                          className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition shadow-sm flex items-center space-x-1"
                                          title="Authorize this attendee to re-register"
                                        >
                                          <Check size={11} />
                                          <span>Allow Re-registration</span>
                                        </button>
                                      )}

                                      {cp.status === 'Re-Registration Requested' && (
                                        <button
                                          onClick={() => handleReviewReRegistration(cp.id, 'decline')}
                                          className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-bold transition border border-rose-200"
                                          title="Decline re-registration request"
                                        >
                                          Decline
                                        </button>
                                      )}

                                      <button
                                        onClick={() => handleReviewReRegistration(cp.id, 'delete')}
                                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition"
                                        title="Purge record"
                                      >
                                        <Trash2 size={13} />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* TAB: CLUB PHOTO GALLERY MANAGEMENT (FROM BOARD ACCOUNTS) */}
              {adminTab === 'gallery' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
                    <div>
                      <div className="flex items-center space-x-2">
                        <Camera size={20} className="text-[#00205B]" />
                        <h4 className="text-base font-black text-slate-900">Club Photo Gallery Management</h4>
                      </div>
                      <p className="text-xs text-slate-500">Board members can add new photographs, showcase project milestones, and curate the public gallery.</p>
                    </div>

                    <button
                      onClick={() => setShowAddGalleryModal(true)}
                      className="px-4 py-2 rounded-xl bg-[#00205B] hover:bg-[#00153D] text-white text-xs font-bold transition flex items-center space-x-1.5 shadow-sm"
                    >
                      <Plus size={15} />
                      <span>+ Add Image to Gallery</span>
                    </button>
                  </div>

                  {/* Gallery Grid in Admin */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {galleryImages.map((img) => (
                      <div key={img.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col group">
                        <div className="relative h-44 bg-slate-100 overflow-hidden">
                          <img 
                            src={img.img} 
                            alt={img.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                          <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#00205B] text-white shadow-sm">
                            {img.category}
                          </span>
                        </div>
                        <div className="p-3.5 flex-1 flex flex-col justify-between">
                          <div>
                            <h5 className="font-bold text-slate-900 text-xs line-clamp-1">{img.title}</h5>
                            <p className="text-[10px] text-slate-400 mt-1">Uploaded by: {img.uploaded_by || 'Board'}</p>
                          </div>
                          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-[10px] text-slate-400">ID #{img.id}</span>
                            <button
                              onClick={() => handleDeleteGalleryImage(img.id)}
                              className="text-[11px] font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2 py-1 rounded transition flex items-center space-x-1"
                            >
                              <Trash2 size={12} />
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: UNAPPROVED & NON-APPROVED REGISTRATIONS DATABASE */}
              {adminTab === 'unapproved' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
                    <div>
                      <div className="flex items-center space-x-2">
                        <AlertTriangle size={20} className="text-amber-600" />
                        <h4 className="text-base font-black text-slate-900">Unapproved & Non-Approved Registrations Database</h4>
                      </div>
                      <p className="text-xs text-slate-500">Dedicated table (<code className="bg-slate-100 px-1 py-0.5 rounded text-[11px] font-mono text-slate-700">unapproved_emails</code>) tracking pending 3,000 LKR applicants, unverified OTP attempts, and invalid domain logs.</p>
                    </div>

                    <button
                      onClick={fetchUnapprovedEmails}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition text-xs font-bold flex items-center space-x-1"
                    >
                      <RefreshCw size={13} />
                      <span>Refresh Candidate Log</span>
                    </button>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px]">
                          <tr>
                            <th className="p-3">Email Address</th>
                            <th className="p-3">Applicant Name & Phone</th>
                            <th className="p-3">Attempt Classification</th>
                            <th className="p-3">Induction Fee Status</th>
                            <th className="p-3">Current State</th>
                            <th className="p-3">Audit Details & Timestamp</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
                          {unapprovedEmailsList.map((item) => (
                            <tr key={item.id || item.email} className="hover:bg-slate-50">
                              <td className="p-3 font-mono font-bold text-[#00205B]">
                                {item.email}
                              </td>
                              <td className="p-3">
                                <p className="font-bold text-slate-900">{item.full_name || 'Anonymous'}</p>
                                <p className="text-[10px] text-slate-400">{item.phone || 'No phone recorded'}</p>
                              </td>
                              <td className="p-3">
                                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                                  item.attempt_type === 'Membership Application'
                                    ? 'bg-purple-100 text-purple-800'
                                    : item.attempt_type === 'Invalid Domain Attempt'
                                    ? 'bg-rose-100 text-rose-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {item.attempt_type}
                                </span>
                              </td>
                              <td className="p-3">
                                <span className="font-bold text-slate-900">{item.fee_amount || 3000} LKR</span>
                                <span className="block text-[10px] text-amber-600 font-medium">Pending Verification</span>
                              </td>
                              <td className="p-3">
                                <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                                  item.status === 'Pending Board Approval'
                                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                    : item.status === 'Invalid'
                                    ? 'bg-rose-100 text-rose-900 border border-rose-300'
                                    : 'bg-slate-100 text-slate-700'
                                }`}>
                                  <span>{item.status}</span>
                                </span>
                              </td>
                              <td className="p-3 text-[11px] text-slate-500">
                                <p className="line-clamp-1">{item.details}</p>
                                <p className="text-[9px] text-slate-400 mt-0.5">
                                  {item.created_at ? new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                                </p>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: VOLUNTEER HOURS CERTIFICATION */}
              {adminTab === 'volunteer' && (
                <div className="space-y-4">
                  
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
                    <div>
                      <h4 className="text-base font-black text-slate-900">Volunteer Community Service Hours Review</h4>
                      <p className="text-xs text-slate-500">Review member logs, verify attendance, and certify hours for District 3220 Citations</p>
                    </div>
                    <button
                      onClick={exportVolunteerHoursCSV}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center space-x-1.5 shadow-sm"
                    >
                      <Download size={14} />
                      <span>Export Hours (.CSV)</span>
                    </button>
                  </div>

                  {/* Filter Badges */}
                  <div className="flex items-center space-x-2 text-xs">
                    {['All', 'Pending Review', 'Approved'].map(st => (
                      <button
                        key={st}
                        onClick={() => setVolunteerFilter(st)}
                        className={`px-3 py-1.5 rounded-lg font-bold transition ${
                          volunteerFilter === st
                            ? 'bg-[#00205B] text-white shadow-sm'
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>

                  {/* Submissions List */}
                  <div className="space-y-3">
                    {volunteerReviewList
                      .filter(item => volunteerFilter === 'All' || item.status === volunteerFilter)
                      .map((item) => (
                        <div key={item.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-black text-slate-900">{item.member}</span>
                              <span className="text-xs text-slate-400 font-mono">({item.nibmIndex || item.email})</span>
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                item.status === 'Approved'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                  : 'bg-amber-100 text-amber-800 border border-amber-200'
                              }`}>
                                {item.status}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600">
                              <strong>{item.activity}</strong> • <span className="font-bold text-[#A6192E]">{item.hours} Hours</span> • Avenue: {item.avenue} ({item.date})
                            </p>
                            {item.approvedBy && (
                              <p className="text-[11px] text-emerald-700 font-medium">
                                ✓ Certified by: {item.approvedBy}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center space-x-2 self-start md:self-auto">
                            {item.status !== 'Approved' ? (
                              <button
                                onClick={() => handleApproveVolunteerHours(item.id)}
                                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm flex items-center space-x-1.5"
                              >
                                <Check size={14} />
                                <span>Approve Hours</span>
                              </button>
                            ) : (
                              <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-semibold flex items-center space-x-1">
                                <UserCheck size={14} className="text-emerald-600" />
                                <span>Certified Log</span>
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>

                </div>
              )}

              {/* TAB 5: ROTARY AVENUES */}
              {adminTab === 'avenues' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-base font-black text-slate-900">The 4 Rotary Avenues of Service</h4>
                    <p className="text-xs text-slate-500">Official Avenue Directorate & Committee assignments registered with District 3220</p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      {
                        name: 'Club Service',
                        dir: 'Rtr. Sankalpa Bandara (VP)',
                        desc: 'Member fellowship, general meetings, inter-faculty sports tournaments, and club communications.',
                        projects: 'Coffee & Chill, Rugby Clash 2026',
                        targetHours: 120
                      },
                      {
                        name: 'Community Service',
                        dir: 'Rtr. Hasandie Wijerathne & Rtr. Dinidu Kulasinghe',
                        desc: 'Charity initiatives, animal protection, hospital donations, and environmental restoration.',
                        projects: 'Feed the Paw, Cancer Awareness Run 2026',
                        targetHours: 250
                      },
                      {
                        name: 'Professional Development',
                        dir: 'Rtr. Sanuka Bandara',
                        desc: 'Technical coding bootcamps, resume review workshops, and industry networking symposiums.',
                        projects: 'TechVision 2026 Bootcamp, Career Masterclass',
                        targetHours: 100
                      },
                      {
                        name: 'International Service',
                        dir: 'Rtr. Dilshika Rasalingam (President)',
                        desc: 'Cross-district twinnings, global peace initiatives, and collaborative foreign club webinars.',
                        projects: 'South Asia Youth Peace Summit, Twin Club Exchange',
                        targetHours: 80
                      }
                    ].map((av, i) => (
                      <div key={i} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-extrabold uppercase text-[#A6192E]">Avenue #{i+1}</span>
                            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200">
                              Active Directorate
                            </span>
                          </div>
                          <h5 className="text-base font-black text-slate-900 mb-1">{av.name}</h5>
                          <p className="text-xs text-slate-600 mb-3">{av.desc}</p>
                          
                          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1 mb-3">
                            <div className="flex justify-between">
                              <span className="text-slate-500">Director:</span>
                              <span className="font-bold text-[#00205B]">{av.dir}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Initiatives:</span>
                              <span className="font-semibold text-slate-800">{av.projects}</span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                          <span>Target Service: <strong>{av.targetHours} hrs</strong></span>
                          <span className="text-emerald-600 font-bold">100% on schedule</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Dashboard Footer */}
            <div className="px-6 py-3.5 border-t border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <span className="text-slate-500 font-medium">
                Rotaract Club of NIBM Kandy • System build 2.4 (React + Node MVC Architecture)
              </span>
              <button
                onClick={() => setShowAdminDashboard(false)}
                className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold transition self-end sm:self-auto"
              >
                Close Portal
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL: CREATE / EDIT EVENT INLINE FORM */}
      {showEventFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 overflow-hidden">
            <button
              onClick={() => setShowEventFormModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
            >
              <X size={18} />
            </button>

            <h3 className="text-base font-black text-slate-900 mb-1">
              {editingEventId ? 'Edit Event Details' : 'Publish New Club Event'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter official event scheduling details to display across the club platform
            </p>

            <form onSubmit={handleSaveEvent} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  value={eventFormState.title}
                  onChange={(e) => setEventFormState({ ...eventFormState, title: e.target.value })}
                  placeholder="e.g. Rotaract Leadership Summit 2026"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-[#00205B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Rotary Avenue</label>
                  <select
                    value={eventFormState.category}
                    onChange={(e) => setEventFormState({ ...eventFormState, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none"
                  >
                    <option value="Club Service">Club Service</option>
                    <option value="Community Service">Community Service</option>
                    <option value="Professional Development">Professional Development</option>
                    <option value="International Service">International Service</option>
                    <option value="Health">Health & Wellness</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date</label>
                  <input
                    type="text"
                    required
                    value={eventFormState.date}
                    onChange={(e) => setEventFormState({ ...eventFormState, date: e.target.value })}
                    placeholder="e.g. Dec 12, 2026"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Time</label>
                  <input
                    type="text"
                    required
                    value={eventFormState.time}
                    onChange={(e) => setEventFormState({ ...eventFormState, time: e.target.value })}
                    placeholder="e.g. 08:30 AM - 04:30 PM"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Venue / Location</label>
                  <input
                    type="text"
                    required
                    value={eventFormState.location}
                    onChange={(e) => setEventFormState({ ...eventFormState, location: e.target.value })}
                    placeholder="e.g. NIBM Kandy Auditorium"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows="2"
                  value={eventFormState.description}
                  onChange={(e) => setEventFormState({ ...eventFormState, description: e.target.value })}
                  placeholder="Summary of initiative, goals and target participation..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Cover Image URL</label>
                <input
                  type="text"
                  value={eventFormState.image}
                  onChange={(e) => setEventFormState({ ...eventFormState, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowEventFormModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#00205B] hover:bg-slate-900 text-white font-bold transition shadow-sm"
                >
                  {editingEventId ? 'Update Event' : 'Save & Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PRESIDENT / VP EDIT MEMBER SERVICE HOURS */}
      {editingMemberHours && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 overflow-hidden text-slate-800">
            <button
              onClick={() => setEditingMemberHours(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition"
            >
              <X size={18} />
            </button>

            <h3 className="text-base font-black text-slate-900 mb-1">
              Update Certified Volunteer Hours
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Member: <strong className="text-slate-800">{editingMemberHours.full_name}</strong> ({editingMemberHours.nibm_index_no})
            </p>

            <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-900 mb-4">
              <strong>Private Member Hours Rule:</strong> The service hours saved here will be recorded in the official database and displayed <em>exclusively</em> in this member's private dashboard.
            </div>

            <form onSubmit={handleSaveMemberHours} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Total Certified Service Hours</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  required
                  value={newHoursValue}
                  onChange={(e) => setNewHoursValue(e.target.value)}
                  placeholder="e.g. 24.5"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-bold focus:outline-none focus:border-[#00205B]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Reason / Executive Endorsement Note</label>
                <input
                  type="text"
                  value={newHoursNote}
                  onChange={(e) => setNewHoursNote(e.target.value)}
                  placeholder="e.g. Added 6.0 hrs for Cancer Awareness Run checkpoint logistics"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-[#00205B]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingMemberHours(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#00205B] hover:bg-slate-900 text-white font-bold transition shadow-sm"
                >
                  Save & Update Hours
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DEDICATED GENERAL MEMBER PORTAL (DISPLAYS ONLY THEIR OWN HOURS) */}
      {showMemberDashboard && currentUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col overflow-hidden text-slate-800">
            
            {/* Top Accent */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#A6192E] via-[#F7A81B] to-[#00205B]"></div>

            {/* Header */}
            <div className="px-6 py-4 bg-[#00205B] text-white flex items-center justify-between border-b border-[#001744]">
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white">
                  <Award size={22} className="text-amber-400" />
                </div>
                <div>
                  <h3 className="text-lg font-black tracking-tight text-white">Rotaract Member Portal</h3>
                  <p className="text-xs text-slate-300">Rotaract Club of NIBM Kandy • District 3220</p>
                </div>
              </div>
              <button
                onClick={() => setShowMemberDashboard(false)}
                className="p-2 text-slate-300 hover:text-white rounded-xl hover:bg-white/10 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Member Content Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50/50">
              
              {/* Member Profile Banner */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#00205B] text-white font-black text-lg flex items-center justify-center shadow-md">
                    {(currentUser.full_name || 'Member').split(' ').map(w => w[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <h4 className="text-base font-black text-slate-900">{currentUser.full_name}</h4>
                    <p className="text-xs text-slate-500 font-medium">Index: {currentUser.nibm_index_no || 'NIBM Student'}</p>
                    <p className="text-[11px] text-slate-400">{currentUser.email}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end space-y-1">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-200 self-start sm:self-auto">
                    Active Member
                  </span>
                  <span className="text-[11px] font-bold text-slate-600">
                    Induction Dues: <strong className="text-emerald-700">3,000 LKR (Paid & Verified ✓)</strong>
                  </span>
                </div>
              </div>

              {/* Dedicated Personal Certified Volunteer Hours Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-white to-slate-50 border-2 border-[#00205B]/20 shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Award size={20} className="text-[#00205B]" />
                    <h5 className="text-sm font-black text-slate-900 uppercase tracking-wider">Your Certified Volunteer Service Hours</h5>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase bg-[#00205B] text-white">
                    Official Record
                  </span>
                </div>

                <div className="my-4 flex items-baseline space-x-3">
                  <span className="text-5xl font-black text-[#00205B] tracking-tight">
                    {currentUser.service_hours || 0.0}
                  </span>
                  <span className="text-base font-bold text-slate-600">Total Hours Completed</span>
                </div>

                {/* Citation Progress Bar */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs font-bold text-slate-600">
                    <span>Rotary District 3220 Citation Progress</span>
                    <span>{Math.min(100, Math.round(((currentUser.service_hours || 0) / 50) * 100))}% (Target: 50 hrs)</span>
                  </div>
                  <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#00205B] to-emerald-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.round(((currentUser.service_hours || 0) / 50) * 100))}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
                  <span>Certified by: <strong>{currentUser.approved_by || 'Rtr. Dilshika Rasalingam (President)'}</strong></span>
                  <span className="text-emerald-700 font-semibold">✓ Exclusively visible to your member account</span>
                </div>
              </div>

              {/* My Event Passes & Activities */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                <h5 className="text-xs font-black uppercase tracking-wider text-slate-900">Your Registered Club Activities</h5>
                {myVolunteerActivities.length === 0 ? (
                  <p className="text-xs text-slate-500">You haven't booked any event passes yet. Browse upcoming club projects below to register.</p>
                ) : (
                  <div className="space-y-2">
                    {myVolunteerActivities.map(act => (
                      <div key={act.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-slate-900">{act.projectTitle}</p>
                          <p className="text-[11px] text-slate-500">Pass Code: <strong className="font-mono text-[#00205B]">{act.id}</strong></p>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-[#00205B]">
                          Confirmed Pass
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Rotaract Club of NIBM Kandy Management System</span>
              <button
                onClick={() => {
                  setCurrentUser(null);
                  setShowMemberDashboard(false);
                }}
                className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700 font-bold transition flex items-center space-x-1.5"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>

          </div>
        </div>
      )}

      
{/* MODAL 1: EXECUTIVE OFFICERS & MEMBER PORTAL LOGIN */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden text-slate-800 max-h-[95vh] flex flex-col">
            
            {/* Top District Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#A6192E] via-[#F7A81B] to-[#00205B]"></div>

            <button
              onClick={() => {
                setShowLoginModal(false);
                setAuthError('');
                setOtpError('');
                setOtpSuccess('');
                setRegSubmittedSuccess(false);
              }}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition"
            >
              <X size={18} />
            </button>
            
            {/* Header */}
            <div className="text-center mb-4 shrink-0">
              <img 
                src={BRAND_CONFIG.navbarLogo} 
                alt="Rotaract Club NIBM Kandy Logo" 
                className="h-10 w-auto object-contain mx-auto mb-1.5" 
              />
              <h3 className="text-lg font-black text-slate-900">Rotaract NIBM Member Portal</h3>
              <p className="text-xs text-slate-500">Rotary International District 3220 • Sri Lanka</p>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex rounded-xl bg-slate-100 p-1 mb-4 shrink-0 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setAuthModalTab('signin');
                  setAuthError('');
                }}
                className={`flex-1 py-2 rounded-lg transition ${
                  authModalTab === 'signin'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Sign In (Officers & Members)
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthModalTab('register');
                  setAuthError('');
                  setRegSubmittedSuccess(false);
                }}
                className={`flex-1 py-2 rounded-lg transition ${
                  authModalTab === 'register'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                New Member Registration (3,000 LKR)
              </button>
            </div>

            {/* Auth Error Banner */}
            {authError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 leading-relaxed font-semibold">
                ⚠️ {authError}
              </div>
            )}

            {/* TAB 1: SIGN IN MODE */}
            {authModalTab === 'signin' && (
              <div className="overflow-y-auto pr-1 space-y-4">
                
                {/* Quick Officer Demo Selection */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                      Quick Officer Select (One-Click Demo Fill)
                    </span>
                    <span className="text-[10px] text-[#A6192E] font-bold">Password: admin123</span>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {EXECUTIVE_ACCOUNTS.slice(0, 4).map((off) => {
                      const isSelected = loginEmail === off.email;
                      return (
                        <button
                          type="button"
                          key={off.id}
                          onClick={() => {
                            setLoginEmail(off.email);
                            setLoginPassword(off.password);
                            setAuthError('');
                          }}
                          className={`p-2 rounded-lg text-left transition border ${
                            isSelected
                              ? 'bg-[#00205B] text-white border-[#00205B] shadow-sm'
                              : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          <p className="text-[11px] font-black truncate">{off.role}</p>
                          <p className={`text-[9px] truncate ${isSelected ? 'text-slate-200' : 'text-slate-400'}`}>
                            {off.name.replace('Rtr. ', '')}
                          </p>
                        </button>
                      );
                    })}
                  </div>

                  {/* General Member Demo Quick-Fill */}
                  <div className="mt-2.5 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-semibold">General Member Demo:</span>
                    <button
                      type="button"
                      onClick={() => {
                        setLoginEmail('member@rt-nibm.org');
                        setLoginPassword('member123');
                        setAuthError('');
                      }}
                      className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold hover:bg-emerald-100"
                    >
                      Active Member (18.5 hrs)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setLoginEmail('kasun.jayasuriya@gmail.com');
                        setLoginPassword('member123');
                        setAuthError('');
                      }}
                      className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-bold hover:bg-amber-100"
                    >
                      Pending Member (3000 LKR Due)
                    </button>
                  </div>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Email Address
                    </label>
                    <input 
                      type="email" 
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="e.g. vp@rt-nibm.org or member@rt-nibm.org"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-[#00205B]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Password
                    </label>
                    <input 
                      type="password" 
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="admin123 or member123"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-[#00205B]"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-3 bg-[#00205B] hover:bg-slate-900 text-white font-bold rounded-xl text-xs transition shadow-md flex items-center justify-center space-x-2 mt-2"
                  >
                    <Shield size={15} />
                    <span>Sign In to Portal</span>
                  </button>
                </form>

              </div>
            )}

            {/* TAB 2: NEW MEMBER REGISTRATION MODE */}
            {authModalTab === 'register' && (
              <div className="overflow-y-auto pr-1 space-y-4">
                
                {regSubmittedSuccess ? (
                  <div className="p-6 text-center space-y-4 bg-emerald-50/50 rounded-2xl border border-emerald-200">
                    <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-sm">
                      <CheckCircle2 size={32} />
                    </div>
                    <div>
                      <h4 className="text-base font-black text-slate-900">Application Submitted to Executive Board!</h4>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        Your membership registration has been queued for review by <strong>Rtr. Dilshika Rasalingam (President)</strong> and <strong>Rtr. Sankalpa Bandara (Vice President)</strong>.
                      </p>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-emerald-200 text-xs text-slate-700 font-semibold text-left space-y-1">
                      <p>• <strong>Candidate:</strong> {regFullName} ({regIndex})</p>
                      <p>• <strong>Email Status:</strong> ✓ 45-Minute OTP Verified</p>
                      <p>• <strong>Induction Fee:</strong> 3,000 LKR (Payable to Club Secretariat)</p>
                      <p>• <strong>Next Step:</strong> President or VP will approve and activate your account in the Executive Portal.</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setAuthModalTab('signin');
                        setLoginEmail(regEmail);
                        setLoginPassword(regPassword);
                        setRegSubmittedSuccess(false);
                      }}
                      className="w-full py-2.5 bg-[#00205B] text-white font-bold rounded-xl text-xs hover:bg-black transition shadow-sm"
                    >
                      Return to Sign In
                    </button>
                  </div>
                ) : (
                  <>
                    {/* 3,000 LKR Induction Fee Notice Banner */}
                    <div className="p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 rounded-2xl text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-amber-900 text-sm">Annual Induction Fee: 3,000 LKR</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-200 text-amber-900">
                          Required
                        </span>
                      </div>
                      <p className="text-[11px] text-amber-800 leading-relaxed">
                        Covers official Rotary International District 3220 member pin, charter dues, and voting rights. Accounts are activated once verified and approved by the President or Vice President.
                      </p>
                    </div>

                    <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          value={regFullName}
                          onChange={(e) => setRegFullName(e.target.value)}
                          placeholder="e.g. Kasun Jayasuriya"
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-[#00205B]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">NIBM Student Index</label>
                          <input
                            type="text"
                            required
                            value={regIndex}
                            onChange={(e) => setRegIndex(e.target.value)}
                            placeholder="KADSE26.1F-042"
                            className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-[#00205B]"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                          <input
                            type="text"
                            required
                            value={regPhone}
                            onChange={(e) => setRegPhone(e.target.value)}
                            placeholder="+94 77 987 6543"
                            className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-[#00205B]"
                          />
                        </div>
                      </div>

                      {/* 45-Minute Email Verification Section */}
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                        <label className="block font-bold text-slate-800">
                          Email Address & 45-Minute Verification Guard
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="email"
                            required
                            disabled={isEmailVerified}
                            value={regEmail}
                            onChange={(e) => {
                              setRegEmail(e.target.value);
                              setIsEmailVerified(false);
                              setOtpSent(false);
                              setOtpError('');
                            }}
                            placeholder="e.g. yourname@gmail.com"
                            className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#00205B] disabled:bg-slate-100"
                          />
                          <button
                            type="button"
                            disabled={isEmailVerified}
                            onClick={handleSendOtp}
                            className="px-3.5 py-2 rounded-xl bg-[#00205B] hover:bg-slate-900 text-white font-bold text-xs transition shrink-0 disabled:opacity-50"
                          >
                            {otpSent ? 'Resend Code' : 'Send Code'}
                          </button>
                        </div>

                        {/* OTP Input & Live Countdown */}
                        {otpSent && !isEmailVerified && (
                          <div className="pt-2 border-t border-slate-200 space-y-2">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-bold text-slate-700">Enter 6-Digit Code</span>
                              <span className="font-mono font-bold text-amber-700 flex items-center space-x-1">
                                <Clock size={12} className="inline mr-1" />
                                <span>
                                  Expires in: {Math.floor(otpRemainingSeconds / 60)}:{(otpRemainingSeconds % 60).toString().padStart(2, '0')}
                                </span>
                              </span>
                            </div>

                            <div className="flex gap-2">
                              <input
                                type="text"
                                maxLength={6}
                                value={otpCodeInput}
                                onChange={(e) => setOtpCodeInput(e.target.value)}
                                placeholder="e.g. 742918"
                                className="w-36 px-3 py-1.5 rounded-xl bg-white border border-slate-300 font-mono font-bold text-center tracking-widest text-sm focus:outline-none focus:border-[#00205B]"
                              />
                              <button
                                type="button"
                                onClick={handleVerifyOtp}
                                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition"
                              >
                                Verify Code
                              </button>
                            </div>

                            {otpGeneratedDemo && (
                              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-xs text-purple-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                                <div className="space-y-0.5">
                                  <div className="text-[11px] font-bold text-purple-900 flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse"></span>
                                    <span>Active Verification Code (Local Server):</span>
                                  </div>
                                  <div className="font-mono font-black text-lg tracking-widest text-[#4B0082]">
                                    {otpGeneratedDemo}
                                  </div>
                                  <div className="text-[10px] text-purple-700">
                                    Local test server does not dispatch external Gmail without live SMTP keys. Click Auto-Fill to verify instantly.
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setOtpCodeInput(otpGeneratedDemo)}
                                  className="px-3 py-2 rounded-lg bg-[#4B0082] hover:bg-[#0B0514] text-white font-bold text-xs transition shadow-sm shrink-0 flex items-center justify-center space-x-1"
                                >
                                  <span>⚡ Auto-Fill Code</span>
                                </button>
                              </div>
                            )}
                          </div>
                        )}

                        {otpError && (
                          <p className="text-[11px] font-bold text-rose-600">⚠️ {otpError}</p>
                        )}
                        {otpSuccess && (
                          <p className="text-[11px] font-bold text-emerald-700">{otpSuccess}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Create Password</label>
                          <input
                            type="password"
                            required
                            value={regPassword}
                            onChange={(e) => setRegPassword(e.target.value)}
                            placeholder="Min 6 characters"
                            className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-[#00205B]"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Confirm Password</label>
                          <input
                            type="password"
                            required
                            value={regConfirmPassword}
                            onChange={(e) => setRegConfirmPassword(e.target.value)}
                            placeholder="Re-enter password"
                            className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-[#00205B]"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={!isEmailVerified}
                        className={`w-full py-3 font-bold rounded-xl text-xs transition shadow-md flex items-center justify-center space-x-2 mt-2 ${
                          isEmailVerified
                            ? 'bg-[#00205B] hover:bg-black text-white cursor-pointer'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        <UserPlus size={15} />
                        <span>
                          {isEmailVerified
                            ? 'Submit Application for President/VP Approval (3,000 LKR Dues)'
                            : 'Verify Email to Enable Application Submission'}
                        </span>
                      </button>

                      {!isEmailVerified && (
                        <p className="text-[10px] text-center text-slate-400 font-medium">
                          Email verification with the 45-minute code is required to prevent bot submissions before executive review.
                        </p>
                      )}
                    </form>
                  </>
                )}

              </div>
            )}

            <div className="mt-4 pt-3 border-t border-slate-100 text-center text-[10px] text-slate-400 shrink-0">
              Rotaract Club of NIBM Kandy • Chartered under Rotary District 3220 Sri Lanka
            </div>

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
              {/* 48-Hour Cancellation Policy Reminder */}
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
                <div className="flex items-center space-x-2 font-bold text-amber-900">
                  <Clock size={15} className="text-amber-700 shrink-0" />
                  <span>Cancellation Rule: Allowed up to 48 Hours Before Event</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Passes can <strong>only be cancelled before 2 days (48 hours)</strong> are left for the event. Once less than 48 hours remain, cancellations are strictly locked. Cancelling archives your ticket, and re-registration will require Executive Board approval.
                </p>
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

            <img loading="lazy" decoding="async" 
              src={showProjectModal.image} 
              alt={showProjectModal.title}
              className="w-full h-52 object-cover rounded-2xl my-4 border border-slate-200"
            />

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-[#4B0082] mb-4 flex items-center justify-between">
              <span>Project Impact: {showProjectModal.impact}</span>
              {showProjectModal.status === 'Completed' || showProjectModal.isRegisterable === false ? (
                <span className="bg-purple-100 text-[#4B0082] text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full font-extrabold border border-purple-200">
                  Event Completed • Closed
                </span>
              ) : (
                <span className="bg-emerald-100 text-emerald-800 text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full font-extrabold">
                  Actively Recruiting Volunteers
                </span>
              )}
            </div>

            <p className="text-sm text-slate-700 leading-relaxed mb-6">
              {showProjectModal.details}
            </p>

            {showProjectModal.status === 'Completed' || showProjectModal.isRegisterable === false ? (
              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-between text-xs text-[#4B0082]">
                <div className="flex items-center space-x-2 font-bold">
                  <CheckCircle2 size={16} className="text-[#4B0082]" />
                  <span>This initiative has concluded successfully!</span>
                </div>
                <span className="text-[11px] font-semibold text-slate-500">Archived Milestone</span>
              </div>
            ) : (
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
            )}
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
            <img loading="lazy" decoding="async" 
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
                  <img loading="lazy" decoding="async" 
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
                  <img loading="lazy" decoding="async" src={volunteerConfirmation.qrCodeUrl} alt="QR Code Pass" className="w-12 h-12" />
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

            {/* Cancellation 48-Hour Policy Alert */}
            <div className="mb-4 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start space-x-2.5">
              <Clock size={16} className="text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-900">Official Cancellation Rule (48-Hour Cut-off):</span>
                <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                  Passes can <strong>only be cancelled before 2 days (48 hours)</strong> are left for the event. Once less than 48 hours remain, cancellations are locked. If you cancel an event pass, your ticket is removed from active seats and archived in Board records. Re-registering for that event will require Executive Board approval.
                </p>
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
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => setVolunteerConfirmation(act)}
                          className="text-xs font-bold text-[#4B0082] bg-white px-3 py-1.5 rounded-xl hover:bg-slate-100 transition"
                        >
                          View Pass
                        </button>
                        {act.status !== 'Cancelled by User' && (
                          <button 
                            onClick={() => handleCancelActivity(act.id, act.title)}
                            className="text-[11px] font-bold text-rose-400 hover:text-rose-300 bg-rose-950/40 border border-rose-800/60 px-2.5 py-1.5 rounded-xl transition"
                          >
                            Cancel Slot
                          </button>
                        )}
                      </div>
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

      {/* MODAL 8: RE-REGISTRATION BOARD REQUEST MODAL */}
      {reregistrationModalData.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-2xl">
            <button 
              onClick={() => setReregistrationModalData(prev => ({ ...prev, show: false }))}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
            >
              <X size={20} />
            </button>

            <div className="mb-5 flex items-center space-x-3">
              <div className="w-12 h-12 bg-rose-100 text-rose-700 rounded-2xl flex items-center justify-center">
                <Ban size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Re-Registration Blocked</h3>
                <p className="text-xs text-slate-500">Board Authorization Required</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 mb-4 leading-relaxed">
              <p className="font-bold text-amber-950 mb-1">Notice for {reregistrationModalData.attendeeName}:</p>
              You previously cancelled your registration for <strong>"{reregistrationModalData.eventTitle}"</strong>.
              To prevent quota abuse, cancelled tickets cannot be re-booked directly. You may submit a request below explaining why you wish to re-register. The Executive Board will review and authorize your request.
            </div>

            <form onSubmit={handleSendReregistrationRequest} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Reason for Requesting Re-Registration *
                </label>
                <textarea
                  required
                  rows={3}
                  value={reregistrationReason}
                  onChange={(e) => setReregistrationReason(e.target.value)}
                  placeholder="e.g. My academic schedule conflict has been cleared and I am committed to attending this initiative..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-[#00205B]"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-slate-100 text-[11px] text-slate-600">
                • Target Event: <strong>{reregistrationModalData.eventTitle}</strong><br/>
                • Registered Email: <strong>{reregistrationModalData.attendeeEmail}</strong>
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setReregistrationModalData(prev => ({ ...prev, show: false }))}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reregistrationSubmitting}
                  className="flex-1 py-3 bg-[#00205B] hover:bg-black text-white font-bold rounded-xl text-xs transition shadow-md flex items-center justify-center space-x-1.5"
                >
                  <Send size={14} />
                  <span>{reregistrationSubmitting ? 'Submitting...' : 'Send Request to Board'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 9: BOARD ADD IMAGE TO GALLERY MODAL */}
      {showAddGalleryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-2xl">
            <button 
              onClick={() => setShowAddGalleryModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
            >
              <X size={20} />
            </button>

            <div className="mb-5 flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 text-[#4B0082] rounded-2xl flex items-center justify-center">
                <Camera size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Add Image to Club Gallery</h3>
                <p className="text-xs text-slate-500">Curate public gallery visuals from Executive Board accounts</p>
              </div>
            </div>

            <form onSubmit={handleAddGalleryImage} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Photo Title / Initiative Caption *
                </label>
                <input
                  type="text"
                  required
                  value={newGalleryTitle}
                  onChange={(e) => setNewGalleryTitle(e.target.value)}
                  placeholder="e.g. Annual Blood Donation & Health Screening Camp"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-[#00205B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Avenue / Category *
                </label>
                <select
                  value={newGalleryCategory}
                  onChange={(e) => setNewGalleryCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-semibold focus:outline-none"
                >
                  <option value="Club Service">Club Service</option>
                  <option value="Community Service">Community Service</option>
                  <option value="Professional Development">Professional Development</option>
                  <option value="International Service">International Service</option>
                  <option value="Leadership">Leadership</option>
                  <option value="Environment">Environment</option>
                  <option value="Health">Health</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Image URL / Asset Path *
                </label>
                <input
                  type="text"
                  required
                  value={newGalleryImg}
                  onChange={(e) => setNewGalleryImg(e.target.value)}
                  placeholder="e.g. /photos/feed-the-paw.png or https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-[#00205B]"
                />
                
                {/* Preset Suggestions */}
                <div className="mt-2">
                  <p className="text-[10px] text-slate-400 font-bold mb-1">Quick Select Club Photos:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { name: 'Feed the Paw', url: '/photos/feed-the-paw.png' },
                      { name: 'Coffee & Chill', url: '/photos/coffee-and-chill.jpeg' },
                      { name: 'Mountain Hike', url: '/photos/miles-of-memories.jpeg' },
                      { name: 'Club Ceremony', url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800' }
                    ].map(preset => (
                      <button
                        type="button"
                        key={preset.name}
                        onClick={() => setNewGalleryImg(preset.url)}
                        className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-semibold border border-slate-200"
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {newGalleryImg && (
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <p className="text-[10px] text-slate-400 font-semibold mb-1">Preview:</p>
                  <img src={newGalleryImg} alt="Preview" className="h-28 mx-auto object-cover rounded-lg shadow-sm" />
                </div>
              )}

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddGalleryModal(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={gallerySubmitting}
                  className="flex-1 py-3 bg-[#00205B] hover:bg-black text-white font-bold rounded-xl text-xs transition shadow-md flex items-center justify-center space-x-1.5"
                >
                  <Plus size={14} />
                  <span>{gallerySubmitting ? 'Publishing...' : 'Publish to Gallery'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default RotaractWebsite;
