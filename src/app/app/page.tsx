import NewUser from "./NewUser";

type Props = {
  searchParams: {
    newuser?: string;
  };
};

const page = ({ searchParams }: Props) => {
  const isNewUser = searchParams?.newuser === "true";

  return (
    <div>
      page
      {isNewUser && <NewUser />}
    </div>
  );
};

export default page;
