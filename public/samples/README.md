# Sample Resume Content for Folio-AI

This directory contains sample resume files in different formats that you can use for testing and development of the Folio-AI portfolio generator.

## Files Included

### Text Resumes (for testing PDF/DOCX parsing)
These are realistic resume examples in plain text format that simulate what would be extracted from PDF or DOCX documents.

- **`resume-developer.txt`** - Full Stack Developer (Arjun Mehta)
  - 4 years experience with React, Node.js, TypeScript
  - 3 professional roles + multiple projects
  - Use case: Test developer theme template

- **`resume-designer.txt`** - UI/UX Designer & Frontend Developer (Priya Nair)
  - 5 years experience with Figma, Design Systems, React
  - Design and product development background
  - Use case: Test designer theme template

- **`resume-data-scientist.txt`** - ML Engineer & Data Scientist (Vikram Sharma)
  - 4 years experience with PyTorch, NLP, Computer Vision
  - Research publications and Kaggle achievements
  - Use case: Test scientist/researcher theme template

### Parsed Resume Data (JSON)
These are the expected output format after OpenAI parses the resume text. Use these to test the portfolio generation pipeline without calling the API.

- **`sample-data-parsed.json`** - Developer persona (Arjun Mehta)
  - Complete PortfolioData structure with all fields
  - 4 featured projects with stars and live URLs
  - 3 professional experiences with achievements

- **`sample-designer-parsed.json`** - Designer persona (Priya Nair)
  - Design-focused portfolio with Dribbble links
  - 3 design projects and case studies
  - Design tools and skills properly categorized

- **`sample-scientist-parsed.json`** - ML Engineer persona (Vikram Sharma)
  - Research-focused portfolio with publications
  - 4 ML/AI projects with star ratings
  - Kaggle and research achievements

## How to Use These Files

### For Testing Resume Parsing

1. **Copy resume text to clipboard** from `resume-*.txt` files
2. **Upload in the app UI** to test parsing and extraction
3. **Verify extracted data** matches the corresponding `.json` file

### For Testing Portfolio Generation

1. **Import the JSON directly** in your development code:
   ```typescript
   import sampleData from '@/public/samples/sample-data-parsed.json';
   ```

2. **Use in test cases**:
   ```typescript
   const portfolioData = sampleData;
   renderPortfolio(portfolioData); // Test rendering
   ```

3. **Simulate API response**:
   ```typescript
   const mockApiResponse = {
     success: true,
     data: sampleData
   };
   ```

### For Frontend Testing

- Test template switching (developer → designer → scientist themes)
- Test with different amounts of data (projects, experience, skills)
- Test responsive design with different content lengths
- Test theme color application (accent colors for each persona)

## Data Structure Overview

### Themes/Roles
- `developer` - Software engineers, full-stack developers, backend/frontend specialists
- `designer` - UI/UX, product designers, design system creators
- `scientist` - ML engineers, data scientists, researchers
- `executive` - Engineering managers, CTOs, product leads
- `marketer` - Growth engineers, marketing leads, product marketers

### Required Fields
```json
{
  "name": "string",
  "title": "string",
  "email": "string",
  "location": "string",
  "availability": "Open to work | Freelance available | Employed",
  "summary": "string",
  "skills": ["skill1", "skill2"],
  "theme": "developer | designer | scientist | executive | marketer"
}
```

### Optional but Recommended
- `phone`: Contact number
- `social`: Links to GitHub, LinkedIn, portfolio, etc.
- `experience`: Array of professional roles
- `projects`: Featured projects with descriptions
- `education`: Universities and degrees
- `certifications`: Professional certifications
- `stats`: Years of experience, projects shipped, GitHub stars

## Tips for Testing

✅ **Best Practices**
- Use these samples to test all major features
- Verify theme switching works correctly for each persona
- Check that all sections render properly (no broken links)
- Test responsive design at mobile, tablet, desktop sizes
- Validate that URLs and social links are correct

⚠️ **Common Issues to Test**
- Empty optional fields should not break layout
- Long project names/descriptions should wrap properly
- Special characters in names/descriptions should display correctly
- Multiple experiences/projects should paginate or scroll smoothly
- Theme accent colors should apply consistently

## Customizing for Your Needs

To create additional test data:

1. Copy an existing JSON file: `sample-data-parsed.json`
2. Modify the fields to test edge cases:
   - Extra long descriptions
   - Minimal data (only required fields)
   - Many projects (10+)
   - International characters/names
   - Different theme assignments

3. Copy corresponding resume text file
4. Use for testing new features

## Contact Information

The sample resumes include realistic contact information for demonstration purposes only. These are fictional personas created for testing the Folio-AI platform.
