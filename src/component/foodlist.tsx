"use client"
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
import { CldImage } from "next-cloudinary";
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const { data } = await axios.get("http://localhost:3030/food/all");
        setFoods(data);
      } catch (error) {
        console.error("Error fetching food data:", error);
      }
    };

    fetchFood();
  }, []);
  const router = useRouter();

  const seeAll = (id: string) => {
    router.push(`/category/${id}`); 
  };
  return (
    <div className="p-6 gap-[100px] flex flex-col">
      {Array.from(new Set(foods.map((food) => food.category))).map((category) => (
        <div key={category} className="mb-6">
          <h2 className="text-2xl font-bold flex justify-between ">{category}
          <Button onClick={()=>seeAll(category)}>see all</Button>
          </h2>
          <div className="flex justify-between gap-4 py-[30px]">
            {foods
              .filter((food) => food.category === category)
              .slice(0, 5)
              .map((food) => (
                <Dialog key={food._id} open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger
                    className="p-4 border rounded-lg shadow-md cursor-pointer hover:bg-gray-100"
                    onClick={() => setSelectedFood(food)}
                  >
                    {/* <CldImage
                      src={food.imageUrl}
                      width={200}
                      height={150}
                      alt={food.foodName}
                      className="rounded-lg mb-2"
                    /> */}
                    <div className="bg-black w-[200px] h-[150px]"></div>
                    <h3 className="text-lg font-medium">{food.foodName}   </h3>
                    <p className="text-gray-600">${food.price.toFixed(2)}</p>
                  </DialogTrigger>

                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{selectedFood?.foodName}</DialogTitle>
                      <DialogDescription>{selectedFood?.ingredients}</DialogDescription>
                      {/* <CldImage
                        src={selectedFood?.imageUrl || ""}
                        width={400}
                        height={300}
                        alt={selectedFood?.foodName || "Food Image"}
                        className="rounded-lg my-2"
                      /> */}
                      <p className="font-bold text-green-600">${selectedFood?.price.toFixed(2)}</p>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FoodList;
