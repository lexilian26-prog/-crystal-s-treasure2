'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TodoItem } from './TodoItem'
import { AddTodoForm } from './AddTodoForm'
import { Users, Lock } from 'lucide-react'
import type { Todo, TripMember } from '@/types/database'

interface TodoModuleProps {
  tripId: string
  todos: Todo[]
  members: TripMember[]
  currentUserId: string
}

export function TodoModule({ tripId, todos, members, currentUserId }: TodoModuleProps) {
  const publicTodos = todos.filter(t => t.is_public)
  const personalTodos = todos.filter(t => !t.is_public && t.created_by === currentUserId)

  return (
    <div className="space-y-6">
      <Tabs defaultValue="public" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="public" className="gap-2">
            <Users className="h-3.5 w-3.5" />
            公共清单
          </TabsTrigger>
          <TabsTrigger value="personal" className="gap-2">
            <Lock className="h-3.5 w-3.5" />
            个人备忘
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="public" className="space-y-4 outline-none">
          <AddTodoForm tripId={tripId} members={members} mode="public" />
          <div className="space-y-2">
            {publicTodos.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                还没有公共待办，点击上方按钮添加。
              </div>
            ) : (
              publicTodos.map(todo => (
                <TodoItem key={todo.id} todo={todo} tripId={tripId} />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="personal" className="space-y-4 outline-none">
          <AddTodoForm tripId={tripId} members={members} mode="personal" />
          <div className="space-y-2">
            {personalTodos.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                个人备忘仅你自己可见。
              </div>
            ) : (
              personalTodos.map(todo => (
                <TodoItem key={todo.id} todo={todo} tripId={tripId} />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
