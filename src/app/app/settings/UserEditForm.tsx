"use client";

import UserAvatar from "@/components/UserAvatar";
import { Session } from "lucia";
import { Button } from "../../../components/ui/button";
import InputField from "../../../components/InputField";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import TextareaAutosize from "../../../components/TextareaAutosize";
import { updateProfileSchema } from "../../../schemas/user";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputError from "../../../components/InputError";
import { api } from "../../../trpc/react";
import SuccessToastIcon from "../../../components/SuccessToastIcon";
import ErrorToastIcon from "../../../components/ErrorToastIcon";
import { toast } from "sonner";
import { revalidatePathAction } from "../../../actions/revalidatePathAction";
import { LoadingButton } from "../../../components/LoadingButton";
import { useState } from "react";

type Props = {
  user: Session["user"];
  description: string;
};

type Form = typeof updateProfileSchema._input;

const UserEditForm = ({ user, description }: Props) => {
  const {
    setValue,
    getValues,
    formState: { errors },
    register,
    handleSubmit,
  } = useForm<Form>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      newAvatarUrl: user.avatarUrl,
      newDescription: description,
    },
  });

  const [currentNewAvatar, setCurrentNewAvatar] = useState(user.avatarUrl);

  const generateNewUserAvatar = () => {
    let hex = "";
    for (let i = 0; i < 12; i++) {
      hex += Math.floor(Math.random() * 16).toString(16);
    }
    setValue("newAvatarUrl", hex);
    //React-hook-form doesnt rerender value correctly so state is needed
    setCurrentNewAvatar(hex);
  };

  const _updateUserProfile = api.user.updateProfile.useMutation({
    onSuccess: () => {
      toast("Pomyślnie zaktualizowano profil", {
        icon: <SuccessToastIcon />,
      });
      revalidatePathAction("/", "layout");
    },
    onError: () => {
      toast("Wystąpił błąd", {
        icon: <ErrorToastIcon />,
      });
    },
  });

  const onSubmit = handleSubmit(({ newAvatarUrl, newDescription }) => {
    _updateUserProfile.mutate({
      newAvatarUrl,
      newDescription,
    });
  });

  return (
    <div className="rounded-lg border-2 p-2 ">
      <h3 className="text-2xl font-semibold">Ustawienia użytkownika</h3>
      <form onSubmit={onSubmit} className="flex flex-col gap-y-2">
        <div className="flex flex-col gap-2 md:flex-row md:justify-between">
          <div className="flex flex-col gap-y-2">
            <UserAvatar
              avatarUrl={currentNewAvatar}
              mediaType={user.avatarMediaType}
              size={200}
            />
            <span>
              <Button type="button" onClick={generateNewUserAvatar}>
                Wygeneruj nowy avatar
              </Button>
            </span>
          </div>
          <div className="w-full">
            <InputField>
              <Label>O mnie:</Label>
              <Textarea {...register("newDescription")} />
              <InputError error={errors.newDescription?.message} />
              <TextareaAutosize />
            </InputField>
          </div>
        </div>
        <LoadingButton loading={_updateUserProfile.isLoading} type="submit">
          Zapisz
        </LoadingButton>
      </form>
    </div>
  );
};

export default UserEditForm;
