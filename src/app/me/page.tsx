import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { signOut } from '@/app/auth/actions/auth-actions'
import { LogOut, User } from 'lucide-react'

export const metadata = {
  title: "个人中心",
}

export default async function MePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center space-y-4 pt-4">
        <Avatar className="h-20 w-20 border-2 border-primary/10">
          <AvatarImage src={user.user_metadata?.avatar_url} />
          <AvatarFallback className="bg-primary/5 text-primary">
            <User className="h-10 w-10" />
          </AvatarFallback>
        </Avatar>
        <div className="text-center space-y-1">
          <h1 className="text-xl font-bold tracking-tight">
            {user.user_metadata?.full_name || '旅行者'}
          </h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between py-1">
            <span className="text-sm font-medium">账号状态</span>
            <span className="text-xs rounded-full bg-emerald-500/10 px-2 py-0.5 font-medium text-emerald-600">
              已验证
            </span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-sm font-medium">加入时间</span>
            <span className="text-xs text-muted-foreground">
              {new Date(user.created_at).toLocaleDateString('zh-CN')}
            </span>
          </div>
        </div>
      </div>

      <form action={signOut}>
        <Button variant="destructive" className="w-full gap-2" type="submit">
          <LogOut className="h-4 w-4" />
          退出登录
        </Button>
      </form>
    </div>
  )
}
