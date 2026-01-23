export interface SkillNode {
  id: string;
  label: string;
  rating: number;
  comments: string;
  children: SkillNode[];
  parentId: string | null;
}

export interface RadarData {
  rootName: string;
  skills: SkillNode[];
}

export const DEFAULT_RADAR_DATA: RadarData = {
  rootName: "Your Name",
  skills: [
    {
      id: "coding",
      label: "Coding",
      rating: 7,
      comments: "",
      parentId: null,
      children: [
        { id: "react", label: "React", rating: 9, comments: "Primary framework", parentId: "coding", children: [] },
        { id: "python", label: "Python", rating: 5, comments: "Learning data science", parentId: "coding", children: [] },
        { id: "rust", label: "Rust", rating: 2, comments: "Just started", parentId: "coding", children: [] },
      ],
    },
    {
      id: "databases",
      label: "Databases",
      rating: 6,
      comments: "",
      parentId: null,
      children: [
        { id: "postgresql", label: "PostgreSQL", rating: 8, comments: "Main database", parentId: "databases", children: [] },
        { id: "mongo", label: "MongoDB", rating: 4, comments: "NoSQL basics", parentId: "databases", children: [] },
      ],
    },
    {
      id: "tools",
      label: "Tools",
      rating: 8,
      comments: "",
      parentId: null,
      children: [
        { id: "git", label: "Git", rating: 9, comments: "Daily use", parentId: "tools", children: [] },
        { id: "docker", label: "Docker", rating: 5, comments: "Containerization", parentId: "tools", children: [] },
        { id: "postman", label: "Postman", rating: 9, comments: "API testing", parentId: "tools", children: [] },
      ],
    },
    {
      id: "methodology",
      label: "Methodology",
      rating: 5,
      comments: "",
      parentId: null,
      children: [
        { id: "agile", label: "Agile", rating: 7, comments: "Scrum experience", parentId: "methodology", children: [] },
        { id: "tdd", label: "TDD", rating: 3, comments: "Need more practice", parentId: "methodology", children: [] },
      ],
    },
  ],
};

export const getRatingColor = (rating: number): "beginner" | "intermediate" | "expert" => {
  if (rating <= 4) return "beginner";
  if (rating <= 7) return "intermediate";
  return "expert";
};

export const getRatingLabel = (rating: number): string => {
  if (rating <= 4) return "Beginner";
  if (rating <= 7) return "Intermediate";
  return "Expert";
};
