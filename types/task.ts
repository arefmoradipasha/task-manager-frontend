// types/task.ts

import { CalendarDate } from "@internationalized/date";

export type TaskStatus = 'pending' | 'in-progress' | 'completed';

// این مدل تسک در فرانت‌اند است.
// دقت کن در سرور id معمولاً عدد است، اما اگر می‌خواهی با string مدیریت کنی، آزاد هستی.
// برای نمونه ما اینجا number در نظر می‌گیریم.
export interface Task {
  completionDate: any;
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  // سرور توی migration `completionDate` دارد، ما اینجا با نام dueDate کار می‌کنیم
  // و در سرویس تبدیلش می‌کنیم:
  dueDate?: string | null;
  // createdAt در سرور به صورت created_at برمی‌گردد.
  createdAt: Date;
}

// داده‌هایی که برای ایجاد/ویرایش فرم استفاده می‌کنیم
export interface TaskFormData {
  title: string;
  description: string;
  status: TaskStatus;
  // در فرم از CalendarDate استفاده می‌کنیم:
  dueDate: CalendarDate | null;
}


