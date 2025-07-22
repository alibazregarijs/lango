import { Button } from "@/components/ui/button"

export default function ButtonDemo() {
  return (
    <div className="flex flex-wrap items-center gap-2 md:flex-row">
      <Button>Button</Button>
      <h1 className="bg-orange-1 text-xl">Hello world</h1>
    </div>
  )
}

