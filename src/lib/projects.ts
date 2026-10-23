// Add only approved, completed customer projects. Empty is intentional.
export type BuildStory = {
  id: string;
  verified: true;
  vehicle: string;
  title: string;
  categories: string[];
  story: string;
  image: string;
  imageAlt: string;
  beforeImage?: string;
  afterImage?: string;
};
export const verifiedProjects: BuildStory[] = [];
