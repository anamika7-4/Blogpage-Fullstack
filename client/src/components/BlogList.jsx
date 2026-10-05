import React, { useEffect, useState } from 'react'

const BlogList = () => {


    const [blogs, setBlogs] = useState([])
    const [loading, setLoading] = useState(true);



    const fetchBlogs = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/blogs")
            const data = await res.json()
            setBlogs(data.blogs)
            setLoading(false)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchBlogs()
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-lg font-medium text-gray-600">
                    Loading blogs...
                </div>
            </div>
        );
    }

    return (
        <div className=' p-10 grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
            {
                blogs.map((blog)=>{
                    return(
                        <div className=' border p-5' key={blog._id}>
                            <img className=' aspect-square  object-cover' src={blog.image} alt={blog.title} />
                            <h1 className=' text-xl font-bold'>{blog.title}</h1>
                            <h2 className=' italic text-red-600 '>{blog.category}</h2>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default BlogList