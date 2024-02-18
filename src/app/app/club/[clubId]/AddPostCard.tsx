import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";

const AddPostCard = ({ clubId }: { clubId: string }) => {
  return (
    <Link href={`/app/club/${clubId}/add-post`}>
      <Card className="w-full border-primary">
        <CardHeader>
          <CardTitle>Dodaj post</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea className="cursor-pointer resize-none" />
        </CardContent>
      </Card>
    </Link>
  );
};

export default AddPostCard;
