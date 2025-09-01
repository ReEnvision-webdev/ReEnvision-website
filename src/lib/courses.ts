export interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  price: string;
  originalPrice: string;
  rating: number;
  reviews: number;
  students: number;
  schedule: {
    format: string;
    commitment: string;
  };
}

export const getAllCourses = async (): Promise<Course[]> => {
  // Simulate the API call delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return [
    {
      id: "web-development-bootcamp",
      title: "Full-Stack Web Development Bootcamp",
      description: "Learn modern web development with HTML, CSS, JavaScript, React, and Node.js. Build real-world projects and get job-ready skills.",
      duration: "12 weeks",
      level: "Beginner to Intermediate",
      price: "Free",
      originalPrice: "$2,499",
      rating: 4.8,
      reviews: 1247,
      students: 15420,
      schedule: {
        format: "Live Online",
        commitment: "20 hours/week"
      }
    },
    {
      id: "python-data-science",
      title: "Python for Data Science & Analytics",
      description: "Master Python programming for data analysis, visualization, and machine learning. Work with real datasets and build predictive models.",
      duration: "10 weeks",
      level: "Beginner",
      price: "Free",
      originalPrice: "$1,899",
      rating: 4.9,
      reviews: 892,
      students: 12350,
      schedule: {
        format: "Live Online",
        commitment: "15 hours/week"
      }
    },
    {
      id: "digital-marketing",
      title: "Digital Marketing & Social Media",
      description: "Learn digital marketing strategies, SEO, social media management, and content creation. Build your personal brand and grow businesses online.",
      duration: "8 weeks",
      level: "Beginner",
      price: "Free",
      originalPrice: "$1,299",
      rating: 4.7,
      reviews: 634,
      students: 8920,
      schedule: {
        format: "Live Online",
        commitment: "12 hours/week"
      }
    },
    {
      id: "cybersecurity-fundamentals",
      title: "Cybersecurity Fundamentals",
      description: "Learn essential cybersecurity concepts, threat detection, and protection strategies. Understand how to secure networks and data.",
      duration: "6 weeks",
      level: "Beginner",
      price: "Free",
      originalPrice: "$1,599",
      rating: 4.6,
      reviews: 445,
      students: 6780,
      schedule: {
        format: "Live Online",
        commitment: "10 hours/week"
      }
    },
    {
      id: "mobile-app-development",
      title: "Mobile App Development with React Native",
      description: "Build cross-platform mobile apps using React Native. Learn to create iOS and Android apps with a single codebase.",
      duration: "10 weeks",
      level: "Intermediate",
      price: "Free",
      originalPrice: "$2,199",
      rating: 4.8,
      reviews: 567,
      students: 7890,
      schedule: {
        format: "Live Online",
        commitment: "18 hours/week"
      }
    },
    {
      id: "ui-ux-design",
      title: "UI/UX Design & Prototyping",
      description: "Learn user interface and user experience design principles. Create beautiful, functional designs using modern tools like Figma.",
      duration: "8 weeks",
      level: "Beginner",
      price: "Free",
      originalPrice: "$1,799",
      rating: 4.7,
      reviews: 723,
      students: 9560,
      schedule: {
        format: "Live Online",
        commitment: "14 hours/week"
      }
    },
    {
      id: "cloud-computing-aws",
      title: "Cloud Computing with AWS",
      description: "Master Amazon Web Services (AWS) cloud platform. Learn to deploy, manage, and scale applications in the cloud.",
      duration: "12 weeks",
      level: "Intermediate",
      price: "Free",
      originalPrice: "$2,799",
      rating: 4.9,
      reviews: 389,
      students: 5430,
      schedule: {
        format: "Live Online",
        commitment: "16 hours/week"
      }
    },
    {
      id: "blockchain-basics",
      title: "Blockchain & Cryptocurrency Basics",
      description: "Understand blockchain technology, smart contracts, and cryptocurrency. Learn about DeFi, NFTs, and the future of digital finance.",
      duration: "6 weeks",
      level: "Beginner",
      price: "Free",
      originalPrice: "$1,499",
      rating: 4.5,
      reviews: 298,
      students: 4120,
      schedule: {
        format: "Live Online",
        commitment: "8 hours/week"
      }
    },
    {
      id: "artificial-intelligence",
      title: "Introduction to Artificial Intelligence",
      description: "Explore AI concepts, machine learning algorithms, and neural networks. Build your first AI models and understand the future of technology.",
      duration: "10 weeks",
      level: "Intermediate",
      price: "Free",
      originalPrice: "$2,299",
      rating: 4.8,
      reviews: 456,
      students: 6230,
      schedule: {
        format: "Live Online",
        commitment: "15 hours/week"
      }
    }
  ];
};
