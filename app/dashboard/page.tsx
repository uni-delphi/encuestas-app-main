//import CreateEventDialog from "@/components/create-event-dialog/create-event-dialog-server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/utils/auth-options";
import { getUserByEmail } from "@/lib/api/users";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  console.log("🚀 ~ Dashboard ~ session:", session)
  const { id } = await getUserByEmail(session?.user?.email as string);
  console.log("🚀 ~ Dashboard ~ id:", id)

  return (
    <>      
      <div className="flex flex-col items-center gap-8 p-4 md:p-8 ">
                
      </div>
    </>
  );
}
