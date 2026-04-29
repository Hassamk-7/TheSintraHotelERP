import React, { createContext, useContext, useReducer } from 'react';

// Cart item structure
const createCartItem = (room, checkIn, checkOut, quantity = 1) => {
  const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
  return {
    id: `${room.id}-${checkIn}-${checkOut}`,
    roomId: room.id,
    name: room.name || room.title,
    image: room.image || room.photo,
    price: room.price,
    quantity,
    nights,
    checkIn,
    checkOut,
    roomType: room.roomType || room.category,
    maxOccupancy: room.maxOccupancy || room.capacity || 2,
    taxAmount: room.taxAmount || 0 // Include the actual tax amount from the room
  };
};

// Initial state
const initialState = {
  items: [],
  totalItems: 0,
  subtotal: 0,
  tax: 0,
  total: 0
};

// Action types
const CART_ACTIONS = {
  ADD_TO_CART: 'ADD_TO_CART',
  REMOVE_FROM_CART: 'REMOVE_FROM_CART',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  UPDATE_NIGHTS: 'UPDATE_NIGHTS',
  CLEAR_CART: 'CLEAR_CART',
  LOAD_CART: 'LOAD_CART'
};

// Calculate totals
const calculateTotals = (items) => {
  const subtotal = items.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1) * (item.nights || 1)), 0);
  const tax = items.reduce((sum, item) => sum + ((item.taxAmount || 0) * (item.quantity || 1) * (item.nights || 1)), 0); // Use actual tax amounts from rooms
  const total = subtotal + tax;
  const totalItems = items.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return { subtotal, tax, total, totalItems };
};

// Reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.ADD_TO_CART: {
      const { room, checkIn, checkOut, quantity } = action.payload;
      const newItem = createCartItem(room, checkIn, checkOut, quantity);
      
      // Check if item already exists
      const existingItemIndex = state.items.findIndex(item => item.id === newItem.id);
      
      let updatedItems;
      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        updatedItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        updatedItems = [...state.items, newItem];
      }

      return {
        ...state,
        items: updatedItems,
        ...calculateTotals(updatedItems)
      };
    }

    case CART_ACTIONS.REMOVE_FROM_CART: {
      const updatedItems = state.items.filter(item => item.id !== action.payload.id);
      return {
        ...state,
        items: updatedItems,
        ...calculateTotals(updatedItems)
      };
    }

    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { id, quantity } = action.payload;
      if (quantity < 1) return state;

      const updatedItems = state.items.map(item =>
        item.id === id ? { ...item, quantity } : item
      );

      return {
        ...state,
        items: updatedItems,
        ...calculateTotals(updatedItems)
      };
    }

    case CART_ACTIONS.UPDATE_NIGHTS: {
      const { id, nights } = action.payload;
      if (nights < 1) return state;

      const updatedItems = state.items.map(item =>
        item.id === id ? { ...item, nights } : item
      );

      return {
        ...state,
        items: updatedItems,
        ...calculateTotals(updatedItems)
      };
    }

    case CART_ACTIONS.CLEAR_CART:
      return initialState;

    case CART_ACTIONS.LOAD_CART:
      return {
        ...action.payload,
        ...calculateTotals(action.payload.items)
      };

    default:
      return state;
  }
};

// Context
const CartContext = createContext();

// Provider component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  React.useEffect(() => {
    const savedCart = localStorage.getItem('sintraCart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: CART_ACTIONS.LOAD_CART, payload: parsedCart });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  React.useEffect(() => {
    localStorage.setItem('sintraCart', JSON.stringify(state));
  }, [state]);

  // Actions
  const addToCart = (room, checkIn, checkOut, quantity = 1) => {
    dispatch({
      type: CART_ACTIONS.ADD_TO_CART,
      payload: { room, checkIn, checkOut, quantity }
    });
  };

  const removeFromCart = (id) => {
    dispatch({ type: CART_ACTIONS.REMOVE_FROM_CART, payload: { id } });
  };

  const updateQuantity = (id, quantity) => {
    dispatch({ type: CART_ACTIONS.UPDATE_QUANTITY, payload: { id, quantity } });
  };

  const updateNights = (id, nights) => {
    dispatch({ type: CART_ACTIONS.UPDATE_NIGHTS, payload: { id, nights } });
  };

  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  };

  const isInCart = (roomId, checkIn, checkOut) => {
    const id = `${roomId}-${checkIn}-${checkOut}`;
    return state.items.some(item => item.id === id);
  };

  const getCartItem = (roomId, checkIn, checkOut) => {
    const id = `${roomId}-${checkIn}-${checkOut}`;
    return state.items.find(item => item.id === id);
  };

  const value = {
    ...state,
    addToCart,
    removeFromCart,
    updateQuantity,
    updateNights,
    clearCart,
    isInCart,
    getCartItem
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export { CART_ACTIONS };
