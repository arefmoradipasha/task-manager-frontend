// services/taskService.ts
import AxiosInstance from "@/lib/axios";
import { parseDate } from "@internationalized/date";
import { Task, TaskFormData, TaskStatus } from "@/types/task";

/**
 * شکل پاسخ عمومی API که شامل data (محتوا) و message (پیام) است.
 */
interface ApiResponse<T> {
  data: T;
  message: string;
}

/**
 * توابع برای فراخوانی API تسک‌ها
 */
export async function fetchTasks(): Promise<Task[]> {
  // انتظار می‌رود سرور در فیلد data، آرایه‌ای از Task برگرداند
  // همچنین سرور فیلد completionDate دارد؛ آن را به dueDate مپ می‌کنیم
  const res = await AxiosInstance.get<ApiResponse<Task[]>>("/tasks");
  const tasks = res.data.data;

  // مپ کردن completionDate => dueDate
  return tasks.map((task) => ({
    ...task,
    dueDate: task.completionDate, // اگر سرور اسمش completionDate است
  }));
}

export async function fetchTaskById(id: number): Promise<Task> {
  const res = await AxiosInstance.get<ApiResponse<Task>>(`/tasks/${id}`);
  const t = res.data.data;
  return {
    ...t,
    dueDate: t.completionDate,
  };
}

export async function createTask(formData: TaskFormData): Promise<Task> {
  /**
   * در دیتابیس اسم فیلد تاریخ completionDate است
   * ما از formData.dueDate (نوع CalendarDate یا null) استفاده می‌کنیم
   * ابتدا باید تاریخ را به فرمت قابل ارسال (مثلا "YYYY-MM-DD") تبدیل کنیم
   */
  const completionDateString = formData.dueDate
    ? formData.dueDate.toString() // بسته به فرمت دلخواه: toString() یا `formData.dueDate.toString({calendar:"gregory"})`
    : null;

  const payload = {
    title: formData.title,
    description: formData.description,
    status: formData.status,
    completionDate: completionDateString,
  };

  const res = await AxiosInstance.post<ApiResponse<Task>>("/tasks", payload);
  const t = res.data.data;

  return {
    ...t,
    dueDate: t.completionDate,
  };
}

export async function updateTask(id: number, formData: TaskFormData): Promise<Task> {
  const completionDateString = formData.dueDate
    ? formData.dueDate.toString()
    : null;

  const payload = {
    title: formData.title,
    description: formData.description,
    status: formData.status,
    completionDate: completionDateString,
  };

  const res = await AxiosInstance.put<ApiResponse<Task>>(`/tasks/${id}`, payload);
  const t = res.data.data;
  return {
    ...t,
    dueDate: t.completionDate,
  };
}

export async function deleteTask(id: number): Promise<void> {
  await AxiosInstance.delete<ApiResponse<null>>(`/tasks/${id}`);
}
