'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createTodo(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: '未登录' }
  }

  const trip_id = formData.get('trip_id') as string
  const title = formData.get('title') as string
  const is_private = formData.get('is_private') === 'true'
  const is_public = !is_private
  const assigned_to_raw = formData.get('assigned_to') as string
  const assigned_to = (assigned_to_raw === 'none' || !assigned_to_raw) ? null : assigned_to_raw
  const external_link = formData.get('external_link') as string || null

  const { data, error } = await supabase
    .from('todos')
    .insert([
      {
        trip_id,
        title,
        is_public,
        assigned_to,
        external_link,
        created_by: user.id,
      },
    ])
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/trips/${trip_id}`)
  return { data }
}

export async function toggleTodo(id: string, is_completed: boolean, trip_id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('todos')
    .update({ is_completed })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/trips/${trip_id}`)
  return { success: true }
}

export async function deleteTodo(id: string, trip_id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('todos')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/trips/${trip_id}`)
  return { success: true }
}
