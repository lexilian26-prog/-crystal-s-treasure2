import { createClient } from '@/utils/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { TripHeader } from '@/components/trips/TripHeader'
import { TodoModule } from '@/components/todos/TodoModule'
import { ItineraryModule } from '@/components/itinerary/ItineraryModule'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ClipboardList, CalendarDays } from 'lucide-react'

interface TripPageProps {
  params: Promise<{ tripId: string }>
}

export default async function TripPage({ params }: TripPageProps) {
  const { tripId } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth')
  }

  // 1. 获取行程信息
  const { data: trip, error: tripError } = await supabase
    .from('trips')
    .select('*')
    .eq('id', tripId)
    .single()

  if (tripError || !trip) {
    notFound()
  }

  // 2. 获取成员信息 (关联 profiles)
  let { data: members, error: membersError } = await supabase
    .from('trip_members')
    .select(`
      user_id,
      role,
      profiles (
        name,
        avatar_url
      )
    `)
    .eq('trip_id', tripId)

  // 如果成员列表为空，但当前用户是创建者，尝试自动修复（针对 RLS 期间创建的异常数据）
  if ((!members || members.length === 0) && trip.created_by === user.id) {
    const { error: insertError } = await supabase.from('trip_members').insert({
      trip_id: tripId,
      user_id: user.id,
      role: 'admin'
    })

    if (!insertError) {
      // 插入成功后，为了避免重定向循环，我们直接手动构造当前用户的成员信息或重新查询一次
      const { data: refreshedMembers } = await supabase
        .from('trip_members')
        .select(`
          user_id,
          role,
          profiles (
            name,
            avatar_url
          )
        `)
        .eq('trip_id', tripId)
      
      if (refreshedMembers && refreshedMembers.length > 0) {
        members = refreshedMembers
      }
    }
  }

  // 3. 获取待办事项 (关联指派人 profile)
  const { data: todos } = await supabase
    .from('todos')
    .select(`
      *,
      assignee_profile:profiles (
        name,
        avatar_url
      )
    `)
    .eq('trip_id', tripId)
    .order('created_at', { ascending: false })

  // 4. 获取行程节点
  const { data: nodes } = await supabase
    .from('itinerary_nodes')
    .select('*')
    .eq('trip_id', tripId)
    .order('day_number', { ascending: true })
    .order('time_text', { ascending: true })

  // 5. 计算进度 (基于公共待办)
  const publicTodos = todos?.filter(t => t.is_public) || []
  const completedPublic = publicTodos.filter(t => t.is_completed).length
  const progress = publicTodos.length > 0 
    ? Math.round((completedPublic / publicTodos.length) * 100) 
    : 0

  const formattedMembers = members?.map((member: any) => { 
    // 1. 准备一个默认的 profile 对象，防止数据为空时页面崩溃 
    let safeProfile = { name: '未知用户', avatar_url: '' }; 
  
    // 2. 判断并提取：如果是数组且有内容，取第一项；如果本来就是对象，直接使用 
    if (Array.isArray(member.profiles) && member.profiles.length > 0) { 
      safeProfile = member.profiles[0]; 
    } else if (member.profiles && !Array.isArray(member.profiles)) { 
      safeProfile = member.profiles; 
    } 
  
    // 3. 返回清洗后的、符合前端组件要求的数据结构 
    return { 
      ...member, 
      profiles: safeProfile 
    }; 
  });

  return (
    <div className="space-y-6 pb-24">
      <TripHeader 
        trip={trip} 
        members={formattedMembers || []} 
        progress={progress} 
      />
      
      <Tabs defaultValue="todos" className="w-full">
        <TabsList className="sticky top-[108px] z-20 grid w-full grid-cols-2 h-12 p-1.5 bg-background/95 backdrop-blur shadow-sm border-b">
          <TabsTrigger value="todos" className="gap-2 text-xs data-[state=active]:bg-primary/5 data-[state=active]:text-primary transition-all">
            <ClipboardList className="h-4 w-4" />
            待办清单
          </TabsTrigger>
          <TabsTrigger value="itinerary" className="gap-2 text-xs data-[state=active]:bg-primary/5 data-[state=active]:text-primary transition-all">
            <CalendarDays className="h-4 w-4" />
            行程时间轴
          </TabsTrigger>
        </TabsList>

        <div className="pt-6">
          <TabsContent value="todos" className="mt-0 outline-none">
            <TodoModule 
              tripId={tripId} 
              todos={todos || []} 
              members={formattedMembers || []} 
              currentUserId={user.id}
            />
          </TabsContent>
          
          <TabsContent value="itinerary" className="mt-0 outline-none">
            <ItineraryModule 
              tripId={tripId} 
              nodes={nodes || []} 
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
