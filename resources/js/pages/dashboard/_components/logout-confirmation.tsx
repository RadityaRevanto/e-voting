import { useState } from "react";
import { LogOut } from "lucide-react";
import { router } from "@inertiajs/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function LogoutConfirmation() {
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    router.post("/logout", {}, {
      onSuccess: () => {
        router.visit("/");
      },
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-6 
                   group-data-[collapsible=icon]:justify-center 
                   transition-all duration-200 
                   w-full px-5 py-4 rounded-2xl 
                   text-[#53599b] 
                   hover:bg-gradient-to-r hover:from-[#6B73C1] hover:to-[#8B94D4] hover:text-white hover:[&>svg]:text-white hover:[&>span]:text-white
                   active:bg-gradient-to-r active:from-[#6B73C1] active:to-[#8B94D4] active:text-white active:[&>svg]:text-white active:[&>span]:text-white"
      >
        <LogOut className="h-7 w-7 flex-shrink-0 text-[#53599b] 
                          transition-colors duration-200" />
        <span className="group-data-[collapsible=icon]:hidden 
                         font-bold text-lg text-[#53599b] 
                         transition-colors duration-200">
          Log-Out
        </span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Konfirmasi Logout</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin keluar?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Batal
            </Button>
            <Button
              type="button"
              onClick={handleLogout}
              className="bg-gradient-to-r from-[#6B73C1] to-[#8B94D4] hover:from-[#5a62a8] hover:to-[#7a83c0] text-white"
            >
              Ya
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

