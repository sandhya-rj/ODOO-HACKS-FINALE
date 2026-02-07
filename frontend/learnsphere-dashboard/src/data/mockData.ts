export interface Lesson {
  id: string;
  title: string;
  type: "video" | "document" | "image" | "quiz";
  duration: string;
  completed: boolean;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  tags: string[];
  lessonsCount: number;
  totalDuration: string;
  published: boolean;
  progress: number;
  status: "draft" | "published";
  lessons: Lesson[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface LearnerProgress {
  id: string;
  course: string;
  learner: string;
  enrolledDate: string;
  timeSpent: string;
  completion: number;
  status: "completed" | "in-progress" | "not-started";
}

export const mockCourses: Course[] = [
  {
    id: "1",
    title: "Machine Learning Fundamentals",
    description: "Master core ML concepts from supervised learning to neural networks. Build real-world models with Python and scikit-learn.",
    tags: ["AI", "Python", "Data Science"],
    lessonsCount: 12,
    totalDuration: "8h 30m",
    published: true,
    progress: 65,
    status: "published",
    lessons: [
      { id: "1-1", title: "Introduction to Machine Learning", type: "video", duration: "45m", completed: true },
      { id: "1-2", title: "Supervised vs Unsupervised Learning", type: "video", duration: "1h", completed: true },
      { id: "1-3", title: "Linear Regression Deep Dive", type: "document", duration: "30m", completed: true },
      { id: "1-4", title: "Decision Trees & Random Forests", type: "video", duration: "1h 15m", completed: false },
      { id: "1-5", title: "Neural Networks Basics", type: "video", duration: "50m", completed: false },
      { id: "1-6", title: "Model Evaluation Techniques", type: "document", duration: "35m", completed: false },
    ],
  },
  {
    id: "2",
    title: "Advanced React Development",
    description: "Deep dive into React patterns, performance optimization, and state management for production applications.",
    tags: ["React", "TypeScript", "Frontend"],
    lessonsCount: 10,
    totalDuration: "6h 45m",
    published: true,
    progress: 30,
    status: "published",
    lessons: [
      { id: "2-1", title: "Advanced Hooks Patterns", type: "video", duration: "55m", completed: true },
      { id: "2-2", title: "State Management with Zustand", type: "video", duration: "1h", completed: false },
      { id: "2-3", title: "Performance Optimization", type: "document", duration: "40m", completed: false },
      { id: "2-4", title: "Testing React Applications", type: "video", duration: "1h 10m", completed: false },
    ],
  },
  {
    id: "3",
    title: "Business Strategy & Leadership",
    description: "Develop strategic thinking and leadership skills for modern business environments.",
    tags: ["Business", "Leadership", "Strategy"],
    lessonsCount: 8,
    totalDuration: "5h 20m",
    published: true,
    progress: 100,
    status: "published",
    lessons: [
      { id: "3-1", title: "Strategic Thinking Framework", type: "video", duration: "50m", completed: true },
      { id: "3-2", title: "Market Analysis", type: "document", duration: "45m", completed: true },
      { id: "3-3", title: "Leadership Styles", type: "video", duration: "1h", completed: true },
    ],
  },
  {
    id: "4",
    title: "UX Design Principles",
    description: "Learn user-centered design methodology, wireframing, prototyping, and usability testing.",
    tags: ["Design", "UX", "Figma"],
    lessonsCount: 9,
    totalDuration: "7h",
    published: true,
    progress: 0,
    status: "published",
    lessons: [
      { id: "4-1", title: "Design Thinking Process", type: "video", duration: "55m", completed: false },
      { id: "4-2", title: "User Research Methods", type: "document", duration: "40m", completed: false },
      { id: "4-3", title: "Wireframing & Prototyping", type: "video", duration: "1h 15m", completed: false },
    ],
  },
  {
    id: "5",
    title: "Cloud Architecture with AWS",
    description: "Design and deploy scalable cloud solutions using Amazon Web Services.",
    tags: ["Cloud", "AWS", "DevOps"],
    lessonsCount: 14,
    totalDuration: "10h",
    published: false,
    progress: 0,
    status: "draft",
    lessons: [
      { id: "5-1", title: "AWS Fundamentals", type: "video", duration: "1h", completed: false },
      { id: "5-2", title: "EC2 & Networking", type: "video", duration: "1h 20m", completed: false },
      { id: "5-3", title: "S3 & Storage Solutions", type: "document", duration: "45m", completed: false },
    ],
  },
  {
    id: "6",
    title: "Data Analytics with Python",
    description: "Transform raw data into actionable insights using pandas, matplotlib, and SQL.",
    tags: ["Python", "Analytics", "SQL"],
    lessonsCount: 11,
    totalDuration: "7h 45m",
    published: false,
    progress: 0,
    status: "draft",
    lessons: [
      { id: "6-1", title: "Python for Data Analysis", type: "video", duration: "50m", completed: false },
      { id: "6-2", title: "Working with Pandas", type: "document", duration: "45m", completed: false },
      { id: "6-3", title: "Data Visualization with Matplotlib", type: "video", duration: "1h", completed: false },
    ],
  },
];

export const mockQuizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    question: "What is the primary goal of supervised learning?",
    options: [
      "To find hidden patterns in data",
      "To learn from labeled training data",
      "To reduce data dimensionality",
      "To generate new data samples",
    ],
    correctAnswer: 1,
  },
  {
    id: "q2",
    question: "Which algorithm is commonly used for classification tasks?",
    options: [
      "Linear Regression",
      "K-Means Clustering",
      "Random Forest",
      "PCA",
    ],
    correctAnswer: 2,
  },
  {
    id: "q3",
    question: "What does overfitting mean in machine learning?",
    options: [
      "Model performs well on both training and test data",
      "Model performs poorly on all data",
      "Model performs well on training data but poorly on new data",
      "Model takes too long to train",
    ],
    correctAnswer: 2,
  },
  {
    id: "q4",
    question: "Which metric is best for evaluating imbalanced classification?",
    options: ["Accuracy", "F1 Score", "Mean Squared Error", "R-Squared"],
    correctAnswer: 1,
  },
];

