# Portfolio Website - Ronan Roberts

A responsive, professional portfolio website designed to showcase software engineering projects, technical skills, and professional experience. The site features a modern dark-themed UI and is built for deployment on GitHub Pages.

## Live Demo

https://ronan-r-r.github.io

## Features

- **Responsive Design:** Fully adaptive layout that works on mobile, tablet, and desktop devices.
- **Modern UI:** Dark mode aesthetic using CSS variables for consistent theming.
- **Project Showcase:** Grid layout to display featured projects with technology tags.
- **Experience Timeline:** Vertical timeline displaying career history and education.
- **Functional Contact Form:** Integrated with FormSubmit.co for serverless email handling via AJAX.
- **Smooth Navigation:** Sticky header with smooth scrolling to section anchors.

## Technologies Used

- **HTML5:** Semantic markup structure.
- **CSS3:** Flexbox, CSS Grid, Media Queries, and CSS Variables.
- **JavaScript:** DOM manipulation, Mobile Menu toggling, and Fetch API for the contact form.
- **Font Awesome:** Iconography.
- **Google Fonts:** Typography (Inter font family).

## Installation and Local Setup

1. Clone the repository:
   git clone https://github.com/Ronan-R-R/Ronan-R-R.github.io.git

2. Navigate to the project directory:
   cd Ronan-R-R.github.io

3. Open the index.html file in your preferred web browser to view the site locally.

## Configuration

### Contact Form
The contact form uses FormSubmit.co to send emails without a backend server.

1. In index.html, the fetch URL is set to: https://formsubmit.co
2. When the first submission occurs, FormSubmit will send an activation email to the address specified.
3. You must click "Activate" in that email for the form to start forwarding messages to your inbox.

### Icons
The site uses Font Awesome CDN. If icons do not load, ensure you have an active internet connection or update the CDN link in the head tag.

## Deployment

This project is designed to be hosted on GitHub Pages.

1. Push the index.html file to your repository (main branch).
2. Go to Repository Settings > Pages.
3. Under "Build and deployment", select "Deploy from a branch".
4. Select "main" as the branch and "/" as the folder.
5. Click Save.

## License

This project is open source and available for personal use and modification.
