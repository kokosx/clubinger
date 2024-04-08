"use client";

import InputField from "@/components/InputField";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputError from "@/components/InputError";
import { Button } from "@/components/ui/button";
import { simpleSearchSchema } from "@/schemas/search";
import { api } from "../../../trpc/react";
import { FormEvent, useEffect, useState } from "react";
import ClubSearchCard from "./ClubSearchCard";
import { SearchIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";

type Form = typeof simpleSearchSchema._output;

const SearchForm = () => {
  const searchParams = useSearchParams();

  const {
    formState: { errors },
    handleSubmit,
    setValue,
    getValues,
  } = useForm<Form>({
    resolver: zodResolver(simpleSearchSchema),
    defaultValues: {
      value: searchParams.get("value") || "",
    },
  });
  //FIXME: Doesnt work without dummy rerender state because react-hook-form doesnt rerender on formState change
  const [dummy, setDummy] = useState(1);
  const [shouldBeEnabled, setShouldBeEnabled] = useState(!!getValues("value"));

  //Disable auto refetching after initial fetch, am i stupid?
  useEffect(() => {
    if (shouldBeEnabled) {
      setShouldBeEnabled(false);
    }
  }, [shouldBeEnabled]);

  const _searchClubs = api.club.search.useQuery(
    { value: getValues("value") },
    {
      enabled: shouldBeEnabled,
    },
  );

  const onSubmit = handleSubmit(({ value }) => {
    _searchClubs.refetch();
    //@ts-expect-error it works :3
    const url = new URL(window.location);
    history.pushState(null, "", `?value=${value}`);
  });

  return (
    <>
      <form onSubmit={onSubmit}>
        <div className="flex gap-x-2">
          <InputField>
            <Input
              value={getValues("value")}
              onChange={(e) => {
                setValue("value", e.target.value);
                setDummy((p) => p + 1);
              }}
            />
            <InputError error={errors.value?.message} />
          </InputField>
          <Button>
            <SearchIcon />
            <span>Wyszukaj</span>
          </Button>
        </div>
      </form>
      <div className="mx-auto mb-20 flex w-full flex-col gap-y-2 md:w-[65%] lg:w-[55%] xl:w-[45%]">
        {_searchClubs.data?.map((club) => (
          <ClubSearchCard club={club} key={club.id} />
        ))}
        {_searchClubs.data?.length === 0 && (
          <p className="text-center">Brak wyników</p>
        )}
      </div>
    </>
  );
};

export default SearchForm;
