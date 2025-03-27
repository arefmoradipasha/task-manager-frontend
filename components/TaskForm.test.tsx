import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TaskForm } from './task-from';

// برای شبیه‌سازی I18nProvider و اجزای دیگر
jest.mock('@react-aria/i18n', () => ({
  I18nProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// شبیه‌سازی ماژول‌های دیگر که ممکن است خطا بدهند
jest.mock('@heroui/date-picker', () => ({
  DatePicker: ({ label, onChange, value }: any) => (
    <input
      data-testid="due-date"
      value={value ? value.toString() : ''}
      onChange={(e) => onChange(e.target.value ? { toString: () => e.target.value } : null)}
      placeholder={label}
    />
  ),
}));

jest.mock('@heroui/input', () => ({
  Input: ({ label, value, onValueChange, isRequired }: any) => (
    <input
      data-testid="title-input"
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      placeholder={label}
      required={isRequired}
    />
  ),
  Textarea: ({ label, value, onValueChange }: any) => (
    <textarea
      data-testid="description-textarea"
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      placeholder={label}
    />
  ),
}));

jest.mock('@heroui/select', () => ({
  Select: ({ label, selectedKeys, onSelectionChange, children }: any) => (
    <select
      data-testid="status-select"
      value={Array.from(selectedKeys)[0] || ''} // مقدار پیش‌فرض برای جلوگیری از undefined
      onChange={(e) => onSelectionChange(new Set([e.target.value]))}
    >
      {children}
    </select>
  ),
  SelectItem: ({ children, id }: any) => <option value={id}>{children}</option>,
}));

// mock برای @heroui/modal
jest.mock('@heroui/modal', () => ({
  Modal: ({ isOpen, onOpenChange, children }: any) =>
    isOpen ? <div data-testid="modal">{children}</div> : null,
  ModalContent: ({ children }: any) => (
    <div data-testid="modal-content">{children(() => {})}</div>
  ),
  ModalHeader: ({ children }: any) => <h2>{children}</h2>,
  ModalBody: ({ children }: any) => <div>{children}</div>,
  ModalFooter: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('@heroui/button', () => ({
  Button: ({ children, onPress, type }: any) => (
    <button
      data-testid={type === 'submit' ? 'submit-button' : 'cancel-button'}
      onClick={onPress}
    >
      {children}
    </button>
  ),
}));

describe('TaskForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnClose = jest.fn();

  // تست برای حالت "ایجاد تسک جدید"
  it('renders correctly and submits new task form', async () => {
    render(
      <TaskForm
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    // بررسی رندر شدن عنوان فرم
    expect(screen.getByText('ایجاد تسک جدید')).toBeInTheDocument();

    // پیدا کردن المنت‌ها
    const titleInput = screen.getByTestId('title-input');
    const descriptionTextarea = screen.getByTestId('description-textarea');
    const statusSelect = screen.getByTestId('status-select');
    const dueDateInput = screen.getByTestId('due-date');
    const submitButton = screen.getByTestId('submit-button');

    // پر کردن فرم
    fireEvent.change(titleInput, { target: { value: 'خرید شیر' } });
    fireEvent.change(descriptionTextarea, { target: { value: 'خرید شیر از فروشگاه' } });
    fireEvent.change(statusSelect, { target: { value: 'in-progress' } });
    fireEvent.change(dueDateInput, { target: { value: '2025-04-01' } });


    fireEvent.click(submitButton);
    expect(mockOnClose).toHaveBeenCalled();
  });

  // تست برای حالت "ویرایش تسک"
  it('renders correctly with initial data for editing', () => {
    const initialData = {
      id: 1,
      title: 'تسک نمونه',
      description: 'توضیحات نمونه',
      status: 'pending' as const,
      dueDate: '2025-03-28T00:00:00Z',
      createdAt: new Date('2025-03-27T00:00:00Z'),
      completionDate: '2025-03-28T00:00:00Z',
    };

    render(
      <TaskForm
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        initialData={initialData}
      />
    );

    // بررسی رندر شدن عنوان فرم
    expect(screen.getByText('ویرایش کار')).toBeInTheDocument();

    // بررسی پر شدن فیلدها با داده اولیه
    expect(screen.getByTestId('title-input')).toHaveValue('تسک نمونه');
    expect(screen.getByTestId('description-textarea')).toHaveValue('توضیحات نمونه');
    // expect(screen.getByTestId('status-select')).toHaveValue('pending');
  });
});