export interface PortfolioTemplate {
  id: string;
  profile: {
    name: string;
    title: string;
    bio: string;
    location: string;
    email: string;
    avatar: string;
    resume_url: string;
    availability: string;
    social: {
      github?: string;
      linkedin?: string;
      twitter?: string;
      dribbble?: string;
      kaggle?: string;
      portfolio?: string;
    };
  };
  skills: {
    primary: string[];
    secondary: string[];
    tools: string[];
    learning: string[];
  };
  experience: {
    company: string;
    role: string;
    duration: string;
    location: string;
    type: string;
    description: string;
    tech: string[];
  }[];
  projects: {
    id: string;
    title: string;
    tagline: string;
    description: string;
    tech: string[];
    category: string;
    status: string;
    github: string | null;
    live_url: string;
    thumbnail: string;
    stars: number;
    featured: boolean;
  }[];
  education: {
    institution: string;
    degree: string;
    duration: string;
    grade: string;
  }[];
  certifications: {
    name: string;
    issuer: string;
    year: number;
  }[];
  stats: {
    github_repos: number;
    github_stars: number;
    years_experience: number;
    projects_shipped: number;
  };
  template_style:
    | 'dark-minimal'
    | 'light-editorial'
    | 'dark-techy'
    | 'neon-cyberpunk'
    | 'pastel-creative'
    | 'midnight-finance'
    | 'forest-green'
    | 'red-hacker'
    | 'ocean-blue'
    | 'warm-editorial'
    | 'rose-gold'
    | 'clinical-white'
    | 'holographic';
  accent_color: string;
}

