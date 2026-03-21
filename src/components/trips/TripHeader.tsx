'use client'

import { MapPin, Calendar, Share2, ChevronLeft, Settings } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Trip, TripMember } from '@/types/database'
import { EditTripDialog } from './EditTripDialog'

interface TripHeaderProps {
  trip: Trip
  members: TripMember[]
  progress?: number
}

export function TripHeader({ trip, members, progress = 0 }: TripHeaderProps) {
  const router = useRouter()

  return (
    <div className="relative space-y-4 pb-2">
      {/* 悬浮进度条 */}
      <div className="fixed inset-x-0 top-14 z-20 mx-auto w-full max-w-xl bg-background/95 px-4 py-2 backdrop-blur sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <Progress value={progress} className="h-1.5" />
          </div>
          <span className="text-[10px] font-bold text-primary tabular-nums">
            {progress}%
          </span>
        </div>
      </div>

      <div className="flex items-start justify-between gap-4 pt-8">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="-ml-2 h-8 w-8 text-muted-foreground"
              onClick={() => router.back()}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold tracking-tight">{trip.title}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3 text-primary/60" />
              {trip.destination || '未设置目的地'}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-primary/60" />
              {new Date(trip.start_date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
              {' - '}
              {new Date(trip.end_date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <EditTripDialog trip={trip} />
          <Button size="icon" variant="secondary" className="h-9 w-9 rounded-full">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center -space-x-2 overflow-hidden">
          {members.map((member, i) => {
            const profile = Array.isArray(member.profiles) ? member.profiles[0] : member.profiles;
            return (
              <Avatar 
                key={member.user_id} 
                className={cn(
                  "h-7 w-7 border-2 border-background ring-1 ring-primary/5",
                  i > 0 && "hover:translate-x-1 transition-transform"
                )}
              >
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="bg-muted text-[10px]">
                  {profile?.name?.[0] || '?'}
                </AvatarFallback>
              </Avatar>
            );
          })}
          {members.length > 5 && (
            <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-muted text-[10px] font-medium ring-1 ring-primary/5">
              +{members.length - 5}
            </div>
          )}
        </div>
        <div className="text-[10px] font-medium text-muted-foreground bg-muted/30 px-2 py-0.5 rounded-full">
          {members.length} 位同伴
        </div>
      </div>
    </div>
  )
}
