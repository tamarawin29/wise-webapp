/*
 * Front‑end script for the Wise full stack webapp.
 *
 * After the DOM has loaded, this script fetches summary data from
 * the /api/data endpoint on the server. It then dynamically builds
 * sections for each part of the MVP outline and injects them into
 * the page's <main> element. This approach demonstrates how the
 * front‑end can consume data from a back‑end service to render
 * content without hardcoding it in the HTML.
 */

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('/api/data');
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }
    const data = await response.json();
    const content = document.getElementById('content');

    // Helper to create a section with a heading and either a paragraph or list
    function createSection(headingText, body) {
      const section = document.createElement('section');
      const heading = document.createElement('h2');
      heading.textContent = headingText;
      section.appendChild(heading);
      if (Array.isArray(body)) {
        const ul = document.createElement('ul');
        body.forEach(item => {
          const li = document.createElement('li');
          li.textContent = item;
          ul.appendChild(li);
        });
        section.appendChild(ul);
      } else {
        const p = document.createElement('p');
        p.textContent = body;
        section.appendChild(p);
      }
      return section;
    }

    // Construct and append sections in the desired order
    content.appendChild(createSection('1. Problem', data.problem));
    content.appendChild(createSection('2. Solution', data.solution));
    content.appendChild(createSection('3. Core Features (MVP)', data.coreFeatures));
    content.appendChild(createSection('4. Target Users', data.targetUsers));
    content.appendChild(createSection('5. Value Proposition', data.valueProposition));
    content.appendChild(createSection('6. Success Metrics', data.successMetrics));
    content.appendChild(createSection('7. Tech Stack', data.techStack));
    content.appendChild(createSection('8. Monetization', data.monetization));
  } catch (error) {
    console.error(error);
    const content = document.getElementById('content');
    content.textContent = 'An error occurred while loading the page.';
  }
});
