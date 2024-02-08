import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExpenseType, User } from "@prisma/client";
import { ArrowLeftIcon } from "lucide-react";

type SplitDrawerProps = {
  users?: User[];
};

export const SplitDrawer = (props: SplitDrawerProps) => {
  const { users = [] } = props;
  return (
    <Drawer>
      <DrawerTrigger>
        split{" "}
        <Button type="button" variant={"outline"}>
          equally
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="px-4 flex gap-4 items-center">
            <DrawerClose>
              <Button type="button" variant="outline" size="icon">
                <ArrowLeftIcon />
              </Button>
            </DrawerClose>
            <div>Split amount</div>
          </DrawerTitle>
        </DrawerHeader>
        <Tabs
          defaultValue={ExpenseType.EQUAL}
          className="w-full pt-3 pb-6 px-8"
        >
          <TabsList className="w-full">
            <TabsTrigger value={ExpenseType.EQUAL} className="w-full">
              Equal
            </TabsTrigger>
            <TabsTrigger value={ExpenseType.EXACT} className="w-full">
              Exact
            </TabsTrigger>
            <TabsTrigger value={ExpenseType.PERCENT} className="w-full">
              Percentage
            </TabsTrigger>
          </TabsList>
          <TabsContent value={ExpenseType.EQUAL}>
            Make changes to your account here.
          </TabsContent>
          <TabsContent value={ExpenseType.EXACT}>
            Change your password here.
          </TabsContent>
          <TabsContent value={ExpenseType.PERCENT}>
            Change your password here.
          </TabsContent>
        </Tabs>
        {/* <DrawerFooter>
          <DrawerClose>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter> */}
      </DrawerContent>
    </Drawer>
  );
};
