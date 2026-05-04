import { Link } from "react-router-dom";

export default function Hero() {
 return (
  <div className="bg-gradient-to-r from-blue-600 to-blue-900 text-white py-24 px-10 text-center">
   <h1 className="text-5xl font-bold mb-6">
    AI Powered Recruitment Pipeline
   </h1>
   <p className="text-lg mb-8">
    Smart CV parsing, automated screening & interview scheduling.
   </p>
   <div className="space-x-4">
    <Link to="/upload-resume">
     <button className="bg-orange-500 px-6 py-3 rounded-lg hover:bg-orange-600 transition cursor-pointer">
      Upload Resume
     </button>
    </Link>
    <Link to="/jobs">
     <button className="bg-white text-blue-700 px-6 py-3 rounded-lg hover:bg-gray-100 transition cursor-pointer">
      Browse Jobs
     </button>
    </Link>
   </div>
  </div>
 );
}
