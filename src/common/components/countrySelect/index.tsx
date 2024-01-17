"use client";

import { Button } from "components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import * as React from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "components/ui/command";
import { cn } from "../../../lib/utils";
import { Countries } from "constant/country-flag";

export function ComboboxDemo({ setCountry, country }: any) {
  const [open, setOpen] = React.useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[100%] justify-between text-[14px] font-[400]"
        >
          <div className="flex">
            <img
              src={
                Countries.find(
                  (item: any) => item.country?.toLocaleLowerCase() === country
                )?.flag
              }
              alt={"flag"}
              className="h-[20px] width-[20px]"
            />
            <p className="ml-[15px]">
              {country
                ? Countries.find(
                    (item: any) => item.country?.toLocaleLowerCase() === country
                  )?.country
                : "Select your country..."}
            </p>
          </div>
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[calc(65vw-36.5rem)] p-0">
        <Command>
          <CommandInput placeholder="Search your country..." className="h-9" />
          <CommandEmpty>No country found.</CommandEmpty>
          <CommandGroup className="h-[300px] overflow-auto">
            {Countries.map(
              (
                item: {
                  country: string;
                  code: string;
                  flag: string;
                },
                index: number
              ) => {
                return (
                  <CommandItem
                    value={item?.country}
                    key={`${item?.code}-${index}`}
                    onSelect={(currentValue: any) => {
                      setCountry(currentValue);
                      setOpen(false);
                    }}
                  >
                    <div className="flex">
                      <img
                        src={item?.flag}
                        alt={"flag"}
                        className="h-[20px] width-[20px]"
                      />
                      <p className="ml-[15px]">{item?.country}</p>
                    </div>
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        country === item?.country?.toLocaleLowerCase() ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                );
              }
            )}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
