import React, { useState, useEffect } from 'react';

// Form presets to facilitate swift user testing
const DEMO_PRESETS = {
  sizeIssue: {
    product_category: "Clothing",
    product_price: 49.99,
    order_quantity: 1,
    discount_applied: 10.0,
    shipping_method: "Standard",
    payment_method: "UPI",
    user_age: 24,
    user_gender: "Male",
    user_location: "California",
    order_value: 44.99,
    review_text: "The jacket looks nice but the size runs extremely small. I can barely zip it up. I need to exchange it for a larger size.",
    rating: 2.0,
    review_count: 340,
    seller_rating: 4.6
  },
  damagedProduct: {
    product_category: "Electronics",
    product_price: 299.99,
    order_quantity: 1,
    discount_applied: 15.0,
    shipping_method: "Express",
    payment_method: "Credit Card",
    user_age: 34,
    user_gender: "Female",
    user_location: "New York",
    order_value: 254.99,
    review_text: "Extremely disappointed. The packaging box was torn open and the device has visible cracks on the screen. Returning it immediately.",
    rating: 1.0,
    review_count: 85,
    seller_rating: 3.8
  },
  noIssue: {
    product_category: "Home",
    product_price: 89.50,
    order_quantity: 2,
    discount_applied: 0.0,
    shipping_method: "Standard",
    payment_method: "Credit Card",
    user_age: 42,
    user_gender: "Female",
    user_location: "Texas",
    order_value: 179.00,
    review_text: "Perfect fit for my living room! The colors match the catalog exactly and assembly took less than ten minutes. Highly recommended.",
    rating: 5.0,
    review_count: 1200,
    seller_rating: 4.9
  }
};

