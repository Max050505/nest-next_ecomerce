
import Link from "next/link";
import { Container } from "@/components/ui/Container";

export function Hero() {
  return (
    <section className="overflow-hidden bg-[#f5f3ee]">
      <Container>
        <div className="grid min-h-[520px] items-center gap-10 py-12 md:grid-cols-2 md:py-16 lg:gap-16 lg:py-20">
          <div className="max-w-xl">
            <span className="inline-flex rounded-full border border-[#d8dfd7] bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#426b57]">
              Новинки сезону
            </span>

            <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight text-[#202820] sm:text-5xl lg:text-6xl">
              Стильні товари
              <br />
              для твого життя.
            </h1>

            <p className="mt-6 max-w-md text-base leading-7 text-[#697169] sm:text-lg">
              Відкривай товари, які поєднують комфорт,
              якість і продуманий дизайн для кожного дня.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="inline-flex items-center gap-3 rounded-full bg-[#315c49] px-6 py-3.5 text-sm font-medium text-white transition hover:bg-[#254735]"
              >
                Перейти до каталогу
                <span aria-hidden="true">→</span>
              </Link>

              <Link
                href="/categories"
                className="inline-flex items-center rounded-full border border-[#d4d8d1] bg-white px-6 py-3.5 text-sm font-medium text-[#27352c] transition hover:bg-[#f8f8f5]"
              >
                Категорії
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-[#697169]">
              <span>✓ Якісні товари</span>
              <span>✓ Зручне замовлення</span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-3 rounded-[2rem] bg-[#dfe5dc]" />

            <img
              src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85"
              alt="Сучасний інтер'єр у природних кольорах"
              className="relative aspect-[4/5] max-h-[560px] w-full rounded-[1.5rem] object-cover shadow-sm sm:aspect-[5/4] lg:aspect-[4/5]"
            />

            <div className="absolute bottom-5 left-5 rounded-2xl bg-white/95 px-5 py-4 shadow-lg backdrop-blur-sm sm:bottom-7 sm:left-7">
              <p className="text-xs text-gray-500">
                Створено для щоденного комфорту
              </p>
              <p className="mt-1 font-semibold text-[#26372c]">
                Твій стиль. Твій вибір.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
