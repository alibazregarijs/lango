"use client";

import { memo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CheckboxItemProps } from "@/types/index";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const FormSchema = z.object({
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
});

const WordsBoxComponent = ({
  items,
  onSubmitHandler,
  disabled,
  slideIndex,
}: {
  items: CheckboxItemProps[];
  onSubmitHandler: (choosedWord: string) => void;
  disabled: boolean;
  slideIndex: number;
}) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      items: ["home"],
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data.items,"data check words ")
    const choosedWord = data.items[0];
    onSubmitHandler(choosedWord);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="items"
          render={() => (
            <FormItem>
              {items && (
                <div className="grid">
                  {items.slice(0, 4).map((item) => (
                    <FormField
                      key={uuidv4()}
                      control={form.control}
                      name="items"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={uuidv4()}
                            className="flex flex-row items-center space-x-2 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([item.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.id
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              {item.label}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="bg-orange-1 text-white hover:bg-black-2 cursor-pointer"
          type="submit"
          disabled={disabled}
        >
          Submit
        </Button>
      </form>
    </Form>
  );
};

// Wrapped in memo to prevent unnecessary re-renders when props don't change
export const WordsBox = memo(WordsBoxComponent);
