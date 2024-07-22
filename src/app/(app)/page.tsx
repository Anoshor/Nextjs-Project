'use client'
import React, { useEffect, useState } from "react";
import messages from "@/messages.json";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";

const HomePage = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12">
      <section className="text-center mb-8 md:mb-12">
        <h1 className="text-3xl md:text-5xl font-bold">Dive into the World of Anonymous Conversations</h1>
        <p className="mt-3 md:mt-4 text-base md:text-lg">Start exploring now...</p>
      </section>
      {isClient && (
        <Carousel plugins={[Autoplay({ delay: 2000 })]} className="w-full">
          <CarouselContent className="flex justify-center">
            {messages.map((message, index) => (
              <CarouselItem key={index} className="flex justify-center">
                <Card className="shadow-lg rounded-lg p-6 bg-white flex flex-col items-center">
                  <h3 className="text-xl font-semibold mb-2">{message.title}</h3>
                  <p className="text-gray-700 mb-4 text-center">{message.content}</p>
                  <p className="text-sm text-gray-500">{message.recieved}</p>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      )}
      <footer className="mt-8 text-center">
        <p className="text-sm md:text-base">Anoshor 2024 Next JS project</p>
      </footer>
    </main>
  );
}

export default HomePage;
