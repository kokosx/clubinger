"use client";

import { api } from "@/trpc/react";
import InputField from "@/components/InputField";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/LoadingButton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "@/schemas/user";
import InputError from "@/components/InputError";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

const page = () => {
  const router = useRouter();
  const [error, setError] = useState<string | false>(false);

  const signup = api.auth.signup.useMutation({
    onError: (e) => {
      if (e.data?.code === "INTERNAL_SERVER_ERROR") {
        setError("Wystąpił nieznany błąd");
      }
      if (e.data?.code === "CONFLICT") {
        setError(e.message);
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
  } = useForm<typeof signupSchema._output>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = handleSubmit((data) => {
    signup.mutate(data);
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
        <Label htmlFor="username">Nazwa użytkownika</Label>
        <Input
          {...register("username")}
          type="text"
          id="username"
          placeholder="Pisz tutaj..."
        />
        <InputError error={errors.username?.message} />
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
      <InputField>
        <Label htmlFor="passwordConfirmation">Potwierdzenie hasła</Label>
        <Input
          {...register("passwordConfirmation")}
          type="password"
          id="passwordConfirmation"
          placeholder="Pisz tutaj..."
        />
      </InputField>
      <LoadingButton loading={signup.isLoading}>Zarejestruj się</LoadingButton>
      <InputError error={error} />
      <Link className={cn(buttonVariants({ variant: "link" }))} href="/sign-in">
        Masz już konto? Zaloguj się
      </Link>
    </form>
  );
};

export default page;
