"use client";

import { useParams } from "next/navigation";
import { OrderDetails } from "@/components/admin/orders/OrderDetails";

export default function AdminOrderDetailsPage() {
  const params = useParams<{ id: string }>();

  return <OrderDetails id={params.id} />;
}
