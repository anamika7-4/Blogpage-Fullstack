import React, { useState } from 'react'
import toast, {Toaster} from "react-hot-toast"

const CreateBlogForm = () => {

    const [formValues, setFormValues] = useState({
        title: "",
        content: "",
        author: "",
        category: "",
        image: "",
        tags: "",
        isPublished: ""
    }
    )


    const handleChange = (e) => {
        const { name, value } = e.target
        setFormValues({ ...formValues, [name]: value })
    }


    const handleCreateBlogPost = async (e) => {

        e.preventDefault();
        console.log(formValues);
        try {

            const res = await fetch("http://localhost:5000/api/blogs",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formValues)
                }
            )
            const data = await res.json()

            if (data.success) {
                toast.success("Blog Created!")
            }else{
                toast.error("Blog Creation failed!")
            }
            console.log(data);

        } catch (error) {
            console.log(error);
        }


    }

    return (
        <div className=' flex justify-center items-center h-screen'>
            <Toaster />
            <form onSubmit={handleCreateBlogPost} className=' bg-amber-50 p-10 w-xl flex gap-3  text-center flex-col sm:w-2xl md:w-4xl rounded-xl'>
                <input onChange={handleChange} value={formValues.title} className=' border outline-none px-10 py-3' placeholder='Enter blog title' type="text" name="title" id="" />
                <input onChange={handleChange} value={formValues.content} className=' border outline-none px-10 py-3' placeholder='Enter blog content' type="text" name="content" id="" />
                <input onChange={handleChange} value={formValues.author} className=' border outline-none px-10 py-3' placeholder='Enter blog author' type="text" name="author" id="" />
                <input onChange={handleChange} value={formValues.category} className=' border outline-none px-10 py-3' placeholder='Enter blog category' type="text" name="category" id="" />
                <input onChange={handleChange} value={formValues.image} className=' border outline-none px-10 py-3' placeholder='Enter blog image' type="text" name="image" id="" />
                <input onChange={handleChange} value={formValues.tags} className=' border outline-none px-10 py-3' placeholder='Enter blog tags seperated by commas' type="text" name="tags" id="" />
                <input onChange={handleChange} value={formValues.isPublished} className=' border outline-none px-10 py-3' placeholder='check is publisded' type="text" name="isPublished" id="" />
                <button className=' bg-blue-700 py-3 text-blue-50'>Create Blog</button>
            </form>
        </div>
    )
}

export default CreateBlogForm