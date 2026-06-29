import {
  FaBrain,
  FaEnvelope,
  FaCloud,
  FaGithub,
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaPython,
  FaReact,
  FaDatabase,
  FaTools,
  FaChartLine,
  FaGraduationCap,
  FaBookOpen,
  FaCode,
  FaUsers,
  FaRegFolderOpen,
  FaJava,
} from 'react-icons/fa';
import {
  SiBootstrap,
  SiCloudinary,
  SiDjango,
  SiFigma,
  SiGit,
  SiGithub,
  SiGooglecolab,
  SiJavascript,
  SiIntellijidea,
  SiMongodb,
  SiMysql,
  SiNodedotjs,
  SiNetlify,
  SiPostgresql,
  SiRailway,
  SiRender,
  SiPandas,
  SiPostman,
  SiScikitlearn,
  SiSpringboot,
  SiTensorflow,
  SiTailwindcss,
  SiVercel,
  SiVite,
  SiVscodium,
  SiHtml5,
  SiCss,
  SiJupyter,
} from 'react-icons/si';

export const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];

export const socialLinks = [
  {
    label: 'GitHub',
    href: 'https://github.com/Paviththiran.K',
    icon: FaGithub,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/paviththiran-kumarasooriyar',
    icon: FaLinkedinIn,
  },
  {
    label: 'Email',
    href: 'mailto:ppaviththiran815@gmail.com',
    icon: FaEnvelope,
  },
];

export const heroRoles = [
  'Data Science Undergraduate',
  'Full Stack Developer',
];

export const aboutCards = [
  {
    title: 'BSc (Hons) Information Technology',
    description: 'Specialization in Data Science.',
    icon: FaGraduationCap,
  },
  {
    title: 'Year 2 Semester 2 Undergraduate',
    description: 'Sri Lanka Institute of Information Technology (SLIIT).',
    icon: FaBookOpen,
  },
  {
    title: 'Sri Lanka',
    description: 'Focused on local and global opportunities in software engineering and data science.',
    icon: FaMapMarkerAlt,
  },
  {
    title: 'Software Engineer | Machine Learning Engineer | Data Scientist',
    description: 'Focused on building intelligent, scalable, and user-centered software solutions.',
    icon: FaCode,
  },
];

