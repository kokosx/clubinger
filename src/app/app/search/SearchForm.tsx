"use client";

import InputField from "@/components/InputField";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputError from "@/components/InputError";
import { Button } from "@/components/ui/button";
import { simpleSearchSchema } from "@/schemas/search";
import { api } from "../../../trpc/react";
import { FormEvent, useState } from "react";
import ClubSearchCard from "./ClubSearchCard";

type Form = typeof simpleSearchSchema._output;

const SearchForm = () => {
  const {
    formState: { errors },
    register,
    handleSubmit,
    setValue,
    getValues,
  } = useForm<Form>({ resolver: zodResolver(simpleSearchSchema) });
  //FIXME: To be fixed so that it doesnt need to be used, should use form values instead
  const [value, _setValue] = useState("");
  //FIXME: Fix this:
  const _searchClubs = api.club.search.useQuery(
    { value },
    {
      enabled: false,
      cacheTime: 0,
      staleTime: 0,
    },
  );

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    _searchClubs.refetch();
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <InputField>
          <Input
            value={getValues("value")}
            onChange={(e) => {
              setValue("value", e.target.value);
              _setValue(e.target.value);
            }}
          />
          <InputError error={errors.value?.message} />
        </InputField>
        <Button>Wyszukaj</Button>
      </form>
      <div className="mx-auto mb-20 flex w-full flex-col gap-y-2 md:w-[65%] lg:w-[55%] xl:w-[45%]">
        {_searchClubs.data?.map((club) => (
          <ClubSearchCard club={club} key={club.id} />
        ))}
      </div>
    </>
  );
};

export default SearchForm;
