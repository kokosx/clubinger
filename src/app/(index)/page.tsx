import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const page = () => {
  return (
    <div className="flex flex-col items-center gap-y-1">
      <h1 className="mt-[15%] text-center text-5xl font-bold md:text-8xl">
        KultKlub
      </h1>
      <p className="text-center text-xl md:text-3xl">
        Odkryj nowe kluby i znajdź ludzi z podobnymi upodobaniami
      </p>
      <Link href="/sign-up" className={cn(buttonVariants())}>
        Zacznij teraz
      </Link>
    </div>
  );
};

export default page;
