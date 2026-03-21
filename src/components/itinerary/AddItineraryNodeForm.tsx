'use client'

import { useState } from 'react'
import { Plus, Link as LinkIcon, Clock, MapPin, Loader2, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { createItineraryNode } from '@/app/trips/actions/itinerary-actions'
import { toast } from 'sonner'

interface AddItineraryNodeFormProps {
  tripId: string
}

export function AddItineraryNodeForm({ tripId }: AddItineraryNodeFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    formData.append('trip_id', tripId)
    
    const result = await createItineraryNode(formData)
    
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('已添加行程节点')
      setIsOpen(false)
      ;(e.target as HTMLFormElement).reset()
    }
    setIsLoading(false)
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button size="sm" variant="outline" className="h-8 gap-1.5 border-dashed border-primary/40 text-primary hover:bg-primary/5">
          <Plus className="h-3.5 w-3.5" />
          添加节点
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl sm:h-auto sm:max-w-xl sm:mx-auto">
        <SheetHeader className="text-left">
          <SheetTitle>添加行程节点</SheetTitle>
          <SheetDescription>
            记录这一天的行程安排。
          </SheetDescription>
        </SheetHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">第几天 (Day)</Label>
              <Input 
                name="day_number" 
                type="number" 
                min="1" 
                defaultValue="1" 
                required 
                className="h-11 bg-muted/20"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">时间 (Time)</Label>
              <div className="relative">
                <Clock className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  name="time_text" 
                  placeholder="如: 09:00, 下午, 傍晚..." 
                  className="h-11 pl-10 bg-muted/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">地点/标题 (Location/Title)</Label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  name="location_name" 
                  placeholder="如: 故宫博物院, 酒店, 餐厅..." 
                  required 
                  className="h-11 pl-10 bg-muted/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">备注 (Note)</Label>
              <div className="relative">
                <FileText className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  name="note" 
                  placeholder="门票信息, 预约提示..." 
                  className="h-11 pl-10 bg-muted/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">外部链接 (URL)</Label>
              <div className="relative">
                <LinkIcon className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  name="external_link" 
                  placeholder="攻略或预订链接 (https://...)" 
                  className="h-11 pl-10 bg-muted/20"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1 h-12 rounded-xl"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              取消
            </Button>
            <Button className="flex-1 h-12 rounded-xl" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              保存
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
