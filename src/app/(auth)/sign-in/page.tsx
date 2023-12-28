"use client";

import { api } from "@/trpc/react";
import InputField from "@/components/InputField";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/LoadingButton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signinSchema } from "@/schemas/user";
import InputError from "@/components/InputError";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const page = () => {
  const router = useRouter();
  const [error, setError] = useState<string | false>(false);

  const signin = api.auth.signin.useMutation({
    onError: (e) => {
      if (e.data?.code === "INTERNAL_SERVER_ERROR") {
        setError("Wystąpił nieznany błąd");
      }
      if (e.data?.code === "UNAUTHORIZED") {
        setError("Nieprawidłowe dane logowania");
      }
    },
    onMutate: () => setError(false),
    onSuccess: () => {
      toast("Pomyślnie utworzono konto. Zaraz nastąpi przekierowanie");
      router.push("/app");
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<typeof signinSchema._output>({
    resolver: zodResolver(signinSchema),
  });

  const onSubmit = handleSubmit((data) => {
    signin.mutate(data);
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-y-2">
      <InputField>
        <Label htmlFor="email">Email</Label>
        <Input
          {...register("email")}
          type="email"
          id="email"
          placeholder="text@example.com"
        />
        <InputError error={errors.email?.message} />
      </InputField>

      <InputField>
        <Label htmlFor="password">Hasło</Label>
        <Input
          {...register("password")}
          type="password"
          id="password"
          placeholder="Bezpieczne hasło"
        />
        <InputError error={errors.password?.message} />
      </InputField>

      <LoadingButton loading={signin.isLoading}>Zaloguj się</LoadingButton>
      <InputError error={error} />
      <Link className={cn(buttonVariants({ variant: "link" }))} href="/sign-up">
        Nie masz konta? Zarejestruj się
      </Link>
    </form>
  );
};

export default page;
