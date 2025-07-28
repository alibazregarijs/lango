import { Button } from "@/components/ui/button";
import Spinner from "@/components/Spinner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function Modal({
  open,
  setOpen,
  grammer,
  suggestion,
  grade,
  loading,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  grammer: string;
  suggestion: string;
  grade: string;
  loading: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className="sm:max-w-[425px] custom-scrollbar">
          <DialogHeader>
            <DialogTitle>Pay attention to these points</DialogTitle>
            {loading ? (
              <Spinner loading={loading} />
            ) : (
              <div className="space-y-4 mt-4">
                <DialogDescription><span className="text-white text-[14px]">Grade : </span>{grade}</DialogDescription>
                <DialogDescription>
                  <span className="text-white text-[14px]">Grammatical problem : </span>{grammer}
                </DialogDescription>
                <DialogDescription><span className="text-white text-[14px]">Suggestion : </span>{suggestion}</DialogDescription>
              </div>
            )}
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
