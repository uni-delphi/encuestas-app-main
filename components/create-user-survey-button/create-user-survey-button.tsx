"use client";
import React from "react";
import { Button } from "../ui/button";

export default function CreateUserSurveyButton({ session }: { session: any }) {
  const handleCreateUserSurvey = () => {
    console.log(session);
  };
  return (
    <Button
      onClick={() => {
        handleCreateUserSurvey();
      }}
      className="bg-blue-600 text-white hover:bg-gray-200 block mx-auto my-4"
    >
      Empezá
    </Button>
  );
}
