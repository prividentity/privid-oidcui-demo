import React from "react";
import { Label } from "components/ui/label";
import { useNavigateWithQueryParams } from "utils/navigateWithQueryParams";
import { useLocation } from "react-router-dom";

const SwitchDeviceSelect = () => {
  const { navigateWithQueryParams } = useNavigateWithQueryParams();
  const location = useLocation();
  return (
    <div className="mt-0 text-primary text-[14px] cursor-pointer block text-center mb-5 max-md:hidden">
      <Label className="font-[400] text-secondaryText text-[16px]">
        Having problems?
      </Label>
      <Label
        className="font-[500] text-primary ml-[6px] cursor-pointer text-[16px] hover:underline"
        onClick={() =>
          navigateWithQueryParams(`/switch-device`, { from: location.pathname })
        }
      >
        Switch to mobile
      </Label>
    </div>
  );
};

export default SwitchDeviceSelect;
