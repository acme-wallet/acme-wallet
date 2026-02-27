import { createFileRoute } from '@tanstack/react-router';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/not-found/')({
  component: NotFoundPage,
});

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#f3f3f5] px-6 py-10 text-[#252632] md:px-10">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <section className="order-2 max-w-xl lg:order-1">
          <p className="text-2xl font-semibold tracking-tight text-[#575b70]">
            404
          </p>
          <h1 className="mt-3 text-5xl font-extrabold leading-none tracking-tight md:text-7xl">
            Page not found
          </h1>
          <p className="mt-6 text-lg text-[#5e6275]">
            Sorry, we couldn&apos;t find the page you&apos;re looking for.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button
              asChild
              className="h-12 rounded-md px-8 text-base font-semibold"
            >
              <Link to="/home">Go back home</Link>
            </Button>
          </div>
        </section>

        <section className="order-1 flex justify-center lg:order-2">
          <img
            src="/404.svg"
            alt="404 illustration"
            className="h-auto w-full max-w-[720px]"
          />
        </section>
      </div>
    </div>
  );
}
