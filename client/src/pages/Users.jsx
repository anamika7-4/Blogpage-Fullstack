import React, { useEffect, useState } from "react";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:5000/users", { credentials: "include" })
            .then((res) => res.json())
            .then((data) => {
                setUsers(data.users);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-lg font-medium text-gray-600">
                    Loading users...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 px-4 py-10 sm:px-6 lg:px-8">

            <div className="mx-auto max-w-6xl">

                
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Users
                    </h1>

                    <p className="mt-2 text-gray-600">
                        Manage and view all registered users.
                    </p>
                </div>

                
                <div className="overflow-hidden rounded-xl bg-white shadow-md">

                    
                    <div className="border-b border-gray-200 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-800">
                                User List
                            </h2>

                            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-600">
                                {users.length} Users
                            </span>
                        </div>
                    </div>

                    {users.length === 0 ? (
                        <div className="px-6 py-16 text-center">
                            <p className="text-gray-500">
                                No users found.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">

                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                                            #
                                        </th>

                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                                            Username
                                        </th>

                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                                            Email
                                        </th>

                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                                            Age
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200">
                                    {users.map((user, index) => (
                                        <tr
                                            key={user._id}
                                            className="transition hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {index + 1}
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">

                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-600">
                                                        {user.username
                                                            ?.charAt(0)
                                                            .toUpperCase()}
                                                    </div>

                                                    <span className="font-medium text-gray-900">
                                                        {user.username}
                                                    </span>

                                                </div>
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {user.email}
                                            </td>

                                            <td className="px-6 py-4">
                                                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                                                    {user.age}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>

                            </table>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default Users;