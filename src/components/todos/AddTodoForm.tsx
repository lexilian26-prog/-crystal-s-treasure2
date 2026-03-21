'use client'

import { useState } from 'react'
import { Plus, Link as LinkIcon, Lock, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createTodo } from '@/app/trips/actions/todo-actions'
import { toast } from 'sonner'
import type { TripMember } from '@/types/database'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

interface AddTodoFormProps {
  tripId: string
  members: TripMember[]
}

export function AddTodoForm({ tripId, members }: AddTodoFormProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    console.log('Submitting todo form...')
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    formData.append('trip_id', tripId)
    
    const result = await createTodo(formData)
    
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('已添加待办')
      setIsExpanded(false)
      ;(e.target as HTMLFormElement).reset()
    }
    setIsLoading(false)
  }

  return (
    <div className="space-y-3">
      {!isExpanded ? (
        <Button 
          variant="outline" 
          className="w-full justify-start gap-2 border-dashed h-11 text-muted-foreground hover:text-primary hover:border-primary/50"
          onClick={() => setIsExpanded(true)}
        >
          <Plus className="h-4 w-4" />
          添加待办事项...
        </Button>
      ) : (
        <form onSubmit={handleSubmit} className="rounded-xl border bg-card p-4 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="space-y-4">
            <Input 
              name="title" 
              placeholder="需要做什么？" 
              autoFocus 
              required
              className="border-none px-0 text-sm font-medium focus-visible:ring-0 h-auto"
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-muted/50">
              <div className="space-y-1.5">
                <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">指派给</Label>
                <Select name="assigned_to">
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="选择成员 (可选)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">不指派</SelectItem>
                    {members.map(m => {
                      const profile = Array.isArray(m.profiles) ? m.profiles[0] : m.profiles;
                      return (
                        <SelectItem key={m.user_id} value={m.user_id}>
                          {profile?.name || '未命名'}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-1.5">
                <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">外部链接</Label>
                <div className="relative">
                  <LinkIcon className="absolute left-2.5 top-2.5 h-3 w-3 text-muted-foreground" />
                  <Input 
                    name="external_link" 
                    placeholder="https://..." 
                    className="h-8 pl-8 text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="is_public" name="is_private" value="true" />
                <label
                  htmlFor="is_public"
                  className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-1 cursor-pointer"
                >
                  <Lock className="h-3 w-3" />
                  设为仅自己可见
                </label>
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsExpanded(false)}
                  disabled={isLoading}
                >
                  取消
                </Button>
                <Button type="submit" size="sm" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                  添加
                </Button>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  )
}
