import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { ArrowRightCircleIcon } from "lucide-react";
import { Skeleton } from "../../../../components/ui/skeleton";

type Props = {
  clubId: string;
};

const ChatLink = ({ clubId }: Props) => {
  return (
    <Link href={`/app/club/${clubId}/chat`}>
      <Card className="w-full border-primary">
        <CardHeader>
          <CardTitle className="flex gap-x-2">
            Chcesz popisać? Wejdź na czat!
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-y-4">
          <Skeleton className="block h-12 w-[35%] animate-none" />
          <Skeleton className="block h-12 w-[40%] animate-none self-end" />
        </CardContent>
      </Card>
    </Link>
  );
};

export default ChatLink;
