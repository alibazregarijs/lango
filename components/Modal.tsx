import Spinner from "@/components/Spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DialogProps,
  DialogContentProps,
  DialogHeaderProps,
  DialogBodyProps,
} from "@/types/index";


const MineDialogContent = ({ children }: DialogContentProps) => {
  return (
    <DialogContent className="sm:max-w-[425px] lsm:h-full sm:h-[80vh] overflow-y-scroll custom-scrollbar">
      {children}
    </DialogContent>
  );
};

const MineDialogHeader = ({ children, title, loading }: DialogHeaderProps) => {
  return (
    <DialogHeader className="mt-6">
      <DialogTitle>{title}</DialogTitle>
      {loading ? (
        <Spinner loading={loading} />
      ) : (
        <div className="space-y-4 mt-4">{children}</div>
      )}
    </DialogHeader>
  );
};

const MineDialogBody = ({ label, children }: DialogBodyProps) => {
  return (
    <DialogDescription>
      <span className="text-white text-[14px]">{label} :</span>
      {children}
    </DialogDescription>
  );
};

const Modal = ({ open, onOpenChange, children }: DialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children}
    </Dialog>
  );
};

Modal.Content = MineDialogContent;
Modal.Section = MineDialogHeader;
Modal.Body = MineDialogBody;

export { Modal };
