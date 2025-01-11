"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/hooks/use-toast";
import axios from "axios";
import { useState } from "react";
import Loader from "../ui/loader";
import { ToastAction } from "@radix-ui/react-toast";
const signinSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(14, "Password cannot exceed 14 characters"),
});

type ValidationSchemaType = z.infer<typeof signinSchema>;

export default function LoginCard() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: {  },
  } = useForm<ValidationSchemaType>({
    resolver: zodResolver(signinSchema),
  });
  const { toast } = useToast();

  const onSubmit = async (data: ValidationSchemaType) => {
    try {
      setLoading(true);
      const response = await axios.post(
        "https://pennywise-backend-q3e3.onrender.com/api/v1/auth/signin",
        {
          email: data.email,
          password: data.password,
        }
      );
      // console.log(response.data);
      toast({
        title: "Success",
        description: "Login successful!",
      });
      setLoading(false);
      localStorage.setItem('token',response.data.token);
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Login failed",
        action: (
          <ToastAction
            altText="Try again"
            onClick={() => {
              setLoading(false);
            }}
          >
            Try again
          </ToastAction>
        ),
      });
    }
  };

  const onError = () => {
    toast({
      variant: "destructive",
      title: "Validation Error",
      description: "Please check your email and password",
    });
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center mx-auto my-40">
        <Loader />
      </div>
    );
  }
  return (
    <Card className="w-96 bg-green-700 text-white flex flex-col items-center px-10 py-5">
      <CardHeader>
        <CardTitle className="font-bold text-4xl">LOG IN</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-10 items-center w-full">
        <form onSubmit={handleSubmit(onSubmit, onError)} className="w-full">
          <div className="grid w-full max-w-sm items-center gap-1.5 mb-4">
            <Label htmlFor="email">Email:</Label>
            <Input
              type="email"
              id="email"
              placeholder="Email"
              {...register("email")}
              className="text-black"
            />
            {/* {errors.email && (
              <span className="text-red-300 text-sm">{errors.email.message}</span>
            )} */}
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5 mb-4">
            <Label htmlFor="password">Password:</Label>
            <Input
              type="password"
              id="password"
              placeholder="Password"
              {...register("password")}
              className="text-black"
            />
            {/* {errors.password && (
              <span className="text-red-300 text-sm">{errors.password.message}</span>
            )} */}
          </div>
          <Button type="submit" className="bg-green-900 w-full">
            Log In
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <div className="font-semibold">
          Not a User?{" "}
          <span className="text-blue-900 font-semibold text-lg underline">
            <Link to="/auth/signup">Sign Up</Link>
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}