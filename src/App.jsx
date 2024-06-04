import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

const App = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    rating: 0,
    is_liked: false,
    product_image: null,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/product/');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      [name]: newValue,
    }));
  };

  const handleImageChange = (e) => {
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      product_image: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', newProduct.name);
      formData.append('price', newProduct.price);
      formData.append('rating', newProduct.rating);
      formData.append('is_liked', newProduct.is_liked);
      formData.append('product_image', newProduct.product_image);

      const response = await axios.post('http://127.0.0.1:8000/api/product/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setProducts([...products, response.data]);
      setNewProduct({
        name: '',
        price: '',
        rating: 0,
        is_liked: false,
        product_image: null,
      });
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/product/${id}/`);
      setProducts(products.filter((product) => product.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div>
      <h1>Product List</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <h2>{product.name}</h2>
            <p>${product.price}</p>
            {product.product_image && (
              <img
                src={`http://127.0.0.1:8000${product.product_image}`}
                alt={product.name}
                style={{ width: '100px', height: '100px' }}
              />
            )}
            <button onClick={() => handleDelete(product.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <h2>Add a New Product</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" name="name" value={newProduct.name} onChange={handleChange} />
        </label>
        <label>
          Price:
          <input type="text" name="price" value={newProduct.price} onChange={handleChange} />
        </label>
        <label>
          Rating:
          <input
            type="number"
            name="rating"
            value={newProduct.rating}
            onChange={handleChange}
          />
        </label>
        <label>
          Is Liked:
          <input
            type="checkbox"
            name="is_liked"
            checked={newProduct.is_liked}
            onChange={handleChange}
          />
        </label>
        <label>
          Product Image:
          <input
            type="file"
            name="product_image"
            onChange={handleImageChange}
          />
        </label>
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default App;
