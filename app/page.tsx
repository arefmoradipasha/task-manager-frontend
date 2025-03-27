// app/page.tsx (یا هر جای دیگر که نقش اصلی را بازی می‌کند)
"use client";

import React from "react";
import { addToast } from "@heroui/toast";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";

import { Navbar, NavbarBrand, NavbarContent } from "@heroui/navbar";
import { CheckCircle, ClipboardList, Plus, Search } from "lucide-react";

import { Task, TaskFormData, TaskStatus } from "@/types/task";
import { TaskCard } from "@/components/task-card";

import { createTask, deleteTask, fetchTasks, updateTask } from "@/utils/api/tasks/tasks";
import { TaskForm } from "@/components/task-from";


export default function Home() {
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<Set<string>>(new Set(["all"]));
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<Task | undefined>();

  React.useEffect(() => {
    // هنگام لود شدن صفحه، لیست تسک‌ها را از سرور بگیر
    const loadTasks = async () => {
      try {
        const data = await fetchTasks(); 
        setTasks(data);
      } catch (error) {
        console.error(error);
        addToast({
          title: "خطا",
          description: "در بارگذاری لیست تسک‌ها خطایی رخ داد",
          color: "danger",
        });
      }
    };
    loadTasks();
  }, []);

  const handleCreateTask = async (data: TaskFormData) => {
    try {
      const newTask = await createTask(data);
      setTasks([...tasks, newTask]);

      addToast({
        title: "تسک ایجاد شد",
        description: "تسک جدید با موفقیت در سرور ایجاد شد",
        color: "success",
      });
    } catch (error) {
      console.error(error);
      addToast({
        title: "خطا",
        description: "در ایجاد تسک خطایی رخ داد",
        color: "danger",
      });
    } finally {
      setIsFormOpen(false);
    }
  };

  const handleUpdateTask = async (data: TaskFormData) => {
    if (!editingTask) return;
    try {
      const updated = await updateTask(editingTask.id, data);
      setTasks((prev) =>
        prev.map((t) => (t.id === editingTask.id ? updated : t))
      );

      addToast({
        title: "تسک به‌روز شد",
        description: "تسک با موفقیت در سرور به‌روز شد",
        color: "success",
      });
    } catch (error) {
      console.error(error);
      addToast({
        title: "خطا",
        description: "در به‌روزرسانی تسک خطایی رخ داد",
        color: "danger",
      });
    } finally {
      setEditingTask(undefined);
    }
  };

  const handleDeleteTask = async (task: Task) => {
    try {
      await deleteTask(task.id);
      setTasks(tasks.filter((t) => t.id !== task.id));

      addToast({
        title: "تسک حذف شد",
        description: "تسک با موفقیت در سرور حذف شد",
        color: "danger",
      });
    } catch (error) {
      console.error(error);
      addToast({
        title: "خطا",
        description: "در حذف تسک خطایی رخ داد",
        color: "danger",
      });
    }
  };

  const handleStatusChange = async (task: Task, newStatus: TaskStatus) => {
    // همانند عملیات آپدیت؛ فقط فیلد status را تغییر می‌دهیم
    try {
      const updated = await updateTask(task.id, {
        title: task.title,
        description: task.description,
        status: newStatus,
        dueDate: task.dueDate ? /* تبدیل string به CalendarDate ؟ */ null : null,
      });
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? updated : t))
      );

      addToast({
        title: "وضعیت تغییر یافت",
        description: `وضعیت تسک به ${newStatus} تغییر یافت`,
        color: "primary",
      });
    } catch (error) {
      console.error(error);
      addToast({
        title: "خطا",
        description: "در تغییر وضعیت تسک خطایی رخ داد",
        color: "danger",
      });
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());

    const filterAll = statusFilter.has("all");
    const matchesStatus = filterAll || statusFilter.has(task.status);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar isBordered>
        <NavbarBrand>
          <CheckCircle className="text-primary text-2xl ml-2" />
          <p className="font-bold text-inherit">تسک منیجر</p>
        </NavbarBrand>
        <NavbarContent justify="end">

        </NavbarContent>
      </Navbar>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="flex-1 w-full sm:w-auto">
              <Input
                placeholder="جستجوی کارها..."
                value={searchQuery}
                onValueChange={setSearchQuery}
                startContent={<Search />}
                isClearable
                aria-label="جستجوی کارها"
              />
            </div>
            <div className="flex gap-4 w-full sm:w-auto">
              <Select
                placeholder="فیلتر بر اساس وضعیت"
                selectedKeys={statusFilter}
                onSelectionChange={(keys: React.SetStateAction<Set<string>>) => setStatusFilter(keys)}
                className="w-full sm:w-48"
                aria-label="فیلتر تسک  بر اساس وضعیت"
              >
                <SelectItem key="all">همه</SelectItem>
                <SelectItem key="pending">در انتظار</SelectItem>
                <SelectItem key="in-progress">در حال انجام</SelectItem>
                <SelectItem key="completed">تکمیل شده</SelectItem>
              </Select>
              <Button
                color="primary"
                onPress={() => setIsFormOpen(true)}
                startContent={<Plus />}
              >
                افزودن تسک
              </Button>
            </div>
          </div>

          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={(t) => setEditingTask(t)}
                onDelete={handleDeleteTask}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>

          {filteredTasks.length === 0 && (
            <div className="text-center py-12">
              <ClipboardList className="text-4xl text-default-400 mx-auto mb-4" />
              <p className="text-default-500">اولین تسک خود را بنویسید</p>
            </div>
          )}
        </div>
      </main>

      {/* فرم ایجاد تسک جدید */}
      <TaskForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreateTask}
      />

      {/* فرم ویرایش تسک */}
      <TaskForm
        isOpen={!!editingTask}
        onClose={() => setEditingTask(undefined)}
        onSubmit={handleUpdateTask}
        initialData={editingTask}
      />
    </div>
  );
}
