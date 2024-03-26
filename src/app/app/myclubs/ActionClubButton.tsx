import  {type ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../components/ui/alert-dialog";
import { Button } from "../../../components/ui/button";
import { LoadingButton } from "../../../components/LoadingButton";

type Props = {
  closeDialog: () => void;
  openDialog: () => void;
  isOpen: boolean;
  onAccept: () => void;
  isLoading: boolean;
  children: ReactNode;
};

const ActionClubButton = ({
  closeDialog,
  isOpen,
  openDialog,
  isLoading,
  onAccept,
  children,
}: Props) => {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogTrigger asChild>
        <Button onClick={openDialog} variant={"destructive"}>
          {children}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Czy jesteś pewien?</AlertDialogTitle>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={closeDialog}>Anuluj</AlertDialogCancel>

          <LoadingButton
            loading={isLoading}
            onClick={onAccept}
            variant={"destructive"}
          >
            {children}
          </LoadingButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ActionClubButton;
