'use client'

import React from 'react'
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {SubmitHandler, useForm} from "react-hook-form";
import {useRouter} from "next/navigation";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {AlertCircle, Terminal} from "lucide-react";


type Inputs = {
  type: string
  name?: string
  email: string
  password: string
}

/**
 * @description Returns a JSX element representing an HTML form with a main content
 * area and a heading that says "Login". It includes a link to log in with Google,
 * styled according to the `buttonVariants` function.
 *
 * @returns {React.ReactElement} A form element with its child elements, including an h1
 * heading and a link, all wrapped in a main element with a specific class name.
 */
export default function Login(): React.ReactElement {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: {errors}
  } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data)
    router.push('/')
  }

  return (
      <form
          onSubmit={handleSubmit(onSubmit)}
          className={"w-full flex flex-col"}
      >
        <Tabs defaultValue="login" className="w-full p-2 ">

          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>


          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>
                  Login
                </CardTitle>

                <CardDescription>
                  Welcome back!
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-2">

                <input
                    id="type-login"
                    type={'hidden'}
                    value={'login'}
                    {...register("type")}

                />

                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                      id="email"
                      type={'email'}
                      placeholder={'developer@example.com'}
                      required
                      {...register("email", {required: true, maxLength: 100})}
                  />
                  {errors.email && <span>This field is required</span>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input
                      id="password"
                      type={'password'}
                      placeholder={'verystrongpassword#93'}
                      required
                      {...register("password", {required: true, maxLength: 250, minLength: 8})}
                  />
                  {errors.password && <>
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4"/>
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>
                        Password must be at least 8 characters long.
                      </AlertDescription>
                    </Alert>
                  </>}
                </div>

              </CardContent>

              <CardFooter>
                <Button>Let&rsquo;s Go</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card>
              <CardHeader>

                <CardTitle>Register</CardTitle>
                <CardDescription>
                  Welcome to the community!
                </CardDescription>

              </CardHeader>

              <CardContent className="space-y-2">

                <input
                    id="type-register"
                    type={'hidden'}
                    value={'register'}
                    {...register("type")}
                />

                <div className="space-y-1">
                  <Label htmlFor="current">
                    Nickname
                  </Label>
                  <Input
                      id="current"
                      type="password"
                      placeholder={'John'}
                      {...register("name")}
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="current">
                    Email
                  </Label>
                  <Input
                      id="email"
                      type="email"
                      placeholder={'john@gmail.com'}
                      {...register("email")}
                  />
                  {errors.email && <span>This field is required</span>}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="new">
                    Password
                  </Label>
                  <Input
                      id="password"
                      type="password"
                      placeholder={'minimum 8 characters'}
                      {...register("password")}
                  />
                  {errors.password && <span>This field is required</span>}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="new">
                    Re-enter Password
                  </Label>
                  <Input
                      id="new"
                      type="password"
                      placeholder={'re-enter the password'}
                      {...register("password")}
                  />
                </div>

              </CardContent>

              <CardFooter>
                <Button>Let&lsquo;s Go!</Button>
              </CardFooter>

            </Card>
          </TabsContent>
        </Tabs>
      </form>
  );
}
