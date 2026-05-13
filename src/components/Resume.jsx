import React from 'react';
import './Resume.css';

const Resume = () => {
  return (
    <div className="resume-container">
      <div className="resume-header">
        <h1>Abhijith Krishna G</h1>
        <p className="resume-subtitle">Full-Stack Developer | Bioinformatics & Computer Science</p>
        <p className="resume-tagline">Student of Technology and Innovation</p>
      </div>

      <div className="resume-content">
        <section className="resume-section">
          <h2>Summary</h2>
          <p>Student of technology and innovation — blending bioinformatics, computer science, and statistics to create impactful solutions. I enjoy combining analytical thinking with creativity, turning data and code into meaningful solutions. My goal is to build projects that are not only functional and technically strong but also intuitive and impactful.</p>
        </section>

        <section className="resume-section">
          <h2>Education</h2>
          <div className="education-item">
            <h3>Master's in Computer Applications (MCA)</h3>
            <p className="meta">Currently Pursuing</p>
            <p>Expanding knowledge in advanced computing and exploring new frameworks and technologies.</p>
          </div>
          <div className="education-item">
            <h3>Bachelor's in Bioinformatics, Computer Science, and Statistics</h3>
            <p className="meta">Completed</p>
            <p>Multidisciplinary degree combining computational techniques with biological data analysis.</p>
          </div>
        </section>

        <section className="resume-section">
          <h2>Technical Skills</h2>
          <div className="skill-item">
            <h3>Programming Languages</h3>
            <p>JavaScript, Python, C, Lua, R, HTML, CSS</p>
          </div>
          <div className="skill-item">
            <h3>Web Development</h3>
            <p>Full-Stack Development, Frontend & Backend Technologies, Responsive Design, Web APIs</p>
          </div>
          <div className="skill-item">
            <h3>Specialized Areas</h3>
            <p>Bioinformatics, Computational Biology, Data Analysis & Statistics, Algorithm Development</p>
          </div>
          <div className="skill-item">
            <h3>Tools & Technologies</h3>
            <p>Git, Version Control, Data Visualization, Research & Analysis Tools</p>
          </div>
        </section>

        <section className="resume-section">
          <h2>Soft Skills</h2>
          <ul>
            <li><strong>Problem Solving:</strong> Analytical thinking combined with creative approaches to find innovative solutions</li>
            <li><strong>Continuous Learning:</strong> Self-motivated to explore new technologies, frameworks, and coding practices</li>
            <li><strong>Adaptability:</strong> Quick learner who embraces new challenges and technologies</li>
            <li><strong>Attention to Detail:</strong> Focus on building technically strong and intuitive projects</li>
            <li><strong>Self-Driven:</strong> Motivated by curiosity and passion for personal and professional growth</li>
            <li><strong>Experimental Mindset:</strong> Not afraid to test new ideas and learn from failures</li>
          </ul>
        </section>

        <section className="resume-section">
          <h2>What I Do</h2>
          <ul>
            <li><strong>Project Development:</strong> Create apps, tools, and experimental projects that combine coding with creativity</li>
            <li><strong>Bioinformatics Exploration:</strong> Apply computational techniques to biological data, bridging science and technology</li>
            <li><strong>Continuous Learning:</strong> Explore new frameworks, languages, and technologies to grow as a developer</li>
            <li><strong>Personal Builder:</strong> Build tools and applications for personal satisfaction and practical use</li>
            <li><strong>Creative Coding:</strong> Experiment with quirky side projects including games, visualizations, and coding experiments</li>
          </ul>
        </section>

        <section className="resume-section">
          <h2>Interests & Passion</h2>
          <p>Passionate about exploring how technology can solve real-world problems and bring ideas to life in innovative ways. Enjoy diving into research papers, coding challenges, and experimental projects. Driven by curiosity to learn something new every day and turn small ideas into useful solutions.</p>
        </section>
      </div>
    </div>
  );
};

export default Resume;