export default function PredictionForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    product_category: 'Electronics',
    product_price: 120.00,
    order_quantity: 1,
    discount_applied: 10.0,
    shipping_method: 'Express',
    payment_method: 'Credit Card',
    user_age: 28,
    user_gender: 'Male',
    user_location: 'New York',
    order_value: 108.00,
    review_text: 'The size is a bit small but overall good quality.',
    rating: 4.0,
    review_count: 150,
    seller_rating: 4.5
  });

  // Auto-calculate order_value when price, quantity or discount changes
  useEffect(() => {
    const price = parseFloat(formData.product_price) || 0;
    const qty = parseInt(formData.order_quantity) || 0;
    const discount = parseFloat(formData.discount_applied) || 0;
    const calculated = price * qty * (1 - discount / 100);
    setFormData(prev => ({
      ...prev,
      order_value: parseFloat(calculated.toFixed(2))
    }));
  }, [formData.product_price, formData.order_quantity, formData.discount_applied]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : parseFloat(value)) : value
    }));
  };

  const handlePresetSelect = (presetKey) => {
    if (DEMO_PRESETS[presetKey]) {
      setFormData({ ...DEMO_PRESETS[presetKey] });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate inputs
    onSubmit(formData);
  };

  return (
    <div className="glass p-6 rounded-3xl border border-gray-800 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-800">
        <div>
          <h2 className="text-lg font-bold text-white tracking-wide">
            Product Predictor Inputs
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Specify order fields to run predictions
          </p>
        </div>
        
        {/* Preset Selector */}
        <div className="flex flex-wrap gap-2">
          <button 
            type="button" 
            onClick={() => handlePresetSelect('sizeIssue')}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-sky-900/30 text-sky-400 hover:bg-sky-900/50 border border-sky-500/20 transition"
          >
            👕 Size Issue Preset
          </button>
          <button 
            type="button" 
            onClick={() => handlePresetSelect('damagedProduct')}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-900/30 text-rose-400 hover:bg-rose-900/50 border border-rose-500/20 transition"
          >
            🔌 Damage Preset
          </button>
          <button 
            type="button" 
            onClick={() => handlePresetSelect('noIssue')}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-900/30 text-emerald-400 hover:bg-emerald-900/50 border border-emerald-500/20 transition"
          >
            🏠 Healthy Preset
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* SECTION 1: Product Details */}
        <div>
          <h3 className="text-xs font-bold text-sky-400 uppercase tracking-widest mb-3">
            1. Product & Transaction Info
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Category</label>
              <select
                name="product_category"
                value={formData.product_category}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl bg-gray-900 border border-gray-800 text-sm text-gray-200 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 transition"
              >
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Home">Home</option>
                <option value="Beauty">Beauty</option>
                <option value="Books">Books</option>
                <option value="Sports">Sports</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Unit Price ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                name="product_price"
                value={formData.product_price}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl bg-gray-900 border border-gray-800 text-sm text-gray-200 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Quantity Ordered</label>
              <input
                type="number"
                min="1"
                required
                name="order_quantity"
                value={formData.order_quantity}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl bg-gray-900 border border-gray-800 text-sm text-gray-200 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Discount Applied (%)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                required
                name="discount_applied"
                value={formData.discount_applied}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl bg-gray-900 border border-gray-800 text-sm text-gray-200 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 transition"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Total Transaction Value ($) <span className="text-gray-500">(Auto-calculated)</span>
              </label>
              <input
                type="number"
                step="0.01"
                name="order_value"
                value={formData.order_value}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl bg-gray-950 border border-gray-800 text-sm text-sky-400 font-mono font-semibold focus:outline-none cursor-not-allowed"
                disabled
              />
            </div>

          </div>
        </div>

        {/* SECTION 2: Customer & Shipping Details */}
        <div>
          <h3 className="text-xs font-bold text-sky-400 uppercase tracking-widest mb-3">
            2. Customer Profile & Logistics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Customer Age</label>
              <input
                type="number"
                min="0"
                max="120"
                required
                name="user_age"
                value={formData.user_age}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl bg-gray-900 border border-gray-800 text-sm text-gray-200 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Gender</label>
              <select
                name="user_gender"
                value={formData.user_gender}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl bg-gray-900 border border-gray-800 text-sm text-gray-200 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 transition"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">User Location (State/City)</label>
              <input
                type="text"
                required
                name="user_location"
                value={formData.user_location}
                onChange={handleChange}
                placeholder="e.g. New York"
                className="w-full px-3.5 py-2 rounded-xl bg-gray-900 border border-gray-800 text-sm text-gray-200 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Shipping Method</label>
              <select
                name="shipping_method"
                value={formData.shipping_method}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl bg-gray-900 border border-gray-800 text-sm text-gray-200 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 transition"
              >
                <option value="Standard">Standard</option>
                <option value="Express">Express</option>
                <option value="Next-Day">Next-Day</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Payment Method</label>
              <select
                name="payment_method"
                value={formData.payment_method}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl bg-gray-900 border border-gray-800 text-sm text-gray-200 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 transition"
              >
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="UPI">UPI</option>
                <option value="COD">COD</option>
              </select>
            </div>

          </div>
        </div>

        {/* SECTION 3: Customer Feedback & Reviews */}
        <div>
          <h3 className="text-xs font-bold text-sky-400 uppercase tracking-widest mb-3">
            3. Review Details & Seller Reputation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Product Rating Given (1-5)</label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="5"
                required
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl bg-gray-900 border border-gray-800 text-sm text-gray-200 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Seller Rating Score (1-5)</label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="5"
                required
                name="seller_rating"
                value={formData.seller_rating}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl bg-gray-900 border border-gray-800 text-sm text-gray-200 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 transition"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Product Total Review Count</label>
              <input
                type="number"
                min="0"
                required
                name="review_count"
                value={formData.review_count}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl bg-gray-900 border border-gray-800 text-sm text-gray-200 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 transition"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Customer Review Text</label>
              <textarea
                name="review_text"
                rows="3"
                required
                value={formData.review_text}
                onChange={handleChange}
                placeholder="Write the customer's text feedback here..."
                className="w-full px-3.5 py-2 rounded-xl bg-gray-900 border border-gray-800 text-sm text-gray-200 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 transition resize-none"
              />
            </div>

          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold text-sm uppercase tracking-wider hover:from-sky-400 hover:to-indigo-500 shadow-lg shadow-sky-500/10 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Calculating Score...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
              </svg>
              Calculate Return Risk
            </>
          )}
        </button>

      </form>
    </div>
  );
}
