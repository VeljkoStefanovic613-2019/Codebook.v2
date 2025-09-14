import { useEffect, useState, useCallback } from "react";
import { useTitle } from "../../hooks/useTitle";
import { createProduct, deleteProduct, updateProduct } from "../../services/productService";
import { 
    adminGetAllOrders, 
    adminGetAllUsers, 
    adminDeleteUser, 
    adminGetAllProducts
} from "../../services/adminService";
import { register } from "../../services/authService";

export const AdminPage = () => {
    useTitle("Admin - Manage Courses");

    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [activeTab, setActiveTab] = useState("courses");
    const [newUser, setNewUser] = useState({ name: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [editingProduct, setEditingProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ productId: "", author: "", comment: "", stars: 5 });

    const [formData, setFormData] = useState({
        name: "",
        overview: "",
        long_description: "",
        price: "",
        poster: "",
        imageFile: null,
        imagePreview: "",
        best_seller: false,
        in_stock: true,
        size: "",
        rating: 5,
    });

    // ---- Loaders ----
    const loadProducts = useCallback(async () => {
        try {
            setLoading(true);
            const list = await adminGetAllProducts();
            setProducts(list);
            return list;
        } catch (err) {
            setError("Failed to load products");
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    const loadOrders = useCallback(async () => {
        try {
            const list = await adminGetAllOrders();
            setOrders(list);
        } catch {
            /* ignore */
        }
    }, []);

    const loadUsers = useCallback(async () => {
        try {
            const list = await adminGetAllUsers();
            setUsers(list);
        } catch {
            /* ignore */
        }
    }, []);

    const loadReviews = useCallback(async () => {
        try {
            const productsList = await loadProducts();
            const allReviews = [];

            productsList.forEach(product => {
                if (product.reviews?.length > 0) {
                    product.reviews.forEach(review => {
                        allReviews.push({
                            ...review,
                            productId: product.id,
                            productName: product.name,
                        });
                    });
                }
            });

            setReviews(allReviews);
        } catch {
            setError("Failed to load reviews");
        }
    }, [loadProducts]);

    // ---- Effects ----
    useEffect(() => {
        loadProducts();
        loadOrders();
        loadUsers();
    }, [loadProducts, loadOrders, loadUsers]);

    useEffect(() => {
        if (activeTab === "reviews") {
            loadReviews();
        }
    }, [activeTab, loadReviews]);

    // ---- Handlers ----
    function handleChange(event) {
        const { name, value, type, checked } = event.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    }

    function handleFileChange(event) {
        const file = event.target.files?.[0];
        if (!file) {
            setFormData(prev => ({ ...prev, imageFile: null, imagePreview: "" }));
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            setFormData(prev => ({ ...prev, imageFile: file, imagePreview: reader.result }));
        };
        reader.readAsDataURL(file);
    }

    function resetForm() {
        setFormData({
            name: "",
            overview: "",
            long_description: "",
            price: "",
            poster: "",
            imageFile: null,
            imagePreview: "",
            best_seller: false,
            in_stock: true,
            size: "",
            rating: 5,
        });
        setEditingProduct(null);
    }

    function startEditProduct(product) {
        setEditingProduct(product);
        setFormData({
            name: product.name || "",
            overview: product.overview || "",
            long_description: product.long_description || "",
            price: product.price || "",
            poster: product.poster || "",
            imageFile: null,
            imagePreview: product.poster || "",
            best_seller: product.best_seller || false,
            in_stock: product.in_stock ?? true,
            size: product.size || "",
            rating: product.rating || 5,
        });
    }

    async function handleAdd(event) {
        event.preventDefault();
        setError("");
        try {
            const baseProduct = {
                name: formData.name,
                overview: formData.overview,
                long_description: formData.long_description || formData.overview,
                price: Number(formData.price),
                poster: formData.imagePreview || formData.poster,
                image_local: formData.imagePreview || "",
                rating: Number(formData.rating),
                in_stock: formData.in_stock,
                size: Number(formData.size),
                best_seller: formData.best_seller,
                reviews: editingProduct ? editingProduct.reviews || [] : [],
            };

            if (editingProduct) {
                const updated = await updateProduct(editingProduct.id, baseProduct);
                setProducts(prev =>
                    prev.map(p => (p.id === editingProduct.id ? updated : p))
                );
            } else {
                const created = await createProduct(baseProduct);
                setProducts(prev => [...prev, created]);
            }

            resetForm();
        } catch (err) {
            setError(
                `Failed to ${editingProduct ? "update" : "create"} product${
                    err?.status ? ` (${err.status})` : ""
                }`
            );
        }
    }

    async function handleDelete(id) {
        setError("");
        try {
            await deleteProduct(Number(id));
            setProducts(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            setError(`Failed to delete product${err?.status ? ` (${err.status})` : ""}`);
        }
    }

    async function handleAddReview(e) {
        e.preventDefault();
        try {
            const productId = Number(newReview.productId);
            const productToUpdate = products.find(p => p.id === productId);

            if (!productToUpdate) {
                setError("Product not found");
                return;
            }

            const newReviewObj = {
                id: Date.now(),
                userId: 1,
                userName: newReview.author || "Anonymous",
                rating: Number(newReview.stars),
                comment: newReview.comment,
                date: new Date().toISOString(),
            };

            const updatedProduct = {
                ...productToUpdate,
                reviews: [...(productToUpdate.reviews || []), newReviewObj],
            };

            await updateProduct(productId, updatedProduct);

            setProducts(prev =>
                prev.map(p => (p.id === productId ? updatedProduct : p))
            );

            setNewReview({ productId: "", author: "", comment: "", stars: 5 });

            if (activeTab === "reviews") loadReviews();
            if (editingProduct?.id === productId) setEditingProduct(updatedProduct);
        } catch (err) {
            setError(`Failed to add review${err?.status ? ` (${err.status})` : ""}`);
        }
    }

    async function handleDeleteReview(reviewId, productId) {
        try {
            const productToUpdate = products.find(p => p.id === productId);
            if (!productToUpdate) return;

            const updatedProduct = {
                ...productToUpdate,
                reviews: productToUpdate.reviews.filter(r => r.id !== reviewId),
            };

            await updateProduct(productId, updatedProduct);

            setProducts(prev =>
                prev.map(p => (p.id === productId ? updatedProduct : p))
            );

            if (activeTab === "reviews") loadReviews();
            if (editingProduct?.id === productId) setEditingProduct(updatedProduct);
        } catch {
            setError("Failed to delete review");
        }
    }

    return (
        <main className="max-w-5xl mx-auto px-4 py-6">
            <h1 className="text-2xl font-semibold mb-4 dark:text-white">Admin Panel</h1>
            <div className="mb-6 flex gap-2">
                <button onClick={() => setActiveTab("courses")} className={`px-3 py-2 rounded ${activeTab==='courses' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-white'}`}>Courses</button>
                <button onClick={() => setActiveTab("analytics")} className={`px-3 py-2 rounded ${activeTab==='analytics' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-white'}`}>Analytics</button>
                <button onClick={() => setActiveTab("users")} className={`px-3 py-2 rounded ${activeTab==='users' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-white'}`}>Users</button>
                <button onClick={() => setActiveTab("reviews")} className={`px-3 py-2 rounded ${activeTab==='reviews' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-white'}`}>Reviews</button>
            </div>
            {error && <div className="mb-4 text-red-600">{error}</div>}

            {activeTab === 'courses' && (
            <section className="mb-8 bg-white dark:bg-gray-800 p-4 rounded shadow">
                <h2 className="text-xl font-medium mb-3 dark:text-white">
                    {editingProduct ? `Edit Course: ${editingProduct.name}` : 'Add Course'}
                </h2>
                <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="border p-2 rounded dark:bg-gray-700 dark:text-white" required />
                    <input name="price" value={formData.price} onChange={handleChange} placeholder="Price" type="number" min="0" step="0.01" className="border p-2 rounded dark:bg-gray-700 dark:text-white" required />
                    <input name="poster" value={formData.poster} onChange={handleChange} placeholder="Poster URL" className="border p-2 rounded dark:bg-gray-700 dark:text-white" />
                    <input name="overview" value={formData.overview} onChange={handleChange} placeholder="Short overview" className="border p-2 rounded dark:bg-gray-700 dark:text-white" required />
                    <textarea name="long_description" value={formData.long_description} onChange={handleChange} placeholder="Long description" className="border p-2 rounded dark:bg-gray-700 dark:text-white md:col-span-2" rows="3" />
                    <input name="size" value={formData.size} onChange={handleChange} placeholder="Size (MB)" type="number" min="1" className="border p-2 rounded dark:bg-gray-700 dark:text-white" required />
                    <input name="rating" value={formData.rating} onChange={handleChange} placeholder="Rating (1-5)" type="number" min="1" max="5" className="border p-2 rounded dark:bg-gray-700 dark:text-white" />
                    <div className="flex items-center gap-2">
                        <input name="best_seller" type="checkbox" checked={formData.best_seller} onChange={handleChange} className="border p-2 rounded" />
                        <label className="dark:text-white">Best Seller</label>
                    </div>
                    <div className="flex items-center gap-2">
                        <input name="in_stock" type="checkbox" checked={formData.in_stock} onChange={handleChange} className="border p-2 rounded" />
                        <label className="dark:text-white">In Stock</label>
                    </div>
                    <input name="image" type="file" accept="image/*" onChange={handleFileChange} className="border p-2 rounded dark:bg-gray-700 dark:text-white md:col-span-2" />
                    {formData.imagePreview && (
                        <div className="md:col-span-2">
                            <img src={formData.imagePreview} alt="preview" className="h-24 object-cover rounded" />
                        </div>
                    )}
                    <div className="md:col-span-2 flex gap-2">
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                            {editingProduct ? 'Update Course' : 'Add Course'}
                        </button>
                        {editingProduct && (
                            <button type="button" onClick={resetForm} className="bg-gray-600 text-white px-4 py-2 rounded">
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </section>
            )}

            {activeTab === 'courses' && (
            <section className="bg-white dark:bg-gray-800 p-4 rounded shadow">
                <h2 className="text-xl font-medium mb-3 dark:text-white">Courses</h2>
                {loading ? (
                    <div className="dark:text-white">Loading...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left">
                            <thead>
                                <tr className="border-b dark:text-white">
                                    <th className="py-2 pr-4">ID</th>
                                    <th className="py-2 pr-4">Name</th>
                                    <th className="py-2 pr-4">Price</th>
                                    <th className="py-2 pr-4">Rating</th>
                                    <th className="py-2 pr-4">Best Seller</th>
                                    <th className="py-2 pr-4">In Stock</th>
                                    <th className="py-2 pr-4">Reviews</th>
                                    <th className="py-2 pr-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(product => (
                                    <tr key={product.id} className="border-b dark:text-white">
                                        <td className="py-2 pr-4">{product.id}</td>
                                        <td className="py-2 pr-4">{product.name}</td>
                                        <td className="py-2 pr-4">${product.price}</td>
                                        <td className="py-2 pr-4">⭐ {product.rating}</td>
                                        <td className="py-2 pr-4">{product.best_seller ? "Yes" : "No"}</td>
                                        <td className="py-2 pr-4">{product.in_stock ? "Yes" : "No"}</td>
                                        <td className="py-2 pr-4">{product.reviews ? product.reviews.length : 0}</td>
                                        <td className="py-2 pr-4 flex gap-2">
                                            <button onClick={() => startEditProduct(product)} className="text-blue-600">Edit</button>
                                            <button onClick={() => handleDelete(product.id)} className="text-red-600">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
            )}

            {/* Reviews management */}
            {activeTab === 'courses' && editingProduct && editingProduct.reviews && (
            <section className="bg-white dark:bg-gray-800 p-4 rounded shadow mt-6">
                <h2 className="text-xl font-medium mb-3 dark:text-white">
                    Reviews for {editingProduct.name}
                </h2>
                {editingProduct.reviews.length === 0 ? (
                    <p className="dark:text-white">No reviews yet.</p>
                ) : (
                    <ul className="space-y-2">
                        {editingProduct.reviews.map((review, index) => (
                            <li key={index} className="flex justify-between items-center border-b pb-2 dark:text-white">
                                <div>
                                    <p><strong>{review.author || review.userName || "Anonymous"}:</strong> {review.comment}</p>
                                    <p className="text-sm text-gray-500">⭐ {review.rating || review.stars} • {review.date ? new Date(review.date).toLocaleDateString() : "No date"}</p>
                                </div>
                                <button
                                    onClick={async () => {
                                        try {
                                            const updated = {
                                                ...editingProduct,
                                                reviews: editingProduct.reviews.filter((_, i) => i !== index)
                                            };
                                            await updateProduct(editingProduct.id, updated);
                                            setEditingProduct(updated);
                                            await loadProducts();
                                        } catch (err) {
                                            setError("Failed to delete review");
                                        }
                                    }}
                                    className="text-red-600"
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
            )}

            {activeTab === 'analytics' && (
            <section className="bg-white dark:bg-gray-800 p-4 rounded shadow">
                <h2 className="text-xl font-medium mb-3 dark:text-white">Purchase Counts</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left">
                        <thead>
                            <tr className="border-b dark:text-white">
                                <th className="py-2 pr-4">Course</th>
                                <th className="py-2 pr-4">Times Bought</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(orders.reduce((acc, order) => {
                                (order.cartList || []).forEach(item => {
                                    acc[item.name] = (acc[item.name] || 0) + 1;
                                });
                                return acc;
                            }, {})).map(([name, count]) => (
                                <tr key={name} className="border-b dark:text-white">
                                    <td className="py-2 pr-4">{name}</td>
                                    <td className="py-2 pr-4">{count}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
            )}

            {activeTab === 'users' && (
            <section className="bg-white dark:bg-gray-800 p-4 rounded shadow">
                <h2 className="text-xl font-medium mb-3 dark:text-white">Users</h2>
                <form onSubmit={async (e) => { e.preventDefault(); try{ await register(newUser); setNewUser({ name: "", email: "", password: "" }); await loadUsers(); }catch(err){ setError(`Failed to create user${err?.status ? ` (${err.status})` : ""}`); } }} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
                    <input value={newUser.name} onChange={(e)=>setNewUser(prev=>({...prev, name: e.target.value}))} placeholder="Name" className="border p-2 rounded dark:bg-gray-700 dark:text-white" required />
                    <input type="email" value={newUser.email} onChange={(e)=>setNewUser(prev=>({...prev, email: e.target.value}))} placeholder="Email" className="border p-2 rounded dark:bg-gray-700 dark:text-white" required />
                    <input type="password" value={newUser.password} onChange={(e)=>setNewUser(prev=>({...prev, password: e.target.value}))} placeholder="Password" minLength="7" className="border p-2 rounded dark:bg-gray-700 dark:text-white" required />
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add User</button>
                </form>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left">
                        <thead>
                            <tr className="border-b dark:text-white">
                                <th className="py-2 pr-4">ID</th>
                                <th className="py-2 pr-4">Name</th>
                                <th className="py-2 pr-4">Email</th>
                                <th className="py-2 pr-4">Role</th>
                                <th className="py-2 pr-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u.id} className="border-b dark:text-white">
                                    <td className="py-2 pr-4">{u.id}</td>
                                    <td className="py-2 pr-4">{u.name}</td>
                                    <td className="py-2 pr-4">{u.email}</td>
                                    <td className="py-2 pr-4">{u.role || "user"}</td>
                                    <td className="py-2 pr-4">
                                        <button onClick={async () => { await adminDeleteUser(u.id); setUsers(prev => prev.filter(x => x.id !== u.id)); }} className="text-red-600">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
            )}

            {activeTab === 'reviews' && (
            <section className="bg-white dark:bg-gray-800 p-4 rounded shadow">
                <h2 className="text-xl font-medium mb-3 dark:text-white">Manage Reviews</h2>
                
                {/* Add Review Form */}
                <form onSubmit={handleAddReview} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
                    <select value={newReview.productId} onChange={(e)=>setNewReview(prev=>({...prev, productId: e.target.value}))} className="border p-2 rounded dark:bg-gray-700 dark:text-white" required>
                        <option value="">Select Product</option>
                        {products.map(product => (
                            <option key={product.id} value={product.id}>{product.name} (ID: {product.id})</option>
                        ))}
                    </select>
                    <input value={newReview.author} onChange={(e)=>setNewReview(prev=>({...prev, author: e.target.value}))} placeholder="Author" className="border p-2 rounded dark:bg-gray-700 dark:text-white" />
                    <input value={newReview.comment} onChange={(e)=>setNewReview(prev=>({...prev, comment: e.target.value}))} placeholder="Comment" className="border p-2 rounded dark:bg-gray-700 dark:text-white" required />
                    <select value={newReview.stars} onChange={(e)=>setNewReview(prev=>({...prev, stars: e.target.value}))} className="border p-2 rounded dark:bg-gray-700 dark:text-white">
                        <option value="5">5 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="2">2 Stars</option>
                        <option value="1">1 Star</option>
                    </select>
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded md:col-span-4">Add Review</button>
                </form>

                {/* Review List */}
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left">
                        <thead>
                            <tr className="border-b dark:text-white">
                                <th className="py-2 pr-4">ID</th>
                                <th className="py-2 pr-4">Product</th>
                                <th className="py-2 pr-4">Author</th>
                                <th className="py-2 pr-4">Comment</th>
                                <th className="py-2 pr-4">Stars</th>
                                <th className="py-2 pr-4">Date</th>
                                <th className="py-2 pr-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reviews.length > 0 ? (
                                reviews.map(r => (
                                    <tr key={r.id} className="border-b dark:text-white">
                                        <td className="py-2 pr-4">{r.id}</td>
                                        <td className="py-2 pr-4">{r.productName} (ID: {r.productId})</td>
                                        <td className="py-2 pr-4">{r.author || r.userName || "Anonymous"}</td>
                                        <td className="py-2 pr-4">{r.comment}</td>
                                        <td className="py-2 pr-4">⭐ {r.rating || r.stars}</td>
                                        <td className="py-2 pr-4">{r.date ? new Date(r.date).toLocaleDateString() : "N/A"}</td>
                                        <td className="py-2 pr-4">
                                            <button onClick={() => handleDeleteReview(r.id, r.productId)} className="text-red-600">Delete</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="py-4 text-center dark:text-white">No reviews found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
            )}
            
        </main>
    );
}

export default AdminPage;