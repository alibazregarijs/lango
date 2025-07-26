import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SelectDemo({setLevel}: {setLevel: React.Dispatch<React.SetStateAction<string>>}) {
  return (
    <Select defaultValue="elementary_school" onValueChange={(value) => setLevel(value)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a Level" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Level</SelectLabel>
          <SelectItem value="pre_school">Preschool</SelectItem>
          <SelectItem value="elementary_school">Elementary School</SelectItem>
          <SelectItem value="middle_school">Middle School</SelectItem>
          <SelectItem value="high_school">High School</SelectItem>
          <SelectItem value="college">College</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