export const skillGroups = [
  {
    title: 'Programming',
    icon: FaCode,
    accent: 'from-cyan-400 to-blue-500',
    skills: [
      { name: 'Python', level: 95, icon: FaPython },
      { name: 'Java', level: 88, icon: FaJava },
      { name: 'JavaScript', level: 92, icon: SiJavascript },
      { name: 'SQL', level: 90, icon: FaDatabase },
    ],
  },
  {
    title: 'Frontend',
    icon: FaReact,
    accent: 'from-emerald-400 to-lime-500',
    skills: [
      { name: 'HTML5', level: 95, icon: SiHtml5 },
      { name: 'CSS3', level: 93, icon: SiCss },
      { name: 'React.js', level: 91, icon: FaReact },
      { name: 'Tailwind CSS', level: 92, icon: SiTailwindcss },
      { name: 'Bootstrap', level: 86, icon: SiBootstrap },
    ],
  },
  {
    title: 'Backend',
    icon: SiNodedotjs,
    accent: 'from-fuchsia-400 to-violet-500',
    skills: [
      { name: 'Node.js', level: 90, icon: SiNodedotjs },
      { name: 'Express.js', level: 88, icon: SiNodedotjs },
      { name: 'Django', level: 84, icon: SiDjango },
      { name: 'Spring Boot', level: 82, icon: SiSpringboot },
      { name: 'REST APIs', level: 90, icon: FaCode },
    ],
  },
  {
    title: 'Machine Learning',
    icon: FaChartLine,
    accent: 'from-fuchsia-400 to-violet-500',
    skills: [
      { name: 'Pandas', level: 88, icon: SiPandas },
      { name: 'NumPy', level: 87, icon: FaPython },
      { name: 'Scikit-learn', level: 86, icon: SiScikitlearn },
      { name: 'Machine Learning', level: 90, icon: FaBrain },
      { name: 'Natural Language Processing', level: 84, icon: FaBrain },
      { name: 'Data Visualization', level: 88, icon: FaChartLine },
    ],
  },
  {
    title: 'Databases',
    icon: FaDatabase,
    accent: 'from-amber-400 to-orange-500',
    skills: [
      { name: 'MongoDB', level: 84, icon: SiMongodb },
      { name: 'MySQL', level: 82, icon: SiMysql },
      { name: 'PostgreSQL', level: 81, icon: SiPostgresql },
    ],
  },
  {
    title: 'Cloud',
    icon: FaCloud,
    accent: 'from-sky-400 to-cyan-500',
    skills: [
      { name: 'AWS', level: 78, icon: FaCloud },
      { name: 'Railway', level: 82, icon: SiRailway },
      { name: 'Render', level: 82, icon: SiRender },
      { name: 'Vercel', level: 88, icon: SiVercel },
      { name: 'Netlify', level: 85, icon: SiNetlify },
      { name: 'Cloudinary', level: 87, icon: SiCloudinary },
    ],
  },
  {
    title: 'Tools',
    icon: FaTools,
    accent: 'from-slate-300 to-slate-500',
    skills: [
      { name: 'Git', level: 90, icon: SiGit },
      { name: 'GitHub', level: 92, icon: SiGithub },
      { name: 'VS Code', level: 96, icon: SiVscodium },
      { name: 'Postman', level: 80, icon: SiPostman },
      { name: 'Google Colab', level: 82, icon: SiGooglecolab },
      { name: 'Jupyter Notebook', level: 84, icon: SiJupyter },
      { name: 'IntelliJ IDEA', level: 78, icon: SiIntellijidea },
    ],
  },
];

export const projects = [
  {
    title: 'StaySync AI',
    description:
      'AI-powered hostel and restaurant management platform integrating room discovery, food ordering, AI recommendations, delivery tracking, and Google Maps integration.',
    tech: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Python', 'REST APIs', 'Google Maps API'],
    github: 'https://github.com/Paviththiran.K',
    live: 'https://www.linkedin.com/in/paviththiran-kumarasooriyar',
    accent: 'from-emerald-400 via-cyan-400 to-blue-500',
    badge: 'AI',
  },
  {
    title: 'SUSI Photography Website',
    description:
      'Developed and deployed a production-ready photography website for a real-world client with responsive UI, backend APIs, and cloud image management.',
    tech: ['React.js', 'Python', 'PostgreSQL', 'Cloudinary', 'GitHub', 'Railway', 'Vercel'],
    github: 'https://github.com/Paviththiran.K',
    live: 'https://www.linkedin.com/in/paviththiran-kumarasooriyar',
    accent: 'from-indigo-400 via-sky-500 to-cyan-400',
    badge: 'Full Stack',
  },
  {
    title: 'POS & Student Order System',
    description:
      'Production-ready Point-of-Sale and student ordering platform developed in an agile team environment for a startup client.',
    tech: ['JavaScript', 'PostgreSQL'],
    github: 'https://github.com/Paviththiran.K',
    live: 'https://www.linkedin.com/in/paviththiran-kumarasooriyar',
    accent: 'from-fuchsia-400 via-violet-500 to-blue-500',
    badge: 'POS',
  },
  {
    title: 'Mood-Based Movie Recommendation System',
    description:
      'AI-powered recommendation system using Machine Learning and NLP to recommend movies based on user emotions and mood.',
    tech: ['Python', 'Scikit-learn', 'Pandas', 'NumPy', 'NLP'],
    github: 'https://github.com/Paviththiran.K',
    live: 'https://www.linkedin.com/in/paviththiran-kumarasooriyar',
    accent: 'from-orange-400 via-amber-400 to-yellow-300',
    badge: 'ML',
  },
  {
    title: 'Voting System for Reality Shows',
    description:
      'Real-time voting platform with secure authentication, duplicate vote prevention, RESTful APIs, and database integration.',
    tech: ['Java', 'Spring Boot', 'REST APIs', 'MySQL'],
    github: 'https://github.com/Paviththiran.K',
    live: 'https://www.linkedin.com/in/paviththiran-kumarasooriyar',
    accent: 'from-cyan-400 via-blue-500 to-indigo-500',
    badge: 'Backend',
  },
  {
    title: 'Online Bookstore Management System',
    description:
      'Online bookstore application with inventory management, ordering system, and administrator features.',
    tech: ['React.js', 'HTML5', 'CSS3', 'JavaScript', 'Bootstrap'],
    github: 'https://github.com/Paviththiran.K',
    live: 'https://www.linkedin.com/in/paviththiran-kumarasooriyar',
    accent: 'from-pink-400 via-fuchsia-500 to-violet-500',
    badge: 'Web',
  },
  {
    title: 'Automated Greenhouse System',
    description:
      'IoT-enabled greenhouse automation system for monitoring soil moisture, temperature, humidity, and automated irrigation.',
    tech: ['Arduino', 'C++', 'IoT Sensors'],
    github: 'https://github.com/Paviththiran.K',
    live: 'https://www.linkedin.com/in/paviththiran-kumarasooriyar',
    accent: 'from-emerald-400 via-green-500 to-teal-400',
    badge: 'IoT',
  },
  {
    title: 'Smart Student Living Platform',
    description:
      'Mobile application for student services with restaurant management, REST APIs, and centralized student platform.',
    tech: ['React Native', 'Node.js', 'Express.js', 'MongoDB'],
    github: 'https://github.com/Paviththiran.K',
    live: 'https://www.linkedin.com/in/paviththiran-kumarasooriyar',
    accent: 'from-sky-400 via-cyan-500 to-blue-500',
    badge: 'Mobile',
  },
];

