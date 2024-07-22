'use client'
import React from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from 'zod';
import { verifySchema } from "@/schemas/verifySchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const VerifyAccount = () => {
    const router = useRouter();
    const param = useParams<{ username: string }>();
    const { toast } = useToast();

    // Explicitly define the form data type
    type FormData = z.infer<typeof verifySchema>;

    const form = useForm<FormData>({
        resolver: zodResolver(verifySchema),
    });

    const onSubmit = async (data: FormData) => {
        try {

            const response = await axios.post(`/api/verify-code`, {
                username: param.username,
                code: data.code,
            });

            console.log(response);
            toast({
                title: "Success",
                description: response.data.message,
            });

            router.replace(`signIn`);
        } catch (error) {
            console.error('Error in sign up', error);
            const axiosError = error as AxiosError<ApiResponse>;

            let errorMessage = axiosError.response?.data.message || 'An error occurred';
            toast({
                title: 'Sign Up Error',
                description: errorMessage,
                variant: 'destructive'
            });
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className='text-center'>
                    <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>
                        Verify your Account
                    </h1>
                    <p className='mb-4'>
                        Enter Verification Code
                    </p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            name="code"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Verification Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="code" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default VerifyAccount;
