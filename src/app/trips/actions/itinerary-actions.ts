'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createItineraryNode(formData: FormData) {
  const supabase = await createClient()
  
  const trip_id = formData.get('trip_id') as string
  const day_number = parseInt(formData.get('day_number') as string)
  const time_text = formData.get('time_text') as string
  const location_name = formData.get('location_name') as string
  const note = formData.get('note') as string
  const external_link = formData.get('external_link') as string

  const { error } = await supabase
    .from('itinerary_nodes')
    .insert({
      trip_id,
      day_number,
      time_text: time_text || null,
      location_name,
      note: note || null,
      external_link: external_link || null
    })

  if (error) {
    console.error('Error creating itinerary node:', error)
    return { error: '添加行程失败，请重试' }
  }

  revalidatePath(`/trips/${trip_id}`)
  return { success: true }
}

export async function deleteItineraryNode(nodeId: string, tripId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('itinerary_nodes')
    .delete()
    .eq('id', nodeId)

  if (error) {
    console.error('Error deleting itinerary node:', error)
    return { error: '删除失败' }
  }

  revalidatePath(`/trips/${tripId}`)
  return { success: true }
}
