import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import RequireAuth from './components/RequireAuth';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Phones from './pages/Phones';
import PhoneDetail from './pages/PhoneDetail';
import Finder from './pages/Finder';
import Compare from './pages/Compare';
import Reviews from './pages/Reviews';
import News from './pages/News';
import Blogs from './pages/Blogs';
import BlogDetail from './pages/BlogDetail';
import CreateBlog from './pages/CreateBlog';
import EditBlog from './pages/EditBlog';
import Community from './pages/Community';
import AISummary from './pages/AISummary';
import AICommunity from './pages/AICommunity';
import Brands from './pages/Brands';
import BrandDetail from './pages/BrandDetail';
import Upcoming from './pages/Upcoming';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-bg">
          <Header />
          <main className="flex-1">
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/phones" element={<Phones />} />
            <Route path="/phones/:slug" element={<PhoneDetail />} />
            <Route path="/finder" element={<Finder />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/news" element={<News />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs/:id" element={<BlogDetail />} />
            <Route element={<RequireAuth />}>
              <Route path="/blogs/create" element={<CreateBlog />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
            <Route path="/blogs/:id/edit" element={<EditBlog />} />
            <Route path="/community" element={<Community />} />
            <Route path="/ai-summary" element={<AISummary />} />
            <Route path="/ai-community" element={<AICommunity />} />
            <Route path="/brands" element={<Brands />} />
            <Route path="/brands/:id" element={<BrandDetail />} />
            <Route path="/upcoming" element={<Upcoming />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
