import { toast } from "sonner";

export const checkNull = (text: string, children: React.ReactNode): boolean => {
  if (!text.trim()) {
    toast("Text must not be empty", {
      description: children,
      action: {
        label: "Undo",
        onClick: () => {},
      },
    });
    return false;
  }
  return true;
};
