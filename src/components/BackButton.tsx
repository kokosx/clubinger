"use client";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const BackButton = () => {
  const router = useRouter();

  return (
    <Button onClick={() => router.back()} variant={"outline"}>
      <ArrowLeft />
    </Button>
  );
};

export default BackButton;
