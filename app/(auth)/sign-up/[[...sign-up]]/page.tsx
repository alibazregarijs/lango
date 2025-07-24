import { SignUp } from '@clerk/nextjs'

const Page = () => {
  return (
    <div className="flex-center h-screen w-full p-4"> {/* Added padding */}
      <div className="relative z-10 w-full max-w-md"> {/* Added constraints */}
        <SignUp />
      </div>
    </div>
  )
}

export default Page