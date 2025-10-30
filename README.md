# Lovable Supply - E-Commerce Clone

A complete clone of the Lovable merchandise e-commerce website (https://merch.lovable.dev/), featuring a modern, responsive design for selling official merchandise to AI-powered developers and builders.

## Features

### Core Functionality
- **Product Catalog**: Display of hoodies, t-shirts, stickers, and accessories
- **Category Filtering**: Filter products by category (All, Hoodies, T-Shirts, Stickers, Accessories)
- **Shopping Cart**: Fully functional cart with add/remove items and quantity management
- **Local Storage**: Cart persists between sessions using localStorage
- **Responsive Design**: Mobile-friendly layout that works on all devices

### Design Elements
- Modern dark theme with gradient accents
- Smooth animations and transitions
- Interactive product cards with hover effects
- Fixed navigation header with blur effect
- Animated hero section with gradient background
- Lovable badge (dismissible)

### Interactive Features
- Add to cart with notification system
- Increase/decrease item quantities
- Remove items from cart
- Real-time cart total calculation
- Smooth scrolling navigation
- Category filtering

## File Structure

```
LovClone/
├── index.html          # Main HTML structure
├── styles.css          # All styling and responsive design
├── script.js           # JavaScript functionality
└── README.md          # This file
```

## Setup and Usage

1. **Open the website**: Simply open `index.html` in any modern web browser
2. **Browse products**: Scroll down to view all available products
3. **Filter by category**: Click category buttons to filter products
4. **Add to cart**: Click "Add to Cart" on any product
5. **View cart**: Click the cart icon in the header
6. **Manage cart**: Adjust quantities or remove items
7. **Checkout**: Click "Proceed to Checkout" (notification feature)

## Technologies Used

- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with CSS Grid, Flexbox, and animations
- **JavaScript (Vanilla)**: No frameworks or libraries required
- **Google Fonts**: Inter font family
- **Local Storage API**: For persistent cart data

## Color Scheme

- Primary Color: `#6366f1` (Indigo)
- Secondary Color: `#8b5cf6` (Purple)
- Background: `#0f0f0f` (Dark)
- Surface: `#1a1a1a` (Dark Gray)
- Text Primary: `#ffffff` (White)
- Text Secondary: `#a3a3a3` (Light Gray)

## Products Included

### Hoodies ($59.99 - $64.99)
- AI Builder Hoodie
- Code Generator Hoodie
- Build Fast Hoodie

### T-Shirts ($27.99 - $31.99)
- Chat with AI Tee
- AI Developer Tee
- AI Powered Tee

### Stickers ($4.99 - $9.99)
- Lovable Sticker Pack
- Gradient Logo Sticker
- Keyboard Stickers

### Accessories ($16.99 - $24.99)
- Developer Cap
- Coding Mug
- Tech Tote Bag

## Responsive Breakpoints

- **Desktop**: 1200px and above
- **Tablet**: 768px - 1199px
- **Mobile**: Below 768px
- **Small Mobile**: Below 480px

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Customization

### Adding New Products

Edit the `products` array in `script.js`:

```javascript
{
    id: 13,
    name: 'Your Product Name',
    category: 'hoodies', // or 'tees', 'stickers', 'accessories'
    price: 49.99,
    description: 'Product description',
    emoji: '🎨'
}
```

### Changing Colors

Update CSS variables in `styles.css`:

```css
:root {
    --primary-color: #6366f1;
    --secondary-color: #8b5cf6;
    /* ... other colors */
}
```

## Contact Information

- Email: merch@lovable.dev
- Twitter: @lovable_dev
- Website: https://merch.lovable.dev

## License

This is a clone for educational purposes. Original website: https://merch.lovable.dev/

## Credits

Built with inspiration from Lovable Supply