export const certificates = [
  {
    title: 'Python for Beginners',
    issuer: 'Introductory Programming',
    year: '2024',
    link: 'https://www.linkedin.com/in/paviththiran-kumarasooriyar',
  },
  {
    title: 'Machine Learning Fundamentals',
    issuer: 'Applied AI',
    year: '2024',
    link: 'https://www.linkedin.com/in/paviththiran-kumarasooriyar',
  },
  {
    title: 'Data Science Essentials',
    issuer: 'Data Analytics',
    year: '2024',
    link: 'https://www.linkedin.com/in/paviththiran-kumarasooriyar',
  },
  {
    title: 'Git & GitHub',
    issuer: 'Developer Workflow',
    year: '2024',
    link: 'https://www.linkedin.com/in/paviththiran-kumarasooriyar',
  },
];

export const githubStats = [
  { label: 'Repositories', value: '18', icon: FaRegFolderOpen },
  { label: 'Commits', value: '420+', icon: FaCode },
  { label: 'Followers', value: '34', icon: FaUsers },
  { label: 'Following', value: '28', icon: FaGithub },
];

export const contactDetails = [
  {
    label: 'Email',
    value: 'ppaviththiran815@gmail.com',
    href: 'mailto:ppaviththiran815@gmail.com',
    icon: FaEnvelope,
  },
  {
    label: 'Phone',
    value: '+94 761834087',
    href: 'tel:+94761834087',
    icon: FaPhoneAlt,
  },
  {
    label: 'Location',
    value: 'Sri Lanka',
    href: 'https://maps.google.com/?q=Sri+Lanka',
    icon: FaMapMarkerAlt,
  },
  {
    label: 'LinkedIn',
    value: 'paviththiran-kumarasooriyar',
    href: 'https://www.linkedin.com/in/paviththiran-kumarasooriyar',
    icon: FaLinkedinIn,
  },
  {
    label: 'GitHub',
    value: 'Paviththiran.K',
    href: 'https://github.com/Paviththiran.K',
    icon: FaGithub,
  },
];
