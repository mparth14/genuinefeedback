'use client'
import * as z from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from 'next/navigation'
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchemaValidation } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react";
import { signInSchemaValidation } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";

const page = () => {
    const {toast} = useToast()
    const router = useRouter()

    // zod impl
    const form = useForm<z.infer<typeof signInSchemaValidation>>({
        resolver: zodResolver(signInSchemaValidation),
        defaultValues: {
            identifier: '',
            password: ''
        }
    })

    const onSubmit = async (data: z.infer<typeof signInSchemaValidation>) => {
        const response = await signIn('credentials', {
            redirect: false,
            identifier: data.identifier,
            password: data.password
        })
        if(response?.error){
            toast({
                title: 'Login Failed',
                description: 'Incorrect credentials. Please try again',
                variant: "destructive"
            })
        } 

        if(response?.url){
            router.replace('/dashboard')
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-600">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                Welcome Back to True Feedback
            </h1>
            <p className="mb-4">Sign in to continue your secret conversations</p>
            </div>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                name="identifier"
                control={form.control}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email/Username</FormLabel>
                        <FormControl>
                            <Input placeholder="email/username" {...field} 
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                            <Input type="password" placeholder="password" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />
                <Button className='w-full' type="submit">Sign In
                </Button>
            </form>
            </Form>
            <div className="text-center mt-4">
            <p>
                Not a member yet?{' '}
                <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
                Sign up
                </Link>
            </p>
            </div>
            </div>
        </div>
    )
}

export default page;