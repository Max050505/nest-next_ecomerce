import Link from "next/link";
import { Container } from "@/components/ui/Container";

const linkClass = "text-sm text-gray-500 transition hover:text-[#315c49]";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-[#fafaf8]">
      <Container>
        <div className="grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:py-16">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xl font-bold tracking-tight text-[#315c49]"
            >
              <span className="flex size-8 items-center justify-center rounded-full bg-[#315c49] text-sm text-white">
                S
              </span>
              SHOP
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-6 text-gray-500">
              Добираємо товари, які поєднують якість, практичність і сучасний
              дизайн.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">Магазин</h3>

            <nav className="mt-4 flex flex-col gap-3">
              <Link href="/shop" className={linkClass}>
                Каталог товарів
              </Link>
              <Link href="/categories" className={linkClass}>
                Категорії
              </Link>
              <Link href="/cart" className={linkClass}>
                Кошик
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">Інформація</h3>

            <nav className="mt-4 flex flex-col gap-3">
              <Link href="/about" className={linkClass}>
                Про нас
              </Link>
              <Link href="/contact" className={linkClass}>
                Контакти
              </Link>
              <Link href="/shipping" className={linkClass}>
                Доставка й оплата
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Особистий кабінет
            </h3>

            <nav className="mt-4 flex flex-col gap-3">
              <Link href="/auth?mode=login" className={linkClass}>
                Увійти
              </Link>
              <Link href="/auth?mode=register" className={linkClass}>
                Створити акаунт
              </Link>
              <Link href="/orders" className={linkClass}>
                Мої замовлення
              </Link>
            </nav>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-gray-200 py-6 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} SHOP. Усі права захищені.
          </p>

          <p className="text-xs text-gray-500">
            Створено з турботою про покупців.
          </p>
        </div>
      </Container>
    </footer>
  );
}
