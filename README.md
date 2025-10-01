# Petify 🐾

<img src="public/images/petify-logo-light.svg" alt="Petify logo" width="300"/>

A playful, social media app for pets — built with **Node.js, Express, EJS, Vanilla JavaScript, and CSS** for my Noroff JavaScript 2 course assignment.  
The app allows users to register, log in, create posts, edit their profile, follow other users, and interact with posts through likes, comments, and shares.  


## Table of Contents  
1. [Project Overview](#project-overview)
2. [User Stories](#user-stories)
3. [Features](#features)
4. [Extra Features](#extra-features)
5. [Style Guide](#style-guide)
6. [Tech Stack](#tech-stack)
7. [Installation](#installation)


## Project Overview  
Petify is a social media platform designed around pets and their owners.  

- **Public users:** Can register for an account for free and log in.
- **Registered users:** Can create posts, like, comment, share, follow/unfollow, and manage their profiles.  

I adapted Noroff’s “social media app with CRUD” assignment into a themed community site, focusing on both functionality and **UI/UX design** to feel like a polished real-world product.  


## User Stories 
| Page               | Endpoint                               | Role         | Goal |
|--------------------|----------------------------------------|--------------|------|
| Register           | POST /auth/register                    | Visitor      | Create a new user account. |
| Login              | POST /auth/login                       | Visitor      | Login with email + password. |
| Feed (/feed)       | GET /social/posts                      | User         | View all posts from followed users. |
| Individual Post    | GET /social/posts/:id                  | User         | View details of a single post. |
| Create Post        | POST /social/posts                     | User         | Publish a new post (with image). |
| Edit/Delete Post   | PUT & DELETE /social/posts/:id         | User         | Modify or delete my own posts. |
| User Profile       | GET /social/profiles/:username         | User         | View profile details + posts. |
| Other Profile      | GET /social/profiles/:username         | User         | View posts from another user. |
| Follow/Unfollow    | PUT /social/profiles/:username/follow  | User         | Follow or unfollow another user. |
| Search Posts       | GET /social/posts?q=keyword            | User         | Search through posts. |
| My Profile         | GET /social/profiles/me                | User         | Manage my own profile & posts. |


## Features  
### Core Features  
- Register and log in  
- View & edit profile  
- Create, edit, delete posts  
- Like posts  
- Comment on posts (and delete own comments)  
- Share posts  
- Follow/unfollow users  
- Search for posts  

### Extra Features  
- **Cloudinary integration** → upload images from device instead of pasting URLs  
- **Custom placeholders** → shown if images fail to load  
- View other users’ profiles from avatars in comments (like Instagram)  
- Fully **responsive design** with desktop & mobile navbars  
- Discover page → browse all public posts  
- Error & success messages across the app (not just alerts)  
- Hover effects for desktop interactions  
- Thoughtful UI/UX to make the app intuitive  


## Style Guide  
**Colors:**  
- <span style="color:#e5e1f2; font-weight:bold;">Primary Light</span>: ![#e5e1f2](https://placehold.co/15x15/e5e1f2/e5e1f2.png) `#e5e1f2`  
- <span style="color:#5f5aa5; font-weight:bold;">Primary Dark</span>: ![#5f5aa5](https://placehold.co/15x15/5f5aa5/5f5aa5.png) `#5f5aa5`  
- <span style="color:#baaceb; font-weight:bold;">Secondary Light</span>: ![#baaceb](https://placehold.co/15x15/baaceb/baaceb.png) `#baaceb`  
- <span style="color:#a796e3; font-weight:bold;">Secondary Darker</span>: ![#a796e3](https://placehold.co/15x15/a796e3/a796e3.png) `#a796e3`  
- <span style="color:#6da90f; font-weight:bold;">Accent</span>: ![#6da90f](https://placehold.co/15x15/6da90f/6da90f.png) `#6da90f`  
- <span style="color:#e67aae; font-weight:bold;">Warning</span>: ![#e67aae](https://placehold.co/15x15/e67aae/e67aae.png) `#e67aae`  

**Fonts:**  
- Body & headings: Encode Sans (google fonts)

**Icons:**  
- [Ionicons](https://ionic.io/ionicons) used throughout the app  

## Tech Stack  
- **Backend:** Node.js, Express  
- **Templating:** EJS (components for head, navbar, footer, etc.)  
- **Frontend:** Vanilla JavaScript (ES6 modules), CSS  
- **Icons:** Ionicons  
- **Image Hosting:** Cloudinary  
- **API:** Noroff Social API  


## Installation  
To get a local copy of this project up and running:  

1. Clone the repo:  
   ```bash
   git clone https://github.com/your-username/petify.git
   cd petify

2. Install dependencies:
   ```bash
   npm install

3. Start the development server:
   ```bash
   npm run dev

4. Open the app in your browser:
   ```bash
   http://localhost:3000

Note: You need **Node.js** installed on your machine to run the project.
