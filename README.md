 BlogSpace — Full Stack Blog Platform
A blog publishing platform built using the MERN Stack.

 Tech Stack
MongoDB,Express.js,React.js,Node.js,Vite,JWT,bcryptjs

 Prerequisites
- Node.js installed
- MongoDB Atlas account
- Git installed

 1. Clone the Repository
bash
git clone https://github.com/yourusername/blogspace.git
cd blogspace

2. Setup Backend
bash
cd backend
npm install


Create a `.env` file inside the `backend` folder and add:
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key
PORT=5000

Run the backend:
bash
npm run dev
Backend runs on `http://localhost:5000`

3. Setup Frontend
Open a new terminal and run:
bash
cd frontend
npm install
npm run dev
Frontend runs on `http://localhost:5173`

4. Open in Browser
http://localhost:5173

---

  Note
- Never share your `.env` file
- Make sure MongoDB Atlas cluster is running before starting the backend

