"use client";

import { useState } from "react";

import type { CreatePollPayload } from "@/lib/types";

const initialForm: CreatePollPayload = {
  question: "",
  description: "",
  options: ["", ""],
};

export function useCreatePollForm() {
  const [form, setForm] = useState<CreatePollPayload>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: keyof Omit<CreatePollPayload, "options">, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const updateOption = (index: number, value: string) => {
    setForm((current) => ({
      ...current,
      options: current.options.map((option, optionIndex) => (optionIndex === index ? value : option)),
    }));
  };

  const addOption = () => {
    setForm((current) => ({ ...current, options: [...current.options, ""] }));
  };

  const removeOption = (index: number) => {
    setForm((current) => ({
      ...current,
      options: current.options.filter((_, optionIndex) => optionIndex !== index),
    }));
  };

  return {
    form,
    updateField,
    updateOption,
    addOption,
    removeOption,
    isSubmitting,
    setIsSubmitting,
  };
}
