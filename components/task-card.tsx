"use client";

import React from "react";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Card, CardBody } from "@heroui/card";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";
import { EllipsisVertical } from "lucide-react";
import { Task, TaskStatus } from "@/types/task";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (task: Task, newStatus: TaskStatus) => void;
}

export const TaskCard = ({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) => {
  const statusColors = {
    pending: "warning",
    "in-progress": "primary",
    completed: "success",
  } as const;

  const statusLabels = {
    pending: "در انتظار",
    "in-progress": "در حال انجام",
    completed: "انجام شده",
  };

  const createdAtText = task.createdAt
    ? new Date(task.createdAt).toLocaleDateString("fa-IR")
    : "";

  return (
    <Card className="w-full">
      <CardBody className="flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-semibold">{task.title}</h3>
            <p className="text-small text-default-500">{task.description}</p>
          </div>
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly variant="light" size="sm">
                <EllipsisVertical className="text-xl" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="عملیات کار">
              <DropdownItem key="edit" onPress={() => onEdit(task)}>
                ویرایش
              </DropdownItem>
              <DropdownItem
                key="delete"
                className="text-danger"
                color="danger"
                onPress={() => onDelete(task)}
              >
                حذف
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>

        <div className="flex justify-between items-center">
          <Dropdown>
            <DropdownTrigger>
              <Chip
                color={statusColors[task.status]}
                variant="flat"
                className="cursor-pointer"
              >
                {statusLabels[task.status]}
              </Chip>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="عملیات وضعیت"
              selectionMode="single"
              selectedKeys={[task.status]}
              onAction={(key) => onStatusChange(task, key as TaskStatus)}
            >
              <DropdownItem key="pending">در انتظار</DropdownItem>
              <DropdownItem key="in-progress">در حال انجام</DropdownItem>
              <DropdownItem key="completed">انجام شده</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <span className="text-md text-default-700">
          {new Date(task.completionDate).toLocaleString("fa-IR", {
  year: "numeric",
  month: "numeric",
  day: "numeric",
})}
          </span>


        </div>
      </CardBody>
    </Card>
  );
};
