
export const updateCount = (currentCount: number, action: "add" | "minus"): number => {
  if (action === "add") {
    return currentCount + 1;
  } else if (action === "minus" && currentCount > 1) {
    return currentCount - 1;
  }
  return currentCount;
};

export const addToCart = (foodId: string, foodName: string, quantity: number) => {
  try {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItemIndex = cart.findIndex((item: { id: string }) => item.id === foodId);
    if (existingItemIndex >= 0) {
      cart[existingItemIndex].quantity += quantity;
    } else {
      cart.push({ id: foodId, foodName: foodName, quantity: quantity });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    console.log("Cart updated successfully.");
    alert(`${foodName} added to the cart!`);
  } catch (error) {
    console.error("Error updating cart:", error);
  }
};
