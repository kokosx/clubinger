import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import SearchForm from "./SearchForm";

type Props = {
  searchParams: {
    type: string;
  };
};

const layout = ({ searchParams }: Props) => {
  return (
    <div className="flex flex-col gap-y-2">
      <h2 className="text-3xl font-medium">Wyszukaj</h2>
      <Tabs defaultValue={searchParams.type}>
        <TabsList>
          <Link href="/app/search?type=clubs">
            <TabsTrigger value="clubs">Kluby</TabsTrigger>
          </Link>

          <Link href="/app/search?type=users">
            <TabsTrigger value="users">Użytkownicy</TabsTrigger>
          </Link>
        </TabsList>
      </Tabs>
      <SearchForm />
    </div>
  );
};

export default layout;
