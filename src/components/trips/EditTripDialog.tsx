'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Settings, Loader2, Trash2 } from 'lucide-react'
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
import { updateTrip, deleteTrip } from '@/app/trips/actions/trip-actions'

interface EditTripDialogProps {
  trip: {
    id: string
    title: string
    destination: string | null
    start_date: string
    end_date: string
  }
}

export function EditTripDialog({ trip }: EditTripDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const result = await updateTrip(trip.id, formData)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('行程更新成功！')
      setOpen(false)
      router.refresh()
    }
    setIsLoading(false)
  }

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault()
    if (!confirm('确定要删除这个行程吗？此操作不可撤销。')) return

    setIsDeleting(true)
    const result = await deleteTrip(trip.id)

    if (result.error) {
      toast.error(result.error)
      setIsDeleting(false)
    } else {
      toast.success('行程已删除')
      setOpen(false)
      router.refresh()
    }
  }

  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8 text-muted-foreground hover:text-primary"
        onClick={(e) => {
          e.stopPropagation()
          setOpen(true)
        }}
      >
        <Settings className="h-4 w-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>编辑行程</DialogTitle>
            <DialogDescription>
              修改行程的基本信息。
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">行程名称</Label>
              <Input
                id="title"
                name="title"
                defaultValue={trip.title}
                placeholder="例如：青岛周末游"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="destination">目的地</Label>
              <Input
                id="destination"
                name="destination"
                defaultValue={trip.destination || ''}
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
                  defaultValue={trip.start_date}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="end_date">结束日期</Label>
                <Input
                  id="end_date"
                  name="end_date"
                  type="date"
                  defaultValue={trip.end_date}
                  required
                />
              </div>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button 
              type="button" 
              variant="destructive" 
              className="sm:mr-auto gap-2" 
              onClick={handleDelete}
              disabled={isLoading || isDeleting}
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              删除行程
            </Button>
            <div className="flex gap-2">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>取消</Button>
              <Button type="submit" disabled={isLoading || isDeleting}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                保存修改
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
    </>
  )
}
