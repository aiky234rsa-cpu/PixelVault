import { BrowserRouter, Routes, Route } from "react-router-dom"

import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import Account from "./pages/Account.jsx";
import Catalog from "./pages/Catalog.jsx";
import Products from "./pages/Products.jsx";
import Product from "./pages/Product.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import Cart from "./pages/Cart.jsx";
import CreatorPage from "./pages/CreatorPage.jsx";
import Create from "./pages/Create.jsx";
import ProductCreate from "./pages/ProductCreate.jsx";
import ProductEdit from "./pages/ProductEdit.jsx";

import { AuthProvider } from "./AuthContext.jsx";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/account" element={<Account />}/>
          <Route path="/catalog" element={<Catalog/>}/>
          <Route path="/catalog/:slug" element={<Products/>}/>
          <Route path="/product/:id" element={<Product/>}/>
          <Route path="/wishlist" element={<Wishlist/>}/>
          <Route path="/cart" element={<Cart/>}/>
          <Route path="/become-a-creator" element={<CreatorPage/>}/>
          <Route path="/create" element={<Create/>}/>
          <Route path="/create/new" element={<ProductCreate/>}/>
          <Route path="/create/edit" element={<ProductEdit/>}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
