"use client";

import { createGroup } from "@/actions/create-group";
import { FormErrors } from "@/components/form/form-errors";
import { FormInput } from "@/components/form/form-input";
import { FormSubmit } from "@/components/form/form-submit";
import { Badge } from "@/components/ui/badge";
import { GROUP_CATEGORY_ICONS, GROUP_TYPES } from "@/constants/ui";
import { useAction } from "@/hooks/use-action";
import { randomNumber } from "@/utils/func";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const Form = () => {
  const router = useRouter();
  const [type, setType] = useState("");
  const { execute, fieldErrors } = useAction(createGroup, {
    onSuccess: (data) => {
      router.push(`/groups/${data.id}`);
      toast.success("Group created successfully");
    },
    onError: (error, debug) => {
      console.error(debug);
      toast.error(error);
    },
  });

  const onSubmit = async (formData: FormData) => {
    const title = formData.get("title") as string;
    // const imgFile = formData.get("image") as File;

    const imageId = randomNumber(1, 20);
    let image_url = `/images/placeholder/groups/${imageId}.png`;
    // if (imgFile) {
    //   try {
    //     setLoading(true);
    //     const images = await uploadFiles("imageUploader", {
    //       files: [imgFile],
    //     });
    //     console.log(images);
    //     image_url = images?.[0]?.url || image_url;
    //     setLoading(false);
    //   } catch (error) {setLoading(false);}
    // }

    execute({ title, type, image_url });
  };

  const handleTypeChange = (t: string) => {
    setType((s) => (s === t ? "" : t));
  };

  return (
    <form className="flex flex-col gap-6" action={onSubmit}>
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        {/* <FormInput
          label="Image"
          id="image"
          name="image"
          type="file"
          accept="image/png, image/gif, image/jpeg"
        /> */}
        <FormInput
          label="Group name"
          id="title"
          name="title"
          placeholder="Enter a group name"
          errors={fieldErrors?.title}
        />
        <div>
          <Label className="text-sm font-semi-bold text-neutral-700 dark:text-neutral-50">
            {"Type"}
          </Label>
          <div className="w-full flex flex-wrap gap-3 items-center pt-3">
            {GROUP_TYPES.map((b) => {
              const GroupIcon = GROUP_CATEGORY_ICONS[b];
              return (
                <Badge
                  key={b}
                  className="cursor-pointer capitalize flex gap-2 items-center"
                  variant={b === type ? "default" : "outline"}
                  onClick={() => handleTypeChange(b)}
                >
                  <GroupIcon className={"w-4 h-4"} />
                  {b}
                </Badge>
              );
            })}
          </div>
        </div>
        <FormErrors errors={fieldErrors?.type} />
      </div>
      <FormSubmit>Create</FormSubmit>
    </form>
  );
};

export default Form;