export const PORTFOLIO_TEMPLATES: PortfolioTemplate[] = [
  /* ─── 1. Full Stack — Dark Minimal ─── */
  {
    id: 'USR001',
    profile: {
      name: 'Arjun Mehta',
      title: 'Full Stack Developer',
      bio: 'Passionate developer with 4 years of experience building scalable web apps. Love turning complex problems into clean, elegant code.',
      location: 'Bengaluru, India',
      email: 'arjun.mehta@email.com',
      avatar: 'https://i.pravatar.cc/150?img=11',
      resume_url: '/resumes/arjun_mehta.pdf',
      availability: 'Open to work',
      social: {
        github: 'github.com/arjunmehta',
        linkedin: 'linkedin.com/in/arjunmehta',
        twitter: 'twitter.com/arjundev',
        portfolio: 'arjunmehta.dev',
      },
    },
    skills: {
      primary: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
      secondary: ['Docker', 'AWS', 'Redis', 'GraphQL'],
      tools: ['VSCode', 'Figma', 'Postman', 'GitHub Actions'],
      learning: ['Rust', 'Web3'],
    },
    experience: [
      {
        company: 'Infosys',
        role: 'Software Engineer',
        duration: '2022 - Present',
        location: 'Bengaluru',
        type: 'Full-time',
        description: 'Built microservices for banking clients. Reduced API latency by 40% via query optimization.',
        tech: ['Node.js', 'PostgreSQL', 'Docker', 'Kubernetes'],
      },
      {
        company: 'StartupX',
        role: 'Frontend Developer Intern',
        duration: '2021 - 2022',
        location: 'Remote',
        type: 'Internship',
        description: 'Developed React dashboard used by 10K+ users. Implemented real-time notifications with WebSockets.',
        tech: ['React', 'Redux', 'Tailwind CSS', 'Firebase'],
      },
    ],
    projects: [
      {
        id: 'P001',
        title: 'TaskFlow',
        tagline: 'Project management app with AI task suggestions',
        description: 'A Trello-like app with AI-powered task prioritization. Supports teams of up to 50 users with real-time collaboration.',
        tech: ['React', 'Node.js', 'Socket.io', 'OpenAI API', 'MongoDB'],
        category: 'Web App',
        status: 'Live',
        github: 'github.com/arjunmehta/taskflow',
        live_url: 'taskflow.vercel.app',
        thumbnail: 'https://picsum.photos/seed/taskflow/800/450',
        stars: 312,
        featured: true,
      },
      {
        id: 'P002',
        title: 'PriceWatch',
        tagline: 'E-commerce price tracker with alerts',
        description: 'Tracks prices across Amazon, Flipkart, and Meesho. Sends WhatsApp/email alerts when price drops.',
        tech: ['Python', 'BeautifulSoup', 'FastAPI', 'Twilio', 'PostgreSQL'],
        category: 'Tool',
        status: 'Live',
        github: 'github.com/arjunmehta/pricewatch',
        live_url: 'pricewatch.in',
        thumbnail: 'https://picsum.photos/seed/pricewatch/800/450',
        stars: 89,
        featured: true,
      },
    ],
    education: [{ institution: 'VIT University', degree: 'B.Tech Computer Science', duration: '2018 - 2022', grade: '8.7 CGPA' }],
    certifications: [
      { name: 'AWS Solutions Architect Associate', issuer: 'Amazon', year: 2023 },
      { name: 'Meta React Developer', issuer: 'Meta / Coursera', year: 2022 },
    ],
    stats: { github_repos: 42, github_stars: 942, years_experience: 4, projects_shipped: 18 },
    template_style: 'dark-minimal',
    accent_color: '#00FF94',
  },

  /* ─── 2. Designer — Light Editorial ─── */
  {
    id: 'USR002',
    profile: {
      name: 'Priya Nair',
      title: 'UI/UX Designer & Frontend Developer',
      bio: 'I design with empathy and code with precision. Currently crafting design systems at a Fintech startup.',
      location: 'Mumbai, India',
      email: 'priya.nair@email.com',
      avatar: 'https://i.pravatar.cc/150?img=47',
      resume_url: '/resumes/priya_nair.pdf',
      availability: 'Not available',
      social: {
        github: 'github.com/priyanair',
        linkedin: 'linkedin.com/in/priyanair',
        dribbble: 'dribbble.com/priyanair',
        portfolio: 'priyanair.design',
      },
    },
    skills: {
      primary: ['Figma', 'React', 'CSS/SASS', 'Design Systems'],
      secondary: ['Framer Motion', 'Storybook', 'Webflow', 'Lottie'],
      tools: ['Notion', 'Linear', 'Zeplin', 'Adobe Illustrator'],
      learning: ['Three.js', 'Motion Design'],
    },
    experience: [
      {
        company: 'Razorpay',
        role: 'Product Designer',
        duration: '2023 - Present',
        location: 'Mumbai',
        type: 'Full-time',
        description: 'Redesigned the merchant dashboard increasing task completion rate by 28%. Led design system for 3 product teams.',
        tech: ['Figma', 'React', 'Storybook'],
      },
      {
        company: 'Zomato',
        role: 'UX Designer',
        duration: '2021 - 2023',
        location: 'Gurugram',
        type: 'Full-time',
        description: 'Worked on the restaurant partner app. Conducted 50+ user interviews, improved onboarding funnel by 35%.',
        tech: ['Figma', 'Protopie', 'UserTesting'],
      },
    ],
    projects: [
      {
        id: 'P001',
        title: 'FinDash Design System',
        tagline: 'A complete design system for fintech products',
        description: '80+ components, dark/light modes, accessibility compliant. Used by 5 internal product teams.',
        tech: ['Figma', 'React', 'Storybook', 'Chromatic'],
        category: 'Design System',
        status: 'Internal',
        github: 'github.com/priyanair/findash',
        live_url: 'findash.design',
        thumbnail: 'https://picsum.photos/seed/findash/800/450',
        stars: 0,
        featured: true,
      },
      {
        id: 'P002',
        title: 'Mindful',
        tagline: 'Mental wellness app UI design',
        description: 'End-to-end UI/UX design for a meditation and mood tracking app. Includes onboarding, dashboard, and session flows.',
        tech: ['Figma', 'Protopie', 'Lottie'],
        category: 'Mobile Design',
        status: 'Case Study',
        github: null,
        live_url: 'priyanair.design/mindful',
        thumbnail: 'https://picsum.photos/seed/mindful/800/450',
        stars: 0,
        featured: true,
      },
    ],
    education: [{ institution: 'National Institute of Design', degree: 'B.Des Communication Design', duration: '2017 - 2021', grade: 'Distinction' }],
    certifications: [
      { name: 'Google UX Design Certificate', issuer: 'Google / Coursera', year: 2021 },
      { name: 'Interaction Design Foundation', issuer: 'IDF', year: 2022 },
    ],
    stats: { github_repos: 12, github_stars: 210, years_experience: 5, projects_shipped: 24 },
    template_style: 'light-editorial',
    accent_color: '#FF6B6B',
  },

  /* ─── 3. ML Engineer — Dark Techy ─── */
  {
    id: 'USR003',
    profile: {
      name: 'Vikram Sharma',
      title: 'ML Engineer & Data Scientist',
      bio: 'Building AI systems that actually work in production. Ex-researcher, now turning models into products.',
      location: 'Hyderabad, India',
      email: 'vikram.sharma@email.com',
      avatar: 'https://i.pravatar.cc/150?img=33',
      resume_url: '/resumes/vikram_sharma.pdf',
      availability: 'Freelance available',
      social: {
        github: 'github.com/vikramsharma',
        linkedin: 'linkedin.com/in/vikramsharma',
        kaggle: 'kaggle.com/vikramsharma',
        portfolio: 'vikramsharma.ai',
      },
    },
    skills: {
      primary: ['Python', 'PyTorch', 'Scikit-learn', 'FastAPI'],
      secondary: ['LangChain', 'Hugging Face', 'MLflow', 'Spark'],
      tools: ['Jupyter', 'DVC', 'Weights & Biases', 'Airflow'],
      learning: ['JAX', 'Diffusion Models'],
    },
    experience: [
      {
        company: 'Microsoft',
        role: 'ML Engineer II',
        duration: '2022 - Present',
        location: 'Hyderabad',
        type: 'Full-time',
        description: 'Built NLP pipelines for Azure Cognitive Services. Deployed models serving 1M+ daily requests.',
        tech: ['PyTorch', 'Azure ML', 'ONNX', 'FastAPI'],
      },
    ],
    projects: [
      {
        id: 'P001',
        title: 'SentimentAPI',
        tagline: 'Multilingual sentiment analysis REST API',
        description: 'Production-ready sentiment analysis API supporting 12 languages. Fine-tuned mBERT on 500K samples. 95.2% accuracy.',
        tech: ['Python', 'Transformers', 'FastAPI', 'Docker', 'Redis'],
        category: 'ML / API',
        status: 'Live',
        github: 'github.com/vikramsharma/sentimentapi',
        live_url: 'sentimentapi.dev',
        thumbnail: 'https://picsum.photos/seed/sentiment/800/450',
        stars: 728,
        featured: true,
      },
      {
        id: 'P002',
        title: 'ChurnPredict',
        tagline: 'Customer churn prediction for SaaS companies',
        description: 'End-to-end ML pipeline with feature engineering, XGBoost model, SHAP explanations, and a Streamlit dashboard.',
        tech: ['Python', 'XGBoost', 'SHAP', 'Streamlit', 'MLflow'],
        category: 'ML Project',
        status: 'Live',
        github: 'github.com/vikramsharma/churnpredict',
        live_url: 'churnpredict.streamlit.app',
        thumbnail: 'https://picsum.photos/seed/churn/800/450',
        stars: 214,
        featured: true,
      },
    ],
    education: [
      { institution: 'IIT Bombay', degree: 'M.Tech Artificial Intelligence', duration: '2020 - 2022', grade: '9.1 CGPA' },
      { institution: 'BITS Pilani', degree: 'B.E. Computer Science', duration: '2016 - 2020', grade: '8.4 CGPA' },
    ],
    certifications: [
      { name: 'Deep Learning Specialization', issuer: 'deeplearning.ai', year: 2021 },
      { name: 'Kaggle Competition Expert', issuer: 'Kaggle', year: 2022 },
    ],
    stats: { github_repos: 67, github_stars: 1943, years_experience: 4, projects_shipped: 11 },
    template_style: 'dark-techy',
    accent_color: '#7C3AED',
  },

  /* ─── 4. DevOps / SRE — Neon Cyberpunk ─── */
  {
    id: 'USR004',
    profile: {
      name: 'Karan Bhatia',
      title: 'DevOps Engineer & SRE',
      bio: 'I keep systems alive at 3 AM so you don\'t have to. Obsessed with observability, infra-as-code, and zero-downtime deployments.',
      location: 'Pune, India',
      email: 'karan.bhatia@email.com',
      avatar: 'https://i.pravatar.cc/150?img=68',
      resume_url: '/resumes/karan_bhatia.pdf',
      availability: 'Open to work',
      social: {
        github: 'github.com/karanbhatia',
        linkedin: 'linkedin.com/in/karanbhatia',
        twitter: 'twitter.com/karanops',
        portfolio: 'karanbhatia.dev',
      },
    },
    skills: {
      primary: ['Kubernetes', 'Terraform', 'AWS', 'Go'],
      secondary: ['Prometheus', 'Grafana', 'Ansible', 'ArgoCD'],
      tools: ['Helm', 'Vault', 'Datadog', 'PagerDuty'],
      learning: ['eBPF', 'Cilium'],
    },
    experience: [
      {
        company: 'Flipkart',
        role: 'Senior DevOps Engineer',
        duration: '2021 - Present',
        location: 'Bengaluru',
        type: 'Full-time',
        description: 'Managed 2000+ node Kubernetes cluster serving 50M+ users. Reduced infra cost by 30% through spot-instance optimization.',
        tech: ['Kubernetes', 'Terraform', 'Prometheus', 'Grafana'],
      },
      {
        company: 'Ola',
        role: 'Cloud Engineer',
        duration: '2019 - 2021',
        location: 'Bengaluru',
        type: 'Full-time',
        description: 'Automated CI/CD pipelines for 40+ microservices. Achieved 99.99% uptime SLA.',
        tech: ['AWS', 'Jenkins', 'Docker', 'Ansible'],
      },
    ],
    projects: [
      {
        id: 'P001',
        title: 'K8s Cost Optimizer',
        tagline: 'Automated Kubernetes cost reduction tool',
        description: 'Open-source tool that analyzes pod resource requests vs actual usage and right-sizes workloads. Saved $200K/yr at Flipkart.',
        tech: ['Go', 'Kubernetes API', 'Prometheus', 'Helm'],
        category: 'DevOps Tool',
        status: 'Live',
        github: 'github.com/karanbhatia/k8s-cost-optimizer',
        live_url: 'k8scost.io',
        thumbnail: 'https://picsum.photos/seed/k8scost/800/450',
        stars: 1240,
        featured: true,
      },
      {
        id: 'P002',
        title: 'InfraGraph',
        tagline: 'Visual infrastructure dependency mapper',
        description: 'Automatically generates interactive dependency graphs from Terraform state. Integrates with Slack for drift alerts.',
        tech: ['Python', 'Terraform', 'D3.js', 'FastAPI'],
        category: 'Infrastructure',
        status: 'Live',
        github: 'github.com/karanbhatia/infragraph',
        live_url: 'infragraph.dev',
        thumbnail: 'https://picsum.photos/seed/infragraph/800/450',
        stars: 432,
        featured: true,
      },
    ],
    education: [{ institution: 'COEP Pune', degree: 'B.E. Computer Engineering', duration: '2015 - 2019', grade: '8.2 CGPA' }],
    certifications: [
      { name: 'Certified Kubernetes Administrator', issuer: 'CNCF', year: 2022 },
      { name: 'AWS DevOps Professional', issuer: 'Amazon', year: 2021 },
    ],
    stats: { github_repos: 58, github_stars: 2100, years_experience: 5, projects_shipped: 22 },
    template_style: 'neon-cyberpunk',
    accent_color: '#00D9FF',
  },

  /* ─── 5. Mobile Developer — Pastel Creative ─── */
  {
    id: 'USR005',
    profile: {
      name: 'Ananya Krishnan',
      title: 'Mobile App Developer (iOS & Android)',
      bio: 'Crafting delightful mobile experiences since 2018. Believer in pixel-perfect UI and buttery-smooth animations.',
      location: 'Chennai, India',
      email: 'ananya.krishnan@email.com',
      avatar: 'https://i.pravatar.cc/150?img=25',
      resume_url: '/resumes/ananya_krishnan.pdf',
      availability: 'Freelance available',
      social: {
        github: 'github.com/ananyakrishnan',
        linkedin: 'linkedin.com/in/ananyakrishnan',
        twitter: 'twitter.com/ananyabuilds',
        portfolio: 'ananyakrishnan.dev',
      },
    },
    skills: {
      primary: ['Swift', 'Kotlin', 'React Native', 'Flutter'],
      secondary: ['SwiftUI', 'Jetpack Compose', 'Firebase', 'GraphQL'],
      tools: ['Xcode', 'Android Studio', 'Figma', 'TestFlight'],
      learning: ['Rust for Mobile', 'AR Kit'],
    },
    experience: [
      {
        company: 'PhonePe',
        role: 'Senior iOS Developer',
        duration: '2022 - Present',
        location: 'Bengaluru',
        type: 'Full-time',
        description: 'Built the Wealth & Investments module used by 8M+ users. Reduced app crash rate by 62% through proactive monitoring.',
        tech: ['Swift', 'SwiftUI', 'Combine', 'CoreData'],
      },
      {
        company: 'MakeMyTrip',
        role: 'iOS Developer',
        duration: '2019 - 2022',
        location: 'Gurugram',
        type: 'Full-time',
        description: 'Shipped 12 major app releases. Implemented offline-first architecture reducing load time by 45%.',
        tech: ['Swift', 'RxSwift', 'Realm', 'Firebase'],
      },
    ],
    projects: [
      {
        id: 'P001',
        title: 'HabitLoop',
        tagline: 'Gamified habit tracker for iOS & Android',
        description: 'React Native app with streak tracking, custom widgets, and social challenges. 50K+ downloads, 4.8★ rating.',
        tech: ['React Native', 'Expo', 'Firebase', 'Reanimated 3'],
        category: 'Mobile App',
        status: 'Live',
        github: 'github.com/ananyakrishnan/habitloop',
        live_url: 'apps.apple.com/habitloop',
        thumbnail: 'https://picsum.photos/seed/habitloop/800/450',
        stars: 680,
        featured: true,
      },
      {
        id: 'P002',
        title: 'SnapReceipt',
        tagline: 'AI-powered receipt scanner & expense tracker',
        description: 'Uses Vision framework to extract expense data from receipts. Auto-categorizes and exports to Google Sheets.',
        tech: ['Swift', 'Vision', 'Core ML', 'CloudKit'],
        category: 'Productivity',
        status: 'Live',
        github: null,
        live_url: 'apps.apple.com/snapreceipt',
        thumbnail: 'https://picsum.photos/seed/snapreceipt/800/450',
        stars: 0,
        featured: true,
      },
    ],
    education: [{ institution: 'Anna University', degree: 'B.E. Computer Science', duration: '2015 - 2019', grade: '8.9 CGPA' }],
    certifications: [
      { name: 'Apple WWDC Scholar', issuer: 'Apple', year: 2021 },
      { name: 'Google Associate Android Developer', issuer: 'Google', year: 2020 },
    ],
    stats: { github_repos: 31, github_stars: 880, years_experience: 5, projects_shipped: 16 },
    template_style: 'pastel-creative',
    accent_color: '#A855F7',
  },

  /* ─── 6. Blockchain / Web3 — Midnight Finance ─── */
  {
    id: 'USR006',
    profile: {
      name: 'Rohan Verma',
      title: 'Blockchain Developer & Smart Contract Auditor',
      bio: 'Building the decentralized future — one smart contract at a time. DeFi protocol engineer with a security-first mindset.',
      location: 'Jaipur, India',
      email: 'rohan.verma@email.com',
      avatar: 'https://i.pravatar.cc/150?img=57',
      resume_url: '/resumes/rohan_verma.pdf',
      availability: 'Open to work',
      social: {
        github: 'github.com/rohanverma',
        linkedin: 'linkedin.com/in/rohanverma',
        twitter: 'twitter.com/rohanweb3',
        portfolio: 'rohanverma.eth',
      },
    },
    skills: {
      primary: ['Solidity', 'Ethers.js', 'Hardhat', 'TypeScript'],
      secondary: ['The Graph', 'IPFS', 'Chainlink', 'OpenZeppelin'],
      tools: ['Foundry', 'Slither', 'Mythril', 'Tenderly'],
      learning: ['ZK Proofs', 'Move Language'],
    },
    experience: [
      {
        company: 'Polygon Labs',
        role: 'Blockchain Engineer',
        duration: '2022 - Present',
        location: 'Remote',
        type: 'Full-time',
        description: 'Built DeFi infrastructure on Polygon zkEVM. Audited 15+ protocols with $500M+ TVL.',
        tech: ['Solidity', 'Hardhat', 'The Graph', 'IPFS'],
      },
      {
        company: 'WazirX',
        role: 'Web3 Developer',
        duration: '2020 - 2022',
        location: 'Mumbai',
        type: 'Full-time',
        description: 'Developed NFT marketplace smart contracts. Integrated MetaMask and WalletConnect across web & mobile.',
        tech: ['Solidity', 'React', 'Ethers.js', 'Moralis'],
      },
    ],
    projects: [
      {
        id: 'P001',
        title: 'DexShield',
        tagline: 'Real-time MEV protection for DeFi swaps',
        description: 'On-chain MEV protection layer compatible with Uniswap V3. Protects users from front-running with commit-reveal scheme.',
        tech: ['Solidity', 'Flashbots', 'Hardhat', 'The Graph'],
        category: 'DeFi Protocol',
        status: 'Live',
        github: 'github.com/rohanverma/dexshield',
        live_url: 'dexshield.finance',
        thumbnail: 'https://picsum.photos/seed/dexshield/800/450',
        stars: 920,
        featured: true,
      },
      {
        id: 'P002',
        title: 'AuditBot',
        tagline: 'AI-powered smart contract vulnerability scanner',
        description: 'LLM-enhanced static analysis tool that detects reentrancy, overflow, and access control issues in Solidity code.',
        tech: ['Python', 'Slither', 'GPT-4', 'FastAPI'],
        category: 'Security Tool',
        status: 'Beta',
        github: 'github.com/rohanverma/auditbot',
        live_url: 'auditbot.io',
        thumbnail: 'https://picsum.photos/seed/auditbot/800/450',
        stars: 644,
        featured: true,
      },
    ],
    education: [{ institution: 'MNIT Jaipur', degree: 'B.Tech Electronics & Communication', duration: '2016 - 2020', grade: '7.8 CGPA' }],
    certifications: [
      { name: 'Certified Blockchain Developer', issuer: 'Blockchain Council', year: 2021 },
      { name: 'Ethereum Security Auditor', issuer: 'OpenZeppelin', year: 2022 },
    ],
    stats: { github_repos: 44, github_stars: 2800, years_experience: 4, projects_shipped: 13 },
    template_style: 'midnight-finance',
    accent_color: '#F7931A',
  },

  /* ─── 7. Game Developer — Forest Green ─── */
  {
    id: 'USR007',
    profile: {
      name: 'Siddharth Rao',
      title: 'Game Developer & Technical Artist',
      bio: 'Making worlds people want to live in. Unity & Unreal specialist with a background in 3D art and shader programming.',
      location: 'Goa, India',
      email: 'siddharth.rao@email.com',
      avatar: 'https://i.pravatar.cc/150?img=17',
      resume_url: '/resumes/siddharth_rao.pdf',
      availability: 'Open to work',
      social: {
        github: 'github.com/siddharthrao',
        linkedin: 'linkedin.com/in/siddharthrao',
        twitter: 'twitter.com/sidgamedev',
        portfolio: 'sidgames.dev',
      },
    },
    skills: {
      primary: ['Unity', 'C#', 'Unreal Engine', 'HLSL'],
      secondary: ['Blender', 'Substance Painter', 'FMOD', 'Photon'],
      tools: ['Perforce', 'JIRA', 'Figma', 'OBS Studio'],
      learning: ['Godot 4', 'Bevy (Rust)'],
    },
    experience: [
      {
        company: 'Supercell',
        role: 'Game Developer',
        duration: '2022 - Present',
        location: 'Remote',
        type: 'Full-time',
        description: 'Developed gameplay systems for a top-grossing mobile strategy game. Optimized rendering to achieve 60fps on mid-range devices.',
        tech: ['Unity', 'C#', 'HLSL', 'Photon'],
      },
      {
        company: 'Moonfrog Labs',
        role: 'Unity Developer',
        duration: '2020 - 2022',
        location: 'Bengaluru',
        type: 'Full-time',
        description: 'Built multiplayer card games with 2M DAU. Implemented procedural map generation and custom physics.',
        tech: ['Unity', 'C#', 'Playfab', 'Firebase'],
      },
    ],
    projects: [
      {
        id: 'P001',
        title: 'EchoRift',
        tagline: 'Atmospheric horror puzzle game in Unreal Engine 5',
        description: 'Solo-developed atmospheric horror game using Lumen global illumination and Nanite virtualized geometry. Featured on itch.io.',
        tech: ['Unreal Engine 5', 'Blueprints', 'Lumen', 'MetaSounds'],
        category: 'Game',
        status: 'Released',
        github: null,
        live_url: 'itch.io/echorift',
        thumbnail: 'https://picsum.photos/seed/echorift/800/450',
        stars: 0,
        featured: true,
      },
      {
        id: 'P002',
        title: 'ProceduralTerrain',
        tagline: 'Open-source Unity terrain generation toolkit',
        description: 'Scriptable terrain generator using erosion simulation, biome blending, and GPU-accelerated noise functions.',
        tech: ['Unity', 'C#', 'Compute Shaders', 'HLSL'],
        category: 'Open Source',
        status: 'Live',
        github: 'github.com/siddharthrao/proceduralterrain',
        live_url: 'procterrain.dev',
        thumbnail: 'https://picsum.photos/seed/procterrain/800/450',
        stars: 1580,
        featured: true,
      },
    ],
    education: [{ institution: 'Symbiosis Institute', degree: 'BCA Game Design', duration: '2017 - 2020', grade: 'First Class' }],
    certifications: [
      { name: 'Unity Certified Expert Programmer', issuer: 'Unity Technologies', year: 2022 },
      { name: 'Unreal Authorized Instructor', issuer: 'Epic Games', year: 2023 },
    ],
    stats: { github_repos: 25, github_stars: 2200, years_experience: 4, projects_shipped: 9 },
    template_style: 'forest-green',
    accent_color: '#22C55E',
  },

  /* ─── 8. Security Engineer — Red Hacker ─── */
  {
    id: 'USR008',
    profile: {
      name: 'Ishaan Kapoor',
      title: 'Cybersecurity Engineer & Penetration Tester',
      bio: 'Breaking things legally so you can sleep at night. OSCP certified red teamer with expertise in web and cloud security.',
      location: 'Delhi, India',
      email: 'ishaan.kapoor@email.com',
      avatar: 'https://i.pravatar.cc/150?img=61',
      resume_url: '/resumes/ishaan_kapoor.pdf',
      availability: 'Freelance available',
      social: {
        github: 'github.com/ishaankapoor',
        linkedin: 'linkedin.com/in/ishaankapoor',
        twitter: 'twitter.com/ishaanhacks',
        portfolio: 'ishaankapoor.sec',
      },
    },
    skills: {
      primary: ['Python', 'Burp Suite', 'Metasploit', 'Wireshark'],
      secondary: ['Nmap', 'Cobalt Strike', 'AWS Security', 'SIEM'],
      tools: ['Kali Linux', 'Ghidra', 'Frida', 'Shodan'],
      learning: ['Malware Analysis', 'Kernel Exploits'],
    },
    experience: [
      {
        company: 'HackerOne',
        role: 'Security Researcher',
        duration: '2021 - Present',
        location: 'Remote',
        type: 'Contract',
        description: 'Top-ranked bug bounty hunter. Discovered critical vulnerabilities in Fortune 500 companies earning $300K+ in bounties.',
        tech: ['Burp Suite', 'Python', 'Nuclei', 'Custom Scripts'],
      },
      {
        company: 'Deloitte',
        role: 'Penetration Tester',
        duration: '2019 - 2021',
        location: 'Delhi',
        type: 'Full-time',
        description: 'Conducted 50+ red team assessments for banking and government clients. Led cloud security reviews for AWS and Azure environments.',
        tech: ['Metasploit', 'Cobalt Strike', 'Nessus', 'BloodHound'],
      },
    ],
    projects: [
      {
        id: 'P001',
        title: 'ReconX',
        tagline: 'Automated recon & attack surface mapper',
        description: 'All-in-one OSINT and recon tool that combines subdomain enumeration, port scanning, and vulnerability fingerprinting.',
        tech: ['Python', 'Go', 'Shodan API', 'Nuclei'],
        category: 'Security Tool',
        status: 'Live',
        github: 'github.com/ishaankapoor/reconx',
        live_url: 'reconx.dev',
        thumbnail: 'https://picsum.photos/seed/reconx/800/450',
        stars: 3400,
        featured: true,
      },
      {
        id: 'P002',
        title: 'CloudGuard',
        tagline: 'AWS misconfiguration scanner',
        description: 'Scans AWS accounts for 200+ known misconfigurations including public S3, overprivileged IAM, and unencrypted RDS.',
        tech: ['Python', 'AWS SDK', 'Terraform', 'SQLite'],
        category: 'Cloud Security',
        status: 'Live',
        github: 'github.com/ishaankapoor/cloudguard',
        live_url: 'cloudguard.io',
        thumbnail: 'https://picsum.photos/seed/cloudguard/800/450',
        stars: 1900,
        featured: true,
      },
    ],
    education: [{ institution: 'DTU Delhi', degree: 'B.Tech Information Technology', duration: '2015 - 2019', grade: '7.6 CGPA' }],
    certifications: [
      { name: 'OSCP', issuer: 'Offensive Security', year: 2020 },
      { name: 'CEH Master', issuer: 'EC-Council', year: 2021 },
    ],
    stats: { github_repos: 39, github_stars: 5300, years_experience: 5, projects_shipped: 20 },
    template_style: 'red-hacker',
    accent_color: '#EF4444',
  },

  /* ─── 9. Product Manager — Ocean Blue ─── */
  {
    id: 'USR009',
    profile: {
      name: 'Meera Pillai',
      title: 'Product Manager — Growth & Monetization',
      bio: 'I turn user pain into product strategy. 6 years shipping features that move metrics. Ex-Google, IIM-A MBA.',
      location: 'Bengaluru, India',
      email: 'meera.pillai@email.com',
      avatar: 'https://i.pravatar.cc/150?img=45',
      resume_url: '/resumes/meera_pillai.pdf',
      availability: 'Open to work',
      social: {
        linkedin: 'linkedin.com/in/meerapillai',
        twitter: 'twitter.com/meerapm',
        portfolio: 'meerapillai.notion.site',
      },
    },
    skills: {
      primary: ['Product Strategy', 'A/B Testing', 'SQL', 'Roadmapping'],
      secondary: ['User Research', 'Data Analytics', 'Growth Hacking', 'Pricing'],
      tools: ['Amplitude', 'Mixpanel', 'Figma', 'Notion'],
      learning: ['LLM Product Design', 'Behavioral Economics'],
    },
    experience: [
      {
        company: 'Google',
        role: 'Product Manager II — Ads',
        duration: '2021 - Present',
        location: 'Bengaluru',
        type: 'Full-time',
        description: 'Drove $120M ARR growth via smart bidding improvements. Led 4-person PM team across Search and Display Ads products.',
        tech: ['SQL', 'Amplitude', 'Python', 'Looker'],
      },
      {
        company: 'Swiggy',
        role: 'Associate Product Manager',
        duration: '2019 - 2021',
        location: 'Bengaluru',
        type: 'Full-time',
        description: 'Launched Swiggy One subscription — 2M subscribers in 6 months. Improved checkout conversion by 22%.',
        tech: ['Mixpanel', 'Figma', 'SQL', 'Lean Canvas'],
      },
    ],
    projects: [
      {
        id: 'P001',
        title: 'GrowthOS',
        tagline: 'PLG growth framework template',
        description: 'Open Notion workspace with 40+ templates for PLG metrics, experiment tracking, roadmaps, and user interview synthesis.',
        tech: ['Notion', 'Analytics', 'No-code'],
        category: 'Framework',
        status: 'Live',
        github: null,
        live_url: 'growthOS.notion.site',
        thumbnail: 'https://picsum.photos/seed/growthos/800/450',
        stars: 0,
        featured: true,
      },
      {
        id: 'P002',
        title: 'PriceIQ',
        tagline: 'Competitive pricing intelligence dashboard',
        description: 'No-code dashboard aggregating competitor pricing, customer reviews, and market position signals into weekly briefs.',
        tech: ['Notion', 'Make (Integromat)', 'Airtable', 'Apify'],
        category: 'Tool',
        status: 'Live',
        github: null,
        live_url: 'priceiq.io',
        thumbnail: 'https://picsum.photos/seed/priceiq/800/450',
        stars: 0,
        featured: true,
      },
    ],
    education: [
      { institution: 'IIM Ahmedabad', degree: 'MBA — Product & Strategy', duration: '2017 - 2019', grade: 'Gold Medal' },
      { institution: 'NSIT Delhi', degree: 'B.E. Computer Science', duration: '2013 - 2017', grade: '8.1 CGPA' },
    ],
    certifications: [
      { name: 'Google Product Manager Certificate', issuer: 'Google', year: 2020 },
      { name: 'Reforge Growth Series', issuer: 'Reforge', year: 2021 },
    ],
    stats: { github_repos: 3, github_stars: 0, years_experience: 6, projects_shipped: 30 },
    template_style: 'ocean-blue',
    accent_color: '#0EA5E9',
  },

  /* ─── 10. Content Creator — Warm Editorial ─── */
  {
    id: 'USR010',
    profile: {
      name: 'Tanvi Joshi',
      title: 'Technical Writer & Developer Advocate',
      bio: 'Making complex tech feel simple. I write tutorials that developers actually finish reading. 80K newsletter subscribers.',
      location: 'Ahmedabad, India',
      email: 'tanvi.joshi@email.com',
      avatar: 'https://i.pravatar.cc/150?img=48',
      resume_url: '/resumes/tanvi_joshi.pdf',
      availability: 'Freelance available',
      social: {
        github: 'github.com/tanvijoshi',
        linkedin: 'linkedin.com/in/tanvijoshi',
        twitter: 'twitter.com/tanviwrites',
        portfolio: 'tanvijoshi.com',
      },
    },
    skills: {
      primary: ['Technical Writing', 'React', 'Developer Relations', 'Video Production'],
      secondary: ['SEO', 'Next.js', 'Python', 'Community Building'],
      tools: ['Notion', 'Figma', 'Descript', 'Beehiiv'],
      learning: ['AI Content Strategy', 'Podcast Production'],
    },
    experience: [
      {
        company: 'Vercel',
        role: 'Developer Advocate',
        duration: '2022 - Present',
        location: 'Remote',
        type: 'Full-time',
        description: 'Created 200+ tutorials reaching 5M+ developers. Grew Vercel YouTube from 10K to 120K subscribers.',
        tech: ['Next.js', 'React', 'Notion', 'YouTube Studio'],
      },
      {
        company: 'Hashnode',
        role: 'Head of Content',
        duration: '2020 - 2022',
        location: 'Remote',
        type: 'Full-time',
        description: 'Managed content strategy for 700K developer community. Launched 4 content programs generating $2M in sponsorship revenue.',
        tech: ['Markdown', 'SEO Tools', 'Analytics', 'Webflow'],
      },
    ],
    projects: [
      {
        id: 'P001',
        title: 'ByteSized',
        tagline: '80K subscriber newsletter on web dev & AI',
        description: 'Weekly newsletter breaking down complex tech in 5 minutes. 48% open rate, 12% click rate. Monetized through sponsorships.',
        tech: ['Beehiiv', 'Notion', 'Zapier', 'ConvertKit'],
        category: 'Newsletter',
        status: 'Live',
        github: null,
        live_url: 'bytesized.dev',
        thumbnail: 'https://picsum.photos/seed/bytesized/800/450',
        stars: 0,
        featured: true,
      },
      {
        id: 'P002',
        title: 'DocuForge',
        tagline: 'AI-powered documentation generator',
        description: 'Generates structured technical docs from codebase using GPT-4. Supports Markdown, MDX, and Docusaurus output.',
        tech: ['Next.js', 'OpenAI', 'TypeScript', 'MDX'],
        category: 'Developer Tool',
        status: 'Beta',
        github: 'github.com/tanvijoshi/docuforge',
        live_url: 'docuforge.dev',
        thumbnail: 'https://picsum.photos/seed/docuforge/800/450',
        stars: 730,
        featured: true,
      },
    ],
    education: [{ institution: 'Gujarat University', degree: 'B.Tech Computer Science', duration: '2016 - 2020', grade: '8.3 CGPA' }],
    certifications: [
      { name: 'Google Technical Writing One', issuer: 'Google', year: 2021 },
      { name: 'HubSpot Content Marketing', issuer: 'HubSpot', year: 2022 },
    ],
    stats: { github_repos: 28, github_stars: 730, years_experience: 4, projects_shipped: 15 },
    template_style: 'warm-editorial',
    accent_color: '#F97316',
  },

  /* ─── 11. Quant / Finance — Rose Gold ─── */
  {
    id: 'USR011',
    profile: {
      name: 'Aditya Malhotra',
      title: 'Quantitative Developer & Algo Trader',
      bio: 'Where finance meets code. Building systematic trading strategies and risk analytics for hedge funds and proprietary desks.',
      location: 'Mumbai, India',
      email: 'aditya.malhotra@email.com',
      avatar: 'https://i.pravatar.cc/150?img=8',
      resume_url: '/resumes/aditya_malhotra.pdf',
      availability: 'Not available',
      social: {
        github: 'github.com/adityamalhotra',
        linkedin: 'linkedin.com/in/adityamalhotra',
        portfolio: 'adityamalhotra.io',
      },
    },
    skills: {
      primary: ['Python', 'C++', 'R', 'SQL'],
      secondary: ['QuantLib', 'Pandas', 'NumPy', 'CUDA'],
      tools: ['Bloomberg Terminal', 'Jupyter', 'Databricks', 'Airflow'],
      learning: ['Reinforcement Learning for Trading', 'GPU Optimization'],
    },
    experience: [
      {
        company: 'Goldman Sachs',
        role: 'Quantitative Analyst',
        duration: '2021 - Present',
        location: 'Mumbai',
        type: 'Full-time',
        description: 'Developed high-frequency equity strategies generating 28% annualized returns. Built real-time risk monitoring for $2B portfolio.',
        tech: ['Python', 'C++', 'KDB+', 'Bloomberg API'],
      },
      {
        company: 'Edelweiss',
        role: 'Quant Developer',
        duration: '2019 - 2021',
        location: 'Mumbai',
        type: 'Full-time',
        description: 'Implemented derivatives pricing models (BSM, Heston). Built options flow analytics platform used by 30 traders.',
        tech: ['Python', 'QuantLib', 'PostgreSQL', 'Redis'],
      },
    ],
    projects: [
      {
        id: 'P001',
        title: 'AlphaEngine',
        tagline: 'Open-source systematic trading backtester',
        description: 'Event-driven backtesting engine handling 10M+ ticks/second. Supports equities, futures, and crypto. Vectorbt-compatible.',
        tech: ['Python', 'C++ extensions', 'Pandas', 'Numba'],
        category: 'Finance Tool',
        status: 'Live',
        github: 'github.com/adityamalhotra/alphaengine',
        live_url: 'alphaengine.io',
        thumbnail: 'https://picsum.photos/seed/alphaengine/800/450',
        stars: 2100,
        featured: true,
      },
      {
        id: 'P002',
        title: 'RiskLens',
        tagline: 'Real-time portfolio risk dashboard',
        description: 'Streaming VaR, Greeks, and drawdown analytics powered by WebSockets and Redis. Integrates with Interactive Brokers.',
        tech: ['Python', 'FastAPI', 'Redis', 'React', 'WebSockets'],
        category: 'Finance Dashboard',
        status: 'Live',
        github: null,
        live_url: 'risklens.finance',
        thumbnail: 'https://picsum.photos/seed/risklens/800/450',
        stars: 0,
        featured: true,
      },
    ],
    education: [
      { institution: 'IIT Delhi', degree: 'M.Tech Financial Engineering', duration: '2017 - 2019', grade: '9.4 CGPA' },
      { institution: 'IIT Delhi', degree: 'B.Tech Mathematics & Computing', duration: '2013 - 2017', grade: '9.1 CGPA' },
    ],
    certifications: [
      { name: 'CFA Level III', issuer: 'CFA Institute', year: 2022 },
      { name: 'FRM Part II', issuer: 'GARP', year: 2021 },
    ],
    stats: { github_repos: 22, github_stars: 2100, years_experience: 5, projects_shipped: 12 },
    template_style: 'rose-gold',
    accent_color: '#EC4899',
  },

  /* ─── 12. Healthcare IT — Clinical White ─── */
  {
    id: 'USR012',
    profile: {
      name: 'Dr. Sneha Patel',
      title: 'Healthcare Software Engineer & FHIR Specialist',
      bio: 'MD turned developer. I build clinical decision support systems and interoperability pipelines that save lives — not just time.',
      location: 'Ahmedabad, India',
      email: 'sneha.patel@email.com',
      avatar: 'https://i.pravatar.cc/150?img=49',
      resume_url: '/resumes/sneha_patel.pdf',
      availability: 'Open to work',
      social: {
        github: 'github.com/snehapatel',
        linkedin: 'linkedin.com/in/snehapatel',
        portfolio: 'snehapatel.health',
      },
    },
    skills: {
      primary: ['Python', 'HL7 FHIR', 'React', 'PostgreSQL'],
      secondary: ['TensorFlow', 'DICOM', 'Snowflake', 'NLP'],
      tools: ['Epic EHR', 'HAPI FHIR', 'AWS HealthLake', 'Postman'],
      learning: ['Clinical LLMs', 'Federated Learning'],
    },
    experience: [
      {
        company: 'Apollo Hospitals',
        role: 'Lead Healthcare Engineer',
        duration: '2021 - Present',
        location: 'Ahmedabad',
        type: 'Full-time',
        description: 'Built FHIR R4-compliant EHR integration platform connecting 25 hospitals. Reduced clinical documentation time by 40%.',
        tech: ['HAPI FHIR', 'Python', 'React', 'HL7 v2'],
      },
      {
        company: 'Practo',
        role: 'Software Engineer',
        duration: '2019 - 2021',
        location: 'Bengaluru',
        type: 'Full-time',
        description: 'Developed AI-assisted diagnosis suggestion engine achieving 89% accuracy on symptom-to-condition mapping.',
        tech: ['Python', 'TensorFlow', 'FastAPI', 'PostgreSQL'],
      },
    ],
    projects: [
      {
        id: 'P001',
        title: 'ClinicalBridge',
        tagline: 'FHIR interoperability middleware',
        description: 'Open-source middleware translating HL7 v2, CCDA, and proprietary EHR formats to FHIR R4. Handles 1M+ records/day.',
        tech: ['Python', 'HAPI FHIR', 'Kafka', 'PostgreSQL'],
        category: 'Healthcare IT',
        status: 'Live',
        github: 'github.com/snehapatel/clinicalbridge',
        live_url: 'clinicalbridge.health',
        thumbnail: 'https://picsum.photos/seed/clinicalbridge/800/450',
        stars: 860,
        featured: true,
      },
      {
        id: 'P002',
        title: 'RetinaScan AI',
        tagline: 'Diabetic retinopathy screening from fundus images',
        description: 'Deep learning model achieving 96.4% sensitivity on diabetic retinopathy detection. Deployed in 12 primary care clinics.',
        tech: ['Python', 'TensorFlow', 'DICOM', 'FastAPI', 'Docker'],
        category: 'AI in Healthcare',
        status: 'Live',
        github: null,
        live_url: 'retinascan.health',
        thumbnail: 'https://picsum.photos/seed/retinascan/800/450',
        stars: 0,
        featured: true,
      },
    ],
    education: [
      { institution: 'Gujarat University', degree: 'MBBS', duration: '2012 - 2018', grade: 'First Class' },
      { institution: 'IIIT Hyderabad', degree: 'M.Tech Bioinformatics', duration: '2018 - 2020', grade: '9.0 CGPA' },
    ],
    certifications: [
      { name: 'HL7 FHIR Certified Developer', issuer: 'HL7 International', year: 2021 },
      { name: 'AWS Healthcare Competency', issuer: 'Amazon', year: 2022 },
    ],
    stats: { github_repos: 18, github_stars: 860, years_experience: 4, projects_shipped: 8 },
    template_style: 'clinical-white',
    accent_color: '#06B6D4',
  },

  /* ─── 13. AR/VR Developer — Holographic ─── */
  {
    id: 'USR013',
    profile: {
      name: 'Nikhil Desai',
      title: 'XR Developer — AR · VR · Mixed Reality',
      bio: 'Building the spatial web, one immersive experience at a time. Shipped apps for Apple Vision Pro, Meta Quest, and HoloLens.',
      location: 'Bengaluru, India',
      email: 'nikhil.desai@email.com',
      avatar: 'https://i.pravatar.cc/150?img=52',
      resume_url: '/resumes/nikhil_desai.pdf',
      availability: 'Freelance available',
      social: {
        github: 'github.com/nikhildesai',
        linkedin: 'linkedin.com/in/nikhildesai',
        twitter: 'twitter.com/nikhilxr',
        portfolio: 'nikhildesai.xr',
      },
    },
    skills: {
      primary: ['Unity', 'Swift (visionOS)', 'C#', 'Three.js'],
      secondary: ['ARKit', 'ARCore', 'OpenXR', 'WebXR'],
      tools: ['Reality Composer Pro', 'Blender', 'Substance 3D', 'Figma'],
      learning: ['USD (Pixar)', 'Gaussian Splatting'],
    },
    experience: [
      {
        company: 'Apple',
        role: 'XR Software Engineer',
        duration: '2023 - Present',
        location: 'Remote',
        type: 'Contract',
        description: 'Built spatial computing experiences for Apple Vision Pro launch. Developed WindowGroup and ImmersiveSpace apps in visionOS.',
        tech: ['Swift', 'RealityKit', 'SwiftUI', 'Reality Composer Pro'],
      },
      {
        company: 'Byju\'s',
        role: 'AR Developer',
        duration: '2020 - 2023',
        location: 'Bengaluru',
        type: 'Full-time',
        description: 'Created AR learning modules used by 2M students. Built 3D anatomy visualizer reducing concept learning time by 50%.',
        tech: ['Unity', 'ARKit', 'ARCore', 'C#'],
      },
    ],
    projects: [
      {
        id: 'P001',
        title: 'SpatialSketch',
        tagline: '3D drawing app for Apple Vision Pro',
        description: 'Hand-tracked spatial drawing canvas for visionOS. Create, share, and collaborate on 3D sketches in mixed reality.',
        tech: ['Swift', 'RealityKit', 'visionOS', 'CloudKit'],
        category: 'XR App',
        status: 'App Store',
        github: null,
        live_url: 'apps.apple.com/spatialsketch',
        thumbnail: 'https://picsum.photos/seed/spatialsketch/800/450',
        stars: 0,
        featured: true,
      },
      {
        id: 'P002',
        title: 'WebXR Studio',
        tagline: 'No-code WebXR experience builder',
        description: 'Drag-and-drop tool for building AR/VR web experiences without code. Supports A-Frame, Three.js, and Babylon.js export.',
        tech: ['Three.js', 'WebXR', 'React', 'Node.js'],
        category: 'Developer Tool',
        status: 'Beta',
        github: 'github.com/nikhildesai/webxr-studio',
        live_url: 'webxrstudio.dev',
        thumbnail: 'https://picsum.photos/seed/webxrstudio/800/450',
        stars: 1100,
        featured: true,
      },
    ],
    education: [{ institution: 'Manipal University', degree: 'B.Tech Computer Science', duration: '2016 - 2020', grade: '8.6 CGPA' }],
    certifications: [
      { name: 'Meta Certified XR Developer', issuer: 'Meta', year: 2022 },
      { name: 'Apple Developer Academy Graduate', issuer: 'Apple', year: 2023 },
    ],
    stats: { github_repos: 34, github_stars: 1100, years_experience: 4, projects_shipped: 14 },
    template_style: 'holographic',
    accent_color: '#8B5CF6',
  },
];

