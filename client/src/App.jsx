import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import BlogDetail from './pages/BlogDetail'
import CreateBlog from './pages/CreateBlog'
import EditBlog from './pages/EditBlog'
import Profile from './pages/Profile'
import Account from './pages/Account'
import CategoryPage from './pages/CategoryPage'
import SearchResults from './pages/SearchResults'
import MyBlogs from './pages/MyBlogs'
import NotFound from './pages/NotFound'


const App = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />

      <main style={{ flex: 1 }}>
        <Routes>
          
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/blog/:id' element={<BlogDetail />} />
          <Route path='/category/:category' element={<CategoryPage />} />
          <Route path='/search' element={<SearchResults />} />
          <Route path='/profile/:id' element={<Profile />} />

          
          <Route path='/write' element={<ProtectedRoute><CreateBlog /></ProtectedRoute>} />
          <Route path='/blog/:id/edit' element={<ProtectedRoute><EditBlog /></ProtectedRoute>} />
          <Route path='/account' element={<ProtectedRoute><Account /></ProtectedRoute>} />
          <Route path='/my-blogs' element={<ProtectedRoute><MyBlogs /></ProtectedRoute>} />

          
          <Route path='*' element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}

export default App
