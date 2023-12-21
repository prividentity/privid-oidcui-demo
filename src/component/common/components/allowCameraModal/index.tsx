import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../ui/dialog";
import CameraInstruction from "../../../assets/cameraInstruction.svg";
import lock from "../../../assets/lock.svg";

interface props {
  open: boolean;
  toggle: () => void;
}

export const AllowCameraModal = (props: props) => {
  const { open, toggle } = props;
  return (
    <Dialog open={open} onOpenChange={toggle}>
      <DialogContent className="p-3">
        <DialogHeader>
          <div className="flex max-w-[800px]">
            <img
              src={CameraInstruction}
              alt="cameraImage"
              className="max-w-[220px]"
            />
            <div className="pt-[10px]">
              <DialogTitle className="font-[400] leading-7 max-w-[180px]">
                Private id is blocked from using your camera
              </DialogTitle>
              <DialogDescription>
                <p className="text-[13px] mt-[5px] font-[200]">
                  1. Click the{" "}
                  <span className="inline-block">
                    <img src={lock} alt="lock" />
                  </span>{" "}
                  lock icon in your browser’s address bar
                </p>
                <p className="text-[13px] mt-[5px] font-[200]">
                  2. Turn on camera
                </p>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
