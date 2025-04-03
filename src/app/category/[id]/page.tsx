"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";

interface Food {
  _id: string;
  foodName: string;
  price: number;
  ingredients: string;
  category: string;
  imageUrl: string;
  rate?: number;
}

const Page = () => {
  const [food, setFood] = useState<Food[]>([]);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const param = useParams();
  const id = param.id;

  useEffect(() => {
    if (id) {
      const fetchFood = async () => {
        try {
          const data = await axios.get(`http://localhost:3030/food/all/${id}`);
          setFood(data.data);
        } catch (error) {
          console.error("Error fetching food:", error);
        }
      };
      fetchFood();
    }
  }, [id]);

  return (
    <div className="p-6 gap-[100px] flex flex-col">
      <h2 className="text-2xl font-bold mb-6">Category: {id}</h2>
      <div className="flex justify-between gap-4 py-[30px] flex flex-row w-fit flex-wrap">
        {food.length > 0 ? (
          food.map((foodItem) => (
            <Dialog
              key={foodItem._id}
              open={selectedFood?._id === foodItem._id} 
              onOpenChange={(open) => { 
                if (!open) setSelectedFood(null); 
              }}
            >
              <DialogTrigger
                className="p-4 border rounded-lg shadow-md cursor-pointer hover:bg-gray-100"
                onClick={() => setSelectedFood(foodItem)} 
              >
                <div className="bg-black w-[200px] h-[150px]"></div>
                <h3 className="text-lg font-medium">{foodItem.foodName}</h3>
                <p className="text-gray-600">${foodItem.price.toFixed(2)}</p>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{foodItem.foodName}</DialogTitle>
                  <DialogDescription>{foodItem.ingredients}</DialogDescription>
                  <p className="font-bold text-green-600">${foodItem.price.toFixed(2)}</p>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          ))
        ) : (
          <p>No foods available in this category.</p>
        )}
      </div>
      <Button onClick={() => window.history.back()}>Go Back</Button>
    </div>
  );
};

export default Page;
