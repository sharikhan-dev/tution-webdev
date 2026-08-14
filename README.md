<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Apex Coaching Academy - Web Application & Backend API

Full-featured Physical Classroom & Coaching Management platform with Public Marketing Website, Student LMS Portal, Admin CRM Portal, Enquiry Chat Room, and Express Backend REST API with Firebase Firestore integration.

## Features & Views

- **Public Marketing Website**: Courses, Batches, Faculty Profiles, Results & Achievements, Testimonials, Notices, Classroom Gallery, Admission Enquiry Modal.
- **Student LMS Portal**: Dashboard, Courses, Study Materials (Google Drive & Firebase), Online Tests & Results, Attendance, Fee Payments, Notices.
- **Admin CRM Portal**: Complete Management of Enquiries, Students, Teachers, Courses, Batches, Attendance, Fees, Study Materials, Tests, Notices & Website Settings.
- **Enquiry Chat Room**: Real-time 2-way communication channel between applicants and institute staff.
- **Backend Connection & Data Explorer**: Express REST API Server running on port 5000 (`server.js`), auto-sync engine, Firebase Firestore integration, and JSON database export.

## Run Locally

**Prerequisites:** Node.js (v18+)

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the Express Backend API Server (Port 5000):
   ```bash
   npm run server
   ```

3. In a separate terminal, start the Vite Frontend Dev Server (Port 3000):
   ```bash
   npm run dev
   ```

4. Open `http://localhost:3000` in your browser. Click **"Connect Backend"** in the top bar to inspect server health, sync data, seed Firebase, or view total entity counts.

