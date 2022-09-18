/**
 * Exercise 01: The Retro Movie Store
 * Implement a shopping cart with the next features for the Movie Store that is selling retro dvds:
 * 1. Add a movie to the cart
 * 2. Increment or decrement the quantity of movie copies. If quantity is equal to 0, the movie must be removed from the cart
 * 3. Calculate and show the total cost of your cart. Ex: Total: $150
 * 4. Apply discount rules. You have an array of offers with discounts depending of the combination of movie you have in your cart.
 * You have to apply all discounts in the rules array (discountRules).
 * Ex: If m: [1, 2, 3], it means the discount will be applied to the total when the cart has all that products in only.
 * 
 * You can modify all the code, this component isn't well designed intentionally. You can redesign it as you need.
 */

import { useEffect, useState } from 'react'
import './assets/styles.css'
import { movies, discountRules } from './dataFake';

export default function Exercise01() {

  const [cart, setCart] = useState([])
  const [discount, setDiscount] = useState(0)

  useEffect(() => {
    if(cart.length > 0) validateHaveDescount();
  }, [cart]);


  function addToCart(item) {
    if (cart.find(element => element.id === item.id)) { incrementElementOnCart(item); return; }

    setCart([...cart, { ...item, quantity: 1 }]);

  }

  function removeFromCart(item) {

    const newCartContent = cart.filter(element => element.id !== item.id);
    setCart([...newCartContent]);

  }

  function decrementElementOnCart(item) {

    if ((item.quantity - 1) < 1) {
      removeFromCart(item);
    } else {
      item.quantity = item.quantity - 1;
      setCart(cart.map(element => element.id === item.id ? { ...item } : element));
    }
  }

  function incrementElementOnCart(item) {
    let newItem = cart.find(element => element.id === item.id);
    newItem.quantity = newItem.quantity + 1;
    setCart(cart.map(element => element.id === newItem.id ? { ...newItem } : element));
  }

  const getTotal = () => {
    let totalResult = 0;

    if (cart.length < 1) return totalResult;

    totalResult = cart.map((item) => (item.price * item.quantity)).reduce((total, item) => total + item);

    if (discount) {
      totalResult = totalResult * discount;
    }

    return totalResult;
  };

  function validateHaveDescount() {

    let existDiscount = false;
    let rulesValidCount = 0;
    discountRules.forEach(rule => {
      rule.m.forEach(ruleElementID => {
        if (cart.find(cartElement => cartElement.id === ruleElementID)) {
          rulesValidCount++;
        }
      })
      if (rulesValidCount === rule.m.length) {
        if (!existDiscount) {
          setDiscount(rule.discount);
          existDiscount = true;
          rulesValidCount = 0
        }
      } else {
        rulesValidCount = 0
      }
    })


  }

  return (
    <section className="exercise01">
      <div className="movies__list">
        <ul>
          {movies.map((movie, index) => (
            <li key={`movie-${movie.id}`} className="movies__list-card">
              <ul>
                <li>
                  ID: {movie.id}
                </li>
                <li>
                  Name: {movie.name}
                </li>
                <li>
                  Price: ${movie.price}
                </li>
              </ul>
              <button onClick={() => addToCart(movie)}>
                Add to cart
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="movies__cart">
        <ul>
          {cart.map((moviesOnCart, index) => (
            <li key={`movie-on-cart-${index}`} className="movies__cart-card">
              <ul>
                <li>
                  ID: {moviesOnCart.id}
                </li>
                <li>
                  Name: {moviesOnCart.name}
                </li>
                <li>
                  Price: ${moviesOnCart.price}
                </li>
              </ul>
              <div className="movies__cart-card-quantity">
                <button onClick={() => decrementElementOnCart(moviesOnCart)}>
                  -
                </button>
                <span>
                  {moviesOnCart.quantity}
                </span>
                <button onClick={() => incrementElementOnCart(moviesOnCart)}>
                  +
                </button>
              </div>
            </li>
          ))}
        </ul>
        <div className="movies__cart-total">
          {discount > 0 && <p>Descuento: %{discount * 100}</p>}
          <p>Total: ${getTotal()}</p>
        </div>
      </div>
    </section>
  )
} 