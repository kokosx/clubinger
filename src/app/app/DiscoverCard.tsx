import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

const DiscoverCard = () => {
  return (
    <Link href={"/app/discover"}>
      <Card className="mx-auto w-[300px] border-primary md:w-[600px] ">
        <CardHeader>
          <div className="flex w-full items-center gap-x-1">
            <CardTitle>Odkryj nowe kluby</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p>Odkryj nowych ludzi i hobby</p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default DiscoverCard;
