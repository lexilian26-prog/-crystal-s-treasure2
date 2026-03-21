'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createTrip } from '@/app/trips/actions/trip-actions'

export function CreateTripDialog() {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const result = await createTrip(formData)

    if (result.error) {
      toast.error(result.error)
    } else if (result.data) {
      toast.success('行程创建成功！')
      setOpen(false)
      router.push(`/trips/${result.data.id}`)
    }
    setIsLoading(false)
  }

  return (
    <>
      <Button size="sm" className="gap-2" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        新建
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>新建行程</DialogTitle>
            <DialogDescription>
              创建一个新的旅行，邀请同伴一起协作。
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">行程名称</Label>
              <Input
                id="title"
                name="title"
                placeholder="例如：青岛周末游"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="destination">目的地</Label>
              <Input
                id="destination"
                name="destination"
                placeholder="例如：山东青岛"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="start_date">开始日期</Label>
                <Input
                  id="start_date"
                  name="start_date"
                  type="date"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="end_date">结束日期</Label>
                <Input
                  id="end_date"
                  name="end_date"
                  type="date"
                  required
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              创建行程
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
    </>
  )
}
