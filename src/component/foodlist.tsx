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
import { Plus } from "lucide-react";


import { updateCount, addToCart } from "../app/utils/addCart";

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

  // Refactor add and minus logic to use utility functions
  const add = () => setCount(updateCount(count, "add"));
  const minus = () => setCount(updateCount(count, "minus"));

  const handleAddToCart = (foodId: string, foodName: string) => {
    addToCart(foodId, foodName, count);
    setCount(1); // Reset count after adding to cart
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
              <Button onClick={() => seeAll(category)}>See all</Button>
            </h2>
            <div className="flex justify-between gap-4 py-[30px]">
              {foods
                .filter((food) => food.category === category)
                .slice(0, 5)
                .map((food) => (
                  <Dialog key={food._id} open={selectedFood?._id === food._id} onOpenChange={(open) => !open && setSelectedFood(null)}>
                    <DialogTrigger
                      className="p-4 border rounded-lg shadow-md cursor-pointer hover:bg-gray-100"
                      onClick={() => setSelectedFood(food)}
                    >
                      <div className="bg-black w-[200px] h-[150px]"></div>
                      <h3 className="text-lg font-medium">{food.foodName}</h3>
                      <p className="text-gray-600">${food.price.toFixed(2)}</p>
                    </DialogTrigger>

                    {selectedFood?._id === food._id && (
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{selectedFood.foodName}</DialogTitle>
                          <DialogDescription>{selectedFood.ingredients}</DialogDescription>
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
                                handleAddToCart(selectedFood._id, selectedFood.foodName);
                                setSelectedFood(null); // Close dialog after adding to cart
                              } else {
                                console.error("No food selected");
                              }
                            }}
                          >
                            Add to Cart
                          </Button>
                        </DialogHeader>
                      </DialogContent>
                    )}
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
