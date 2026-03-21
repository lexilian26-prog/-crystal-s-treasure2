import { createClient } from '@/utils/supabase/server'
import Link from "next/link"
import { ArrowRight, MapPin, Calendar, Settings } from "lucide-react"

import { CreateTripDialog } from "@/components/trips/CreateTripDialog"
import { EditTripDialog } from "@/components/trips/EditTripDialog"

export const metadata = {
  title: "我的行程",
}

export default async function TripsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 获取用户参与的所有行程
  const { data: trips } = await supabase
    .from('trips')
    .select(`
      *,
      trip_members!inner(user_id)
    `)
    .eq('trip_members.user_id', user?.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight text-foreground/90">我的行程</h1>
        <CreateTripDialog />
      </div>

      {!trips || trips.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-muted/20 p-12 text-center">
          <div className="rounded-full bg-primary/10 p-3 text-primary">
            <Calendar className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-sm font-semibold">暂无行程</h3>
          <p className="mt-2 text-xs text-muted-foreground max-w-[180px]">
            创建一个新行程或让同伴分享邀请链接加入。
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {trips.map((trip) => (
            <div
              key={trip.id}
              className="group relative overflow-hidden rounded-2xl border bg-card transition-all hover:border-primary/50 hover:shadow-md active:scale-[0.99]"
            >
              <Link
                href={`/trips/${trip.id}`}
                className="block p-5"
              >
                <div className="flex flex-col space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="font-bold text-base leading-tight group-hover:text-primary transition-colors">
                        {trip.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {trip.destination || '未设置目的地'}
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                  
                  <div className="flex items-center justify-between pt-1 border-t border-muted/50">
                    <div className="flex items-center gap-3 text-[11px] font-medium text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(trip.start_date).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })}
                      </div>
                      <span>-</span>
                      <div className="flex items-center gap-1">
                        {new Date(trip.end_date).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
              
              <div className="absolute top-2 right-12 z-10">
                <EditTripDialog trip={trip} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
