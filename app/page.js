import ObjectDetection from "@/components/object-detection";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex items-center p-8 flex-col min-h-screen">
      <h1 className=" gradient-title font-extrabold text-3xl md:text-6xl lg:text-8xl tracking-tighter md:px-6 text-center">Thief detection alaram </h1>
      <ObjectDetection/>
    </div>
  );
}
