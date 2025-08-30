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

export async function getAllCourses(): Promise<Course[]> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return [
    {
      id: "web-development-bootcamp",
      title: "Full-Stack Web Development Bootcamp",
      description: "Master modern web development with React, Node.js, and databases. Build real-world projects and deploy them to production.",
      duration: "12 weeks",
      level: "Beginner to Intermediate",
      price: "$1,299",
      originalPrice: "$1,999",
      rating: 4.8,
      reviews: 127,
      students: 2340,
      schedule: {
        format: "Live Sessions",
        commitment: "15 hours/week"
      }
    },
    {
      id: "data-science-fundamentals",
      title: "Data Science Fundamentals",
      description: "Learn Python, statistics, and machine learning basics. Analyze real datasets and create predictive models.",
      duration: "10 weeks",
      level: "Beginner",
      price: "$999",
      originalPrice: "$1,499",
      rating: 4.9,
      reviews: 89,
      students: 1567,
      schedule: {
        format: "Live Sessions",
        commitment: "12 hours/week"
      }
    },
    {
      id: "mobile-app-development",
      title: "Mobile App Development with React Native",
      description: "Build cross-platform mobile apps for iOS and Android using React Native. Learn app store deployment and monetization.",
      duration: "8 weeks",
      level: "Intermediate",
      price: "$1,199",
      originalPrice: "$1,699",
      rating: 4.7,
      reviews: 73,
      students: 892,
      schedule: {
        format: "Live Sessions",
        commitment: "10 hours/week"
      }
    },
    {
      id: "cybersecurity-basics",
      title: "Cybersecurity Fundamentals",
      description: "Understand cybersecurity principles, ethical hacking, and network security. Learn to protect systems and data.",
      duration: "6 weeks",
      level: "Beginner",
      price: "$799",
      originalPrice: "$1,199",
      rating: 4.6,
      reviews: 45,
      students: 634,
      schedule: {
        format: "Live Sessions",
        commitment: "8 hours/week"
      }
    },
    {
      id: "cloud-computing-aws",
      title: "Cloud Computing with AWS",
      description: "Master AWS services, cloud architecture, and DevOps practices. Deploy scalable applications in the cloud.",
      duration: "10 weeks",
      level: "Intermediate to Advanced",
      price: "$1,499",
      originalPrice: "$2,199",
      rating: 4.9,
      reviews: 156,
      students: 2103,
      schedule: {
        format: "Live Sessions",
        commitment: "14 hours/week"
      }
    },
    {
      id: "ui-ux-design",
      title: "UI/UX Design Masterclass",
      description: "Create beautiful, user-friendly interfaces. Learn design principles, prototyping, and user research methods.",
      duration: "8 weeks",
      level: "Beginner to Intermediate",
      price: "$899",
      originalPrice: "$1,399",
      rating: 4.8,
      reviews: 67,
      students: 987,
      schedule: {
        format: "Live Sessions",
        commitment: "10 hours/week"
      }
    }
  ];
}
