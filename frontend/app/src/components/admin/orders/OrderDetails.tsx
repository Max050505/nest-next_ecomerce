"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";

import { DeleteButton } from "@/components/ui/DeleteButton";
import { useCancelOrder, useOrder, useUpdateOrder } from "@/hooks/use-orders";
import type { OrderStatus, UpdateOrderPayload } from "@/types/order.types";

interface OrderDetailsProps {
  id: string;
}

const editableStatuses: OrderStatus[] = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
];

const statusLabels: Record<OrderStatus, string> = {
  PENDING: "Очікує обробки",
  PROCESSING: "Обробляється",
  SHIPPED: "Відправлено",
  DELIVERED: "Доставлено",
  CANCELLED: "Скасовано",
};

const statusStyles: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const currencyFormatter = new Intl.NumberFormat("uk-UA", {
  style: "currency",
  currency: "UAH",
});

function formatDate(value: string): string {
  return new Date(value).toLocaleString("uk-UA");
}

export function OrderDetails({ id }: OrderDetailsProps) {
  const { data, isPending, isError, error } = useOrder(id);

  const updateMutation = useUpdateOrder();
  const cancelMutation = useCancelOrder();

  const order = data?.data;

  const [status, setStatus] = useState<OrderStatus>("PENDING");
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    if (order) {
      setStatus(order.status);
    }
  }, [order]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaveMessage("");

    if (!order || status === order.status) {
      return;
    }

    if (order.status === "CANCELLED" || status === "CANCELLED") {
      setSaveMessage("Для скасування замовлення використовуйте окрему дію.");
      return;
    }

    const payload: UpdateOrderPayload = { status };

    try {
      await updateMutation.mutateAsync({ id, payload });
      setSaveMessage("Зміни успішно збережено.");
    } catch {
      setSaveMessage("Не вдалося зберегти зміни. Спробуйте ще раз.");
    }
  }

  if (isPending) {
    return (
      <div className="py-10 text-center text-gray-500">
        Завантаження замовлення...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="font-medium text-red-700">
          Не вдалося завантажити замовлення.
        </p>
        <p className="mt-1 text-sm text-red-600">
          {error instanceof Error ? error.message : "Сталася невідома помилка."}
        </p>
        <Link
          href="/admin/orders"
          className="mt-3 inline-block text-sm font-medium text-blue-600 hover:underline"
        >
          Повернутися до замовлень
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-10 text-center">
        <p className="text-gray-600">Замовлення не знайдено.</p>
        <Link
          href="/admin/orders"
          className="mt-3 inline-block text-sm font-medium text-blue-600 hover:underline"
        >
          Повернутися до замовлень
        </Link>
      </div>
    );
  }

  const isCancelled = order.status === "CANCELLED";
  const isBusy = updateMutation.isPending || cancelMutation.isPending;

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/admin/orders"
            className="text-sm text-blue-600 hover:underline"
          >
            ← До списку замовлень
          </Link>

          <h1 className="mt-2 text-2xl font-bold text-gray-900">
            Деталі замовлення
          </h1>

          <p className="mt-1 break-all text-sm text-gray-500">ID: {order.id}</p>
        </div>

        <span
          className={`inline-flex w-fit rounded-full px-3 py-1 text-sm font-medium ${statusStyles[order.status]}`}
        >
          {statusLabels[order.status]}
        </span>
      </div>

      {/* Основна інформація */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Інформація про замовлення
          </h2>

          <dl className="space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500">Статус</dt>
              <dd className="text-right font-medium text-gray-900">
                {statusLabels[order.status]}
              </dd>
            </div>

            <div className="flex justify-between gap-4">
              <dt className="text-gray-500">Сума</dt>
              <dd className="text-right font-semibold text-gray-900">
                {currencyFormatter.format(order.total)}
              </dd>
            </div>

            <div className="flex justify-between gap-4">
              <dt className="text-gray-500">Створено</dt>
              <dd className="text-right text-gray-900">
                {formatDate(order.createdAt)}
              </dd>
            </div>

            <div className="flex justify-between gap-4">
              <dt className="text-gray-500">Оновлено</dt>
              <dd className="text-right text-gray-900">
                {formatDate(order.updatedAt)}
              </dd>
            </div>
          </dl>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Інформація про покупця
          </h2>

          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-gray-500">Ім’я</dt>
              <dd className="mt-1 font-medium text-gray-900">
                {order.userName || "Не вказано"}
              </dd>
            </div>

            <div>
              <dt className="text-gray-500">Email</dt>
              <dd className="mt-1 break-all font-medium text-gray-900">
                {order.userEmail || "Не вказано"}
              </dd>
            </div>

            <div>
              <dt className="text-gray-500">Адреса доставки</dt>
              <dd className="mt-1 whitespace-pre-wrap text-gray-900">
                {order.shippingAddress || "Не вказано"}
              </dd>
            </div>
          </dl>
        </section>
      </div>

      {/* Товари */}
      <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Товари в замовленні
          </h2>
        </div>

        {order.items.length === 0 ? (
          <p className="p-5 text-sm text-gray-500">
            У цьому замовленні немає товарів.
          </p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Товар
                    </th>
                    <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                      Ціна
                    </th>
                    <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                      Кількість
                    </th>
                    <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                      Сума
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 bg-white">
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-5 py-4 text-sm font-medium text-gray-900">
                        {item.productName}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-right text-sm text-gray-600">
                        {currencyFormatter.format(item.price)}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-right text-sm text-gray-600">
                        {item.quantity}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-right text-sm font-medium text-gray-900">
                        {currencyFormatter.format(item.subtotal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end border-t border-gray-200 px-5 py-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Загальна сума</p>
                <p className="mt-1 text-xl font-bold text-gray-900">
                  {currencyFormatter.format(order.total)}
                </p>
              </div>
            </div>
          </>
        )}
      </section>

      {/* Керування замовленням */}
      <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Керування замовленням
        </h2>

        {isCancelled ? (
          <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">
            Це замовлення скасовано. Змінювати його статус або скасовувати
            повторно не можна.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="order-status"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Статус замовлення
              </label>

              <select
                id="order-status"
                value={status}
                onChange={(event) => {
                  setStatus(event.target.value as OrderStatus);
                  setSaveMessage("");
                }}
                disabled={isBusy}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-gray-100 sm:max-w-md"
              >
                {editableStatuses.map((itemStatus) => (
                  <option key={itemStatus} value={itemStatus}>
                    {statusLabels[itemStatus]}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={
                isBusy || status === order.status || status === "CANCELLED"
              }
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {updateMutation.isPending ? "Збереження..." : "Зберегти зміни"}
            </button>

            {saveMessage && (
              <p
                role="status"
                className={`text-sm ${
                  updateMutation.isError ? "text-red-600" : "text-green-600"
                }`}
              >
                {saveMessage}
              </p>
            )}
          </form>
        )}

        {!isCancelled && order.status === "PENDING" && (
          <div className="mt-5 border-t border-gray-200 pt-5">
            <h3 className="font-medium text-gray-900">Скасування замовлення</h3>

            <p className="mt-1 mb-3 text-sm text-gray-500">
              Скасувати можна лише замовлення, яке ще очікує обробки. Після
              скасування товари мають бути повернуті на склад.
            </p>

            <DeleteButton
              title="Скасувати замовлення?"
              description="Замовлення буде скасовано, а товари повернуться на склад. Цю дію не можна скасувати."
              confirmText="Скасувати замовлення"
              cancelText="Назад"
              loadingText="Скасування..."
              isLoading={cancelMutation.isPending}
              disabled={isBusy}
              onConfirm={async () => {
                setSaveMessage("");

                try {
                  await cancelMutation.mutateAsync(id);
                } catch {
                  setSaveMessage(
                    "Не вдалося скасувати замовлення. Спробуйте ще раз.",
                  );
                  throw new Error("Не вдалося скасувати замовлення.");
                }
              }}
            />

            {cancelMutation.isError && (
              <p role="alert" className="mt-3 text-sm text-red-600">
                Не вдалося скасувати замовлення. Перевірте з’єднання та
                спробуйте ще раз.
              </p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
