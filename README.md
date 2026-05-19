# Dynamic Dashboard Builder

A production-quality drag-and-drop dashboard/page builder inspired by Figma, Canva, and Webflow editors.

## Tech Stack
- **Frontend**: React.js, Vite, Tailwind CSS, React Grid Layout, React Quill, Recharts
- **Backend**: Node.js, Express.js, MySQL, Sequelize ORM

## Features
- Drag and drop widgets (Text, Image, Chart)
- Rich text editing
- Image uploading and previews
- Dynamic charts (Bar, Line, Pie)
- Customizable widget properties (Opacity, Background, Typography, etc.)
- Auto-saving layouts with MySQL persistence

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd dynamic-dashboard-builder
   ```

2. **Install dependencies**
   Install all dependencies for root, client, and server:
   ```bash
   npm run install:all
   ```

3. **Database Setup**
   - Make sure MySQL is running locally.
   - Run the provided `schema.sql` file to create the database and tables, and insert initial data.
   - Example command: `mysql -u root -p < schema.sql`

4. **Environment Variables**
   - Navigate to the `server` directory and rename `.env.example` to `.env`.
   - Adjust the database credentials if necessary.

5. **Run the Application**
   From the root directory, run both frontend and backend concurrently:
   ```bash
   npm start
   ```

   - Frontend runs on `http://localhost:5173`
   - Backend runs on `http://localhost:5000`

## Project Structure
- `/client`: React Vite frontend
- `/server`: Express Node backend
- `schema.sql`: MySQL schema setup
