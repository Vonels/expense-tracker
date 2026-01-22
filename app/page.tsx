"use client";
import { useState } from "react";
import TransactionForm from "@/components/TransactionForm/TransactionForm";

export default function TransactionsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"incomes" | "expenses">(
    "expenses",
  );

  const [selectedCategory, setSelectedCategory] = useState({
    id: "",
    name: "",
  });

  const handleOpenModal = (type: "incomes" | "expenses") => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleSelectCategory = (id: string, name: string) => {
    setSelectedCategory({ id, name });
    setIsModalOpen(false);
  };

  return (
    <main>
      <TransactionForm
        onOpenCategories={handleOpenModal}
        selectedCategoryName={selectedCategory.name}
        selectedCategoryId={selectedCategory.id}
      />
    </main>
  );
}
