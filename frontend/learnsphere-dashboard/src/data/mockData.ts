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
  image: string;
  instructor: string;
  rating: number;
  enrolledCount: number;
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

import { getCourseImage } from "./courseImages";

export const mockCourses: Course[] = [
  {
    id: "1",
    title: "Machine Learning Fundamentals",
    description: "Master core ML concepts from supervised learning to neural networks. Build real-world models with Python and scikit-learn.",
    tags: ["AI", "Python", "Data Science"],
    lessonsCount: 12,
    totalDuration: "8h 30m",
    published: true,
    progress: 0,
    status: "published",
    image: getCourseImage("1"),
    instructor: "Dr. Sarah Chen",
    rating: 4.8,
    enrolledCount: 2847,
    lessons: [
      { id: "1-1", title: "Introduction to Machine Learning", type: "video", duration: "45m", completed: false },
      { id: "1-2", title: "Supervised vs Unsupervised Learning", type: "video", duration: "1h", completed: false },
      { id: "1-3", title: "Linear Regression Deep Dive", type: "document", duration: "30m", completed: false },
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
    progress: 0,
    status: "published",
    image: getCourseImage("2"),
    instructor: "Michael Chen",
    rating: 4.9,
    enrolledCount: 3215,
    lessons: [
      { id: "2-1", title: "Advanced Hooks Patterns", type: "video", duration: "55m", completed: false },
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
    progress: 0,
    status: "published",
    image: getCourseImage("3"),
    instructor: "Prof. James Harper",
    rating: 4.7,
    enrolledCount: 1893,
    lessons: [
      { id: "3-1", title: "Strategic Thinking Framework", type: "video", duration: "50m", completed: false },
      { id: "3-2", title: "Market Analysis", type: "document", duration: "45m", completed: false },
      { id: "3-3", title: "Leadership Styles", type: "video", duration: "1h", completed: false },
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
    image: getCourseImage("4"),
    instructor: "Lisa Park",
    rating: 4.6,
    enrolledCount: 2104,
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
    image: getCourseImage("5"),
    instructor: "Alex Rivera",
    rating: 4.5,
    enrolledCount: 978,
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
    image: getCourseImage("6"),
    instructor: "Dr. Emily Zhang",
    rating: 4.7,
    enrolledCount: 1562,
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

// Per-course quiz question banks
export const quizQuestionsByCourseName: Record<string, QuizQuestion[]> = {
  // Course 1: JavaScript Fundamentals
  '1': [
    { id: "js-q1", question: "What keyword declares a block-scoped variable in JavaScript?", options: ["var", "let", "define", "dim"], correctAnswer: 1 },
    { id: "js-q2", question: "Which method converts a JSON string into a JavaScript object?", options: ["JSON.stringify()", "JSON.parse()", "JSON.convert()", "JSON.toObject()"], correctAnswer: 1 },
    { id: "js-q3", question: "What does '===' check in JavaScript?", options: ["Value only", "Type only", "Value and type", "Reference only"], correctAnswer: 2 },
    { id: "js-q4", question: "Which array method returns a new array with filtered elements?", options: [".map()", ".reduce()", ".filter()", ".forEach()"], correctAnswer: 2 },
  ],
  // Course 2: React Essentials
  '2': [
    { id: "react-q1", question: "What hook is used to manage state in a functional component?", options: ["useEffect", "useState", "useContext", "useRef"], correctAnswer: 1 },
    { id: "react-q2", question: "What is the virtual DOM in React?", options: ["A copy of the browser DOM kept in memory", "A database for components", "A CSS framework", "A testing tool"], correctAnswer: 0 },
    { id: "react-q3", question: "Which hook runs side effects after render?", options: ["useState", "useMemo", "useEffect", "useCallback"], correctAnswer: 2 },
    { id: "react-q4", question: "What is the purpose of 'key' prop in React lists?", options: ["Styling elements", "Helping React identify changed items", "Binding events", "Setting accessibility"], correctAnswer: 1 },
  ],
  // Course 3: Business Strategy & Leadership
  '3': [
    { id: "biz-q1", question: "What framework analyzes competitive forces in an industry?", options: ["SWOT Analysis", "Porter's Five Forces", "Balanced Scorecard", "Gantt Chart"], correctAnswer: 1 },
    { id: "biz-q2", question: "What does KPI stand for?", options: ["Key Product Initiative", "Key Performance Indicator", "Knowledge Process Insight", "Key Planning Index"], correctAnswer: 1 },
    { id: "biz-q3", question: "Which leadership style involves shared decision-making?", options: ["Autocratic", "Democratic", "Laissez-faire", "Transactional"], correctAnswer: 1 },
    { id: "biz-q4", question: "What is the primary purpose of a SWOT analysis?", options: ["Financial auditing", "Strategic planning", "Employee evaluation", "Product design"], correctAnswer: 1 },
  ],
  // Course 4: UX Design Principles
  '4': [
    { id: "ux-q1", question: "What does UX stand for?", options: ["Universal Exchange", "User Experience", "Unified Extension", "User Execution"], correctAnswer: 1 },
    { id: "ux-q2", question: "Which research method involves watching users interact with a product?", options: ["Surveys", "A/B Testing", "Usability Testing", "Focus Groups"], correctAnswer: 2 },
    { id: "ux-q3", question: "What is a wireframe?", options: ["A high-fidelity mockup", "A low-fidelity layout sketch", "A CSS framework", "A testing tool"], correctAnswer: 1 },
    { id: "ux-q4", question: "Fitts's Law relates to what aspect of UX?", options: ["Color theory", "Target size and distance for interaction", "Typography", "Animation speed"], correctAnswer: 1 },
  ],
  // Course 5: Machine Learning Fundamentals (uses the default ML questions)
  '5': [
    { id: "ml-q1", question: "What is the primary goal of supervised learning?", options: ["To find hidden patterns in data", "To learn from labeled training data", "To reduce data dimensionality", "To generate new data samples"], correctAnswer: 1 },
    { id: "ml-q2", question: "Which algorithm is commonly used for classification tasks?", options: ["Linear Regression", "K-Means Clustering", "Random Forest", "PCA"], correctAnswer: 2 },
    { id: "ml-q3", question: "What does overfitting mean in machine learning?", options: ["Model performs well on both sets", "Model performs poorly on all data", "Model performs well on training but poorly on new data", "Model takes too long to train"], correctAnswer: 2 },
    { id: "ml-q4", question: "Which metric is best for evaluating imbalanced classification?", options: ["Accuracy", "F1 Score", "Mean Squared Error", "R-Squared"], correctAnswer: 1 },
  ],
  // Course 6: Data Science with Python
  '6': [
    { id: "ds-q1", question: "Which Python library is primarily used for data manipulation?", options: ["NumPy", "Pandas", "Matplotlib", "Scikit-learn"], correctAnswer: 1 },
    { id: "ds-q2", question: "What does a DataFrame represent in Pandas?", options: ["A chart", "A 2D labeled data structure", "A machine learning model", "A database connection"], correctAnswer: 1 },
    { id: "ds-q3", question: "Which function reads a CSV file in Pandas?", options: ["pd.load_csv()", "pd.read_csv()", "pd.open_csv()", "pd.import_csv()"], correctAnswer: 1 },
    { id: "ds-q4", question: "What does 'df.describe()' return?", options: ["Column names", "Summary statistics", "First 5 rows", "Data types"], correctAnswer: 1 },
  ],
};

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