export const mockLearnerProgress: LearnerProgress[] = [
  { id: "lp1", course: "Machine Learning Fundamentals", learner: "Alice Johnson", enrolledDate: "2024-01-15", timeSpent: "5h 12m", completion: 65, status: "in-progress" },
  { id: "lp2", course: "Machine Learning Fundamentals", learner: "Bob Smith", enrolledDate: "2024-01-20", timeSpent: "8h 30m", completion: 100, status: "completed" },
  { id: "lp3", course: "Advanced React Development", learner: "Carol Davis", enrolledDate: "2024-02-01", timeSpent: "2h 15m", completion: 30, status: "in-progress" },
  { id: "lp4", course: "Advanced React Development", learner: "Dave Wilson", enrolledDate: "2024-02-05", timeSpent: "0m", completion: 0, status: "not-started" },
  { id: "lp5", course: "Business Strategy & Leadership", learner: "Eve Martinez", enrolledDate: "2024-01-10", timeSpent: "5h 20m", completion: 100, status: "completed" },
  { id: "lp6", course: "UX Design Principles", learner: "Frank Brown", enrolledDate: "2024-02-10", timeSpent: "1h 30m", completion: 20, status: "in-progress" },
  { id: "lp7", course: "Machine Learning Fundamentals", learner: "Grace Lee", enrolledDate: "2024-01-25", timeSpent: "0m", completion: 0, status: "not-started" },
  { id: "lp8", course: "UX Design Principles", learner: "Henry Clark", enrolledDate: "2024-02-12", timeSpent: "3h 45m", completion: 55, status: "in-progress" },
];
