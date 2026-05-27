/**
 * Sample Resume Data Utilities
 * Quick access to test resume data for development and testing
 * 
 * Usage:
 *   import { getSampleData, getAllSamples } from '@/lib/data/sample-resumes';
 *   
 *   const developerData = getSampleData('developer');
 *   const allPersonas = getAllSamples();
 */

import developerData from '@/public/samples/sample-data-parsed.json';
import designerData from '@/public/samples/sample-designer-parsed.json';
import scientistData from '@/public/samples/sample-scientist-parsed.json';

export type PersonaType = 'developer' | 'designer' | 'scientist';

export interface SampleResume {
  persona: PersonaType;
  name: string;
  title: string;
  theme: string;
  data: any;
}

const samples: Record<PersonaType, any> = {
  developer: developerData,
  designer: designerData,
  scientist: scientistData,
};

/**
 * Get sample resume data for a specific persona
 * @param persona - 'developer', 'designer', or 'scientist'
 * @returns Portfolio data as JSON object
 */
export function getSampleData(persona: PersonaType) {
  return samples[persona] || samples.developer;
}

/**
 * Get all available sample resumes
 * @returns Array of all sample personas with metadata
 */
export function getAllSamples(): SampleResume[] {
  return [
    {
      persona: 'developer',
      name: developerData.name,
      title: developerData.title,
      theme: developerData.theme,
      data: developerData,
    },
    {
      persona: 'designer',
      name: designerData.name,
      title: designerData.title,
      theme: designerData.theme,
      data: designerData,
    },
    {
      persona: 'scientist',
      name: scientistData.name,
      title: scientistData.title,
      theme: scientistData.theme,
      data: scientistData,
    },
  ];
}

/**
 * Get random sample data
 * @returns Random portfolio data from available samples
 */
export function getRandomSample(): any {
  const personas: PersonaType[] = ['developer', 'designer', 'scientist'];
  const randomPersona = personas[Math.floor(Math.random() * personas.length)];
  return getSampleData(randomPersona);
}

/**
 * Get summary of all available samples
 * @returns Array of sample metadata without full data
 */
export function getSamplesSummary() {
  return [
    {
      persona: 'developer',
      name: developerData.name,
      title: developerData.title,
      email: developerData.email,
      location: developerData.location,
      theme: developerData.theme,
      projects: developerData.projects.length,
      experience: developerData.experience.length,
    },
    {
      persona: 'designer',
      name: designerData.name,
      title: designerData.title,
      email: designerData.email,
      location: designerData.location,
      theme: designerData.theme,
      projects: designerData.projects.length,
      experience: designerData.experience.length,
    },
    {
      persona: 'scientist',
      name: scientistData.name,
      title: scientistData.title,
      email: scientistData.email,
      location: scientistData.location,
      theme: scientistData.theme,
      projects: scientistData.projects.length,
      experience: scientistData.experience.length,
    },
  ];
}

/**
 * Mock function to simulate API resume parsing
 * In development, this returns sample data instead of calling OpenAI
 * @param resumeText - Text content of resume
 * @returns Mocked parsed portfolio data
 */
export function mockParseResume(resumeText: string): any {
  // In a real implementation, this would call the OpenAI API
  // For development, return a random sample
  console.log('🚀 Using mock resume parsing (development mode)');
  console.log(`Received ${resumeText.length} characters of resume text`);
  
  return getRandomSample();
}

/**
 * Get download links for sample resume files
 */
export const SAMPLE_RESUME_LINKS = {
  developer_text: '/samples/resume-developer.txt',
  designer_text: '/samples/resume-designer.txt',
  scientist_text: '/samples/resume-data-scientist.txt',
  developer_json: '/samples/sample-data-parsed.json',
  designer_json: '/samples/sample-designer-parsed.json',
  scientist_json: '/samples/sample-scientist-parsed.json',
};

export default {
  getSampleData,
  getAllSamples,
  getRandomSample,
  getSamplesSummary,
  mockParseResume,
  SAMPLE_RESUME_LINKS,
};
