"use client";

import { useState } from "react";
import { ConfirmModal } from "./ConfirmModal";

interface DeleteButtonProps {
  title: string;
  description: string;
  onConfirm: () => Promise<unknown>;
  isLoading?: boolean;
  confirmText?: string;
  cancelText?: string;
  loadingText?: string;
  disabled?: boolean;
}

export function DeleteButton({
  title,
  description,
  onConfirm,
  isLoading = false,
  confirmText = "Delete",
  cancelText = "Cancel",
  loadingText = "Deleting...",
  disabled = false,
}: DeleteButtonProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleConfirm() {
    setError("");
    setIsSubmitting(true);

    try {
      await onConfirm();
      setOpen(false);
    } catch {
      setError("Could not delete this item. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleCancel() {
    if (isSubmitting || isLoading) return;

    setOpen(false);
    setError("");
  }

  const pending = isLoading || isSubmitting;

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setError("");
          setOpen(true);
        }}
        disabled={pending || disabled}
        className="inline-flex items-center justify-center rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Delete
      </button>

      <ConfirmModal
        open={open}
        title={title}
        description={description}
        confirmText={confirmText}
        cancelText={cancelText}
        loadingText={loadingText}
        isLoading={pending}
        error={error}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />
    </>
  );
}
