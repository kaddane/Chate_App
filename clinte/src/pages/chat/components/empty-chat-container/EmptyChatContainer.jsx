
import Lottie from "react-lottie"
import { animationDefaultOption } from "../../../../lib/utils"


function EmptyChatContainer() {
  return (
    <div className="flex-1 md:bg-[#1c1b25] md:flex flex-col justify-center items-center hidden duration-1000 transition-all">
        <Lottie 
            isClickToPauseDisabled={true}
            width={200}
            height={200}
            options={animationDefaultOption}
        />
        <div className="text-opacity-80 text-white flex flex-col items-center gap-5 mt-10 lg:text-4xl text-3xl transition-all duration-300 text-center">
            <h3 className="poppins-medium">
                Hi<span className="text-purple-500">! </span>
                Wilcome to
                <span className="text-purple-500"> Synctonus </span>
                Chat app
                <span className="text-purple-500">.</span>
            </h3>
        </div>
    </div>
  )
}

export default EmptyChatContainer