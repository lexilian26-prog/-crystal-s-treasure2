'use client'

import { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { toggleTodo, deleteTodo } from '@/app/trips/actions/todo-actions'
import { toast } from 'sonner'
import { Link as LinkIcon, Trash2, Loader2, User } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import type { Todo } from '@/types/database'

interface TodoItemProps {
  todo: Todo
  tripId: string
  isOwner?: boolean
}

export function TodoItem({ todo, tripId }: TodoItemProps) {
  const [isToggling, setIsToggling] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleToggle(checked: boolean) {
    setIsToggling(true)
    const result = await toggleTodo(todo.id, checked, tripId)
    if (result.error) {
      toast.error(result.error)
    }
    setIsToggling(false)
  }

  async function handleDelete() {
    if (!confirm('确定要删除这个待办事项吗？')) return
    setIsDeleting(true)
    const result = await deleteTodo(todo.id, tripId)
    if (result.error) {
      toast.error(result.error)
    }
    setIsDeleting(false)
  }

  return (
    <div className="group flex items-center justify-between gap-3 rounded-lg border bg-card p-3 transition-all hover:shadow-sm">
      <div className="flex items-center gap-3 flex-1">
        <div className="relative flex h-5 w-5 items-center justify-center">
          {isToggling ? (
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
          ) : (
            <Checkbox
              checked={todo.is_completed}
              onCheckedChange={handleToggle}
              className="h-5 w-5"
            />
          )}
        </div>
        
        <div className="flex flex-col gap-0.5 flex-1">
          <span className={cn(
            "text-sm font-medium leading-tight transition-all",
            todo.is_completed && "text-muted-foreground line-through decoration-muted-foreground/50"
          )}>
            {todo.title}
          </span>
          
          <div className="flex items-center gap-2">
            {todo.external_link && (
              <a 
                href={todo.external_link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[10px] text-primary hover:underline"
              >
                <LinkIcon className="h-2.5 w-2.5" />
                链接
              </a>
            )}
            {!todo.is_public && (
              <span className="text-[10px] rounded-full bg-amber-500/10 px-1.5 py-0.5 font-medium text-amber-600">
                个人
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {todo.assigned_to && (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-muted/50">
            <Avatar className="h-5 w-5">
              <AvatarImage src={todo.assignee_profile?.avatar_url ?? undefined} />
              <AvatarFallback className="text-[8px]">
                <User className="h-3 w-3" />
              </AvatarFallback>
            </Avatar>
            <span className="text-[10px] font-medium text-muted-foreground hidden sm:inline">
              {todo.assignee_profile?.name || '未命名'}
            </span>
          </div>
        )}
        
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground/30 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  )
}
