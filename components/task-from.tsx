"use client";

import React from "react";
import { DatePicker } from "@heroui/date-picker";
import { Input, Textarea } from "@heroui/input";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { parseDate, CalendarDate } from "@internationalized/date";
import { I18nProvider } from "@react-aria/i18n";

import { Task, TaskFormData } from "@/types/task";

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => void;
  initialData?: Task; // اگر undefined باشد یعنی حالت "ایجاد" است
}

export const TaskForm = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: TaskFormProps) => {
  const [formData, setFormData] = React.useState<TaskFormData>({
    title: "",
    description: "",
    status: "pending",
    dueDate: null,
  });

  React.useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
        status: initialData.status,
        dueDate: initialData.dueDate ? parseDate(initialData.dueDate.split("T")[0]) : null,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        status: "pending",
        dueDate: null,
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const handleDateChange = (date: CalendarDate | null) => {
    setFormData((prev) => ({ ...prev, dueDate: date }));
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        {(onModalClose: () => void) => (
          <form onSubmit={handleSubmit} dir="rtl">
            <ModalHeader className="flex flex-col gap-1">
              {initialData ? "ویرایش کار" : "ایجاد تسک جدید"}
            </ModalHeader>
            <ModalBody>
              <Input
                label="عنوان"
                placeholder="عنوان تسک را وارد کنید"
                value={formData.title}
                onValueChange={(value: string) =>
                  setFormData({ ...formData, title: value })
                }
                isRequired
              />
              <Textarea
                label="توضیحات"
                placeholder="توضیحات تسک را وارد کنید"
                value={formData.description}
                onValueChange={(value: string) =>
                  setFormData({ ...formData, description: value })
                }
                className="mt-4"
              />
              <I18nProvider locale="fa-IR">
                <DatePicker
                  className="mt-4 w-full"
                  label="مهلت انجام"
                  value={formData.dueDate}
                  onChange={handleDateChange}
                />
              </I18nProvider>
              <Select
                label="وضعیت"
                selectedKeys={[formData.status]}
                onSelectionChange={(keys) => {
                  const key = Array.from(keys)[0];
                  setFormData({
                    ...formData,
                    status: key as TaskFormData["status"],
                  });
                }}
                className="mt-4"
              >
                <SelectItem key="pending">در انتظار</SelectItem>
                <SelectItem key="in-progress">در حال انجام</SelectItem>
                <SelectItem key="completed">انجام شده</SelectItem>
              </Select>
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="light"
                onPress={() => {
                  onModalClose();
                }}
              >
                انصراف
              </Button>
              <Button color="primary" type="submit">
                {initialData ? "بروزرسانی" : "ایجاد"}
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
};