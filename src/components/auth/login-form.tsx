"use client"

import * as z from "zod"
import { useState, useTransition } from "react"
import { CardWrapper } from "./card-wrapper"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"

import {LoginSchema} from "@/schemas"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { FormError } from "@/components/form-error"
import { FormSuccess } from "@/components/form-success"
import { login } from "@/actions/login"

export const LoginForm = () => {
    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")
    const [isPending, startTransition] = useTransition()

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {

        setError("");
        setSuccess("");

        startTransition(() => {
            login(values).then((data) => {
                setError(data.error);
                setSuccess(data.success)
            })
        })
    }
    return (
        <CardWrapper
            headerLabel="Welcome back"
            backButtonHref="/auth/register"
            backButtonLabel="Don't have an account?"
            showSocial
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="yourname@example.com" {...field} type="email" disabled={isPending}/>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input placeholder="*******" {...field} type="password" disabled={isPending}/>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    </div>
                    <FormError message={error}/>
                    <FormSuccess message={success}/>
                    <Button variant={"custom"} type="submit" className="w-full" disabled={isPending}>Login</Button>
                </form>
            </Form>
        </CardWrapper>
    )
}