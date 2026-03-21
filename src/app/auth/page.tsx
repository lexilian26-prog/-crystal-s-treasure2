'use client'

import { useState } from 'react'
import { signIn, signInWithPassword, signUp } from './actions/auth-actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from 'sonner'
import { Loader2, Mail, Lock, User } from 'lucide-react'

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'magic'>('login')

  async function handlePasswordLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    const formData = new FormData(e.currentTarget)
    const result = await signInWithPassword(formData)
    if (result?.error) toast.error(result.error)
    setIsLoading(false)
  }

  async function handleSignUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    const formData = new FormData(e.currentTarget)
    const result = await signUp(formData)
    if (result?.error) {
      toast.error(result.error)
    } else if (result?.message) {
      toast.success(result.message)
    }
    setIsLoading(false)
  }

  async function handleMagicLink(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    const formData = new FormData(e.currentTarget)
    const result = await signIn(formData)
    if (result?.error) {
      toast.error(result.error)
    } else if (result?.message) {
      toast.success(result.message)
    }
    setIsLoading(false)
  }

  return (
    <div className="flex min-h-[calc(100dvh-12rem)] flex-col items-center justify-center p-4">
      <Card className="w-full max-w-sm border-none shadow-none sm:border sm:shadow-sm">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">欢迎使用 TripSync</CardTitle>
          <CardDescription>
            同步您的旅行清单与行程
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">登录</TabsTrigger>
              <TabsTrigger value="signup">注册</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4 outline-none">
              <form onSubmit={handlePasswordLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">邮箱</Label>
                  <Input id="email" name="email" type="email" placeholder="name@example.com" required disabled={isLoading} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">密码</Label>
                  <Input id="password" name="password" type="password" required disabled={isLoading} />
                </div>
                <Button className="w-full" type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  登录
                </Button>
              </form>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">或者</span>
                </div>
              </div>

              <form onSubmit={handleMagicLink} className="space-y-4">
                <Input name="email" type="email" placeholder="使用无密码链接登录" required disabled={isLoading} className="text-xs h-9" />
                <Button variant="outline" className="w-full h-9 text-xs" type="submit" disabled={isLoading}>
                  <Mail className="mr-2 h-3 w-3" />
                  发送 Magic Link
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4 outline-none">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">昵称</Label>
                  <Input id="signup-name" name="name" placeholder="您的称呼" required disabled={isLoading} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">邮箱</Label>
                  <Input id="signup-email" name="email" type="email" placeholder="name@example.com" required disabled={isLoading} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">设置密码</Label>
                  <Input id="signup-password" name="password" type="password" placeholder="至少 6 位" required disabled={isLoading} />
                </div>
                <Button className="w-full" type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  立即注册
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
