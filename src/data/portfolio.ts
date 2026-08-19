export const portfolioData = {
  personal: {
    name: "Swaraj Vecha",
    role: "AI/ML & Full Stack Engineer",
    location: "Hyderabad, Telangana, India",
    email: "swarajvecha@gmail.com",
    phone: "+91-9642985278",
    linkedin: "https://www.linkedin.com/in/laxmiswarajbabu",
    github: "https://github.com/Swarajbabu",
    instagram: "https://github.com/Swarajbabu",
    resumeUrl: "/Swaraj_Vecha_CV.pdf",
    avatar: "",
    socials: {
      linkedin: "https://www.linkedin.com/in/laxmiswarajbabu",
      github: "https://github.com/Swarajbabu",
      leetcode: "https://leetcode.com/u/swarajvecha/",
      codechef: "",
      hackerrank: "",
    },
  },

  hero: {
    headlineOne: "Swaraj Vecha",
    headlineTwo: "AI/ML & Full Stack Engineer",
    subheadline: "Engineering scalable digital platforms, AI/ML models, high-performance RESTful microservices, and cloud infrastructure.",
    typingCycle: ["AI / ML Systems", "Generative AI", "Full Stack Apps", "DevOps & Cloud", "RESTful APIs"],
    primaryCta: "View Projects",
    secondaryCta: "Download CV",
  },

  about: {
    title: "About",
    bio: "Passionate AI/ML & Full Stack Engineer focused on engineering scalable, high-impact digital solutions, AI/ML integrations, and intelligent automation systems. Expertise across AI foundations, modern frontend frameworks, robust backend microservices, databases, and automated cloud infrastructure with Docker, Kubernetes, Terraform, and AWS.",
    highlights: [
      "Education: B.Tech CSE at Lovely Professional University (2023–2027)",
      "Certifications: Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate",
      "Hackathon Ranker: Top-tier rank among 2,000+ at AP MSME Digital Empowerment Challenge 2025",
      "Competitive Coding: 200+ Data Structures & Algorithms problems solved on LeetCode"
    ]
  },

  skills: {
    title: "Skills",
    groups: [
      {
        heading: "AI & Machine Learning",
        items: ["AI / ML Foundations", "Generative AI", "OpenAI API", "Prompt Engineering", "NLP", "Machine Learning", "Deep Learning", "PyTorch", "TensorFlow", "Scikit-learn"]
      },
      {
        heading: "Languages",
        items: ["JavaScript", "Python", "Java", "C++", "SQL", "HTML5", "CSS3"]
      },
      {
        heading: "Frontend",
        items: ["React.js", "Redux", "Context API", "React Router DOM", "Tailwind CSS", "Bootstrap", "Material UI", "Responsive Design"]
      },
      {
        heading: "Backend",
        items: ["Node.js", "Express.js", "RESTful APIs", "MVC Architecture", "JWT", "OAuth 2.0", "Socket.IO", "WebRTC"]
      },
      {
        heading: "Databases",
        items: ["MongoDB", "Mongoose (NoSQL)", "MySQL (Relational)"]
      },
      {
        heading: "Cloud & DevOps",
        items: ["AWS (EC2, S3, ECR, EKS, IAM)", "Docker", "Kubernetes", "Jenkins", "Terraform", "GitHub Actions", "Grafana", "Prometheus"]
      },
      {
        heading: "Tools & Platforms",
        items: ["Git", "GitHub", "Postman", "Linux", "VS Code", "Figma", "Jupyter Notebook", "Power BI", "Excel"]
      },
      {
        heading: "Soft Skills",
        items: ["Communication", "Problem Solving", "Team Collaboration", "Time Management", "Adaptability"]
      }
    ]
  },

  projects: {
    title: "Projects",
    cards: [
      {
        name: "TradeX – Zerodha Inspired Stock Trading Platform",
        category: "FinTech & Real-Time Trading",
        year: "Jul 2026",
        description: "Engineered a high-performance stock trading platform with 12 RESTful API endpoints for authentication, orders, holdings, positions, and fund management with atomic order execution.",
        tags: ["React.js", "Node.js", "Express.js", "MongoDB", "Mongoose", "Yahoo Finance API", "Chart.js", "JWT"],
        links: [
          { label: "GitHub Code", url: "https://github.com/Swarajbabu" },
          { label: "Live Demo", url: "https://github.com/Swarajbabu" }
        ],
        image: "https://res.cloudinary.com/svshyagm/image/upload/v1787145031/swaraj_portfolio/tradex-preview_p28bnz.jpg",
        impactPoints: [
          "Real-time market streaming for 95 NSE stocks with parallel data pipelines",
          "Transactional order processing engine atomically managing balances & holdings",
          "Secured 12 RESTful API endpoints using JWT authentication & bcrypt hashing"
        ]
      },
      {
        name: "Wanderlust – Travel Stay Booking Application",
        category: "Cloud & Full Stack",
        year: "Jun 2025",
        description: "Architected a full-stack, scalable rental booking platform with Cloudinary & Mapbox API integration, automated CI/CD pipeline, and cloud deployment on AWS.",
        tags: ["Node.js", "Express.js", "MongoDB", "Cloudinary", "Mapbox API", "Docker", "AWS EKS", "Terraform", "Jenkins"],
        links: [
          { label: "GitHub Code", url: "https://github.com/Swarajbabu" },
          { label: "Live Demo", url: "https://github.com/Swarajbabu" }
        ],
        image: "https://res.cloudinary.com/svshyagm/image/upload/v1787145033/swaraj_portfolio/wanderlust-preview_yfe9pd.jpg",
        impactPoints: [
          "10+ RESTful CRUD endpoints for rental listings, media uploads & reviews",
          "Containerized with Docker & provisioned on AWS EKS via Terraform IaC",
          "Automated testing and cloud deployment with an 11-stage Jenkins CI/CD pipeline"
        ]
      },
      {
        name: "QuickCode AI – GPT Conversational Coding Platform",
        category: "AI & Generative Models",
        year: "Feb 2025",
        description: "Scalable AI-driven conversational web application using OpenAI APIs and MongoDB with real-time prompt handling, context-aware responses, and markdown code rendering.",
        tags: ["React.js", "Node.js", "Express.js", "MongoDB", "OpenAI API", "Context API", "Markdown", "Tailwind CSS"],
        links: [
          { label: "GitHub Code", url: "https://github.com/Swarajbabu" },
          { label: "Live Demo", url: "https://github.com/Swarajbabu" }
        ],
        image: "https://res.cloudinary.com/svshyagm/image/upload/v1787145034/swaraj_portfolio/quickcode-preview_usvqev.jpg",
        impactPoints: [
          "Structured 7 RESTful API routes & MongoDB models for multi-thread chat history",
          "Interactive chat UI with syntax-highlighted code blocks & streaming responses",
          "Context-aware prompt caching supporting multi-session AI interactions"
        ]
      }
    ]
  },

  education: {
    title: "Education",
    entries: [
      {
        period: "Aug 2023 – Aug 2027",
        degree: "Bachelor of Technology – Computer Science and Engineering",
        org: "Lovely Professional University, Phagwara, Punjab",
        details: ["CGPA: 7.42", "Core Focus: Artificial Intelligence, Machine Learning, Data Structures & Algorithms, Full Stack Development"]
      },
      {
        period: "Mar 2021 – Mar 2023",
        degree: "Intermediate / Senior Secondary",
        org: "Narayana Junior College, Hyderabad, Telangana",
        details: ["Percentage: 94.1%", "MPC Stream (Mathematics, Physics, Chemistry)"]
      },
      {
        period: "Mar 2020 – Mar 2021",
        degree: "Matriculation / Secondary Schooling",
        org: "Green wood High School, Huzurnagar, Telangana",
        details: ["Percentage: 100%"]
      }
    ]
  },

  experience: {
    title: "Certifications & Achievements",
    items: [
      {
        role: "Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate",
        org: "Oracle",
        period: "Mar 2026",
        url: "https://github.com/Swarajbabu",
        image: "https://res.cloudinary.com/svshyagm/image/upload/v1787145035/swaraj_portfolio/auto_ta9ibt.png",
        bullets: [
          "Demonstrated expertise in Artificial Intelligence fundamentals, machine learning models, and OCI AI services."
        ]
      },
      {
        role: "Oracle Data Platform 2025 Certified Foundations Associate",
        org: "Oracle",
        period: "Mar 2026",
        url: "https://github.com/Swarajbabu",
        image: "https://res.cloudinary.com/svshyagm/image/upload/v1787145035/swaraj_portfolio/auto_ta9ibt.png",
        bullets: [
          "Proven knowledge in cloud database architecture, data management, and data platform services."
        ]
      },
      {
        role: "Build Generative AI Apps and Solutions with No-Code Tools",
        org: "Udemy",
        period: "Aug 2025",
        url: "https://github.com/Swarajbabu",
        image: "https://res.cloudinary.com/svshyagm/image/upload/v1787145035/swaraj_portfolio/auto_ta9ibt.png",
        bullets: [
          "Hands-on experience building generative AI tools, prompt engineering, and AI automation."
        ]
      },
      {
        role: "Introduction to Internet of Things",
        org: "NPTEL",
        period: "Oct 2025",
        url: "https://github.com/Swarajbabu",
        image: "https://res.cloudinary.com/svshyagm/image/upload/v1787145035/swaraj_portfolio/auto_ta9ibt.png",
        bullets: [
          "Mastered core concepts of IoT architecture, sensor networks, and smart system integration."
        ]
      },
      {
        role: "Top-Tier Ranking — AP MSME Digital Empowerment Challenge",
        org: "Andhra Pradesh MSME Challenge 2025",
        period: "2025",
        url: "https://github.com/Swarajbabu",
        image: "https://res.cloudinary.com/svshyagm/image/upload/v1787145035/swaraj_portfolio/auto_ta9ibt.png",
        bullets: [
          "Secured top ranking among 2,000+ participants by pitching an AI-driven MSME digitization solution in 48 hours."
        ]
      },
      {
        role: "200+ DSA Problems Solved on LeetCode",
        org: "LeetCode",
        period: "Ongoing",
        url: "https://github.com/Swarajbabu",
        image: "https://res.cloudinary.com/svshyagm/image/upload/v1787145035/swaraj_portfolio/auto_ta9ibt.png",
        bullets: [
          "Solved 200+ Data Structures & Algorithms problems across Arrays, Strings, Trees, Linked Lists, and Dynamic Programming."
        ]
      }
    ]
  },

  contact: {
    title: "Contact",
    copy: "Looking for AI/ML and software engineering opportunities. Feel free to reach out for collaborations or project discussions!",
    formspreeId: "xdenyeaj",
    formspreeUrl: "https://formspree.io/f/xdenyeaj",
    web3FormsKey: "",
    fields: ["Name", "Email", "Message"],
    submitLabel: "Send Message",
    altContacts: [
      { label: "Email", value: "swarajvecha@gmail.com" },
      { label: "Mobile", value: "+91-9642985278" },
      { label: "LinkedIn", value: "https://www.linkedin.com/in/laxmiswarajbabu" },
      { label: "GitHub", value: "https://github.com/Swarajbabu" }
    ]
  },

  footer: {
    note: "© Swaraj Vecha"
  }
};
