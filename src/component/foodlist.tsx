"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Skeleton from "../component/skeleton";
import { Minus } from "lucide-react";
import { Plus } from 'lucide-react';

interface Food {
  _id: string;
  foodName: string;
  price: number;
  ingredients: string;
  category: string;
  imageUrl: string;
  rate?: number;
}

const FoodList = () => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [count, setCount] = useState(1);
  const [open, setOpen] = useState(false); // State to manage dialog open/close

  useEffect(() => {
    setLoading(true);
    const fetchFood = async () => {
      try {
        const { data } = await axios.get("http://localhost:3030/food/all");
        setFoods(data);
      } catch (error) {
        console.error("Error fetching food data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFood();
  }, []);

  const seeAll = (id: string) => {
    router.push(`/category/${id}`);
  };

  const add = () => setCount(count + 1);
  const minus = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };
  const addToCart = async (foodId: string, foodName: string, quantity: number) => {
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
      setOpen(false);
      setCount(1);
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  return (
    <div className="p-6 gap-[100px] flex flex-col">
      {loading ? (
        <Skeleton />
      ) : (
        Array.from(new Set(foods.map((food) => food.category))).map((category) => (
          <div key={category} className="mb-6">
            <h2 className="text-2xl font-bold flex justify-between">
              {category}
              <Button onClick={() => seeAll(category)}>see all</Button>
            </h2>
            <div className="flex justify-between gap-4 py-[30px]">
              {foods
                .filter((food) => food.category === category)
                .slice(0, 5)
                .map((food) => (
                  <Dialog key={food._id} open={open} onOpenChange={setOpen}> 
                    <DialogTrigger
                      className="p-4 border rounded-lg shadow-md cursor-pointer hover:bg-gray-100"
                      onClick={() => {
                        setSelectedFood(food);
                        setOpen(true); 
                      }}
                    >
                      <div className="bg-black w-[200px] h-[150px]"></div>
                      <h3 className="text-lg font-medium">{food.foodName}</h3>
                      <p className="text-gray-600">${food.price.toFixed(2)}</p>
                    </DialogTrigger>

                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{selectedFood?.foodName}</DialogTitle>
                        <DialogDescription>{selectedFood?.ingredients}</DialogDescription>
                        <div className="flex justify-between">
                          <p className="font-bold text-green-600">
                            ${((selectedFood?.price ?? 0) * count).toFixed(2)}
                          </p>
                          <div className="flex gap-[20px]">
                            <Minus onClick={minus} className="hover:text-red-500" />
                            {count}
                            <Plus onClick={add} className="hover:text-red-500" />
                          </div>
                        </div>

                        <Button
                          className="mt-4 bg-red-500 hover:bg-red-600"
                          onClick={() => {
                            if (selectedFood) {
                              addToCart(selectedFood._id, selectedFood.foodName, count);
                           
                              
                            } else {
                              console.error("No food selected");
                            }
                          }}
                        >
                          Add to Cart
                        </Button>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default FoodList;