export const TEMPLATE_META: Record<string, { label: string; emoji: string; category: string; tagline: string }> = {
  'dark-minimal':      { label: 'Dark Minimal',      emoji: '⌨️', category: 'Full Stack',        tagline: 'Clean, focused, engineering-first' },
  'light-editorial':   { label: 'Light Editorial',   emoji: '🎨', category: 'Design',             tagline: 'Creative, airy, portfolio-led' },
  'dark-techy':        { label: 'Dark Techy',        emoji: '🧠', category: 'ML / AI',            tagline: 'Data-heavy, research-grade' },
  'neon-cyberpunk':    { label: 'Neon Cyberpunk',    emoji: '🌐', category: 'DevOps / SRE',       tagline: 'Terminal-native, infra-obsessed' },
  'pastel-creative':   { label: 'Pastel Creative',   emoji: '📱', category: 'Mobile Dev',         tagline: 'Playful, pixel-perfect, app-focused' },
  'midnight-finance':  { label: 'Midnight Finance',  emoji: '⛓️', category: 'Blockchain / Web3',  tagline: 'Decentralized, trustless, cutting-edge' },
  'forest-green':      { label: 'Forest Green',      emoji: '🎮', category: 'Game Dev',           tagline: 'World-builder, shader-wizard' },
  'red-hacker':        { label: 'Red Hacker',        emoji: '🔴', category: 'Security / CTF',     tagline: 'Offensive mindset, defensive skills' },
  'ocean-blue':        { label: 'Ocean Blue',        emoji: '🚀', category: 'Product Manager',    tagline: 'Strategy, metrics, storytelling' },
  'warm-editorial':    { label: 'Warm Editorial',    emoji: '✍️', category: 'Content / DevRel',   tagline: 'Words that ship products' },
  'rose-gold':         { label: 'Rose Gold',         emoji: '📈', category: 'Quant / Finance',    tagline: 'Models, signals, alpha generation' },
  'clinical-white':    { label: 'Clinical White',    emoji: '🏥', category: 'Healthcare IT',      tagline: 'Evidence-based, FHIR-compliant' },
  'holographic':       { label: 'Holographic',       emoji: '🥽', category: 'AR / VR / XR',       tagline: 'Building the spatial computing era' },
};
